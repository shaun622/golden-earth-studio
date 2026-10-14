# Editing Golden Earth Studio through Git

Artist, artwork and Journal detail content lives in Markdown under `src/content`. Gallery index cards and Collective/Mission presentation copy live in `src/data/interior.generated.json`; these retain WordPress labels and image choices that differ from the detail pages. Edit a branch, run the checks, review the Cloudflare preview, then merge.

## Add an artist

1. Add a Markdown file at `src/content/artists/<slug>.md` using an existing file as the field example.
2. Store portrait/hover images below `public/assets/migrated/artists/` and use root-relative paths such as `/assets/migrated/artists/name-portrait.webp`.
3. Set `listedInGallery: true`, add the slug to `artistOrder` in `src/data/gallery.generated.json`, and add an entry to `gallery.artists` in `src/data/interior.generated.json` with its detail `href`, exact `label`, `image`, `hoverImage` and `objectPosition`.
4. Add artwork IDs as `artist-slug/artwork-slug`; every referenced ID must have a matching artwork file.
5. Add the profile URL to `generated` in `src/data/route-ledger.json`, which also supplies the sitemap. Use `sourceWpId: null` for a new artist; do not invent a WordPress ID.

## Add an artwork

1. Add `src/content/artworks/<artist-slug>/<artwork-slug>.md`.
2. Keep `id`, `artistSlug`, and `slug` aligned with the folder and URL. Use optional `price: null` when none is stated.
3. Put the main and detail images in `public/assets/migrated/artworks/<artist-slug>/`, then list them in `gallery` in display order.
4. Add the stable ID to the artist's `artworkIds`. For a Gallery Artwork tab card, also add it to `artworkOrder` and `gallery.artworks` in `src/data/interior.generated.json`, preserving the desired index label and image pair separately from the detail page.
5. Add the detail URL to `src/data/route-ledger.json` and the matching ID/title/artist/path entry to `worker/catalogue.generated.ts`. The Worker rejects enquiries for unknown IDs.

## 2026 Figma profiles and pending photographs

James Galbraith Kirkpatrick, Edie Evans, Lucia Ocejo and Eleanor Herbosch use `profileVariant: "figma-2026"`. The eleven active new products use `detailVariant: "figma-2026"`, `year: 2026` and a separate `tileMedium` for the profile hover. James's straight-sided Cup I was removed on 15 October 2026; its former URL redirects to his profile. Keep the base title free of the year. Their Gallery order is explicit; their works are reached from artist profiles and are not appended to the original 21-item Artwork tab.

The 20 active photo entries live in `src/data/media.ts`: all are filled by supplied photos (16 retained from Drive and four attachments received on 14 October 2026). The retired Cup I photo is no longer public. Content refers to a photo as `{ "slot": "lucia-ocejo-mug" }`, rather than an empty image path. A null source renders a blank with “Photo pending”; do not substitute another photograph. The source mapping and resolved missing images are recorded in `docs/reference/figma-2026/PHOTO-MATCH-REPORT.md`.

An optional artwork `cardImage` selects a different profile crop from `mainImage`. Edie's three portrait crops remain on her profile cards; the complete wide photos fill her product pages and image viewers. Tiled Screen uses its portrait crop on the profile and the complete three-panel image on its product page. Update the corresponding slot independently; do not stretch a card crop to imitate a missing wide photo.

To supply a photo:

1. Add an optimised image under `public/assets/artists/` or `public/assets/artworks/`, with a descriptive filename.
2. Set that slot's `src` to its root-relative path and update accurate alt text and intrinsic width/height in the same registry entry.
3. Review all repeated uses: artist portraits also appear in Gallery, and Cup II, Bedrock and Round Bud Vase also appear in the artist hover cards. Product images become lightbox links only once a real source exists.
4. Run the build and audits. `audit:figma` checks that supplied paths exist, supplied photos render with viewer/social references on product pages, profile crops render, and only remaining null entries show blanks. Keep the content, links, forms and reference-copy checks.

Eleanor's old biography/studies are archived at `docs/reference/figma-2026/eleanor-before.md`; old media assets remain available. Her profile displays the supplied painting below the biography using `profileArtworkImage`, added following the owner's 14 October clarification. This optional media reference is separate from catalogue product records and uses the existing image viewer. The Gallery hover reuses the same media slot. The archived studies are not displayed.

## Add a Journal story

1. Add `src/content/journal/<slug>.md` with the card title/date, article title/date, `cardImage` (landscape index image), `coverImage` (article image), order, and Markdown body. These images may be different. Keep card dates in the source `DD | MM | YYYY` format.
2. Set `showInIndex: true` for a current Journal card. Leave `legacyPopupId: null` for new stories.
3. Use ordinary Markdown links for external sources and keep long interviews complete in the body.

## Validate a change

```powershell
npm run build
npm run test:worker
npm run audit
npm run audit:journal
npm run audit:interior
npm run audit:figma
npx wrangler deploy --dry-run
```

The migration importer in `scripts/prepare-content.mjs` is historical tooling. Routine edits should change the curated content and local assets directly; do not rerun the importer unless intentionally refreshing the WordPress snapshot.
