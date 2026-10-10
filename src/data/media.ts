export type MediaReference = string | { slot: string };
export interface MediaAsset {
  src: string | null;
  alt: string;
  width: number;
  height: number;
}

// Set src when the studio supplies the photograph. Null renders an actual blank.
export const mediaSlots: Record<string, MediaAsset> = {
  "james-galbraith-kirkpatrick-portrait": { src: null, alt: "Portrait of James Galbraith Kirkpatrick", width: 410, height: 525 },
  "edie-evans-portrait": { src: null, alt: "Portrait of Edie Evans", width: 334, height: 442 },
  "lucia-ocejo-portrait": { src: null, alt: "Portrait of Lucia Ocejo", width: 410, height: 498 },
  "eleanor-herbosch-portrait": { src: null, alt: "Portrait of Eleanor Herbosch", width: 410, height: 555 },
  "james-galbraith-kirkpatrick-square-plate": { src: null, alt: "Square Plate by James Galbraith Kirkpatrick", width: 350, height: 600 },
  "james-galbraith-kirkpatrick-cup-i": { src: null, alt: "Cup I by James Galbraith Kirkpatrick", width: 350, height: 600 },
  "james-galbraith-kirkpatrick-bowl": { src: null, alt: "Bowl by James Galbraith Kirkpatrick", width: 350, height: 600 },
  "james-galbraith-kirkpatrick-cup-ii": { src: null, alt: "Cup II by James Galbraith Kirkpatrick", width: 350, height: 600 },
  "edie-evans-earth-memory": { src: null, alt: "Earth Memory by Edie Evans", width: 550, height: 370 },
  "edie-evans-bedrock": { src: null, alt: "Bedrock by Edie Evans", width: 550, height: 370 },
  "edie-evans-fragmentation-1": { src: null, alt: "Fragmentation 1 by Edie Evans", width: 550, height: 370 },
  "lucia-ocejo-round-bud-vase": { src: null, alt: "Round Bud Vase by Lucia Ocejo", width: 350, height: 600 },
  "lucia-ocejo-tea-bowl": { src: null, alt: "Tea Bowl by Lucia Ocejo", width: 350, height: 600 },
  "lucia-ocejo-mug": { src: null, alt: "Mug by Lucia Ocejo", width: 350, height: 600 },
  "lucia-ocejo-jug": { src: null, alt: "Jug by Lucia Ocejo", width: 350, height: 600 },
  "lucia-ocejo-tiled-screen": { src: null, alt: "Tiled Screen by Lucia Ocejo", width: 350, height: 600 },
  "eleanor-herbosch-painting-hover": { src: null, alt: "Painting detail by Eleanor Herbosch", width: 330, height: 395 },
};

export function resolveMedia(reference: MediaReference, fallbackAlt = ""): MediaAsset & { slot?: string } {
  if (typeof reference === "string") return { src: reference, alt: fallbackAlt, width: 900, height: 1200 };
  if (!Object.hasOwn(mediaSlots, reference.slot)) throw new Error(`Unknown photo slot: ${reference.slot}`);
  return { ...mediaSlots[reference.slot], slot: reference.slot };
}

export function mediaSource(reference: MediaReference): string | undefined {
  return resolveMedia(reference).src || undefined;
}
