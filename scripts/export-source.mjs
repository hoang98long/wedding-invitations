import { execFileSync, spawnSync } from "node:child_process";
import { copyFile, lstat, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gitOptions = ["-c", `safe.directory=${root.replaceAll("\\", "/")}`];
const git = args => execFileSync("git", [...gitOptions, ...args], { cwd: root, maxBuffer: 32 * 1024 * 1024 });
const candidates = [...new Set(git(["ls-files", "--cached", "--others", "--exclude-standard", "-z"]).toString("utf8").split("\0").filter(Boolean))];
const ignored = spawnSync("git", [...gitOptions, "check-ignore", "--no-index", "--stdin", "-z"], {
  cwd: root,
  input: candidates.join("\0") + "\0",
  maxBuffer: 32 * 1024 * 1024
});
if (ignored.error) throw ignored.error;
if (ignored.status !== 0 && ignored.status !== 1) throw new Error(ignored.stderr.toString());
const excluded = new Set(ignored.stdout.toString("utf8").split("\0").filter(Boolean));
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const output = path.join(root, ".local", "github-ready", `wedding-invitations-${stamp}`);
await mkdir(output, { recursive: true });

let count = 0;
let bytes = 0;
for (const file of candidates.sort()) {
  if (excluded.has(file)) continue;
  const source = path.resolve(root, file);
  if (!source.startsWith(root + path.sep)) throw new Error(`Path is outside the project: ${file}`);
  let info;
  try { info = await lstat(source); } catch (error) {
    if (error.code === "ENOENT") continue;
    throw error;
  }
  if (!info.isFile()) continue;
  const destination = path.join(output, file);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
  count += 1;
  bytes += info.size;
}

console.log(`Exported ${count} source files (${(bytes / 1024 / 1024).toFixed(2)} MB).`);
console.log(`Source: ${output}`);
console.log("The export contains no Git history, installed dependencies, build cache, original resources, or local secrets.");
