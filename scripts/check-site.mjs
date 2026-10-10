import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const ledger = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "route-ledger.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "asset-manifest.json"), "utf8"));
const errors = [];
const warnings = [];

function routeFile(route) {
  return route === "/" ? path.join(dist, "index.html") : path.join(dist, route.replace(/^\//, ""), "index.html");
}

function publicFile(urlPath) {
  return path.join(dist, decodeURIComponent(urlPath).replace(/^\//, ""));
}

for (const route of ledger.generated) {
  if (!fs.existsSync(routeFile(route))) errors.push(`Missing generated route: ${route}`);
}
for (const route of ledger.notFound) {
  if (fs.existsSync(routeFile(route))) errors.push(`Excluded route was generated: ${route}`);
}

const redirects = fs.readFileSync(path.join(root, "public", "_redirects"), "utf8");
for (const redirect of ledger.redirects) {
  if (!redirects.includes(`${redirect.from} ${redirect.to} ${redirect.status}`)) errors.push(`Missing redirect rule: ${redirect.from}`);
}

for (const asset of manifest) {
  const file = publicFile(asset.localPath);
  if (!fs.existsSync(file)) errors.push(`Missing migrated asset: ${asset.localPath}`);
  else if (fs.statSync(file).size === 0) errors.push(`Empty migrated asset: ${asset.localPath}`);
}

const htmlFiles = [];
const cssFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(candidate);
    else if (entry.name.endsWith(".html")) htmlFiles.push(candidate);
    else if (entry.name.endsWith(".css")) cssFiles.push(candidate);
  }
}
walk(dist);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(dist, file).replace(/\\/g, "/");
  const pagePath = relative === "index.html" ? "/" : `/${relative.replace(/index\.html$/, "")}`;
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const seen = new Set();
  for (const id of ids) { if (seen.has(id)) errors.push(`Duplicate id ${id} in ${pagePath}`); seen.add(id); }
  for (const match of html.matchAll(/<a\b[^>]*href="(https:\/\/goldenearthstudio\.co\.uk\/[^"]*)"/gi)) {
    warnings.push(`Absolute same-site anchor in ${pagePath}: ${match[1]}`);
  }
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    if (/^(?:mailto:|tel:|https?:\/\/|data:)/i.test(raw)) {
      continue;
    }
    const resolved = new URL(raw, `https://audit.local${pagePath}`);
    if (resolved.hostname !== "audit.local") continue;
    if (resolved.hash && resolved.pathname === pagePath && !seen.has(decodeURIComponent(resolved.hash.slice(1)))) {
      // IDs can appear later in the document, so defer to a whole-document check.
      if (!ids.includes(decodeURIComponent(resolved.hash.slice(1)))) errors.push(`Missing fragment ${raw} in ${pagePath}`);
    }
    if (!resolved.pathname || resolved.pathname === pagePath || resolved.pathname.startsWith("/api/")) continue;
    const target = path.extname(resolved.pathname) ? publicFile(resolved.pathname) : routeFile(resolved.pathname.endsWith("/") ? resolved.pathname : `${resolved.pathname}/`);
    if (!fs.existsSync(target)) errors.push(`Broken internal reference in ${pagePath}: ${raw}`);
  }
  for (const forbidden of ["/wp-content/", "Add Your Heading Text Here", "[newsletter]", "Email delivery will be connected in the Resend phase."]) {
    if (html.includes(forbidden)) errors.push(`Forbidden shipped text in ${pagePath}: ${forbidden}`);
  }
}

for (const file of cssFiles) {
  const css = fs.readFileSync(file, "utf8");
  for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    if (match[1].startsWith("data:")) continue;
    const url = new URL(match[1], "https://audit.local/_astro/style.css");
    if (url.hostname === "audit.local" && !fs.existsSync(publicFile(url.pathname))) errors.push(`Broken CSS asset in ${path.basename(file)}: ${match[1]}`);
  }
}

if (warnings.length) console.warn(warnings.join("\n"));
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(JSON.stringify({ generatedRoutes: ledger.generated.length, redirects: ledger.redirects.length, excludedRoutes: ledger.notFound.length, htmlFiles: htmlFiles.length, migratedAssets: manifest.length, migratedAssetBytes: manifest.reduce((sum, asset) => sum + asset.bytes, 0) }, null, 2));
