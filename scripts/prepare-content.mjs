import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { prepareInterior } from "./prepare-interior.mjs";

const root = process.cwd();
const referenceRoot = path.join(root, "docs", "reference");
const contentRoot = path.join(root, "src", "content");
const assetRoot = path.join(root, "public", "assets", "migrated");

const artistSpecs = [
  { id: 2952, slug: "louis-vincent", name: "Louis Vincent", discipline: "Wood", listedInGallery: true, artworks: ["wall-panel-i", "plate", "conical-bowl", "bowl", "wall-panel-ii"] },
  { id: 2837, slug: "jihyun-kim", name: "Jihyun Kim", discipline: "Ceramic", listedInGallery: true, artworks: ["teoju", "small-teoju"] },
  { id: 1439, slug: "jacob-chan", name: "Jacob Chan", discipline: "Ceramic", listedInGallery: true, artworks: ["chess-set", "sake-set", "ginger-jar-2", "sake-bottle", "ginger-jar", "sake-bottle-2"] },
  { id: 4262, slug: "alexandra-yan-wong", name: "Alexandra Yan Wong", discipline: "Painting", listedInGallery: true, artworks: ["untitled-2025"] },
  { id: 4332, slug: "adam-weismann", name: "Adam Weismann", discipline: "Wall Art", listedInGallery: true, artworks: ["clay-2025"] },
  { id: 4235, slug: "arran-gregory", name: "Arran Gregory", discipline: "Clay", listedInGallery: true, artworks: ["the-universe-was-an-egg-which-cracked", "heart-of-matter"] },
  { id: 3072, slug: "zahed-tajeddin", name: "Zahed Tajeddin", discipline: "Ceramic", listedInGallery: true, artworks: ["bulls-matter", "bowing-bull", "elevation", "stillness"] },
  { id: 2872, slug: "rickie-cheuk", name: "Rickie Cheuk", discipline: "Metal", listedInGallery: true, artworks: ["chopsticks"] },
  { id: 1454, slug: "celia-dowson", name: "Celia Dowson", discipline: "Ceramic & cast glass", listedInGallery: false, artworks: [], profileVariant: "editorial" },
  { id: 362, slug: "eleanor-herbosch", name: "Eleanor Herbosch", discipline: "Ceramic", listedInGallery: false, artworks: [], profileVariant: "editorial" },
];

const artworkWpIds = {
  "louis-vincent/wall-panel-i": 3007,
  "louis-vincent/plate": 3039,
  "louis-vincent/conical-bowl": 3017,
  "louis-vincent/bowl": 2974,
  "louis-vincent/wall-panel-ii": 3057,
  "jihyun-kim/teoju": 2861,
  "jihyun-kim/small-teoju": 4387,
  "jacob-chan/chess-set": 2753,
  "jacob-chan/sake-set": 4453,
  "jacob-chan/ginger-jar-2": 4433,
  "jacob-chan/sake-bottle": 4470,
  "jacob-chan/ginger-jar": 2826,
  "jacob-chan/sake-bottle-2": 4475,
  "alexandra-yan-wong/untitled-2025": 4270,
  "adam-weismann/clay-2025": 4351,
  "arran-gregory/the-universe-was-an-egg-which-cracked": 4257,
  "arran-gregory/heart-of-matter": 4249,
  "zahed-tajeddin/bulls-matter": 3133,
  "zahed-tajeddin/bowing-bull": 3107,
  "zahed-tajeddin/elevation": 3144,
  "zahed-tajeddin/stillness": 3155,
  "rickie-cheuk/chopsticks": 2878,
};

const galleryArtworkOrder = [
  "jacob-chan/chess-set", "alexandra-yan-wong/untitled-2025", "louis-vincent/bowl",
  "louis-vincent/wall-panel-i", "jihyun-kim/teoju", "arran-gregory/the-universe-was-an-egg-which-cracked",
  "jacob-chan/sake-set", "zahed-tajeddin/bowing-bull", "adam-weismann/clay-2025",
  "louis-vincent/conical-bowl", "zahed-tajeddin/bulls-matter", "jihyun-kim/small-teoju",
  "jacob-chan/ginger-jar-2", "rickie-cheuk/chopsticks", "louis-vincent/wall-panel-ii",
  "louis-vincent/plate", "jacob-chan/sake-bottle-2", "arran-gregory/heart-of-matter",
  "jacob-chan/sake-bottle", "zahed-tajeddin/elevation", "jacob-chan/ginger-jar",
];

