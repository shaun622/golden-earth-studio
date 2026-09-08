import assert from "node:assert/strict";
import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const source = (id) => JSON.parse(read(`docs/reference/content/${id}.json`));
const data = JSON.parse(read("src/data/interior.generated.json"));
const collective = JSON.parse(read("src/data/collective.generated.json"));
const manifest = JSON.parse(read("src/data/asset-manifest.json"));
const remote = (local) => manifest.find((asset) => asset.localPath === local)?.remote;
const normalize = (text) => text.replace(/<[^>]*>/g, "").replace(/&#x([a-f\d]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/\s+/g, "");
const pages = Object.fromEntries(["collective", "gallery", "our-mission"].map((slug) => [slug, read(`dist/${slug}/index.html`)]));
for (const [id, slug] of [[424, "collective"], [600, "our-mission"]]) {
  const blocks = [...source(id).referenceHtml.matchAll(/<(h[1-6]|p)\b[^>]*>([\s\S]*?)<\/\1>/g)];
  for (const block of blocks) assert.ok(normalize(pages[slug]).includes(normalize(block[2])), `${slug}: missing original copy ${normalize(block[2]).slice(0, 80)}`);
  const background = data[slug === "collective" ? "collective" : "mission"].background;
  assert.ok(read(`docs/reference/styles/post-${id}.css`).includes(remote(background)), `${slug}: wrong background`);
  assert.ok(pages[slug].includes(background), `${slug}: background not rendered`);
  const mobileBackground = data[slug === "collective" ? "collective" : "mission"].mobileBackground;
  assert.ok(read(`docs/reference/styles/post-${id}.css`).includes(remote(mobileBackground)) && pages[slug].includes(mobileBackground), `${slug}: missing mobile background`);
}
assert.equal(collective.length, 9);
for (const item of collective) {
  assert.equal(remote(item.image), item.originalUrl);
  assert.ok(pages.collective.includes(`src="${item.image}"`));
  assert.ok(pages.collective.includes(`width="${item.width}" height="${item.height}"`));
  assert.ok(pages.collective.includes(item.creator));
}
const sourceCards = [...source(333).referenceHtml.matchAll(/<a href="([^"]+)">\s*<img\b[^>]*src="([^"]+)"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/g)];
assert.ok(normalize(pages.gallery).includes(normalize(source(333).headings[0])));
const cards = [...data.gallery.artists, ...data.gallery.artworks];
const renderedCards = [...pages.gallery.matchAll(/<article class="reference-catalogue-card">([\s\S]*?)<\/article>/g)];
assert.equal(cards.length, 29);
assert.equal(renderedCards.length, 29);
const expectedHovers = [...new Map([...read("docs/reference/styles/post-333.css").matchAll(/\/\* Start custom CSS for image, class: \.elementor-element-([^ ]+)[\s\S]*?background-image:\s*url\('([^']+)'\)/g)].map((m) => [m[1], m[2]])).values()];
for (const [index, card] of cards.entries()) {
  assert.equal(normalize(card.label), normalize(sourceCards[index][3]));
  assert.equal(card.href, new URL(sourceCards[index][1]).pathname);
  assert.equal(remote(card.image), sourceCards[index][2]);
  assert.equal(remote(card.hoverImage), expectedHovers[index]);
  const rendered = renderedCards[index][1];
  assert.ok(normalize(rendered).includes(normalize(card.label)));
  assert.ok(rendered.includes(`href="${card.href}"`) && rendered.includes(`src="${card.image}"`) && rendered.includes(`src="${card.hoverImage}"`));
  assert.ok(fs.existsSync(`dist${card.href}index.html`), `Broken catalogue route ${card.href}`);
}
for (const copy of data.gallery.commission) assert.ok(normalize(pages.gallery).includes(normalize(copy)));
for (const [slug, forbidden] of [["collective", "<h1>The Collective</h1>"], ["collective", "contact-general-main"], ["gallery", "<h1>Gallery</h1>"], ["our-mission", "page-kicker"], ["our-mission", "mission-statement"]]) assert.ok(!pages[slug].includes(forbidden));
const portraits = [...source(600).referenceHtml.matchAll(/data-thumbnail="([^"]+)"/g)];
for (const portrait of portraits) {
  const asset = manifest.find((a) => a.remote === portrait[1]);
  assert.ok(asset && pages["our-mission"].includes(`src="${asset.localPath}"`), "Missing founder portrait");
}
console.log("Interior parity passed: original Collective/Mission copy, 9 Collective images, 29 Gallery labels and image/hover pairs, 2 founder portraits, original backgrounds and commission copy.");
