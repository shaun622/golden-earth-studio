import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = new URL(process.argv[2] || "http://127.0.0.1:8790/");
const ledger = JSON.parse(await fs.readFile(path.resolve("src/data/route-ledger.json"), "utf8"));
const failures = [];

async function request(route, init) {
  try {
    return await fetch(new URL(route, baseUrl), { redirect: "manual", ...init });
  } catch (error) {
    failures.push(`${route}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

for (const route of [...ledger.generated, "/robots.txt", "/sitemap.xml"]) {
  const response = await request(route);
  if (response && response.status !== 200) failures.push(`${route}: expected 200, received ${response.status}`);
}

for (const { from, to, status } of ledger.redirects) {
  const response = await request(from);
  if (!response) continue;
  if (response.status !== status) failures.push(`${from}: expected ${status}, received ${response.status}`);
  const location = response.headers.get("location");
  if (location !== to) failures.push(`${from}: expected Location ${to}, received ${location || "none"}`);
}

for (const route of ledger.notFound) {
  const response = await request(route);
  if (response && response.status !== 404) failures.push(`${route}: expected 404, received ${response.status}`);
}

const missingApi = await request("/api/missing");
if (missingApi && missingApi.status !== 404) failures.push(`/api/missing: expected 404, received ${missingApi.status}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ baseUrl: baseUrl.href, generatedRoutes: ledger.generated.length, redirects: ledger.redirects.length, notFound: ledger.notFound.length }, null, 2));
}
