import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import catalogue from "../worker/catalogue.generated.ts";
import { mediaSlots, resolveMedia } from "../src/data/media.ts";

const read = file => fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
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
const expectedArtists = ["louis-vincent", "jihyun-kim", "jacob-chan", "alexandra-yan-wong", "adam-weismann", "arran-gregory", "zahed-tajeddin", "rickie-cheuk", "lucia-ocejo", "james-galbraith-kirkpatrick", "edie-evans", "eleanor-herbosch", "jo-pearl", "grace-rose-watts", "shiro-shimizu"];
const expectedWorks = {
  "james-galbraith-kirkpatrick": [["square-plate", "Square Plate", "15cm(w) x 4cm(h)", "£80"], ["cup-i", "Cup I", "7cm(w) x 7.5cm(h)", "£70"], ["bowl", "Bowl", "17cm(w) x 7cm(h)", "£80"], ["large-bowl", "Large Bowl", "", "£80"]],
  "edie-evans": [["earth-memory", "Earth Memory", "Ball 7cm(l) x 7cm(w) x 7cm(h)\nRock 7cm(l) x 9cm(w) x 6cm(h)", "£275"], ["bedrock", "Bedrock", "16.5cm(l) x 12cm(w) x 8cm(h)", "£375"], ["fragmentation-1", "Fragmentation 1", "10cm(l) x 9.5cm(w) x 8cm(h)", "£175"], ["dorodango-pair-ii", "Dorodango Pair II", "", "£275"], ["dorodango-pair-i", "Dorodango Pair I", "", "£275"], ["holding", "Holding", "", "£575"], ["ground", "Ground", "10 x 9.5 x 8 cm", "£575"]],
  "lucia-ocejo": [["round-bud-vase", "Round Bud Vase", "18cm(w) x 20cm(h) x 7cm(w)", "£220"], ["tea-bowl", "Tea Bowl", "8cm(w) x 9cm(h)", "£50"], ["mug", "Mug", "9cm(w) x 8.5cm(h)", "£40"], ["jug", "Jug", "17cm(w) x 26cm(h)", "£160"], ["tiled-screen", "Tiled Screen", "156cm(w) x 130cm(h)", null]],
  "eleanor-herbosch": [["unearthing-series-1", "Unearthing Series #1", "70cm(w) x 120cm(h)", "£7,200"], ["unearthing-series-2", "Unearthing Series #2", "160cm(w) x 80cm(h)", "£10,500"], ["unearthing-series-3", "Unearthing Series #3", "160cm(w) x 80cm(h)", "£10,500"], ["unearthing-series-4", "Unearthing Series #4", "160cm(w) x 90cm(h)", null], ["unearthing-series-5", "Unearthing Series #5", "90cm(w) x 120cm(h)", null]],
};
const expectedMaterials = { "tiled-screen": "Ceramic & Wood", "unearthing-series-1": "London Clay on Canvas", "unearthing-series-2": "London Clay on Canvas", "unearthing-series-3": "London Clay on Canvas", "unearthing-series-4": "London construction clay", "unearthing-series-5": "London construction clay" };
const interior = json("src/data/interior.generated.json");
const order = json("src/data/gallery.generated.json");
const ledger = json("src/data/route-ledger.json");
const plan = read("docs/FIGMA-ARTIST-EXPANSION-PLAN.md");
const gallery = html("/gallery/");
assert.deepEqual(order.artistOrder, expectedArtists);
assert.deepEqual(interior.gallery.artists.map(card => card.href.split("/")[2]), expectedArtists);
// The 21 original works follow 50 works added in 2026; cards are shuffled in the browser.
assert.equal(interior.gallery.artworks.length, 87);
for (const card of interior.gallery.artworks) assert.ok(fs.existsSync(`dist${card.href}index.html`), `Broken Artworks tab link ${card.href}`);
assert.equal([...gallery.matchAll(/<article class="reference-catalogue-card"/g)].length, 102);
assert.ok(gallery.indexOf('id="artwork-tab"') < gallery.indexOf('id="artists-tab"'));
assert.equal(ledger.generated.length, 130);
assert.equal(Object.keys(catalogue).length, 88);
assert.equal(Object.keys(mediaSlots).length, 198);
const retiredId = "james-galbraith-kirkpatrick/cup-ii";
const retiredRoute = `/gallery/${retiredId}/`;
assert.ok(!Object.hasOwn(catalogue, retiredId), "Retired Cup II remains available for enquiries");
assert.ok(!ledger.generated.includes(retiredRoute), "Retired Cup II remains a generated route");
assert.deepEqual(ledger.redirects.find(item => item.from === retiredRoute), { from: retiredRoute, to: "/gallery/james-galbraith-kirkpatrick/", status: 301 });
assert.ok(!fs.existsSync("dist/gallery/james-galbraith-kirkpatrick/cup-ii/index.html"), "Retired Cup II page remains in the build");
assert.ok(!fs.existsSync("public/assets/artworks/james-galbraith-kirkpatrick/cup-ii.webp"), "Retired Cup II photo remains public");
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
for (const slug of Object.keys(expectedWorks)) {
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
  assert.equal([...page.matchAll(/<article class="figma-work-card[" ]/g)].length, works.length);
  if (slug === "eleanor-herbosch") {
    assert.equal(artist.discipline, "Painting");
    assert.ok(!page.includes("Material studies") && !page.includes("Which material(s)"));
    // The owner asked for only the catalogue artwork on Eleanor's profile; the earlier painting remains the Gallery hover only.
    assert.equal(artist.profileArtworkImage, undefined);
    assert.ok(!page.includes("figma-profile-artwork"), "Eleanor: standalone painting still on profile");
    assert.ok(!page.includes("figma-artist--without-works"), "Eleanor: empty artwork spacing retained");
  }
  for (const [work, title, dimensions, price] of works) {
    const id = `${slug}/${work}`, route = `/gallery/${id}/`;
    const { data, body: description } = record(`src/content/artworks/${id}.md`);
    assert.deepEqual([data.title, data.dimensions, data.price, data.year], [title, dimensions, price, 2026], `${id}: wrong facts`);
    assert.equal(description, "");
    assert.equal(data.materials, expectedMaterials[work] || "London Clay");
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
    const image = resolveMedia(data.mainImage);
    if (image.src) {
      assert.ok(detail.includes(`src="${image.src}"`), `${id}: supplied product photo not rendered`);
      assert.ok(!detail.includes("data-lightbox-open"), `${id}: product photos should not open a viewer`);
      assert.ok(detail.includes(`content="https://goldenearthstudio.co.uk${image.src}"`), `${id}: social image mismatch`);
    } else {
      assert.ok(!detail.includes("data-lightbox-open"), `${id}: blank is a lightbox target`);
    }
    const card = resolveMedia(data.cardImage || data.mainImage);
    assert.ok(page.includes(`data-media-slot="${card.slot}"`), `${id}: profile crop missing`);
    if (card.src) assert.ok(page.includes(`src="${card.src}"`), `${id}: profile photo missing`);
    const related = detail.match(/<div class="figma-related-grid"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    // Related works come from a pool of similar Artworks-tab pieces; the browser shows a random four.
    const links = [...related.matchAll(/href="([^"]+)"/g)].map(item => item[1]);
    const tab = new Set(interior.gallery.artworks.map(card => card.href));
    assert.ok(links.length >= 4 && links.every(link => tab.has(link) && link !== route), `${id}: related pool must hold four or more other Artworks-tab works`);
    // The artist's own other works lead the pool, ahead of every other artist.
    const own = links.map(link => link.startsWith(`/gallery/${slug}/`));
    assert.ok(own.every((mine, index) => !mine || own.slice(0, index).every(Boolean)), `${id}: the artist's own works must come first in related artworks`);
    checkPage(detail, id);
    allUpdatedHtml += detail;
  }
}
// Louis Vincent's 2026 works lead his existing catalogue pieces on his profile.
const louisWorks = [["bowl-iii", "Bowl III", "11.2cm(h) x 21.6cm(w)", "£350"], ["bowl-ii", "Bowl II", "9.8cm(h) x 21.7cm(w)", "£325"], ["plate-ii", "Plate II", "2.2cm(h) x 25.7cm(w)", "£225"], ["plate-iii", "Plate III", "0.4cm(h) x 19.5cm(w)", "£150"], ["plate-iv", "Plate IV", "0.4cm(h) x 19cm(w)", "£150"]];
// Wall panels III–V follow his original catalogue pieces at the end of the profile.
const louisPanels = [["wall-panel-iii", "Wall Panel III", "45.4cm(h) x 10.2cm(w)", "£600"], ["wall-panel-iv", "Wall Panel IV", "56.5cm(h) x 16.3cm(w)", "£800"], ["wall-panel-v", "Wall Panel V", "50.2cm(h) x 16.7cm(w)", "£725"]];
const louis = record("src/content/artists/louis-vincent.md").data;
assert.deepEqual(louis.artworkIds.slice(0, louisWorks.length), louisWorks.map(([work]) => `louis-vincent/${work}`));
assert.deepEqual(louis.artworkIds.slice(-louisPanels.length), louisPanels.map(([work]) => `louis-vincent/${work}`));
const louisPage = html("/gallery/louis-vincent/");
allUpdatedHtml += louisPage;
for (const [work, title, dimensions, price] of [...louisWorks, ...louisPanels]) {
  const id = `louis-vincent/${work}`, route = `/gallery/${id}/`;
  const { data } = record(`src/content/artworks/${id}.md`);
  assert.deepEqual([data.title, data.dimensions, data.price, data.year, data.materials, data.tileMedium], [title, dimensions, price, 2026, "Wood, clay and lacquer", "Wood"], `${id}: wrong facts`);
  assert.ok(louisPage.includes(`href="${route}"`), `${id}: missing profile link`);
  assert.ok(ledger.generated.includes(route));
  assert.deepEqual(catalogue[id], { title, artist: "Louis Vincent", path: route });
  const detail = html(route);
  assert.ok(detail.includes(`name="artworkId" value="${id}"`));
  checkPage(detail, id);
  allUpdatedHtml += detail;
}

