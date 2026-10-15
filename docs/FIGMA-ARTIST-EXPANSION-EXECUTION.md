# Figma artist expansion execution ledger

Authoritative plan: `docs/FIGMA-ARTIST-EXPANSION-PLAN.md`, prepared 2026-10-10.
User amendment: build the available work now while the user requests Figma edit access/photos. All missing media remains blank.
Branch: `codex/figma-artist-expansion`; base `7835d3b12f57c05a80ffdea5815c4d8f75cf28d4`.
Starting tree: only the untracked plan from the previous turn. No existing user source edits.

| Task | Dependencies | Acceptance | Status |
| --- | --- | --- | --- |
| T01 media/content contracts | — | AC05, AC11 | verified |
| T02 scoped layouts | T01 | AC06, AC09, AC10 | verified |
| T03 enquiry forms | T02 | AC07, AC10 | verified |
| T04 James | T01–03 | AC02, AC03, AC05, AC06 | verified |
| T05 Edie | T01–03 | AC02, AC03, AC05, AC06 | verified |
| T06 Lucia | T01–03 | AC02, AC03, AC05, AC06 | verified |
| T07 Eleanor | T01–02 | AC04, AC05, AC06, AC08 | verified |
| T08 Gallery | T04–07 | AC01, AC05, AC06, AC09 | verified |
| T09 routes/audits/docs | T03–08 | AC01–05, AC07, AC08, AC10, AC11 | verified |
| T10 build/Edge QA | T01–09 | all | verified; limitations below |

Defaults: individual product measurements take precedence; Tiled Screen gets the matching template with no price. These remain documented editorial assumptions. No extra photo retrieval is needed to build this phase.

Checks: prior planning baseline `npm run check` passed under host execution. Final implementation results are recorded below.
First implementation build: type-check passed (60 files); build exposed a duplicate `bowl` collection entry and omitted James's Bowl route. Routine correction: the artwork glob loader now uses its existing full `data.id`, rather than Astro's default short `data.slug`, preserving both artist/product URLs. No public route contract changes.
Worker tests: 10/10 pass, including all twelve new allowlist entries, name-free commissions, continued name requirements elsewhere and HTML escaping.
Implemented: media schema/registry/component; scoped Figma components/styles and route dispatch; Figma forms and commission validation; 3 artist files + 12 product files; Eleanor refreshed with original archived under `docs/reference/figma-2026/`; 12-card Gallery and order metadata; 72-route ledger and 34-item Worker catalogue.
Build diagnostics were resolved; focused audits, editing documentation and production-preview Edge review are complete.
Visual adaptation: the Gallery's migrated Jihyun image showed a standing portrait, while Figma uses her seated striped-shirt portrait. That exact photo already exists at `/assets/images/jihyun-kim.webp`; the Gallery now reuses it. Her hover and all other retained assets remain as before. The source-parity audit has this explicit single-photo override.
Desktop refinements from the reference: added the small Artworks label above the profile rule, increased biography spacing, aligned portrait product images beside the title, matched the larger enquiry gap and moved commission copy/form to the observed columns. These refine the plan's approximate measurements without changing scope.

## Final verification — 10 October 2026

