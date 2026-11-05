import "server-only";

import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { WeddingWish, WishInput } from "@/lib/wishes";
import { databaseConfig } from "@/lib/guestbook-config";
import { GuestbookStorageError } from "@/lib/guestbook-errors";

type StoredWish = WeddingWish & { visitorHash: string };
type DatabaseWish = { id: string; name: string; message: string; created_at: string };
export class WishRateLimitError extends Error {}

const publicWish = ({ id, name, message, createdAt }: StoredWish): WeddingWish => ({ id, name, message, createdAt });
const fromDatabase = (row: DatabaseWish): WeddingWish => ({ id: row.id, name: row.name, message: row.message, createdAt: row.created_at });

async function databaseRequest(endpoint: string, init?: RequestInit) {
  const config = databaseConfig();
  if (!config) throw new Error("Missing database configuration.");
  let response: Response;
  try {
    response = await fetch(`${config.url}/rest/v1/${endpoint}`, {
      ...init,
      headers: config.headers,
      cache: "no-store",
      signal: AbortSignal.timeout(10000)
    });
  } catch {
    throw new GuestbookStorageError("GUESTBOOK_UNAVAILABLE", "Could not reach Supabase. Check the Project URL, project status, and network access.");
  }
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    if (error?.message === "WISH_RATE_LIMIT") throw new WishRateLimitError();
    if (response.status === 401 || response.status === 403) {
      throw new GuestbookStorageError("GUESTBOOK_ACCESS_DENIED", "Supabase rejected access. Check the backend secret key and run supabase/guestbook.sql to grant service_role access.");
    }
    if (response.status === 404 || ["PGRST202", "PGRST205", "42P01", "42883"].includes(error?.code)) {
      throw new GuestbookStorageError("GUESTBOOK_SCHEMA_MISSING", "Run supabase/guestbook.sql in the correct Supabase project's SQL Editor, then retry.");
    }
    throw new GuestbookStorageError("GUESTBOOK_UNAVAILABLE", `Supabase request failed (${response.status}). Check Supabase logs and project status.`);
  }
  return response.json() as Promise<DatabaseWish[]>;
}

const dataFile = () => path.join(process.env.GUESTBOOK_DATA_DIR || path.join(process.cwd(), "data"), "wishes.jsonl");

async function readLocal(): Promise<StoredWish[]> {
  try {
    const data = await readFile(dataFile(), "utf8");
    return data.split("\n").filter(Boolean).map(line => JSON.parse(line) as StoredWish);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

// Serialize reads and append operations so concurrent visitors cannot lose a wish.
let localQueue: Promise<unknown> = Promise.resolve();
function localTransaction<T>(operation: () => Promise<T>): Promise<T> {
  const result = localQueue.then(operation);
  localQueue = result.catch(() => {});
  return result;
}

export async function listWishes(): Promise<WeddingWish[]> {
  if (databaseConfig()) {
    return (await databaseRequest("wedding_wishes?select=id,name,message,created_at&order=created_at.desc&limit=100")).map(fromDatabase);
  }
  return localTransaction(async () => (await readLocal()).slice(-100).reverse().map(publicWish));
}

export async function saveWish(input: WishInput, visitorHash: string): Promise<WeddingWish> {
  if (databaseConfig()) {
    const rows = await databaseRequest("rpc/add_wedding_wish", {
      method: "POST",
      body: JSON.stringify({ p_id: input.id, p_name: input.name, p_message: input.message, p_visitor_hash: visitorHash })
    });
    if (!rows[0]) throw new Error("Database did not confirm the new wish.");
    return fromDatabase(rows[0]);
  }
  return localTransaction(async () => {
    const wishes = await readLocal();
    const existing = wishes.find(wish => wish.id === input.id);
    // Retrying after a dropped response returns the original, without adding a duplicate.
    if (existing) return publicWish(existing);
    const now = Date.now();
    if (wishes.some(wish => wish.visitorHash === visitorHash && now - Date.parse(wish.createdAt) < 20000)) {
      throw new WishRateLimitError();
    }
    const wish: StoredWish = { id: input.id, name: input.name, message: input.message, createdAt: new Date(now).toISOString(), visitorHash };
    await mkdir(path.dirname(dataFile()), { recursive: true });
    await appendFile(dataFile(), JSON.stringify(wish) + "\n", { encoding: "utf8", mode: 0o600 });
    return publicWish(wish);
  });
}
