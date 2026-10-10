# Responsive review — 8 September 2026

## Coverage

Reviewed the built static site through the Edge extension using responsive viewport overrides.

- All 58 HTML routes checked at 320px and 768px, including the homepage, Collective, Gallery, Mission, Journal, archive, legal pages, 10 artist pages, 22 artwork pages, 17 article pages and the 404 page.
- Twelve representative routes additionally checked at 375, 390, 430, 760, 761, 767, 820 and 1024px (212 route/viewport checks total).
- DOM checks covered off-screen elements and content overflowing its own container, including overflow hidden by the page wrapper. No remaining failures; deliberately clipped accessible form labels were excluded.
- All 16 Journal dialogs checked at 320 × 740. Their content stays within the dialog width and scrolls vertically.
- Visual inspection of phone and tablet layouts, including the contact section and footer; additional image-viewer check at 844 × 390 landscape.

## Corrections

1. Allow image heights to scale with responsive widths. HTML height attributes previously overrode intended aspect ratios, leaving artwork images 900px tall and introducing oversized crops and gaps elsewhere. Explicit frame heights still apply to catalogue crossfades and Journal cards.
2. Stack the homepage contact section at tablet widths so its 480px minimum form column cannot be clipped. Reduce tablet footer gaps.
3. Give the Collective section heading enough column width on tablets.
4. Align shared phone breakpoints at 767px. Anchor the dropdown below the actual header height, make it scroll in short viewports, and clear scroll locking when returning to desktop navigation.
5. Enlarge menu, tabs, image-viewer, form and footer touch controls. Use 16px form inputs and a 44px minimum field height at phone/tablet widths; allow form actions to wrap.
6. Keep keyboard focus inside the open mobile menu. Escape restores button focus; resizing above 767px closes the menu and clears body scroll locking.
7. Use dynamic viewport height for full-screen phone dialogs. Reduce image-viewer padding/image height in landscape so the image, caption and controls fit together.
8. Space the footer legal links explicitly.

## Interaction checks

- Mobile menu open, close, focus wrap, Escape, and resize cleanup passed.
- Gallery Artwork tab selected correctly and exposed all 21 artwork cards; tab target height is 44px.
- Image-viewer Next changes the image/caption; Escape closes it and restores page scrolling. Viewer controls are at least 44px square. At 844 × 390 the complete viewer content fits without vertical scrolling.
- Journal card opens its article; close returns to the index and restores focus to the opener.
- Commission form required-field validation focuses First Name. Main and footer fields render at 16px with a minimum 44px height. No test enquiry was sent.
- Existing reduced-motion CSS and progressive content fallbacks reviewed in source; OS preference emulation was not available through the viewport controls.

## Validation and limits

`npm run build`, `npm run audit`, `npm run audit:journal`, `npm run audit:interior` and `git diff --check` pass.

These are Edge responsive-viewport checks, not physical iOS/Safari or Android device tests. On-screen keyboard behavior and browser chrome resizing on real devices remain device-specific checks. Contact email delivery is outside this layout review.

## Figma gallery expansion — 10 October 2026

Reviewed the final built Worker preview in the Edge extension. Gallery, James, Edie, Lucia and Eleanor profiles plus all twelve new product pages were checked at 360, 390, 768, 820, 1024, 1280 and 1440px: 119 checks, no overflow or out-of-viewport headings, forms, inputs, media or cards. Desktop commission columns and phone stacking were also asserted. Six retained pages were smoke-tested at 390/1280px: Home, Collective, Mission, Journal, Louis Vincent and Jacob Chan's Sake Bottle.

Visual comparison covered the four profile compositions, portrait/landscape products, Tiled Screen, related cards, commission section and footer. Desktop whitespace follows Figma; phone layouts reduce empty space and expose artwork captions permanently. A full-page screenshot revealed an empty section anchor taking up a grid cell; removing it from grid flow restored the intended left copy/right form columns.

Gallery tab keyboard/hash changes, profile focus captions, mobile menu Escape/focus restoration, required-field validation and disabled local contact feedback pass. A temporary local CSP server blocking all scripts confirmed readable biographies/specifications, ordinary page/email links and both Gallery panels. It was stopped and removed. Reduced-motion CSS disables caption transitions; OS preference emulation was unavailable through this extension.

One temporary Cup I source demonstrated replacement in Gallery hover/profile/product and social metadata, with the existing lightbox working. It was restored to null before the final build. All 17 sources are null in the final content and render real neutral blanks with Photo pending labels.

Final build, site/Journal/interior/Figma audits, runtime audit and 10 Worker tests pass. Evidence is saved in `docs/reference/figma-2026/qa/`; the implementation ledger records details and editorial assumptions. These remain Edge viewport checks rather than physical-device tests, and live email delivery remains outside this review.

## Supplied Drive photographs — 10 October 2026

The subsequent photo import replaces 17 image slots, adds separate card crops for Edie and Tiled Screen, and leaves four actual blanks. The earlier all-null result above records the initial build only. See `reference/figma-2026/PHOTO-MATCH-REPORT.md` for the exact missing images.

All 17 affected routes were checked again in the Edge extension at 390, 768 and 1280px: 51 layout checks, no horizontal overflow or clipped headings, portraits, product media, cards or form fields. Full-page visual review covered Edie and Lucia profiles; Gallery review confirmed the supplied portraits and keyboard crossfade. Off-screen lazy images were loaded by navigating through card links before the final phone capture. The initial JSON observation of an unloaded legacy Gallery hover is its hidden lazy state, not a missing supplied file.

Cup I's real image viewer opens on desktop and phone; Escape closes it and restores focus to the image link. Phone image/caption/close bounds fit the 390 × 844 viewport. Tiled Screen's full three-panel source is preserved on its product page and phone viewer. Edie's missing product image remains a labelled blank with no viewer link. The build, all four audits, 10 Worker tests and the 72-route runtime check pass.

Evidence: `reference/figma-2026/photo-qa/` contains the responsive JSON, interaction results and representative screenshots. These are Edge viewport checks, with the same physical-device and live-email limits as the original review.
