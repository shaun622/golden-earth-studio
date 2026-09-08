# Collective, Gallery and Our Mission fidelity correction

The user requested the same correction already approved and delivered for Journal. Compare live WordPress in Edge and captured page HTML (424, 333, 600), using the original Elementor styles as measurements. These are presentation and source-copy corrections; retain Astro, Git delivery, routes and contact handling.

1. Preserve the source stylesheets as reference. Extend the existing importer to keep exact index labels, image/hover pairs, Collective captions/dimensions, missing photographic backgrounds, and original Mission/founders copy. Fail on unexpected card counts or broken source links. Keep detail-page titles independent from index captions.
2. Rebuild Collective's right-aligned introduction, photographic opening with original text, Absent Boundaries introduction, three-column masonry and caption overlays, extended invitation, and two-column clay information. Remove the invented title, rewritten paragraphs and added contact section. Retain lightbox access and original outbound links.
3. Restore Gallery's small right-aligned introduction, original tab separator and divider, three-column portrait catalogue with 600px images, original labels and slow image crossfades. Restore the full commission copy. Keep keyboard tabs, real detail links and no-JavaScript fallback.
4. Restore Mission's small opening quote and attribution, excavation photograph with two text columns, full original paragraphs, and both founder portraits beside the original biography. Remove the added About label and replacement olive panel.
5. Scope styles to these index pages with sufficient specificity for production stylesheet ordering. Preserve readable responsive layouts and reduced-motion support. Build, run route/asset and source-parity checks, compare production-built desktop pages in Edge, then push the existing review branch and verify the Cloudflare preview. No merge or domain cutover.

Risks: index images and labels can differ from detail pages; migration must preserve both. Background photographs are in CSS and were absent from the previous HTML-only import. Masonry must retain source order and image aspect ratios, expose captions on keyboard focus, and remain readable without JavaScript. Revert the correction commit to roll back.

## Verification

Compared all three opening views with WordPress in the same desktop Edge tab, plus original Collective masonry and Mission founders. Measured Collective section positions and masonry height: the rebuilt grid starts within a pixel of the original and total masonry height differs by under two pixels at the inspected viewport. Verified Collective lightbox opening, next-image navigation and Escape close, and Gallery mouse/keyboard tabs. The refreshed Edge session exposed viewport controls: checked all three pages at 390 × 844, found no horizontal overflow, and restored WordPress's distinct mobile background image. Build, route/asset audit, Journal parity and the new interior source-parity check pass.

Content remains independent from detail-page metadata: 29 Gallery cards use exact source labels and image/hover pairs, nine Collective images retain their dimensions, and both founder portraits are rendered. The importer now includes the previously omitted page backgrounds. Added `npm run audit:interior` and updated Git editing instructions.
