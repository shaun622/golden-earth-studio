export type MediaReference = string | { slot: string };
export interface MediaAsset {
  src: string | null;
  alt: string;
  width: number;
  height: number;
}

// Supplied photos use their real pixel dimensions. Null marks a missing crop.
export const mediaSlots: Record<string, MediaAsset> = {
  "james-galbraith-kirkpatrick-portrait": { src: "/assets/artists/james-galbraith-kirkpatrick-portrait.webp", alt: "James Galbraith Kirkpatrick working at a pottery wheel", width: 862, height: 1034 },
  "edie-evans-portrait": { src: "/assets/artists/edie-evans-portrait.webp", alt: "Edie Evans working with clay in her studio", width: 864, height: 1026 },
  "lucia-ocejo-portrait": { src: "/assets/artists/lucia-ocejo-portrait.webp", alt: "Lucia Ocejo wearing an apron in a doorway", width: 866, height: 1050 },
  "eleanor-herbosch-portrait": { src: "/assets/artists/eleanor-herbosch-portrait.webp", alt: "Portrait of Eleanor Herbosch in a light shirt", width: 860, height: 1032 },
  "james-galbraith-kirkpatrick-square-plate": { src: "/assets/artworks/james-galbraith-kirkpatrick/square-plate.webp", alt: "Stack of Square Plates by James Galbraith Kirkpatrick", width: 682, height: 1180 },
  "james-galbraith-kirkpatrick-bowl": { src: "/assets/artworks/james-galbraith-kirkpatrick/bowl.webp", alt: "Stack of Bowls by James Galbraith Kirkpatrick", width: 682, height: 1178 },
  "james-galbraith-kirkpatrick-cup-i": { src: "/assets/artworks/james-galbraith-kirkpatrick/cup-i.webp", alt: "Cup I by James Galbraith Kirkpatrick, a short cup with a dark rim, patterned glaze and small foot", width: 684, height: 1178 },
  // Full product photos and the original portrait card crops have separate slots.
  "edie-evans-earth-memory": { src: "/assets/artworks/edie-evans/earth-memory.webp", alt: "A rough rock beside a burnished clay sphere in Earth Memory by Edie Evans", width: 1418, height: 936 },
  "edie-evans-bedrock": { src: "/assets/artworks/edie-evans/bedrock.webp", alt: "Bedrock by Edie Evans, a burnished clay bowl with an uneven rim", width: 1166, height: 770 },
  "edie-evans-fragmentation-1": { src: "/assets/artworks/edie-evans/fragmentation-1.webp", alt: "Fragmentation 1 by Edie Evans, a reddish clay sphere with a cracked surface", width: 1482, height: 934 },
  "edie-evans-earth-memory-card": { src: "/assets/artworks/edie-evans/earth-memory-card.webp", alt: "Portrait crop of the rock and sphere in Earth Memory by Edie Evans", width: 682, height: 1174 },
  "edie-evans-bedrock-card": { src: "/assets/artworks/edie-evans/bedrock-card.webp", alt: "Close-up of Bedrock by Edie Evans", width: 682, height: 1170 },
  "edie-evans-fragmentation-1-card": { src: "/assets/artworks/edie-evans/fragmentation-1-card.webp", alt: "Close-up of Fragmentation 1 by Edie Evans", width: 680, height: 1176 },
  "lucia-ocejo-round-bud-vase": { src: "/assets/artworks/lucia-ocejo/round-bud-vase.webp", alt: "Round Bud Vase by Lucia Ocejo with an incised wave pattern", width: 664, height: 1194 },
  "lucia-ocejo-tea-bowl": { src: "/assets/artworks/lucia-ocejo/tea-bowl.webp", alt: "Pale blue Tea Bowl by Lucia Ocejo", width: 666, height: 1188 },
  "lucia-ocejo-mug": { src: "/assets/artworks/lucia-ocejo/mug.webp", alt: "A hand holding the handle of Lucia Ocejo's Mug", width: 664, height: 1184 },
  "lucia-ocejo-jug": { src: "/assets/artworks/lucia-ocejo/jug.webp", alt: "Jug by Lucia Ocejo with a pale glazed upper half", width: 682, height: 1192 },
  "lucia-ocejo-tiled-screen": { src: "/assets/artworks/lucia-ocejo/tiled-screen.webp", alt: "Three-panel Tiled Screen by Lucia Ocejo", width: 1076, height: 1050 },
  "lucia-ocejo-tiled-screen-card": { src: "/assets/artworks/lucia-ocejo/tiled-screen-card.webp", alt: "Portrait crop of Lucia Ocejo's Tiled Screen", width: 666, height: 1180 },
  "eleanor-herbosch-unearthing-series-1": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-1.webp", alt: "Unearthing Series #1 by Eleanor Herbosch, a tall canvas of pale earth tones with raised grey clay marks and drips, hung on a plaster wall", width: 1072, height: 1652 },
  "eleanor-herbosch-unearthing-series-1-detail": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-1-detail.webp", alt: "Close-up of Unearthing Series #1 by Eleanor Herbosch showing ridges of raised London Clay and grey drips across the canvas", width: 1092, height: 1648 },
  "eleanor-herbosch-unearthing-series-1-installed": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-1-installed.webp", alt: "Unearthing Series #1 by Eleanor Herbosch hanging on a curved plaster wall above a stairwell with a dark handrail", width: 1600, height: 1066 },
  "eleanor-herbosch-unearthing-series-1-card": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-1-card.webp", alt: "Unearthing Series #1 by Eleanor Herbosch, a tall canvas of pale earth tones with raised grey clay marks and drips, hung on a plaster wall", width: 778, height: 1319 },
  "eleanor-herbosch-unearthing-series-2": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-2.webp", alt: "Unearthing Series #2 by Eleanor Herbosch, a wide canvas of pale earth tones crossed by two ridges of raised grey clay with dark splashes", width: 1600, height: 790 },
  "eleanor-herbosch-unearthing-series-2-card": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-2-card.webp", alt: "Close-up of Unearthing Series #2 by Eleanor Herbosch showing two ridges of raised London Clay converging across the canvas", width: 740, height: 1254 },
  "eleanor-herbosch-unearthing-series-2-corner": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-2-corner.webp", alt: "Lower right corner of Unearthing Series #2 by Eleanor Herbosch showing raised clay ridges, grey splashes and the canvas edge against a plaster wall", width: 1600, height: 1067 },
  "eleanor-herbosch-unearthing-series-2-detail": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-2-detail.webp", alt: "Close-up of Unearthing Series #2 by Eleanor Herbosch showing two ridges of raised London Clay converging across the canvas", width: 1600, height: 1066 },
  "eleanor-herbosch-unearthing-series-3": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-3.webp", alt: "Unearthing Series #3 by Eleanor Herbosch, a wide canvas of warm earth tones with two sweeping arcs of raised green-grey clay and dark splashes", width: 1600, height: 790 },
  "eleanor-herbosch-unearthing-series-3-card": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-3-card.webp", alt: "Unearthing Series #3 by Eleanor Herbosch, a wide canvas of warm earth tones with two sweeping arcs of raised green-grey clay and dark splashes", width: 582, height: 987 },
  "eleanor-herbosch-unearthing-series-3-room": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-3-room.webp", alt: "Unearthing Series #3 by Eleanor Herbosch hanging on a plaster wall above a cream sofa, black side table and rattan armchair", width: 1038, height: 1650 },
  "eleanor-herbosch-unearthing-series-3-detail": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-3-detail.webp", alt: "Close-up of Unearthing Series #3 by Eleanor Herbosch showing cracked ridges of raised London Clay and dark splashes", width: 1600, height: 1066 },
  "eleanor-herbosch-unearthing-series-3-angle": { src: "/assets/artworks/eleanor-herbosch/unearthing-series-3-angle.webp", alt: "Unearthing Series #3 by Eleanor Herbosch seen at an angle on a plaster wall, showing the depth of the canvas edge", width: 1600, height: 1466 },
  "louis-vincent-bowl-iii-card": { src: "/assets/artworks/louis-vincent/bowl-iii-card.webp", alt: "Bowl III by Louis Vincent, a deep footed bowl with a mottled brown and stone-coloured surface, seen from the side", width: 630, height: 1068 },
  "louis-vincent-bowl-iii": { src: "/assets/artworks/louis-vincent/bowl-iii-side-crop.webp", alt: "Bowl III by Louis Vincent, a deep footed bowl with a mottled brown and stone-coloured surface, seen from the side", width: 674, height: 506 },
  "louis-vincent-bowl-iii-top": { src: "/assets/artworks/louis-vincent/bowl-iii-top.webp", alt: "Bowl III by Louis Vincent seen from above, showing its dark mottled interior", width: 1080, height: 1350 },
  "louis-vincent-bowl-ii-card": { src: "/assets/artworks/louis-vincent/bowl-ii-card.webp", alt: "Bowl II by Louis Vincent, a wide shallow footed bowl with a mottled brown and stone-coloured surface, seen from the side", width: 631, height: 1069 },
  "louis-vincent-bowl-ii": { src: "/assets/artworks/louis-vincent/bowl-ii-side-crop.webp", alt: "Bowl II by Louis Vincent, a wide shallow footed bowl with a mottled brown and stone-coloured surface, seen from the side", width: 675, height: 506 },
  "louis-vincent-bowl-ii-top": { src: "/assets/artworks/louis-vincent/bowl-ii-top.webp", alt: "Bowl II by Louis Vincent seen from above, showing its speckled interior", width: 1080, height: 1350 },
  "louis-vincent-bowl-ii-detail": { src: "/assets/artworks/louis-vincent/bowl-ii-detail.webp", alt: "Close-up of the rim of Bowl II by Louis Vincent showing the speckled clay surface", width: 1080, height: 1350 },
  "louis-vincent-plate-ii": { src: "/assets/artworks/louis-vincent/plate-ii-top.webp", alt: "Plate II by Louis Vincent seen from above, a dark mottled plate with a wide rim and sunken centre", width: 1080, height: 1349 },
  "louis-vincent-plate-ii-side": { src: "/assets/artworks/louis-vincent/plate-ii-side-crop.webp", alt: "Plate II by Louis Vincent seen from the side, showing its low profile and recessed centre", width: 904, height: 678 },
  "louis-vincent-plate-ii-detail": { src: "/assets/artworks/louis-vincent/plate-ii-detail.webp", alt: "Close-up of the sunken centre of Plate II by Louis Vincent", width: 1080, height: 1351 },
  "louis-vincent-plate-iii-card": { src: "/assets/artworks/louis-vincent/plate-iii-card.webp", alt: "Plate III by Louis Vincent seen from above, a flat speckled disc with a faint inner ring", width: 656, height: 1112 },
  "louis-vincent-plate-iii": { src: "/assets/artworks/louis-vincent/plate-iii-top.webp", alt: "Plate III by Louis Vincent seen from above, a flat speckled disc with a faint inner ring", width: 1080, height: 1350 },
  "louis-vincent-plate-iii-side": { src: "/assets/artworks/louis-vincent/plate-iii-side-crop.webp", alt: "Plate III by Louis Vincent seen from the side, showing its thin flat profile", width: 686, height: 515 },
  "louis-vincent-plate-iii-detail": { src: "/assets/artworks/louis-vincent/plate-iii-detail.webp", alt: "Close-up of the speckled clay surface of Plate III by Louis Vincent", width: 901, height: 1125 },
  "louis-vincent-plate-iv-card": { src: "/assets/artworks/louis-vincent/plate-iv-card.webp", alt: "Plate IV by Louis Vincent seen from above, a flat disc with a light mottled clay surface", width: 631, height: 1069 },
  "louis-vincent-plate-iv": { src: "/assets/artworks/louis-vincent/plate-iv-top.webp", alt: "Plate IV by Louis Vincent seen from above, a flat disc with a light mottled clay surface", width: 1080, height: 1351 },
  "louis-vincent-plate-iv-side": { src: "/assets/artworks/louis-vincent/plate-iv-side-crop.webp", alt: "Plate IV by Louis Vincent seen from the side, showing its thin flat profile", width: 703, height: 527 },
  "louis-vincent-plate-iv-detail": { src: "/assets/artworks/louis-vincent/plate-iv-detail.webp", alt: "Close-up of the mottled clay surface of Plate IV by Louis Vincent", width: 899, height: 1125 },
  "louis-vincent-plate-card": { src: "/assets/artworks/louis-vincent/plate-card.webp", alt: "Plate by Louis Vincent", width: 896, height: 1519 },
  "louis-vincent-conical-bowl-card": { src: "/assets/artworks/louis-vincent/conical-bowl-card.webp", alt: "Conical Bowl by Louis Vincent", width: 788, height: 1336 },
  "louis-vincent-bowl-card": { src: "/assets/artworks/louis-vincent/bowl-card.webp", alt: "Bowl by Louis Vincent", width: 832, height: 1410 },
  "eleanor-herbosch-painting-hover": { src: "/assets/artworks/eleanor-herbosch/painting-hover.webp", alt: "Painting detail by Eleanor Herbosch with dark branching marks and raised textures on a grey surface", width: 758, height: 954 },
};

export function resolveMedia(reference: MediaReference, fallbackAlt = ""): MediaAsset & { slot?: string } {
  if (typeof reference === "string") return { src: reference, alt: fallbackAlt, width: 900, height: 1200 };
  if (!Object.hasOwn(mediaSlots, reference.slot)) throw new Error(`Unknown photo slot: ${reference.slot}`);
  return { ...mediaSlots[reference.slot], slot: reference.slot };
}

export function mediaSource(reference: MediaReference): string | undefined {
  return resolveMedia(reference).src || undefined;
}