const journalSpecs = [
  [4602, "were-hiring", "We're Hiring", "14 January 2026"],
  [4586, "reframing-waste", "Reframing Waste", "12 November 2025"],
  [4590, "735kg-reclaimed", "735kg Reclaimed", "29 October 2025"],
  [4580, "ekta-bagri-residency", "Ekta Bagri Residency", "5 October 2025"],
  [4573, "subsurface-by-hal-strode", "Subsurface by Hal Strode", "16 September 2025"],
  [3685, "arran-gregory-interview", "Arran Gregory Interview", "17 July 2025"],
  [3700, "chp-masterclass", "CHP Masterclass", "17 June 2025"],
  [3708, "london-craft-week", "London Craft Week", "12 May 2025"],
  [2503, "ges-workshop-masterclass", "GES Workshop Masterclass", "17 May 2025"],
  [2452, "meet-olla-ceramics", "Meet Olla Ceramics", "5 January 2025"],
  [2430, "ceramics-monthly", "Ceramics Monthly", "15 September 2024"],
  [2170, "circular-ceramics", "Circular Ceramics", "1 April 2023"],
  [2168, "excavation", "Excavation", "31 January 2022"],
  [2164, "piling-begins", "Piling Begins", "29 January 2022"],
  [2096, "grand-designs", "Grand Designs", "8 May 2022"],
  [2166, "material-collection", "Material Collection", "17 February 2022"],
];

const namedEntities = {
  amp: "&", apos: "'", quot: '"', lt: "<", gt: ">", nbsp: " ", pound: "£",
  ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…",
};

function decodeEntities(value = "") {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (_, entity) => {
    if (entity[0] === "#") {
      const code = entity[1].toLowerCase() === "x" ? Number.parseInt(entity.slice(2), 16) : Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : "";
    }
    return namedEntities[entity.toLowerCase()] ?? `&${entity};`;
  });
}

function cleanText(value = "") {
  return decodeEntities(value.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, " "))
    .replace(/[\t\r ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function inlineMarkdown(value = "") {
  let result = value
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<(strong|b)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<(em|i)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => `[${cleanText(label)}](${decodeEntities(href)})`);
  result = cleanText(result).replace(/\[\s*\]\([^)]*\)/g, "");
  return result;
}

function blocksFromHtml(html = "") {
  const withoutForms = html.replace(/<form\b[\s\S]*?<\/form>/gi, " ");
  const blocks = [];
  const regex = /<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const match of withoutForms.matchAll(regex)) {
    const text = cleanText(match[2]);
    if (!text) continue;
    const tag = match[1].toLowerCase();
    const markdown = inlineMarkdown(match[2]);
    blocks.push({ tag, text, markdown });
  }
  return blocks;
}

