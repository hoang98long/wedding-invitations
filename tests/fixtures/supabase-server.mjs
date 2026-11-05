import { createServer } from "node:http";

let scenario = "ready";
let wishes = [];
let receivedHeaders = {};
const json = (response, status, value) => { response.writeHead(status, { "Content-Type": "application/json" }); response.end(JSON.stringify(value)); };
async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1:3105");
  if (url.pathname === "/__health") return json(response, 200, { ok: true });
  if (url.pathname === "/__scenario") {
    scenario = (await readBody(request)).scenario;
    wishes = [];
    return json(response, 200, { ok: true });
  }
  if (url.pathname === "/__headers") return json(response, 200, receivedHeaders);
  receivedHeaders = { correctApiKey: request.headers.apikey === "sb_secret_guestbook_test", authorizationPresent: Boolean(request.headers.authorization) };
  if (!receivedHeaders.correctApiKey || receivedHeaders.authorizationPresent) return json(response, 401, { message: "Invalid backend authentication" });
  if (scenario === "schema-missing") return json(response, 404, { code: "PGRST205", message: "Table not found in schema cache" });
  if (scenario === "access-denied") return json(response, 403, { code: "42501", message: "Permission denied" });
  if (scenario === "unavailable") { response.writeHead(503, { "Content-Type": "text/html" }); return response.end("<h1>Database temporarily unavailable</h1>"); }
  if (url.pathname === "/rest/v1/wedding_wishes" && request.method === "GET") return json(response, 200, wishes.slice().reverse().slice(0, 100));
  if (url.pathname === "/rest/v1/rpc/add_wedding_wish" && request.method === "POST") {
    const input = await readBody(request);
    const existing = wishes.find(wish => wish.id === input.p_id);
    if (existing) return json(response, 200, [existing]);
    const wish = { id: input.p_id, name: input.p_name, message: input.p_message, created_at: new Date().toISOString() };
    wishes.push(wish);
    return json(response, 200, [wish]);
  }
  return json(response, 404, { code: "PGRST202", message: "Function not found" });
}).listen(3105, "127.0.0.1", () => console.log("Supabase test fixture ready on port 3105."));