- `npm run build`: 61 checked files, zero errors/warnings/hints; 73 generated pages. Host execution was used because of the sandbox's Astro sync limitation.
- `npm run audit`: 72 ledger routes, five redirects, five exclusions, 73 HTML files and all 146 migrated assets.
- `npm run audit:journal`, `audit:interior`, `audit:figma`: pass. Exact biographies/product facts, 12+21 Gallery cards, 17 null media slots, related links, contact metadata and sitemap checked. Existing Collective/Mission/Journal parity assertions retained.
- `npm run test:worker`: 10/10 pass, including the 12 new catalogue IDs, commission name exception, unchanged security/error behaviour and escaped email output.
- `npm run check:runtime -- http://127.0.0.1:8791/`: pass for all 72 routes, redirects, exclusions and missing API route. Host execution was required to reach the host preview.
- Edge extension: 17 affected routes at 360, 390, 768, 820, 1024, 1280 and 1440px; 119 final checks, no overflow or out-of-viewport headings/forms/media/cards. Commission copy and form are aligned in columns on desktop and stacked without overlap on phones.
- Visual desktop comparisons covered Gallery, all four profiles, James/Lucia portrait products, Edie landscape products and inferred Tiled Screen. Phone checks covered long names, fifth Lucia work, two-line Earth Memory dimensions, forms, blank slots and Eleanor's empty work section. Full-page review caught the empty `bespoke` anchor occupying a grid cell; absolute positioning fixes the commission columns.
- Keyboard: Gallery Artwork/Artists selection and hash destinations; profile caption reveals with focus (opacity 1) and visible outline; mobile menu opens and Escape restores button focus.
- JavaScript disabled using a temporary local CSP preview: both Gallery panels/links visible, profile biography and product facts intact, email links available, blanks have no image-viewer controls. The temporary server/script was removed after QA.
- Browser form validation identifies required fields. A synthetic submission to the disabled local Worker shows the delivery-disabled message, email fallback and enabled retry button; no live email was sent.
- Photo replacement demonstrated by temporarily setting Cup I to a known local asset and rebuilding: Gallery hover, profile card, product image and social metadata changed together. The existing viewer opened, and Escape restored focus. The entry was restored to null, the final site rebuilt, and `audit:figma` confirmed all 17 blanks.
- Regression smoke review of Home, Collective, Mission, Journal, Louis profile and Jacob Sake Bottle at 390/1280px: no horizontal overflow or failed sourced images. Uninitialised image-viewer images inside closed dialogs are intentionally excluded.

Evidence: `docs/reference/figma-2026/qa/` contains final responsive/regression JSON and representative desktop/mobile screenshots. Editing instructions and the outstanding photo/editorial checklist are in `docs/CONTENT-EDITING.md` and `docs/CONTENT-QUESTIONS.md`.

Limits: Edge viewport checks do not substitute for physical iOS/Android devices. Reduced-motion and coarse-pointer fallbacks were reviewed in source; this extension exposes viewport controls but no OS preference emulation. Live Resend delivery is still disabled and was not tested. Photos, the repeated width label on Round Bud Vase and the inferred Tiled Screen layout remain the documented editorial follow-up items.

All T01–T10 work is complete for review. No Cloudflare account/domain/secret changes or deployment were performed.

## Photo import amendment — 10 October 2026

User instruction: use the files in Updated Gallery Images and identify missing or wrong photos against Figma. Starting tree was clean at `36ee325`; work continues on the same review branch.

Reviewed all 33 supplied PNGs through the connected Drive workflow and visually matched them with the Figma references. Imported 17 clean photos, encoded at their original dimensions to WebP (1,303,282 bytes total). Excluded 16 screenshots containing baked captions, darkening or portrait blends; the site supplies those effects itself. No different artist/artwork was found among the selected images.

The media registry now contains 21 entries: 17 supplied photos and four null sources. Optional `cardImage` separates Edie's available portrait crops from her missing wide product images, and separates Tiled Screen's portrait card crop from the supplied complete screen. Profile frames retain the intended Figma aspect ratios. The full screen keeps its natural aspect ratio on the detail page. The updated Figma audit checks real paths, card crops, product viewers, social metadata and remaining labelled blanks.

Still required: full wide Earth Memory, Bedrock and Fragmentation 1 images for Edie; a clean painting image for Eleanor's Gallery hover. Eleanor's portrait is installed from the shared artists folder. Source IDs, file hashes, output dimensions and decisions are recorded in `docs/reference/figma-2026/photo-import.json` and `PHOTO-MATCH-REPORT.md`.

Verification: `npm run build` passes with 61 checked files, zero diagnostics and 73 generated pages. Site/Journal/interior/Figma audits pass; the focused audit confirms 17 supplied photos and four actual blanks. Worker tests remain 10/10. Runtime audit passes for 72 routes, five redirects and five expected exclusions. Edge checks cover the 17 affected routes at 390/768/1280px (51 checks without layout failures), visible photo matching, Gallery keyboard crossfade, phone captions, actual image viewer opening, Escape/focus restoration and the complete Tiled Screen. Evidence is in `docs/reference/figma-2026/photo-qa/`.

