import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { mediaSource } from "../data/media";

// Static index for the header search: every listed artist and their artworks.
export const GET: APIRoute = async () => {
  const artists = (await getCollection("artists")).filter((artist) => artist.data.listedInGallery);
  const listed = new Set(artists.map((artist) => artist.data.slug));
  const artworks = (await getCollection("artworks")).filter((artwork) => listed.has(artwork.data.artistSlug));

  const items = [
    ...artists
      .sort((a, b) => a.data.order - b.data.order)
      .map(({ data }) => ({
        type: "Artist",
        title: data.name,
        subtitle: data.discipline,
        href: `/gallery/${data.slug}/`,
        image: mediaSource(data.portrait) ?? null,
        keywords: data.discipline,
      })),
    ...artworks.map(({ data }) => ({
      type: "Artwork",
      title: data.year ? `${data.title}, ${data.year}` : data.title,
      subtitle: data.artistName,
      href: `/gallery/${data.id}/`,
      image: mediaSource(data.cardImage || data.mainImage) ?? null,
      keywords: [data.materials, data.tileMedium].filter(Boolean).join(" "),
    })),
  ];

  return new Response(JSON.stringify(items), { headers: { "content-type": "application/json; charset=utf-8" } });
};
