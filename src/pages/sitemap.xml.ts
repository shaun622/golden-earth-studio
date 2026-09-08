import type { APIRoute } from "astro";
import routeLedger from "../data/route-ledger.json";

export const GET: APIRoute = async ({ site }) => {
  const base = site || new URL("https://goldenearthstudio.co.uk");
  const routes = [...new Set(routeLedger.generated)].filter((route) => route !== "/journal2/");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${new URL(route, base).href}</loc></url>`).join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
};