// Jacob Chan's 2026 works follow his Chess Set; sizes are not yet supplied.
const jacobWorks = [["sake-set-1", "Sake Set #1"], ["sake-set-2", "Sake Set #2"], ["sake-set-3", "Sake Set #3"], ["sake-set-4", "Sake Set #4"], ["ginger-jar-2026", "Ginger Jar"], ["lotus-set", "Lotus Set"], ["bottle-series", "Bottle Series"]];
const jacob = record("src/content/artists/jacob-chan.md").data;
// The Chess Set leads, the Lotus Set is third, and the sake sets are spread out rather than grouped.
assert.equal(jacob.artworkIds[0], "jacob-chan/chess-set");
assert.equal(jacob.artworkIds[2], "jacob-chan/lotus-set");
assert.deepEqual(new Set(jacob.artworkIds.slice(1, jacobWorks.length + 1)), new Set(jacobWorks.map(([work]) => `jacob-chan/${work}`)));
const jacobPage = html("/gallery/jacob-chan/");
allUpdatedHtml += jacobPage;
for (const [work, title] of jacobWorks) {
  const id = `jacob-chan/${work}`, route = `/gallery/${id}/`;
  assert.ok(jacobPage.includes(`href="${route}"`), `${id}: missing profile link`);
  assert.ok(ledger.generated.includes(route));
  assert.deepEqual(catalogue[id], { title, artist: "Jacob Chan", path: route });
  const detail = html(route);
  assert.ok(detail.includes(`name="artworkId" value="${id}"`));
  assert.ok(!detail.includes(">Dimensions</dt>"), `${id}: empty dimensions rendered`);
  checkPage(detail, id);
  allUpdatedHtml += detail;
}

