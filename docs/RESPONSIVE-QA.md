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
