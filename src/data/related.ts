import type { CollectionEntry } from "astro:content";
import interior from "./interior.generated.json";

type Artwork = CollectionEntry<"artworks">["data"];
type Kind = "painting" | "wall" | "vessel" | "sculpture";

// Broad visual families used to suggest similar-looking works. Explicit IDs cover pieces whose
// titles do not describe their form.
const kindById: Record<string, Kind> = {
  "adam-weismann/clay-2025": "wall",
  "adam-weismann/terre-verte": "wall",
  "lucia-ocejo/tiled-screen": "wall",
  "jacob-chan/chess-set": "sculpture",
  "jihyun-kim/teoju": "sculpture",
  "jihyun-kim/small-teoju": "sculpture",
  "jihyun-kim/teoju-2": "sculpture",
  "jihyun-kim/mini-teoju-1": "sculpture",
  "jihyun-kim/mini-teoju-2": "sculpture",
  "rickie-cheuk/chopsticks": "vessel",
};

function kindOf(work: Artwork): Kind {
  if (kindById[work.id]) return kindById[work.id];
  if (work.tileMedium === "Painting" || /canvas/i.test(work.materials)) return "painting";
  if (/panel/i.test(work.title)) return "wall";
  if (/bowl|plate|cup|mug|jug|vase|jar|sake|lotus|bottle|cutlery/i.test(work.title)) return "vessel";
  return "sculpture";
}

// Neighbouring families fill the pool when a family is small.
const nearby: Record<Kind, Kind[]> = {
  painting: ["wall"],
  wall: ["painting"],
  vessel: ["sculpture"],
  sculpture: ["vessel"],
};

const onArtworksTab = new Set(interior.gallery.artworks.map((card) => card.href));

/** Similar works from the Artworks tab, other artists first; the page shows a random four from different artists. */
export function relatedPool(work: Artwork, all: Artwork[]): Artwork[] {
  const candidates = all.filter((other) => other.id !== work.id && onArtworksTab.has(`/gallery/${other.id}/`));
  const kind = kindOf(work);
  const rank = (other: Artwork) => (kindOf(other) === kind ? 0 : nearby[kind].includes(kindOf(other)) ? 2 : 4) + (other.artistSlug === work.artistSlug ? 1 : 0);
  // Neighbouring families only join when the work's own family has fewer than four other pieces.
  const sameKind = candidates.filter((other) => rank(other) < 2);
  return (sameKind.length >= 4 ? sameKind : candidates.filter((other) => rank(other) < 4))
    .sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id));
}
