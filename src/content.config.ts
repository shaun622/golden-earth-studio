import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const mediaReference = z.union([z.string(), z.object({ slot: z.string() })]);
const mediaItem = z.object({ src: mediaReference, alt: z.string() });

const artists = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artists" }),
  schema: z.object({
    id: z.string(), slug: z.string(), name: z.string(), discipline: z.string(), portrait: mediaReference, hoverImage: mediaReference,
    profileVariant: z.enum(["catalogue", "editorial", "figma-2026"]), listedInGallery: z.boolean(), order: z.number(),
    artworkIds: z.array(z.string()), studies: z.array(z.object({ image: z.string(), caption: z.string() })),
    relatedProfiles: z.array(z.string()), seoDescription: z.string(), sourceWpId: z.number().nullable(),
  }),
});

const artworks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artworks", generateId: ({ data }) => String(data.id) }),
  schema: z.object({
    id: z.string(), artistSlug: z.string(), slug: z.string(), title: z.string(), artistName: z.string(),
    dimensions: z.string(), materials: z.string(), price: z.string().nullable(), mainImage: mediaReference, gallery: z.array(mediaItem),
    detailVariant: z.enum(["legacy", "figma-2026"]).default("legacy"), year: z.number().int().optional(), tileMedium: z.string().optional(),
    relatedIds: z.array(z.string()), seoDescription: z.string(), sourceWpId: z.number().nullable(),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/journal" }),
  schema: z.object({
    id: z.string(), slug: z.string(), title: z.string(), articleTitle: z.string(), indexDateLabel: z.string(), articleDateLabel: z.string(),
    displayOrder: z.number(), legacyPopupId: z.string().nullable(), coverImage: z.string().nullable(), showInIndex: z.boolean(),
    cardImage: z.string().optional(),
    seoDescription: z.string(), externalLinks: z.array(z.object({ text: z.string(), href: z.string() })), source: z.string(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({ id: z.string(), slug: z.string(), title: z.string(), description: z.string(), images: z.array(z.string()), sourceWpId: z.number() }),
});

export const collections = { artists, artworks, journal, pages };