// Alexandra Yan Wong's GES series runs in number order after the renamed GES#1.
const alexWorks = [["ges-2", "Untitled (GES#2)", "100 x 75 cm", "£5,500"], ["ges-3", "Untitled (GES#3)", "30.5 x 30.5 cm", "£850"], ["ges-4", "Untitled (GES#4)", "30.5 x 30.5 cm", "£850"], ["ges-5", "Untitled (GES#5)", "21 x 30 cm", "£550"], ["ges-6", "Untitled (GES#6)", "21 x 30 cm", "£550"], ["ges-7", "Untitled (GES#7)", "21 x 30 cm", "£550"]];
const alex = record("src/content/artists/alexandra-yan-wong.md").data;
assert.deepEqual(alex.artworkIds, ["alexandra-yan-wong/untitled-2025", ...alexWorks.map(([work]) => `alexandra-yan-wong/${work}`), "alexandra-yan-wong/ges-8", "alexandra-yan-wong/untitled-series"]);
// Sold pieces come first in every artist's list of artworks.
for (const artistFile of fs.readdirSync("src/content/artists")) {
  const artistData = record(`src/content/artists/${artistFile}`).data;
  if (!artistData.listedInGallery || artistData.profileVariant !== "figma-2026") continue;
  const cards = [...html(`/gallery/${artistData.slug}/`).matchAll(/<article class="figma-work-card[^"]*">\s*<a href="\/gallery\/([^"]+)\/"/g)].map((match) => match[1]);
  const soldFlags = cards.map((id) => record(`src/content/artworks/${id}.md`).data.sold === true);
  assert.ok(soldFlags.every((sold, index) => !sold || soldFlags.slice(0, index).every(Boolean)), `${artistData.slug}: sold works must come first`);
}
// Sold works say SOLD, in capitals, as the first line of the details and of the profile card caption.
{
  const page = html("/gallery/adam-weismann/red-earth/"), facts = page.match(/<dl class="figma-product-facts">([\s\S]*?)<\/dl>/)[1];
  assert.ok(/^\s*<div><dt[^>]*>Availability<\/dt><dd>SOLD<\/dd>/.test(facts), "red-earth: SOLD should be the first detail");
  const profile = html("/gallery/adam-weismann/"), caption = profile.match(/href="\/gallery\/adam-weismann\/red-earth\/"[\s\S]*?<span class="figma-work-caption">([\s\S]*?)<\/span>\s*<\/a>/)[1];
  assert.ok(caption.trim().startsWith('<span class="figma-work-sold">SOLD</span>'), "red-earth: SOLD should lead the profile card caption");
}
// Her large GES#8 is sold, so it shows "SOLD" and no price.
const alexGes8 = record("src/content/artworks/alexandra-yan-wong/ges-8.md").data;
assert.deepEqual([alexGes8.title, alexGes8.dimensions, alexGes8.price, alexGes8.sold, alexGes8.year], ["Untitled (GES#8)", "140 x 140 cm", null, true, 2026]);
assert.deepEqual(catalogue["alexandra-yan-wong/ges-8"], { title: "Untitled (GES#8)", artist: "Alexandra Yan Wong", path: "/gallery/alexandra-yan-wong/ges-8/" });
const alexGes8Page = html("/gallery/alexandra-yan-wong/ges-8/");
assert.ok(alexGes8Page.includes(">SOLD</dd>") && !alexGes8Page.includes("£"), "alexandra-yan-wong/ges-8: should show Sold and no price");
checkPage(alexGes8Page, "alexandra-yan-wong/ges-8");
allUpdatedHtml += alexGes8Page;
// Her Untitled Series is sold, so it shows "SOLD" and no price.
const alexSeries = record("src/content/artworks/alexandra-yan-wong/untitled-series.md").data;
assert.deepEqual([alexSeries.title, alexSeries.price, alexSeries.sold, alexSeries.materials], ["Untitled Series", null, true, "London construction clay, paper and ink"]);
const alexSeriesPage = html("/gallery/alexandra-yan-wong/untitled-series/");
assert.ok(alexSeriesPage.includes(">SOLD</dd>") && !alexSeriesPage.includes("£"), "alexandra-yan-wong/untitled-series: should show Sold and no price");
checkPage(alexSeriesPage, "alexandra-yan-wong/untitled-series");
allUpdatedHtml += alexSeriesPage;
const alexPage = html("/gallery/alexandra-yan-wong/");
allUpdatedHtml += alexPage;
allUpdatedHtml += html("/gallery/alexandra-yan-wong/untitled-2025/");
// Adam Weismann's Terre Verte leads his profile; materials and size are not yet supplied.
const adam = record("src/content/artists/adam-weismann.md").data;
assert.deepEqual(adam.artworkIds.slice(0, 2), ["adam-weismann/red-earth", "adam-weismann/terre-verte"]);
// Red Earth is sold, so it shows "SOLD" and no price.
const redEarth = record("src/content/artworks/adam-weismann/red-earth.md").data;
assert.deepEqual([redEarth.title, redEarth.price, redEarth.sold, redEarth.year, redEarth.materials], ["Red Earth", null, true, 2026, "London construction clay"]);
assert.deepEqual(catalogue["adam-weismann/red-earth"], { title: "Red Earth", artist: "Adam Weismann", path: "/gallery/adam-weismann/red-earth/" });
const redEarthPage = html("/gallery/adam-weismann/red-earth/");
assert.ok(redEarthPage.includes(">SOLD</dd>") && !redEarthPage.includes("£"), "adam-weismann/red-earth: should show Sold and no price");
checkPage(redEarthPage, "adam-weismann/red-earth");
assert.ok(redEarthPage.includes("figma-product--wide"), "adam-weismann/red-earth: photos should take half the page");
allUpdatedHtml += redEarthPage;
// Eleanor Herbosch's Unearthing Series #4 and #5 are sold, so they show "Sold" and no price.
for (const work of ["unearthing-series-4", "unearthing-series-5"]) {
  assert.equal(record(`src/content/artworks/eleanor-herbosch/${work}.md`).data.sold, true, `${work}: should be sold`);
  assert.ok(html(`/gallery/eleanor-herbosch/${work}/`).includes(">SOLD</dd>"), `${work}: Sold not shown`);
}
assert.deepEqual(catalogue["adam-weismann/terre-verte"], { title: "Terre Verte", artist: "Adam Weismann", path: "/gallery/adam-weismann/terre-verte/" });
const terreVerte = html("/gallery/adam-weismann/terre-verte/");
assert.ok(terreVerte.includes("£16,000 for the diptych (two panels)") && !terreVerte.includes(">Materials</dt>"));
checkPage(terreVerte, "adam-weismann/terre-verte");
allUpdatedHtml += html("/gallery/adam-weismann/") + terreVerte;
// Arran Gregory's 2026 works lead his profile.
const arranWorks = ["blue-entity-study-2", "wheel-of-matter", "all-our-gods-are-dancing-gods", "incense-ball", "inbetween-worlds", "meditation-balls"];
const arran = record("src/content/artists/arran-gregory.md").data;
assert.deepEqual(arran.artworkIds.slice(0, arranWorks.length), arranWorks.map((work) => `arran-gregory/${work}`));
allUpdatedHtml += html("/gallery/arran-gregory/");
allUpdatedHtml += html("/gallery/rickie-cheuk/") + html("/gallery/rickie-cheuk/cutlery-set/");
allUpdatedHtml += html("/gallery/zahed-tajeddin/") + html("/gallery/zahed-tajeddin/bull-leaping-ii/") + html("/gallery/zahed-tajeddin/beauty-and-the-beast/");
allUpdatedHtml += html("/gallery/arran-gregory/heart-of-matter/") + html("/gallery/arran-gregory/the-universe-was-an-egg-which-cracked/");
for (const work of arranWorks) {
  const detail = html(`/gallery/arran-gregory/${work}/`);
  assert.ok(detail.includes(`name="artworkId" value="arran-gregory/${work}"`));
  checkPage(detail, work);
  allUpdatedHtml += detail;
}
for (const [work, title, dimensions, price] of alexWorks) {
  const id = `alexandra-yan-wong/${work}`, route = `/gallery/${id}/`;
  const { data } = record(`src/content/artworks/${id}.md`);
  assert.deepEqual([data.title, data.dimensions, data.price, data.year, data.materials], [title, dimensions, price, 2026, "London Clay, Paper and Canvas"], `${id}: wrong facts`);
  assert.ok(alexPage.includes(`href="${route}"`), `${id}: missing profile link`);
  assert.deepEqual(catalogue[id], { title, artist: "Alexandra Yan Wong", path: route });
  const detail = html(route);
  assert.ok(detail.includes(`name="artworkId" value="${id}"`));
  checkPage(detail, id);
  allUpdatedHtml += detail;
}

for (const [slot, asset] of Object.entries(mediaSlots)) {
  assert.ok(allUpdatedHtml.includes(`data-media-slot="${slot}"`), `${slot}: unused/missing slot`);
  const blanks = [...allUpdatedHtml.matchAll(new RegExp(`<span[^>]*data-media-slot="${slot}"[^>]*>`, "g"))];
  if (asset.src === null) {
    assert.ok(blanks.length, `${slot}: actual blank not rendered`);
  } else {
    assert.ok(asset.src.startsWith("/assets/"), `${slot}: supplied photo must be local`);
    assert.ok(fs.existsSync(path.join("public", asset.src.slice(1))), `${slot}: photo file missing`);
    assert.ok(asset.width > 0 && asset.height > 0, `${slot}: invalid intrinsic dimensions`);
    assert.equal(blanks.length, 0, `${slot}: supplied photo still renders a blank`);
    assert.ok(allUpdatedHtml.includes(`src="${asset.src}"`), `${slot}: photo not rendered`);
  }
}
assert.ok(!allUpdatedHtml.includes("Side Plate"));
const sitemap = read("dist/sitemap.xml");
for (const route of ledger.generated.filter(route => route.includes("james-galbraith-kirkpatrick") || route.includes("edie-evans") || route.includes("lucia-ocejo") || route.includes("eleanor-herbosch"))) assert.ok(sitemap.includes(route));
const files = fs.readdirSync("src/content/artists").filter(file => file.endsWith(".md"));
assert.equal(files.length, 16);
const artworkCount = fs.readdirSync("src/content/artworks", { recursive: true }).filter(file => path.extname(file) === ".md").length;
assert.equal(artworkCount, 88);
assert.ok(!allUpdatedHtml.includes("Cup II, 2026") && !allUpdatedHtml.includes("/cup-ii/"), "Retired cup remains in rendered content");
assert.ok(!sitemap.includes(retiredRoute), "Retired cup remains in sitemap");
assert.ok(gallery.includes('src="/assets/artworks/james-galbraith-kirkpatrick/cup-i.webp"'), "James Gallery hover must use retained patterned Cup I");
const pendingPhotos = Object.values(mediaSlots).filter(asset => asset.src === null).length;
console.log(`Figma content audit passed: 12 artists, 21 retained and 50 added Gallery works, 50 new products, retired Cup II absent, exact biographies/facts, ${Object.keys(mediaSlots).length - pendingPhotos} supplied photos, ${pendingPhotos} actual blanks, forms, related links and sitemap.`);