No push, merge, deployment or contact-service configuration was performed in this amendment. Live delivery remains outside photo verification.

## Final photo handover — 14 October 2026

The owner supplied four attachments and authorized upload/deployment. Branch: `codex/complete-figma-photos`, based on deployed `main` commit `1d4cefe`. The complete Earth Memory, Bedrock and Fragmentation 1 photos fill Edie's product images and viewers; the clean Eleanor painting fills her Gallery hover. Existing portrait/card crops and all product facts are retained.

The four images were encoded to WebP at quality 92 with their original dimensions: 4,902,581 source bytes become 460,968 bytes. Provenance is recorded in `reference/figma-2026/photo-import-2026-10-14.json`. All 21 media slots are now filled; there are no remaining Figma photo blanks.

Validation: `npm run build` passes (61 checked files, zero diagnostics, 73 generated pages); site and Figma audits pass with all 72 routes and 21 supplied photos. Eight Edge checks cover the three changed product pages and Eleanor's Gallery card at 390px and 1280px. All images load, fit their columns and have no horizontal overflow or pending labels. Earth Memory's full-image viewer opens and closes correctly; keyboard focus reveals Eleanor's painting. Viewport overrides were reset after review.

## Eleanor profile artwork clarification — 14 October 2026

The owner clarified that Eleanor's supplied painting should also appear on her profile. The optional typed `profileArtworkImage` reference renders it below the biography under Artworks, reusing the existing asset and full-image viewer. The empty-profile spacing is replaced by the actual image section; catalogue records and artwork metadata remain unchanged.

Build, site audit and Figma audit pass. Edge checks at 390px, 768px and 1280px confirm the portrait remains present, the complete painting retains its aspect ratio and fits without overflow, and the obsolete empty spacing is absent. The viewer opens and Escape closes it with focus restored to the image link. Viewport overrides were reset.

## James Cup I withdrawal — 15 October 2026

Historical entry: the owner's later photo clarification below supersedes this cup identification and withdrawal.

The owner authorized removing James's straight-sided cup and deploying the change. Visual comparison identifies it as Cup I; Cup II is the retained tapered cup. The Cup I content record, public photo, media slot, profile card, generated route and Worker enquiry entry are removed. Both James Gallery hover references now use Cup II. The former Cup I product URL redirects to James's profile with an exact 301 rule, and the sitemap excludes it.

Validation: build passes with zero Astro diagnostics; site, Figma and interior audits pass with 71 generated routes, 33 product records, 20 active photos and no blanks. Eleven mocked Worker tests pass. Runtime checks pass for 71 routes, six redirects and five existing not-found paths. Edge checks at 390px and 1280px confirm exactly three James profile cards, the retained cup in both views, no withdrawn photo/links and no overflow. Viewport overrides were reset.

Form status was checked using GET only on the public domain and stable Workers URL: both return HTTP 503, `contact_disabled`. Deployment configuration still has `CONTACT_ENABLED=false` and empty `CONTACT_FROM`/`CONTACT_TO`. No live form submission or email test was performed; contact delivery was not activated.

## Corrected James cup withdrawal — 15 October 2026

The owner supplied two photos identifying the taller plain-sided brown Cup II as the cup to remove and the shorter patterned Cup I with a dark rim and small foot as the cup to keep. This reverses the earlier identification above. Cup I's original content, image, profile card, product URL and enquiry catalogue entry are restored. James's Gallery hover uses Cup I. Cup II's content and public image are removed, and its former product URL redirects to James's profile. There are still three James profile cards, eleven active new products and 20 supplied photo slots.

Validation: production build passes with zero diagnostics; site, interior and Figma audits pass. The Figma audit normalizes Windows line endings before comparing reference biographies. All 15 mocked Worker tests pass. Local runtime checks pass for 71 generated routes, six redirects and five existing not-found paths. Edge reviews use 1280px and 390px frames for James's profile and Cup I product: correct image loaded, no Cup II content, no horizontal overflow, three profile cards. The profile link opens Cup I; its full-image viewer opens, Escape closes it and focus returns to the opener. No live form was submitted.
