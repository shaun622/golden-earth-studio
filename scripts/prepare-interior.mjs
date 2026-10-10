import assert from "node:assert/strict";
import fs from "node:fs/promises";

// Index presentation is sourced separately: WordPress card labels and crops
// are intentionally not inferred from artist/artwork detail pages.
export async function prepareInterior({ readReference, registerAsset, cleanText, blocksFromHtml }) {
  const gallery = await readReference("content", 333);
  const collective = await readReference("content", 424);
  const mission = await readReference("content", 600);
  const styles = Object.fromEntries(await Promise.all([333, 424, 600].map(async (id) => [id, await fs.readFile(`docs/reference/styles/post-${id}.css`, "utf8")])));
  const cards = [...gallery.referenceHtml.matchAll(/<a href="([^"]+)">\s*<img\b[^>]*src="([^"]+)"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/g)];
  const hovers = [...new Map([...styles[333].matchAll(/\/\* Start custom CSS for image, class: \.elementor-element-([^ ]+)[\s\S]*?background-image:\s*url\('([^']+)'\)/g)].map((m) => [m[1], m[2]])).values()];
  assert.equal(cards.length, 29, "Gallery source card count changed");
  assert.equal(hovers.length, 29, "Gallery hover count changed");
  const galleryCards = cards.map((card, index) => {
    const href = new URL(card[1]).pathname;
    assert.ok(href.startsWith("/gallery/"));
    const label = cleanText(card[3]);
    return {
      href, label,
      image: registerAsset(card[2], "gallery-index", `${index + 1}-image`, label),
      hoverImage: registerAsset(hovers[index], "gallery-index", `${index + 1}-hover`, label),
      objectPosition: index === 8 ? "right center" : "center",
    };
  });
  function background(id, element, mobile = false) {
    const css = mobile ? styles[id].slice(styles[id].indexOf("@media(max-width:767px)")) : styles[id];
    const rule = css.split("}").find((rule) => rule.includes(`elementor-element-${element}`) && rule.includes("background-image:url"));
    const url = rule?.match(/background-image:url\("([^"]+)"\)/)?.[1];
    assert.ok(url, `Missing background for ${id}`);
    return registerAsset(url, "pages", `${id}-${mobile ? "mobile-" : ""}background`, "");
  }
  const collectiveBlocks = blocksFromHtml(collective.referenceHtml);
  const missionBlocks = blocksFromHtml(mission.referenceHtml);
  const missionBody = missionBlocks.find((block) => block.text.startsWith("Currently, only half"))?.text;
  const founders = missionBlocks.find((block) => block.text.startsWith("Golden Earth Studio was established"))?.text;
  assert.ok(missionBody && founders, "Missing original Mission copy");
  const data = {
    gallery: { artists: galleryCards.slice(0, 8), artworks: galleryCards.slice(8), commission: blocksFromHtml(gallery.referenceHtml).filter((b) => b.tag === "p").map((b) => b.text) },
    collective: { background: background(424, "395cc5b"), mobileBackground: background(424, "395cc5b", true), paragraphs: collectiveBlocks.filter((b) => b.tag === "p").map((b) => b.text) },
    mission: { background: background(600, "ae1fc60"), mobileBackground: background(600, "ae1fc60", true), founders },
  };
  await fs.writeFile("src/data/interior.generated.json", JSON.stringify(data, null, 2) + "\n");
  return { missionBody: missionBody.replace(/\n\s*\n/g, "\n\n") };
}
