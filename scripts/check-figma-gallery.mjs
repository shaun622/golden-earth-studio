import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import catalogue from "../worker/catalogue.generated.ts";
import { mediaSlots, resolveMedia } from "../src/data/media.ts";

const read = file => fs.readFileSync(file, "utf8");
const json = file => JSON.parse(read(file));
const html = route => read(`dist${route}index.html`);
const plain = text => text.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
function record(file) {
  const [, fields, body] = read(file).match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  return { data: Object.fromEntries(fields.split(/\r?\n/).filter(Boolean).map(line => {
    const split = line.indexOf(":");
    return [line.slice(0, split), JSON.parse(line.slice(split + 1).trim())];
  })), body: body.trim() };
}
const expectedArtists = ["louis-vincent", "jihyun-kim", "jacob-chan", "alexandra-yan-wong", "adam-weismann", "arran-gregory", "zahed-tajeddin", "rickie-cheuk", "lucia-ocejo", "james-galbraith-kirkpatrick", "edie-evans", "eleanor-herbosch"];
const expectedWorks = {
  "james-galbraith-kirkpatrick": [["square-plate", "Square Plate", "15cm(w) x 4cm(h)", "£80"], ["cup-i", "Cup I", "7cm(w) x 7.5cm(h)", "£70"], ["bowl", "Bowl", "17cm(w) x 7cm(h)", "£80"], ["cup-ii", "Cup II", "7cm(w) x 7.5cm(h)", "£70"]],
  "edie-evans": [["earth-memory", "Earth Memory", "Ball 7cm(l) x 7cm(w) x 7cm(h)\nRock 7cm(l) x 9cm(w) x 6cm(h)", "£275"], ["bedrock", "Bedrock", "8cm(l) x 12cm(w) x 6.5cm(h)", "£375"], ["fragmentation-1", "Fragmentation 1", "10cm(l) x 9.5cm(w) x 8cm(h)", "£175"]],
  "lucia-ocejo": [["round-bud-vase", "Round Bud Vase", "18cm(w) x 20cm(h) x 7cm(w)", "£220"], ["tea-bowl", "Tea Bowl", "8cm(w) x 9cm(h)", "£50"], ["mug", "Mug", "9cm(w) x 8.5cm(h)", "£40"], ["jug", "Jug", "17cm(w) x 26cm(h)", "£160"], ["tiled-screen", "Tiled Screen", "156cm(w) x 130cm(h)", null]],
};
const interior = json("src/data/interior.generated.json");
const order = json("src/data/gallery.generated.json");
const ledger = json("src/data/route-ledger.json");
const plan = read("docs/FIGMA-ARTIST-EXPANSION-PLAN.md");
const gallery = html("/gallery/");
assert.deepEqual(order.artistOrder, expectedArtists);
assert.deepEqual(interior.gallery.artists.map(card => card.href.split("/")[2]), expectedArtists);
assert.equal(interior.gallery.artworks.length, 21);
assert.equal([...gallery.matchAll(/<article class="reference-catalogue-card"/g)].length, 33);
assert.ok(gallery.indexOf('id="artwork-tab"') < gallery.indexOf('id="artists-tab"'));
assert.equal(ledger.generated.length, 72);
assert.equal(Object.keys(catalogue).length, 34);
assert.equal(Object.keys(mediaSlots).length, 17);
assert.throws(() => resolveMedia({ slot: "not-a-photo-slot" }), /Unknown photo slot/);
const oldPhoto = resolveMedia("/assets/images/bowl.webp", "Bowl");
assert.equal(oldPhoto.src, "/assets/images/bowl.webp");
let allUpdatedHtml = gallery;