function markdownFromBlocks(blocks) {
  return blocks.map(({ tag, markdown }) => {
    if (tag.startsWith("h")) return `${"#".repeat(Math.min(3, Number(tag[1]) || 2))} ${markdown}`;
    if (tag === "li") return `- ${markdown}`;
    return markdown;
  }).filter(Boolean).join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

function largestImage(image) {
  if (!image) return null;
  // WordPress can advertise stale generated srcset derivatives. The rendered
  // src is the source-backed file visitors actually receive; linked lightbox
  // originals are registered separately where the page exposes them.
  return image.src || null;
}

function isMediaUrl(url = "") {
  return /\.(?:avif|gif|jpe?g|png|webp|svg|pdf|mp4|webm)(?:\?.*)?$/i.test(url);
}

function mediaLinks(record) {
  return (record.links || []).map((link) => link.href).filter(isMediaUrl);
}

function mediaUrlsFromHtml(html = "") {
  const urls = [];
  for (const match of html.matchAll(/https:\/\/goldenearthstudio\.co\.uk\/wp-content\/uploads\/[^\s"'<>\\]+?\.(?:avif|gif|jpe?g|png|webp|svg|pdf|mp4|webm)(?:\?[^\s"'<>\\]*)?/gi)) {
    urls.push(decodeEntities(match[0]));
  }
  return [...new Set(urls)];
}

function pathsFromContentLinks(record) {
  return (record.links || []).map((link) => {
    try { return new URL(link.href).pathname; } catch { return ""; }
  }).filter((pathname) => pathname.startsWith("/gallery/") && pathname.split("/").filter(Boolean).length === 3);
}

function yamlFrontmatter(data) {
  return Object.entries(data).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n");
}

function excerpt(text, length = 180) {
  const normalized = cleanText(text).replace(/\s+/g, " ");
  return normalized.length <= length ? normalized : `${normalized.slice(0, length).replace(/\s+\S*$/, "")}…`;
}

async function readReference(kind, id) {
  return JSON.parse(await fs.readFile(path.join(referenceRoot, kind, `${id}.json`), "utf8"));
}

const assetQueue = [];
const assetByRemote = new Map();

function registerAsset(remote, folder, stem, alt) {
  if (!remote) return null;
  if (assetByRemote.has(remote)) return assetByRemote.get(remote).localPath;
  const extension = path.extname(new URL(remote).pathname).toLowerCase();
  const passthrough = [".svg", ".pdf", ".mp4", ".webm"].includes(extension);
  const safeStem = stem.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const suffix = crypto.createHash("sha1").update(remote).digest("hex").slice(0, 7);
  const outputExtension = passthrough ? extension : ".webp";
  const localPath = `/assets/migrated/${folder}/${safeStem}-${suffix}${outputExtension}`;
  const item = { remote, localPath, alt, passthrough };
  assetQueue.push(item);
  assetByRemote.set(remote, item);
  return localPath;
}

async function downloadAsset(item) {
  const destination = path.join(root, "public", item.localPath.replace(/^\//, ""));
  await fs.mkdir(path.dirname(destination), { recursive: true });
  try {
    const existing = await fs.stat(destination);
    if (existing.size > 0) return { ...item, bytes: existing.size, status: "existing" };
  } catch {}
  const response = await fetch(item.remote, { headers: {
    "user-agent": "Mozilla/5.0 Golden Earth Studio migration/1.0",
    "referer": "https://goldenearthstudio.co.uk/",
    "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  } });
  if (!response.ok) throw new Error(`${response.status} ${item.remote}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length === 0) throw new Error(`Empty asset ${item.remote}`);
  if (item.passthrough) {
    await fs.writeFile(destination, buffer);
    return { ...item, bytes: buffer.length, status: "downloaded" };
  }
  const source = sharp(buffer, { animated: true }).rotate();
  const metadata = await source.metadata();
  await source.resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, alphaQuality: 90, effort: 5 })
    .toFile(destination);
  const output = await sharp(destination).metadata();
  return { ...item, bytes: (await fs.stat(destination)).size, sourceWidth: metadata.width, sourceHeight: metadata.height, width: output.width, height: output.height, format: output.format, status: "downloaded" };
}

async function runPool(items, worker, concurrency = 5) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  }));
  return results;
}

function artworkParts(record) {
  const blocks = blocksFromHtml(record.referenceHtml);
  const heading = record.headings?.[0] || record.title;
  const start = blocks.findIndex((block) => block.text === heading);
  const afterHeading = blocks.slice(start >= 0 ? start + 1 : 0);
  const stop = afterHeading.findIndex((block) => /^(Enquire now|Related Artworks)$/i.test(block.text));
  const relevant = afterHeading.slice(0, stop >= 0 ? stop : undefined).filter((block) => !/^(First & Last Name|Email|Phone|Message|Send)$/i.test(block.text));
  const dimensionIndex = relevant.findIndex((block) => /(?:cm|mm)\s*\(/i.test(block.text));
  const dimensions = dimensionIndex >= 0 ? relevant[dimensionIndex].text : "";
  const materialIndex = dimensionIndex >= 0
    ? relevant.findIndex((block, index) => index > dimensionIndex && block.text !== "–")
    : -1;
  const materials = materialIndex >= 0 ? relevant[materialIndex].text : "";
  const descriptionIndex = relevant.findIndex((block, index) => index > materialIndex && block.text.length > 55 && !/^£/.test(block.text));
  const price = descriptionIndex > materialIndex
    ? relevant.slice(materialIndex + 1, descriptionIndex).map((block) => block.text).filter((text) => text !== "–").join(" ").replace(/^–\s*/, "") || null
    : null;
  const bodyBlocks = relevant.slice(descriptionIndex >= 0 ? descriptionIndex : materialIndex + 1);
  return {
    heading,
    dimensions,
    materials,
    price,
    body: markdownFromBlocks(bodyBlocks) || excerpt(record.text.split(/Enquire now/i)[0].replace(heading, ""), 1000),
  };
}

function journalBody(record) {
  const blocks = blocksFromHtml(record.referenceHtml);
  const headings = new Set((record.headings || []).map(cleanText));
  const filtered = blocks.filter((block, index) => !(index < 4 && headings.has(block.text)));
  return markdownFromBlocks(filtered) || cleanText(record.text).replace(record.headings?.[0] || "", "").trim();
}

function editorialBody(record) {
  const text = cleanText(record.text);
  const stopAt = text.indexOf("Explore Our Featured Artists");
  const source = stopAt >= 0 ? text.slice(0, stopAt).trim() : text;
  const questions = (record.headings || []).filter((heading) => heading.includes("?") && source.includes(heading));
  if (!questions.length) return source;
  const firstQuestion = source.indexOf(questions[0]);
  const introAndStudies = source.slice(0, firstQuestion).trim();
  const firstStudy = (record.links || []).find((link) => isMediaUrl(link.href))?.text;
  const intro = firstStudy ? introAndStudies.split(firstStudy)[0].trim() : introAndStudies;
  const sections = [intro];
  questions.forEach((question, index) => {
    const answerStart = source.indexOf(question) + question.length;
    const next = questions[index + 1];
    const answerEnd = next ? source.indexOf(next, answerStart) : source.length;
    sections.push(`## ${question}\n\n${source.slice(answerStart, answerEnd).trim()}`);
  });
  return sections.filter(Boolean).join("\n\n");
}

await Promise.all([
  fs.mkdir(path.join(contentRoot, "artists"), { recursive: true }),
  fs.mkdir(path.join(contentRoot, "artworks"), { recursive: true }),
  fs.mkdir(path.join(contentRoot, "journal"), { recursive: true }),
  fs.mkdir(path.join(contentRoot, "pages"), { recursive: true }),
  fs.mkdir(assetRoot, { recursive: true }),
]);

const artworkModels = [];
for (const [stableId, wpId] of Object.entries(artworkWpIds)) {
  const [artistSlug, slug] = stableId.split("/");
  const record = await readReference("content", wpId);
  const parts = artworkParts(record);
  const artist = artistSpecs.find((item) => item.slug === artistSlug);
  const media = [...new Set([largestImage(record.images?.[0]), ...mediaLinks(record)].filter(Boolean))];
  const mainImage = registerAsset(media[0], `artworks/${artistSlug}`, `${slug}-main`, `${parts.heading} artwork`);
  const gallery = media.map((remote, index) => ({
    src: registerAsset(remote, `artworks/${artistSlug}`, `${slug}-${index + 1}`, `${parts.heading} detail ${index + 1}`),
    alt: `${parts.heading} detail ${index + 1}`,
  }));
  const relatedIds = pathsFromContentLinks(record).map((pathname) => pathname.replace(/^\/gallery\//, "").replace(/\/$/, "")).filter((id) => id !== stableId && artworkWpIds[id]);
  const model = {
    id: stableId, artistSlug, slug, title: parts.heading.split(/\s+\|\s+/)[0] || record.title,
    artistName: artist.name, dimensions: parts.dimensions, materials: parts.materials, price: parts.price,
    mainImage, gallery, relatedIds, seoDescription: excerpt(parts.body), sourceWpId: wpId,
  };
  artworkModels.push(model);
  const folder = path.join(contentRoot, "artworks", artistSlug);
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(path.join(folder, `${slug}.md`), `---\n${yamlFrontmatter(model)}\n---\n\n${parts.body}\n`, "utf8");
}

const artworkById = new Map(artworkModels.map((item) => [item.id, item]));
const artistModels = [];
for (const [order, spec] of artistSpecs.entries()) {
  const record = await readReference("content", spec.id);
  const portraitRemote = largestImage(record.images?.[0]) || mediaUrlsFromHtml(record.referenceHtml)[0];
  const firstArtwork = artworkById.get(`${spec.slug}/${spec.artworks[0]}`);
  // Arran's displayed portrait remains visible in the browser cache/live render,
  // but its public upload URL now returns 404. Use his first source-backed work
  // until the owner can provide the original portrait file.
  const portrait = spec.slug === "arran-gregory" && firstArtwork
    ? firstArtwork.mainImage
    : registerAsset(portraitRemote, "artists", `${spec.slug}-portrait`, `${spec.name} portrait`);
  const studies = mediaLinks(record).map((remote, index) => ({
    image: registerAsset(remote, `artists/${spec.slug}`, `study-${index + 1}`, record.links.find((link) => link.href === remote)?.text || `${spec.name} material study ${index + 1}`),
    caption: record.links.find((link) => link.href === remote)?.text || `${spec.name} material study ${index + 1}`,
  }));
  const rawBio = cleanText(record.text).split(/\bArtworks\b/)[0].trim();
  const body = spec.profileVariant === "editorial" ? editorialBody(record) : rawBio;
  const relatedProfiles = pathsFromContentLinks(record).map((pathname) => pathname.split("/").filter(Boolean)[1]).filter((slug) => slug && slug !== spec.slug);
  const model = {
    id: spec.slug, slug: spec.slug, name: spec.name, discipline: spec.discipline,
    portrait, hoverImage: firstArtwork?.mainImage || studies[0]?.image || portrait,
    profileVariant: spec.profileVariant || "catalogue", listedInGallery: spec.listedInGallery,
    order, artworkIds: spec.artworks.map((slug) => `${spec.slug}/${slug}`), studies, relatedProfiles,
    seoDescription: excerpt(body), sourceWpId: spec.id,
  };
  artistModels.push(model);
  await fs.writeFile(path.join(contentRoot, "artists", `${spec.slug}.md`), `---\n${yamlFrontmatter(model)}\n---\n\n${body}\n`, "utf8");
}

const journalIndex = await readReference("content", 1947);
const journalCards = new Map();
for (const match of journalIndex.referenceHtml.matchAll(/<a class="elementor-cta" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
  const fragment = decodeURIComponent(match[1]);
  const settings = JSON.parse(Buffer.from(fragment.split("settings=")[1], "base64").toString());
  const html = match[2];
  journalCards.set(String(settings.id), {
    title: cleanText(html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1]),
    date: cleanText(html.match(/<div class="elementor-cta__description[^>]*>([\s\S]*?)<\/div>/)?.[1]),
    image: html.match(/background-image:\s*url\(([^)]+)\)/)?.[1],
  });
}
if (journalCards.size !== 16) throw new Error(`Expected 16 Journal cards, found ${journalCards.size}`);
const journalModels = [];
for (const [order, [popupId, slug, title, indexDateLabel]] of journalSpecs.entries()) {
  const card = journalCards.get(String(popupId));
  if (!card?.image || !card.title || !card.date) throw new Error(`Incomplete source Journal card ${popupId}`);
  const record = await readReference("popups", popupId);
  const body = journalBody(record);
  const coverImage = registerAsset(largestImage(record.images?.[0]), "journal", `${slug}-cover`, `${title}`);
  const articleTitle = record.headings?.[0] || title;
  const articleDateLabel = record.headings?.[1] || indexDateLabel;
  const model = {
    id: slug, slug, title: card.title, articleTitle, indexDateLabel: card.date, articleDateLabel, displayOrder: order,
    cardImage: registerAsset(card.image, "journal", `${slug}-card`, card.title),
    legacyPopupId: String(popupId), coverImage, showInIndex: true, seoDescription: excerpt(body),
    externalLinks: (record.links || []).filter((link) => link.text && link.href), source: `popup ${popupId}`,
  };
  journalModels.push(model);
  await fs.writeFile(path.join(contentRoot, "journal", `${slug}.md`), `---\n${yamlFrontmatter(model)}\n---\n\n${body}\n`, "utf8");
}

const archiveRecord = await readReference("content", 478);
const archiveText = cleanText(archiveRecord.text);
const podcastStart = archiveText.toLowerCase().indexOf("the circular economy podcast");
const podcastBody = podcastStart >= 0 ? archiveText.slice(podcastStart).split(/Excavation|Piling Begins/i)[0].trim() : "The Circular Economy Podcast story from the Golden Earth Studio archive.";
const podcastRemote = largestImage(archiveRecord.images?.find((image) => /podcast/i.test(image.src))) || largestImage(archiveRecord.images?.[0]);
const podcastModel = {
  id: "the-circular-economy-podcast", slug: "the-circular-economy-podcast", title: "The Circular Economy Podcast",
  articleTitle: "The Circular Economy Podcast", indexDateLabel: "", articleDateLabel: "", displayOrder: 16,
  legacyPopupId: null, coverImage: registerAsset(podcastRemote, "journal", "the-circular-economy-podcast-cover", "The Circular Economy Podcast"),
  showInIndex: false, seoDescription: excerpt(podcastBody), externalLinks: (archiveRecord.links || []).filter((link) => /podcast/i.test(`${link.text} ${link.href}`)), source: "page 478 archive",
};
journalModels.push(podcastModel);
await fs.writeFile(path.join(contentRoot, "journal", "the-circular-economy-podcast.md"), `---\n${yamlFrontmatter(podcastModel)}\n---\n\n${podcastBody}\n`, "utf8");

const collectiveRecord = await readReference("content", 424);
const collectiveMediaLinks = (collectiveRecord.links || []).filter((link) => isMediaUrl(link.href)).slice(0, 9);
const collectiveDimensions = [...collectiveRecord.referenceHtml.matchAll(/data-width="(\d+)" data-height="(\d+)"/g)];
if (collectiveDimensions.length !== 9) throw new Error("Collective source dimensions changed");
const collective = collectiveMediaLinks.map((link, index) => ({
  id: `collective-${index + 1}`, order: index, caption: cleanText(link.text), creator: cleanText(link.text).split(/\s+-\s+/)[0],
  image: registerAsset(link.href, "collective", `${index + 1}-${cleanText(link.text)}`, cleanText(link.text)), alt: cleanText(link.text), originalUrl: link.href,
  width: Number(collectiveDimensions[index][1]), height: Number(collectiveDimensions[index][2]),
}));

const pageSpecs = [
  ["our-mission", 600, "Our Mission"], ["terms", 1528, "Terms"], ["privacy-policy", 1823, "Privacy Policy"], ["journal2", 478, "Journal Archive"],
];
const { missionBody } = await prepareInterior({ readReference, registerAsset, cleanText, blocksFromHtml });
const pageModels = [];
for (const [slug, id, title] of pageSpecs) {
  const record = await readReference("content", id);
  const blocks = blocksFromHtml(record.referenceHtml).filter((block) => !/^(Contact Us|First Name|Last Name|Email|Subject|Message|Send)$/i.test(block.text));
  let body = markdownFromBlocks(blocks) || cleanText(record.text);
  body = body.replace(new RegExp(`^##\\s+${title.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\s*`, "i"), "").trim();
  if (slug === "our-mission") body = missionBody;
  const backgroundMedia = id === 600
    ? mediaUrlsFromHtml(record.referenceHtml).filter((url) => !/-\d+x\d+\.(?:avif|gif|jpe?g|png|webp)(?:\?.*)?$/i.test(url))
    : [];
  const media = [...new Set([...(record.images || []).map(largestImage), ...mediaLinks(record), ...backgroundMedia].filter(Boolean))];
  const images = media.map((remote, index) => registerAsset(remote, `pages/${slug}`, `${slug}-${index + 1}`, `${title} image ${index + 1}`));
  const model = { id: slug, slug, title, description: excerpt(body), images, sourceWpId: id };
  pageModels.push(model);
  await fs.writeFile(path.join(contentRoot, "pages", `${slug}.md`), `---\n${yamlFrontmatter(model)}\n---\n\n${body}\n`, "utf8");
}

await fs.writeFile(path.join(root, "src", "data", "gallery.generated.json"), JSON.stringify({
  artistOrder: artistSpecs.filter((item) => item.listedInGallery).map((item) => item.slug),
  artworkOrder: galleryArtworkOrder,
  displayOnlyWorks: [
    { id: "jacob-chan/sake-cups", artistSlug: "jacob-chan", title: "Sake Cups", source: "visible artist-profile entry; no detail URL" },
    { id: "jacob-chan/teapot", artistSlug: "jacob-chan", title: "Teapot", source: "visible artist-profile entry; no detail URL" },
  ],
}, null, 2) + "\n", "utf8");

await fs.writeFile(path.join(root, "src", "data", "collective.generated.json"), JSON.stringify(collective, null, 2) + "\n", "utf8");
await fs.mkdir(path.join(root, "worker"), { recursive: true });
await fs.writeFile(path.join(root, "worker", "catalogue.generated.ts"), `// Generated by scripts/prepare-content.mjs\nexport default ${JSON.stringify(Object.fromEntries(artworkModels.map((artwork) => [artwork.id, { title: artwork.title, artist: artwork.artistName, path: `/gallery/${artwork.id}/` }])), null, 2)} as const;\n`, "utf8");
await fs.writeFile(path.join(root, "src", "data", "route-ledger.json"), JSON.stringify({
  generated: ["/", "/gallery/", "/collective/", "/our-mission/", "/journal/", "/journal2/", "/terms/", "/privacy-policy/",
    ...artistSpecs.map((item) => `/gallery/${item.slug}/`), ...Object.keys(artworkWpIds).map((id) => `/gallery/${id}/`),
    ...journalModels.map((item) => `/journal/${item.slug}/`)],
  redirects: [
    { from: "/directory/", to: "/gallery/", status: 301 }, { from: "/newsletter/", to: "/journal/", status: 301 },
    { from: "/circular-ceramics-book/", to: "/journal/circular-ceramics/", status: 301 },
    { from: "/grand-designs-live/", to: "/journal/grand-designs/", status: 301 },
    { from: "/the-circular-economy-podcast/", to: "/journal/the-circular-economy-podcast/", status: 301 },
  ],
  notFound: ["/global-styles/", "/glas-allt-shielf/", "/the-art-relief-series/", "/bear/", "/hello-world/"],
}, null, 2) + "\n", "utf8");

console.log(`Prepared ${artistModels.length} artists, ${artworkModels.length} artworks, ${journalModels.length} journal records and ${collective.length} collective entries.`);
console.log(`Downloading ${assetQueue.length} unique assigned media files…`);
const assetResults = await runPool(assetQueue, downloadAsset);
await fs.writeFile(path.join(root, "src", "data", "asset-manifest.json"), JSON.stringify(assetResults, null, 2) + "\n", "utf8");
const retainedAssets = new Set(assetResults.map((item) => path.resolve(root, "public", item.localPath.replace(/^\//, ""))));
async function pruneUnassigned(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const candidate = path.resolve(directory, entry.name);
    if (!candidate.startsWith(path.resolve(assetRoot) + path.sep)) throw new Error(`Refusing to prune outside migrated assets: ${candidate}`);
    if (entry.isDirectory()) await pruneUnassigned(candidate);
    else if (!retainedAssets.has(candidate)) await fs.unlink(candidate);
  }
}
await pruneUnassigned(assetRoot);
console.log(`Media complete: ${assetResults.length} files, ${assetResults.reduce((sum, item) => sum + item.bytes, 0)} bytes.`);
