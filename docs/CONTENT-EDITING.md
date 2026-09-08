# Editing Golden Earth Studio through Git

All public catalogue and Journal content lives in Markdown under `src/content`. Edit a branch, run the checks, review the Cloudflare preview, then merge.

## Add an artist

1. Add a Markdown file at `src/content/artists/<slug>.md` using an existing file as the field example.
2. Store portrait/hover images below `public/assets/migrated/artists/` and use root-relative paths such as `/assets/migrated/artists/name-portrait.webp`.
3. Set `listedInGallery: true` and add the slug to `artistOrder` in `src/data/gallery.generated.json` when the artist belongs in the public gallery.
4. Add artwork IDs as `artist-slug/artwork-slug`; every referenced ID must have a matching artwork file.

## Add an artwork

1. Add `src/content/artworks/<artist-slug>/<artwork-slug>.md`.
2. Keep `id`, `artistSlug`, and `slug` aligned with the folder and URL. Use optional `price: null` when none is stated.
3. Put the main and detail images in `public/assets/migrated/artworks/<artist-slug>/`, then list them in `gallery` in display order.
4. Add the stable ID to the artist's `artworkIds`, and to `artworkOrder` only if it should appear in the Gallery Artwork tab.

## Add a Journal story

1. Add `src/content/journal/<slug>.md` with the card title/date, article title/date, cover image, order, and Markdown body.
2. Set `showInIndex: true` for a current Journal card. Leave `legacyPopupId: null` for new stories.
3. Use ordinary Markdown links for external sources and keep long interviews complete in the body.

## Validate a change

```powershell
npm run build
npm run test:worker
npm run audit
npx wrangler deploy --dry-run
```

The migration importer in `scripts/prepare-content.mjs` is historical tooling. Routine edits should change the curated content and local assets directly; do not rerun the importer unless intentionally refreshing the WordPress snapshot.
