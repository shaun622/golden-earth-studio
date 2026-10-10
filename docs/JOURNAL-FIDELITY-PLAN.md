# Journal fidelity correction — 8 September 2026

User approved planning and fixing in the same request. Compared WordPress `/journal/` in Edge with preview `f2430987`; inspected the captured page 1947, popup bodies and live Elementor CSS before editing.

## Findings

The rebuild invented a large `The Journal` heading, introductory sentence and contact section. It substituted popup cover images for the actual card backgrounds, used portrait crops instead of 200px-high landscape cards, reformatted dates, constrained the grid to 92rem, and replaced the source's tracked serif card titles. These are fidelity defects, not missing architecture.

## Ordered implementation

1. **Content:** parse the 16 source CTA records by their known popup IDs. Add `cardImage` alongside `coverImage`, retain source card titles and pipe-separated dates, and store the exact index images locally. Update the importer so regeneration preserves the fix. No URL or ID changes; do not overwrite article images with card images.
2. **Index:** replace the invented heading and description with `Curated chronicles of the innovation, news and events as it unfolds`, with the source italic emphasis. Remove the added main contact section; retain the existing footer. Scope new styles to Journal: 93% wide four-column grid, 4% horizontal gaps, 200px images, 50vh row cadence, 35px card text inset, Baskervville 16px/4px tracking titles, original dates, and slow zoom/darkening hover. Adapt to a readable single column on mobile. Remove obsolete conflicting Journal rules from the shared stylesheet.
3. **Article presentation:** preserve full bodies and source titles/date differences; put title before date as WordPress does and eliminate repeated outbound links. Bring popup width/height and type closer to source CSS while keeping vertical scrolling, focus containment, real article URLs and legacy fragment mapping.
4. **Validation:** build and route/asset audit; add a focused source-parity check for all 16 card titles, dates and source image mappings and absence of invented copy. Compare the resulting desktop screenshot in Edge with the original. Validate direct and legacy popup URLs and direct article content.
5. **Delivery:** commit to the existing review branch, push, wait for Cloudflare Builds and open the new preview. No merge or domain cutover.

## Boundaries and failure cases

No new framework, API, database or provider configuration. Existing content IDs, article URLs, popup IDs and delivery settings stay valid. Card images are independent of popup images; a failed download must fail the import, not silently choose a different image. Missing JS must retain real article links. Styles must not change gallery cards or image lightboxes. Existing malformed-source dates remain documented rather than silently rewritten. Reverting the correction commit restores the previous review build.

Mobile viewport control is unavailable in the Edge extension; do not claim narrow-screen screenshot validation. The page's existing editor placeholder is excluded intentionally.

## Implementation evidence

Completed the content/schema, index, popup typography and duplicate-link corrections. Seven additional original card images are now local; nine cards reuse already-local images. Compared the original and corrected index in the same Edge tab: 200px image bands, four columns, tracked serif titles, original dates, and matching row cadence. The popup was checked with a direct article fragment. `npm run audit:journal` checks every source card's title/date/image/ID and rejects the invented index copy. Build and full asset/route audit pass. Narrow-screen screenshot validation remains unperformed for the tool limitation above.