function checkPage(page, label) {
  assert.ok(!/src="(?:|null|undefined|\[object Object\])"/.test(page), `${label}: invalid image source`);
  assert.ok(!page.includes('class="page-eyebrow"'), `${label}: legacy eyebrow`);
  const form = page.match(/<form\b[^>]*data-variant="commission"[^>]*>([\s\S]*?)<\/form>/)?.[1];
  assert.ok(form, `${label}: commission form missing`);
  const names = [...form.matchAll(/<(?:input|textarea)\b[^>]*name="([^"]+)"/g)].map(item => item[1]);
  assert.deepEqual(names.filter(name => !["variant", "sourcePath", "cf-turnstile-response"].includes(name)), ["email", "subject", "message"]);
}
checkPage(gallery, "Gallery");
for (const slug of [...Object.keys(expectedWorks), "eleanor-herbosch"]) {
  const { data: artist, body } = record(`src/content/artists/${slug}.md`);
  const page = html(`/gallery/${slug}/`);
  const section = plan.split(`### ${artist.name}\n\n`)[1].split(/\n\n(?:###|##) /)[0].trim();
  assert.equal(body, section, `${slug}: biography differs from reference transcription`);
  assert.ok(plain(page).includes(plain(body)), `${slug}: full biography not rendered`);
  assert.equal(artist.profileVariant, "figma-2026");
  assert.ok(page.includes(`data-media-slot="${slug}-portrait"`));
  checkPage(page, slug);
  allUpdatedHtml += page;
  const works = expectedWorks[slug] || [];
  assert.deepEqual(artist.artworkIds, works.map(([work]) => `${slug}/${work}`));
  assert.equal([...page.matchAll(/<article class="figma-work-card"/g)].length, works.length);
  if (slug === "eleanor-herbosch") {
    assert.equal(artist.discipline, "Painting");
    assert.ok(!page.includes("Material studies") && !page.includes("Which material(s)"));
  }
  for (const [work, title, dimensions, price] of works) {
    const id = `${slug}/${work}`, route = `/gallery/${id}/`;
    const { data, body: description } = record(`src/content/artworks/${id}.md`);
    assert.deepEqual([data.title, data.dimensions, data.price, data.year], [title, dimensions, price, 2026], `${id}: wrong facts`);
    assert.equal(description, "");
    assert.equal(data.materials, work === "tiled-screen" ? "Ceramic & Wood" : "London Clay");
    assert.ok(page.includes(`href="${route}"`), `${id}: missing profile link`);
    assert.ok(ledger.generated.includes(route));
    assert.deepEqual(catalogue[id], { title, artist: artist.name, path: route });
    const detail = html(route);
    assert.ok(plain(detail).includes(`${title}, 2026`));
    assert.ok(plain(detail).includes(plain(dimensions)));
    if (price) assert.ok(detail.includes(price));
    else assert.ok(!detail.includes('>Price</dt>'), `${id}: invented price`);
    assert.ok(detail.includes(`name="artworkId" value="${id}"`));
    assert.equal([...detail.matchAll(new RegExp(`data-media-slot="${slug}-${work}"`, "g"))].length, 1);
    assert.ok(!detail.includes("data-lightbox-open"), `${id}: blank is a lightbox target`);
    const related = detail.match(/<div class="figma-related-grid">([\s\S]*?)<\/div>/)?.[1];
    const links = [...related.matchAll(/href="([^"]+)"/g)].map(item => item[1]);
    assert.deepEqual(links, ["/gallery/jihyun-kim/teoju/", "/gallery/zahed-tajeddin/bulls-matter/", "/gallery/louis-vincent/bowl/", "/gallery/rickie-cheuk/chopsticks/"]);
    checkPage(detail, id);
    allUpdatedHtml += detail;
  }
}
for (const [slot, asset] of Object.entries(mediaSlots)) {
  assert.equal(asset.src, null, `${slot}: photo must remain blank until supplied`);
  assert.ok(allUpdatedHtml.includes(`data-media-slot="${slot}"`), `${slot}: unused/missing slot`);
  const blanks = [...allUpdatedHtml.matchAll(new RegExp(`<span[^>]*data-media-slot="${slot}"[^>]*>`, "g"))];
  assert.ok(blanks.length, `${slot}: actual blank not rendered`);
}
assert.ok(!allUpdatedHtml.includes("Side Plate"));
const sitemap = read("dist/sitemap.xml");
for (const route of ledger.generated.filter(route => route.includes("james-galbraith-kirkpatrick") || route.includes("edie-evans") || route.includes("lucia-ocejo"))) assert.ok(sitemap.includes(route));
const files = fs.readdirSync("src/content/artists").filter(file => file.endsWith(".md"));
assert.equal(files.length, 13);
const artworkCount = fs.readdirSync("src/content/artworks", { recursive: true }).filter(file => path.extname(file) === ".md").length;
assert.equal(artworkCount, 34);
console.log("Figma content audit passed: 12 artists, 21 retained Gallery works, 12 new products, exact biographies/facts, 17 actual blanks, forms, related links and sitemap.");
