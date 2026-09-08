import assert from "node:assert/strict";
import fs from "node:fs";

const source = JSON.parse(fs.readFileSync("docs/reference/content/1947.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("src/data/asset-manifest.json", "utf8"));
const html = fs.readFileSync("dist/journal/index.html", "utf8");
const text = (value) => value.replace(/<[^>]*>/g, " ").replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const fields = (file) => Object.fromEntries([...fs.readFileSync(file, "utf8").matchAll(/^(\w+): (.+)$/gm)].map((m) => [m[1], JSON.parse(m[2])]));
const entries = fs.readdirSync("src/content/journal").map((file) => fields(`src/content/journal/${file}`)).filter((entry) => entry.showInIndex).sort((a, b) => a.displayOrder - b.displayOrder);
const cards = [...source.referenceHtml.matchAll(/<a class="elementor-cta" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
assert.equal(cards.length, 16);
assert.equal(entries.length, 16);
for (const [index, card] of cards.entries()) {
  const popup = JSON.parse(Buffer.from(decodeURIComponent(card[1]).split("settings=")[1], "base64").toString());
  const entry = entries[index];
  const expectedTitle = text(card[2].match(/<h2[^>]*>([\s\S]*?)<\/h2>/)[1]);
  const expectedDate = text(card[2].match(/<div class="elementor-cta__description[^>]*>([\s\S]*?)<\/div>/)[1]);
  const expectedImage = card[2].match(/background-image:\s*url\(([^)]+)\)/)[1];
  assert.equal(entry.legacyPopupId, String(popup.id));
  assert.equal(entry.title, expectedTitle);
  assert.equal(text(entry.indexDateLabel), expectedDate);
  assert.equal(manifest.find((asset) => asset.localPath === entry.cardImage)?.remote, expectedImage);
  const renderedCard = html.match(new RegExp(`<article class="journal-card">[\\s\\S]*?data-journal-open="${entry.slug}"[\\s\\S]*?<\\/article>`))?.[0];
  assert.ok(renderedCard?.includes(`src="${entry.cardImage}"`), `Wrong card image: ${entry.slug}`);
  assert.ok(text(renderedCard).includes(expectedTitle), `Missing title: ${entry.slug}`);
  assert.ok(text(renderedCard).includes(expectedDate), `Missing date: ${entry.slug}`);
}
assert.ok(html.includes("Curated chronicles of the <em>innovation</em>, news and events as it unfolds"));
for (const addedCopy of ["<h1>The Journal</h1>", "Past and future events, active invitations", "contact-general-main", "Add Your Heading Text Here"]) assert.ok(!html.includes(addedCopy), `Unexpected Journal content: ${addedCopy}`);
console.log("Journal parity passed: 16 source titles, dates, popup IDs and card images; no invented intro or contact section.");
