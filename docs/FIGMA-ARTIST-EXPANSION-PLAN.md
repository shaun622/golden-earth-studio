# Figma Gallery and artist expansion — implementation handover

Prepared 10 October 2026. Status: **ready for implementation using the stated defaults; planning only so far**. This document is the authoritative handover for the next coding pass. No site source was changed during planning.

## 1. Outcome and scope

Reproduce the designs inside the large red rectangle on the **ARCHIVE** page of the GES Figma file. Add James Galbraith Kirkpatrick, Edie Evans and Lucia Ocejo, refresh Eleanor Herbosch, and update the Gallery listing. Match the reference's typography, spacing, image proportions, hover treatments and enquiry sections. Missing photographs must render as actual, recognisable blanks until supplied.

| Change | Deliverable |
| --- | --- |
| Gallery | Twelve artists in the reference order; revised card proportions, labels and tabs; existing 21-piece Artwork listing retained; compact commission section |
| James Galbraith Kirkpatrick | New profile and four product pages: Square Plate, Cup I, Bowl, Cup II |
| Edie Evans | New profile and three product pages: Earth Memory, Bedrock, Fragmentation 1 |
| Lucia Ocejo | New profile and five product pages: Round Bud Vase, Tea Bowl, Mug, Jug, Tiled Screen |
| Eleanor Herbosch | Existing URL refreshed with the new biography, Painting discipline and portrait slot; added to Gallery; no invented product pages |
| Photographs | Seventeen unique missing-media slots, all initially blank; existing matching photography remains in use |

This adds **15 routes**: three artist profiles and twelve product pages. Eleanor already has a route. The build remains static Astro with the existing contact Worker. No editor, CMS, database, shopping cart, account migration, hosting migration, dependency upgrade or email-service activation is part of this change. Home, Collective, Our Mission, Journal and existing product/profile designs outside the red rectangle retain their current content and behaviour.

## 2. Source of truth and inspected baseline

### Figma evidence

File: [GES](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES). Inspected through the user's **Edge extension**, not native computer control. Use the **ARCHIVE** page, not the similarly named work-in-progress page.

The [red boundary, Rectangle 30](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5061-156) is 22,400 × 18,231, with a red outline. Its contents are the scope boundary. Many designs are screenshots placed inside frames, so old frame names and text layers are not reliable content sources. The visible artwork names inside the screenshots take precedence over layer names such as “Side Plate” or “Cup”.

| Reference | Figma node | Inspection notes |
| --- | --- | --- |
| Gallery / Artists | [6-2](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=6-2) | 1280 × 3245; 12 artists |
| Artist grid | [5059-43](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5059-43) | image 165; 1176 × 1972, left 50, top 405 |
| Artist hover grid | [5060-46](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-46) | image 166 |
| Gallery / Artwork | [66-22](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=66-22) | 1280 × 4519; 21 existing pieces |
| James profile | [5001-2](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5001-2) | 1280 × 2968; bio 5004-8; grids 5060-112 / 5060-115 |
| Edie profile | [5010-2](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5010-2) | 1280 × 2268; bio 5011-25; grids 5060-97 / 5060-100 |
| Lucia profile | [5023-165](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5023-165) | 1280 × 2968; bio 5041-3; hover grid 5060-53 |
| Eleanor profile | [5062-160](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5062-160) | 1280 × 2968; bio/portrait 5062-158; no product tiles |

Individual product reference nodes are listed in section 6. The copy in sections 6–7 was transcribed from the rendered references; another agent does not need the previous conversation to obtain it.

### Repository baseline

- Workspace: `C:\Users\USER\Documents\ChatGPT\GES - Website`.
- Inspected branch: `codex/full-site-rebuild`; commit `7835d3b12f57c05a80ffdea5815c4d8f75cf28d4`. Working tree was clean before this plan.
- Astro 7.3.1, TypeScript 6.0.3, Wrangler 4.129.1. Keep the installed dependency versions.
- `src/content.config.ts` defines artist/artwork collections. There are 10 artist profiles and 22 artwork records. Two profiles are currently unlisted.
- `src/pages/gallery/[artist]/index.astro` and `[artist]/[artwork].astro` generate routes from those collections.
- **The Gallery index does not automatically use those collections.** It reads the eight artist and 21 artwork cards in `src/data/interior.generated.json`.
- `src/data/gallery.generated.json` holds related catalogue order metadata. Keep it consistent with the visible listing.
- `src/data/route-ledger.json` currently has 57 generated routes, five redirects and five excluded routes. `src/pages/sitemap.xml.ts` uses this ledger.
- `worker/catalogue.generated.ts` is the authoritative server-side artwork allowlist. New artwork pages without matching entries cannot make valid enquiries.
- `src/data/home.ts` already contains the four related works shown in the Figma product footer, in the correct order.
- `reference-pages.css` currently gives Gallery cards 600px desktop images and large tracked serif captions. Existing detail templates add Artist/Artwork eyebrows and large headings; those do not match the new frames.
- `ContactForm.astro` currently has five fields for commissions. The reference has three. `worker/validation.ts` currently requires a name for every variant, which must be adjusted for the reference commission form.

### Baseline verification actually performed

`npm run check` passed: **54 files, zero errors, warnings or hints**. The sandboxed invocation first failed during Astro sync with a runtime/environment error; the same check passed under host execution. Do not change dependencies to “fix” that sandbox-only failure.

No full build was run during planning. A runtime check was attempted without a local server and therefore reported connection failures; it is **not** evidence of a site defect or a successful runtime baseline. Start Wrangler before running that check during implementation.

## 3. Decisions, defaults and invariants

| ID | Decision |
| --- | --- |
| D01 | Preserve Astro static generation, content collections, public URL conventions, existing Worker API and Git deployment workflow. |
| D02 | Add scoped `figma-2026` profile/detail variants. Apply them to the four affected profiles and twelve new products only. Avoid a global restyle of legacy details or home cards. |
| D03 | Missing photos are `null` sources in a typed media registry. Render a neutral empty rectangle with a small “Photo pending” label, never a borrowed image, stock photo, Figma screenshot crop, broken `<img>` or empty `src`. |
| D04 | Reuse only existing photographs that match the reference: the original eight Gallery artists, existing Artwork listing and four related works. New portraits, new products and Eleanor's new painting hover remain blank. |
| D05 | For conflicting dimensions, **use the individual product page** and make the profile hover agree. This is a recommended default pending the user's answer; discrepancies are recorded below. Materials may legitimately be a broad tile medium and a more specific product material. |
| D06 | Include a Tiled Screen detail page using the common Lucia template and the tile's supplied facts. No price or invented description. Its detail layout is inferred because no separate product frame exists. This is a recommended default pending the user's answer. |
| D07 | Keep the Artwork index's existing 21 items and order: that is what the red-area Artwork frame shows. New works are reached through the new artist profiles. Adding them to the main Artwork index would be a subsequent content choice. |
| D08 | Keep the shared functional header/footer navigation and contact behaviour. Match their appearance in the affected layouts where necessary, but do not add the screenshot's unsupported “Email Updates” subscription or dead “About” destination. Do not change site credits from an old screenshot. |
| D09 | Use the supplied biography and product copy. No filler headings, marketing descriptions or additional interviews. Preserve the canonical `adam-weismann` spelling/URL; change only his Gallery discipline label to Clay. |
| D10 | Commission forms in affected pages use Email Address, Subject, Message. Permit a missing name for the `commission` variant only. All other form variants retain their name requirement. Keep Turnstile, limits, error states and mailto fallback. |
| D11 | Preserve desktop negative space deliberately. Derive mobile layouts from the same content order without forcing 2968px page heights or huge empty mobile sections. |
| D12 | Edit the curated content/data explicitly. Do not rerun historical WordPress import/prepare scripts: they can overwrite the new Figma content and generated-named data files. Document this limitation. |

Two optional clarification questions were sent during planning about D05 and D06. No answer had been received when this document was prepared. These defaults make the handover executable without pretending the user has approved either detail. Incorporate any answer before implementation.

**Invariants:** existing URLs and redirect behaviour remain; no secret values enter Git; existing source assets are retained; no real email is sent during automated/visual QA; content and links remain usable without JavaScript; keyboard focus reveals the same information as hover; reduced-motion users receive no required animation; preview indexing settings remain unchanged.

## 4. Acceptance criteria

| ID | Required outcome |
| --- | --- |
| AC01 | Gallery has exactly 12 artist cards in section 5 order, plus the unchanged 21-piece Artwork listing; every card links to a generated local route. |
| AC02 | James, Edie and Lucia profiles contain the exact biographies, correct contact names, and respectively 4, 3 and 5 linked artworks in the specified order. |
| AC03 | All 12 product routes render the correct artist, base title, 2026 year, dimensions, materials and supplied price; Tiled Screen has no fabricated price. |
| AC04 | Eleanor's existing URL shows the new two-paragraph biography, Painting discipline and new blank portrait; the old interview/study section is not rendered in this variant. |
| AC05 | All 17 missing-media slots render actual blanks in every context, with stable layout and clear replacement identifiers. No new photo is substituted from another artist or scraped from Figma. |
| AC06 | At 1280px, the Gallery, four profiles and product variants match reference composition, type hierarchy, portrait/landscape proportions, rules, forms, related cards and intentional whitespace. Deviations are documented, not silently invented. |
| AC07 | Enquiry forms carry the correct catalogue artwork ID. The three-field commission form validates without a name; other variants still require one. Disabled delivery and email fallback continue to work. |
| AC08 | Route ledger, sitemap and Worker allowlist include the additions. All internal links resolve; unchanged redirects/exclusions retain their behaviour. |
| AC09 | Mobile/tablet layouts have no horizontal overflow, clipped long names or overlapping controls. Hover content is accessible by keyboard and on touch; essential content works without animation/JavaScript. |
| AC10 | Existing home, Collective, Mission, Journal, legacy profiles/products and contact variants pass appropriate regression checks. No unrelated copy, image or layout change ships. |
| AC11 | Photo replacement is documented and demonstrated locally: updating one registry entry updates its repeated uses without structural changes; missing media never becomes a lightbox target or invalid social-image URL. |

## 5. Gallery and layout specification

### Artist order and labels

Retain the original eight artists and their normal/hover image pairs, then append the new row positions exactly as shown. Use zero-based `order` values 0–11 where collection order is stored.

| Order | Name | Discipline | Destination |
| --- | --- | --- | --- |
| 1 | Louis Vincent | Wood | `/gallery/louis-vincent/` |
| 2 | Jihyun Kim | Ceramic | `/gallery/jihyun-kim/` |
| 3 | Jacob Chan | Ceramic | `/gallery/jacob-chan/` |
| 4 | Alexandra Yan Wong | Painting | `/gallery/alexandra-yan-wong/` |
| 5 | Adam Weismann | Clay | `/gallery/adam-weismann/` |
| 6 | Arran Gregory | Clay | `/gallery/arran-gregory/` |
| 7 | Zahed Tajeddin | Ceramic | `/gallery/zahed-tajeddin/` |
| 8 | Rickie Cheuk | Metal | `/gallery/rickie-cheuk/` |
| 9 | Lucia Ocejo | Ceramic | `/gallery/lucia-ocejo/` |
| 10 | James Galbraith Kirkpatrick | Ceramic | `/gallery/james-galbraith-kirkpatrick/` |
| 11 | Edie Evans | Ceramic | `/gallery/edie-evans/` |
| 12 | Eleanor Herbosch | Painting | `/gallery/eleanor-herbosch/` |

New Gallery hover media: Lucia → Round Bud Vase; James → Cup I; Edie → Bedrock; Eleanor → new painting detail. The first three share the corresponding product's missing-media slot. Eleanor needs a separate blank hover slot.

Keep the current right-aligned introduction: “Explore the artists who *transform* construction / by-products into fine art and functional ware”. Preserve the emphasis on “transform”. The reference tab order is **Artwork | Artists**; retain Artists as the existing initial selection, existing hash destinations and accessible tab behaviour. Update keyboard order to match visual order.

### Visual measurements and responsive rules

The frames are 1280px wide. Dimensions below are **visual starting targets**, except the explicitly recorded Figma node dimensions; compare rendered pages in Edge against the actual reference before signing off. Embedded screenshots mean arbitrary pixel precision would be misleading.

| Area | Desktop target |
| --- | --- |
| Surface and fonts | Existing `#f2f2f2` paper, muted grey text, Baskervville and Gill Sans Light. No new font service. |
| Gallery grid | About 1176px wide at 1280; three columns, four artist rows. Cards roughly 330 × 395, rather than the present 600px-high cards. Fine body-font captions with restrained tracking. |
| Profile opening | Starts around y250–280; about 60px outer margins; portrait left, biography right; name around 22px serif and body around 14–16px with generous line height. Remove added Artist and discipline eyebrows from this variant. |
| Portrait variation | James about 410 × 525; Lucia about 410 × 498; Edie about 334 × 442 with a larger gap to the biography. Eleanor uses the new upright portrait composition. Use explicit per-profile layout variants where needed. |
| Profile works | Three columns of tall portrait cards, approximately 0.59 width/height. James 3+1, Edie 3, Lucia 3+2. Thin separator above. |
| Work hover | Darkened image/blank with centred light title/year, dimensions and medium. Title in italic serif. Make the same information available on focus and visibly on touch. |
| Product heading | `Title, 2026 | Artist Name` on one line when space permits, title roughly 36px light sans and artist serif. Wrap cleanly on smaller screens; separator is decoration, not the accessible title. |
| Product details | Plain specification lines separated by dashes; do not display the legacy Dimensions/Materials/Price labels. A semantic definition list with visually hidden labels is acceptable. |
| Product body | About 1160px total width. Narrow left specification/enquiry column, input width about 335px. Product image on the right. James/Lucia portrait slots roughly 350 × 600; Edie landscape slots roughly 550 × 370. |
| Enquiry | “Enquire now”, thin rule, light-grey rounded fields for First and Last Name, Email Address, Phone Number, Message, then right-aligned Send. Labels remain accessible even when visually hidden. |
| Below product | Preserve generous blank vertical space before Related Artworks, which starts around y1770 in the full desktop references. Use spacing/min-height on the content region rather than absolute positioning. |
| Related works | Four columns: Teoju / Jihyun Kim; Bull's Matter / Zahed Tajeddin; Bowl / Louis Vincent; Chopsticks / Rickie Cheuk. Reuse `src/data/home.ts` entries, labels and assets. |
| Commissions | Thin full-width rule; heading, existing commission paragraph and email beside a compact Email Address / Subject / Message form; shared footer below. |

Use two columns on intermediate widths where three become cramped; one column for the portrait/biography and product information/image at phone widths. Preserve source reading order: profile portrait → biography → works; product heading/specifications/enquiry → image → related works. Touch cards must expose captions without needing a first hover tap. Related cards can use two columns where readable, then one on narrow screens. No fixed desktop height should create an unusable phone scroll gap.

Eleanor's frame has a large empty middle section and no work cards. Preserve that restrained desktop composition with a scoped minimum content space; reduce it responsively. Do not fill it with her old material studies or invented paintings.

Owner clarification, 14 October 2026: the newly supplied painting image must also appear on Eleanor's profile below the biography. Display it under Artworks with the existing full-image viewer, preserve its complete aspect ratio and replace the empty middle spacing. Reuse the Gallery hover asset without inventing a catalogue title, price or product page.

Use the existing commission paragraph in `interior.generated.json` rather than rewriting marketing copy. Use the per-profile contact sentence: “For further information on pricing and availability for James’ work, please contact info@goldenearthstudio.co.uk”, with Edie’s, Lucia’s or Eleanor’s as appropriate. The email must be a mailto link.

## 6. Product content and routes

All works have year **2026**. Store the base title without the year, and render the year once. Artist ID plus product slug is the artwork ID, e.g. `edie-evans/bedrock`. Source WordPress ID is `null` for new records. New product bodies are empty because no descriptive prose was supplied. Each new detail page displays one main media slot; do not invent extra photographs or repeat the same slot as a thumbnail strip.

| Artist | Title / slug | Dimensions to display | Detail material | Price | Reference content node |
| --- | --- | --- | --- | --- | --- |
| James | Square Plate / `square-plate` | 15cm(w) x 4cm(h) | London Clay | £80 | [5060-118](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-118), inside misleading “Side Plate” frame 5001-20 |
| James | Cup I / `cup-i` | 7cm(w) x 7.5cm(h) | London Clay | £70 | [5060-121](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-121) |
| James | Bowl / `bowl` | 17cm(w) x 7cm(h) | London Clay | £80 | [5060-124](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-124) |
| James | Cup II / `cup-ii` | 7cm(w) x 7.5cm(h) | London Clay | £70 | [5060-154](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-154) |
| Edie | Earth Memory / `earth-memory` | Ball 7cm(l) x 7cm(w) x 7cm(h); Rock 7cm(l) x 9cm(w) x 6cm(h) | London Clay | £275 | [5060-103](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-103) |
| Edie | Bedrock / `bedrock` | 8cm(l) x 12cm(w) x 6.5cm(h) | London Clay | £375 | [5060-106](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-106), inside frame 5015-63 named “Cup” |
| Edie | Fragmentation 1 / `fragmentation-1` | 10cm(l) x 9.5cm(w) x 8cm(h) | London Clay | £175 | [5060-109](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-109) |
| Lucia | Round Bud Vase / `round-bud-vase` | 18cm(w) x 20cm(h) x 7cm(w) | London Clay | £220 | [5060-62](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-62) |
| Lucia | Tea Bowl / `tea-bowl` | 8cm(w) x 9cm(h) | London Clay | £50 | [5060-65](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-65) |
| Lucia | Mug / `mug` | 9cm(w) x 8.5cm(h) | London Clay | £40 | [5060-68](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-68) |
| Lucia | Jug / `jug` | 17cm(w) x 26cm(h) | London Clay | £160 | [5060-91](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-91) |
| Lucia | Tiled Screen / `tiled-screen` | 156cm(w) x 130cm(h) | Ceramic & Wood | null | [5060-53](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5060-53), profile tile only |

Use separate lines for Earth Memory's Ball and Rock dimensions; a YAML multiline string is sufficient. Keep the shared value consistent between page and hover. All routes are `/gallery/{artist-slug}/{product-slug}/` with trailing slashes.

Tile medium: James's four pieces and Lucia's first four use **Ceramic**; Tiled Screen uses **Ceramic & Wood**; Earth Memory and Bedrock use **Burnished Clay**; Fragmentation 1 uses **Ceramic**. A `tileMedium` field expresses this distinction without changing the product's London Clay material.

### Explicit source discrepancies

| Item | Difference | Implementation default |
| --- | --- | --- |
| Earth Memory | Hover says 14cm(w) x 16cm(h); detail gives separate Ball/Rock measurements | Use Ball/Rock measurements in both locations under D05 |
| Bedrock | Hover says 12cm(w) x 8cm(h); detail says 8cm(l) x 12cm(w) x 6.5cm(h) | Use detail dimensions |
| Fragmentation 1 | Hover says 9.5cm(w) x 10cm(h); detail says 10cm(l) x 9.5cm(w) x 8cm(h) | Use detail dimensions |
| Mug | Hover says 10cm(w) x 9cm(h); detail says 9cm(w) x 8.5cm(h) | Use detail dimensions |
| Round Bud Vase | The supplied dimensions repeat `(w)` in the third measurement | Preserve the supplied text; flag for editorial correction. Do not guess that it means depth. |
| Cup II | “Enquire now” appears misplaced over a field in the embedded reference | Place it above the form, consistent with the other product pages; do not reproduce accidental overlap |
| Tiled Screen | Five Lucia tiles but only four dedicated product designs | Use the common template; null price; no additional copy |
| Adam | Figma appears to spell the surname differently; current canonical spelling is Weismann | Preserve name/URL; use Clay on the Gallery label |

## 7. Exact artist biography copy

### James Galbraith Kirkpatrick

James Galbraith Kirkpatrick is a ceramic artist based in Kent whose work explores repetition, absence and the spatial behaviour of vessels. Predominantly wheel-thrown, pieces are developed as individual objects yet conceived as part of larger compositions. Arranged in lines, clusters or fields, the works investigate how meaning shifts through proximity, distance and omission.

Kirkpatrick transforms clay excavated from London construction sites into a collection of wheel-thrown tableware, using the clay alongside waste wood-ash to create mineral-rich glazes. Earth has long been used to build the spaces we inhabit, from early earthen structures to the bricks of the modern city. Drawing on years spent working as both a ceramicist and plasterer, Kirkpatrick redirects this displaced material from construction site to table, exploring its potential through objects made for everyday use.

### Edie Evans

Edie Evans is an Artist whose practice investigates how ceramics can operate as a regenerative, circular and place-responsive discipline. Through material research, she explores alternatives to extractive ceramic production by working with locally sourced clays, reclaimed ceramic waste, vernacular materials and historic making traditions that reconnect clay to its ecological and geographical origins.

The works are all made from raw, unfired London clay, combined with reclaimed aggregates and organic matter. They’re burnished and sealed with local beeswax. The work is part of my wider research into local materials, construction and more sustainable ways of working with clay.

### Lucia Ocejo

Lucia Ocejo is a Mexican potter based in London. Her interest in pottery as a record of human activity was sparked when she handled a Han Dynasty bowl at the V&A and discovered the fingerprint of the potter preserved on its rim, two thousand years later. After studying Fine Arts in the United States, she developed her practice through working with potters internationally, including Steve Sheridan in Australia and Lisa Hammond MBE in London. She currently fires all her work in a self-built gas kiln in Oxfordshire.

Ocejo’s practice explores how ceramics can become a geological record of place. For the body of work for Golden Earth Studio, the foraged construction clay creates a unique colour, exploring how its mineral composition is revealed through fire. The firing process draws out latent greens, blues and other hues, each shaped by the minerals held within the clay and revealing qualities that are otherwise hidden in its raw state. Colour becomes a way of reading the earth: each variation is a material expression of place, geology and the elemental forces that have shaped it.

### Eleanor Herbosch

Herbosch is a British-born Belgian multidisciplinary artist exploring the physical and sensory qualities of earth, using soil and clay as both material and pigment. In her paintings, she seeks to capture the tactile essence and subtle complexity of the earth’s surfaces. Deeply influenced by nature, her practice explores the intricate patterns, shifting textures, and delicate interplay of light and shadow found across natural landscapes. Through painting, she brings these observations of the outdoors inward, translating the physical qualities of earth into an expressive visual language.

For Golden Earth Studio, Eleanor has incorporated waste materials from construction sites, giving them a new purpose through her process of painting. Herbosch is drawn to the way materials carry their own qualities and histories, allowing them to become part of the creative process rather than being overlooked. Each surface carries the imprint of the hand and the breath of the earth, delicate and alive.

## 8. Data, media and rendering contracts

### Collection changes

Extend `src/content.config.ts` compatibly:

- Artist `profileVariant` gains `figma-2026`; existing catalogue/editorial values remain valid.
- Artwork `detailVariant` gains a default legacy value and `figma-2026`; legacy records do not require bulk edits.
- Artwork `year` is optional numeric; new records set 2026. `tileMedium` is optional; new records use section 6.
- New artist/artwork `sourceWpId` may be null; existing IDs are preserved. Do not loosen the unrelated page collection unnecessarily.
- Use a shared media reference schema/type: a legacy path string **or** `{ slot: string }`. Support it on artist portrait/hover and artwork main/gallery media. Existing strings continue to work.
- Keep `artworkIds`, artist slug, product slug and catalogue IDs consistent. New artists have empty `studies` and `relatedProfiles` arrays. Eleanor keeps the old studies data for recovery but the new profile renderer does not display it.
- Choose truthful, concise SEO descriptions derived from the supplied copy. A missing image resolves to `undefined` for layout metadata, allowing `BaseLayout.astro`'s real fallback image; never pass an object or null into `new URL()`.

### Typed photo registry and blank component

Proposed files: `src/data/media.ts` and `src/components/MediaSlot.astro`.

Registry entries contain a stable slot ID, `src: string | null`, useful alt text and intended intrinsic dimensions. All 17 new entries initially have `src: null`. A resolver must reject unknown slot IDs during build, rather than silently hide a typo. Existing string paths resolve unchanged. Context-specific CSS controls crop/aspect ratio; the same asset can occupy a portrait profile image or Gallery crop.

`MediaSlot` renders a real `<img>` only when a source exists. Otherwise it renders a neutral rectangle with a fine border, a small visible “Photo pending” label, and an accessible description identifying the required photo. Add `data-media-slot` to identify the slot in built markup. A card containing a blank still links to its detail page. A blank main image is never an anchor to a lightbox, never triggers a media request, and never uses fake alt text claiming a real photo is present.

| Slot ID | Used in |
| --- | --- |
| `james-galbraith-kirkpatrick-portrait` | James profile and Gallery artist card |
| `edie-evans-portrait` | Edie profile and Gallery artist card |
| `lucia-ocejo-portrait` | Lucia profile and Gallery artist card |
| `eleanor-herbosch-portrait` | Eleanor profile and Gallery artist card |
| `james-galbraith-kirkpatrick-square-plate` | James tile and Square Plate detail |
| `james-galbraith-kirkpatrick-cup-i` | James tile, Cup I detail and James Gallery hover |
| `james-galbraith-kirkpatrick-bowl` | James tile and Bowl detail |
| `james-galbraith-kirkpatrick-cup-ii` | James tile and Cup II detail |
| `edie-evans-earth-memory` | Edie tile and Earth Memory detail |
| `edie-evans-bedrock` | Edie tile, Bedrock detail and Edie Gallery hover |
| `edie-evans-fragmentation-1` | Edie tile and Fragmentation 1 detail |
| `lucia-ocejo-round-bud-vase` | Lucia tile, Round Bud Vase detail and Lucia Gallery hover |
| `lucia-ocejo-tea-bowl` | Lucia tile and Tea Bowl detail |
| `lucia-ocejo-mug` | Lucia tile and Mug detail |
| `lucia-ocejo-jug` | Lucia tile and Jug detail |
| `lucia-ocejo-tiled-screen` | Lucia tile and inferred Tiled Screen detail |
| `eleanor-herbosch-painting-hover` | Eleanor Gallery hover only |

No placeholder image file needs to be downloaded or generated. At photo handover, add the supplied optimised file under `public/assets/artists/` or `public/assets/artworks/`, set that slot's source and meaningful alt/dimensions, then inspect all uses. Do not replace missing slots with another artist's available image merely to make the layout look finished.

### Components and styling

Add scoped components such as `FigmaArtistProfile.astro`, `FigmaArtworkDetail.astro`, `FigmaArtworkCard.astro` and `FigmaCommission.astro`, with `src/styles/gallery-2026.css`. These are proposed files, not existing APIs. Share data and repeatable markup; allow explicit profile/image-orientation modifiers for the observed differences.

The dynamic route files select the new components by variant. Update `ArtistLayout.astro` and `ArtworkLayout.astro` to accept optional real metadata images and suppress the old eyebrow for this variant, or render the variant through the existing `InteriorLayout` directly. Keep that choice local; do not change the default legacy appearance. Any legacy component receiving the widened media type must resolve it before passing it to an `<img>` or lightbox.

`CatalogueCard.astro` should support the new media reference and a Gallery-scoped visual treatment. Do not change `ArtistCard.astro`/`ArtworkCard.astro` globally and thereby restyle the homepage. Use the four existing `home.ts` related works in a dedicated four-column region on new products.

`ContactForm.astro` should receive an explicit presentation option for the Figma variant. Implement the product placeholders and three-field commission branch without changing unrelated forms. Retain semantic labels, required indicators, status live regions, unique IDs, source path and hidden artwork IDs. `src/scripts/contact.ts` must continue serialising the visible fields correctly. In `worker/validation.ts`, skip the missing-name error only for `commission`; in `worker/contact.ts`, omit the Name line from the email body when absent. Do not supply a fabricated hidden customer name.

## 9. Ordered implementation tasks

Start from the inspected full-site branch, not an older homepage-only main branch. Check for newer commits/local changes, read `AGENTS.md`, then create `codex/figma-artist-expansion` from the current equivalent of the inspected base. Preserve user changes. Use the account-aware GitHub wrappers if GitHub operations become necessary. Implementation can be sequential; no agent delegation is required.

### T01 — Add compatible media and content contracts

- **Purpose:** make missing photos explicit and allow Figma content without fake WordPress IDs.
- **Depends on:** none; review D05/D06 if answers have arrived.
- **Targets:** `src/content.config.ts`; new `src/data/media.ts`, `src/components/MediaSlot.astro`; relevant image metadata consumers in layouts/routes.
- **Changes:** implement section 8 schemas/resolver; add 17 null slots; retain existing path-string compatibility and valid SEO fallback. Do not create blank image assets.
- **Verify:** `npm run check`; exercise a known null slot and invalid slot through a temporary development fixture; confirm legacy collections still load. Remove the temporary fixture.
- **Done:** typed contracts support existing and new records, unknown IDs fail clearly, null media produces no image request. Covers AC05/AC11.
- **Risk:** widened types can leak into `new URL`, image attributes or lightbox arrays; resolve at each boundary.

### T02 — Build the scoped reference layouts

- **Purpose:** establish reusable profile, product, hover-card and commission composition before entering all content.
- **Depends on:** T01.
- **Targets:** new Figma components/style file; dynamic artist/product routes; artist/artwork layout wrappers; Gallery card presentation.
- **Changes:** implement section 5; remove legacy eyebrows only in the variant; support James/Lucia portrait images and Edie landscape product images; include four related works and commission band; make hover/focus/touch behaviour equivalent. Normalize Cup II's accidental overlap.
- **Verify:** compare a representative portrait product, landscape product and profile in Edge at 1280 and 390px once T04/T05 content is available; check no-JS content and reduced motion.
- **Done:** a shared design handles all reference compositions without global CSS leakage. Covers AC06/AC09/AC10.
- **Risk:** current reference selectors have high specificity; scope new rules explicitly and inspect the production build, not only development CSS.

### T03 — Align enquiry forms and validation

- **Purpose:** reproduce visible form fields while retaining working server contracts.
- **Depends on:** T02's form presentation interface; can precede content entry.
- **Targets:** `src/components/ContactForm.astro`, `src/scripts/contact.ts` if needed, `worker/validation.ts`, `worker/contact.ts`, `worker/contact.test.ts`.
- **Changes:** implement D10 and section 8. Product forms keep name/email/phone/message. Commission forms use email/subject/message. Preserve all other validation/security/delivery behaviour.
- **Verify:** worker tests for commission without a name, non-commission without a name, missing/invalid email, disabled delivery and escaped email output. Stub delivery; do not submit a real email.
- **Done:** new visual forms and server agree; existing variants regress cleanly. Covers AC07/AC10.
- **Risk:** CSS-only field hiding would leave an impossible required-field contract; actually render the correct fields and validate by variant.

### T04 — Add James and his four works

- **Purpose:** deliver the first complete new artist journey.
- **Depends on:** T01–T03.
- **Targets:** new `src/content/artists/james-galbraith-kirkpatrick.md`; four files under `src/content/artworks/james-galbraith-kirkpatrick/`.
- **Changes:** exact section 7 bio; Ceramic; listed; order 9; four IDs in section 6 order; portrait layout and blank photo references; supplied product facts/prices/year; empty product bodies.
- **Verify:** profile shows four links in 3+1 desktop layout; each route has correct title, facts, blank and form ID. “Side Plate” must not appear as an invented product title.
- **Done:** profile plus four detail routes match their references and work as a navigable set. Covers AC02/AC03/AC05/AC06.
- **Risk:** Cup I versus Cup II must not share IDs, prices by accident, or the wrong title; they share dimensions but have separate slots.

### T05 — Add Edie and her three works

- **Purpose:** deliver the landscape-image product variation and compound dimensions.
- **Depends on:** T01–T03.
- **Targets:** new `src/content/artists/edie-evans.md`; three files under `src/content/artworks/edie-evans/`.
- **Changes:** exact bio; Ceramic; listed; order 10; three artworks; Edie portrait spacing; landscape product slots; Ball/Rock multiline dimensions and D05 corrections.
- **Verify:** three tiles form one desktop row; each landscape blank retains its reference proportion; correct £275/£375/£175 values and full measurements; no inherited “Cup” title.
- **Done:** four routes use correct content and the Edie composition. Covers AC02/AC03/AC05/AC06.
- **Risk:** do not use abbreviated, conflicting hover dimensions as product data.

### T06 — Add Lucia and her five works

- **Purpose:** deliver the larger artist catalogue, including the tile-only Tiled Screen.
- **Depends on:** T01–T03.
- **Targets:** new `src/content/artists/lucia-ocejo.md`; five files under `src/content/artworks/lucia-ocejo/`.
- **Changes:** exact bio; Ceramic; listed; order 8; five artwork IDs in reference order; supplied facts/year/prices; Tiled Screen uses null price and matching common template.
- **Verify:** 3+2 desktop tile layout; five local links; Mug uses product-page measurements; Tiled Screen has an enquiry form and no fake price/description; repeated `(w)` on vase is retained and documented.
- **Done:** six routes are complete within the supplied content/defaults. Covers AC02/AC03/AC05/AC06.
- **Risk:** D06 is an explicit inferred page, not a separately observed Figma frame. If the user chooses tile-only before implementation, reduce product/route counts consistently and leave the tile unlinked; the Tiled Screen photo slot remains necessary for the profile tile, so the 17-slot count does not change.

### T07 — Refresh Eleanor's existing profile

- **Purpose:** align the existing artist with the new Painting presentation.
- **Depends on:** T01–T02.
- **Targets:** `src/content/artists/eleanor-herbosch.md`; new profile variant; optionally archive old biography in `docs/reference/` if useful beyond Git history.
- **Changes:** exact new two-paragraph bio; Painting; listed; order 11; new portrait and painting hover slots; empty artwork IDs; retain legacy study assets/data but do not render them in this variant. Preserve existing WordPress ID and route.
- **Verify:** no old Q&A/study grid on the page; no invented paintings; desktop negative space and shorter mobile spacing; old URL still resolves.
- **Done:** existing route matches the new reference and has the correct Gallery data. Covers AC04/AC05/AC06/AC08.
- **Risk:** accidentally reusing the old portrait/study hover would conceal photos that still need replacing.

### T08 — Update Gallery listing and shared order metadata

- **Purpose:** make all four affected artists discoverable in the reference composition.
- **Depends on:** T04–T07.
- **Targets:** `src/pages/gallery/index.astro`, `CatalogueCard.astro`, `GalleryTabs.astro`, `src/data/interior.generated.json`, `src/data/gallery.generated.json`, scoped Gallery CSS.
- **Changes:** 12-card artist order/labels from section 5, null media references for the new cards, Adam label Clay, Artwork-before-Artists tab order, revised proportions/captions and new commission presentation. Preserve the 21 artwork entries exactly.
- **Verify:** 33 total rendered cards across both panels; compare desktop normal and hover states to nodes 5059-43/5060-46; mouse/keyboard/hash tabs; no-JS fallback; new cards reach the expected profiles.
- **Done:** both Gallery states match the source, with no accidental addition/reordering of the existing artwork catalogue. Covers AC01/AC05/AC06/AC09.
- **Risk:** the index reads JSON rather than content collections; adding only Markdown profiles will not update it.

### T09 — Register routes/enquiries and update focused audits

- **Purpose:** make new routes and enquiries valid across the whole build.
- **Depends on:** T03–T08.
- **Targets:** `src/data/route-ledger.json`, `worker/catalogue.generated.ts`, `worker/contact.test.ts`, `scripts/check-interior.mjs`; new `scripts/check-figma-gallery.mjs`; `package.json` for its audit command; `docs/CONTENT-EDITING.md`, `docs/SITE-INVENTORY.md`, `docs/CONTENT-QUESTIONS.md`.
- **Changes:** add three profile routes and twelve product routes; append twelve authoritative artwork catalogue entries with title/artist/path; preserve redirects/exclusions; document source conflicts and photo inventory/replacement. Add `audit:figma` for built-page/content integrity.
- **Verify:** baseline becomes 72 ledger routes, 13 total artist profiles and 34 artwork records. Built HTML count is expected to be 73 including 404, subject to the existing build conventions. Every new artwork ID validates; unknown IDs remain rejected; sitemap has new routes and keeps existing exclusions.
- **Audit detail:** the existing interior audit assumes 29 cards and exact WordPress parity. Update it deliberately: check all 21 retained artwork labels/URLs/image pairs, the original eight artists with the explicit Adam label override, and all four appended artist cards. Match entries by stable URL rather than shifted array offsets. Preserve Collective/Mission source-parity assertions. Add checks for new profile/product links, exact facts, 17 missing slots, no empty image URLs, no fake prices and no legacy eyebrows in Figma variants. Do not simply remove old assertions.
- **Done:** build data, navigation, sitemap and contact allowlist agree; editing guide explains that historical import scripts can overwrite these curated files. Covers AC01–AC05/AC07/AC08/AC10/AC11.
- **Risk:** filenames ending `.generated` are not regenerated by the normal site build; changing content alone is insufficient.

### T10 — Build, review in Edge and record results

- **Purpose:** finish with visible evidence that the build follows the reference across devices.
- **Depends on:** T01–T09.
- **Targets:** built site, Edge extension, focused QA notes in `docs/RESPONSIVE-QA.md` and this plan's completion record.
- **Changes:** fix issues found by the acceptance matrix below; no unrelated refactor. Capture representative desktop/mobile screenshots in a task-specific QA location if the browser capability supports saving them.
- **Verify:** run the commands and visual scenarios in section 10; review the final diff; ensure all 17 expected blank slots remain null in committed content.
- **Done:** all ACs are checked with recorded results, remaining editorial ambiguities are listed, and the branch is ready for the user's review. Follow any subsequent explicit instruction about push/preview/merge; this planning turn authorises no deployment action.
- **Risk:** a successful build alone does not establish visual fidelity. Do not finish before the Edge comparison.

## 10. Verification and acceptance matrix

Run `npm run build` after source changes. Then run `npm run test:worker`, `npm run audit`, `npm run audit:journal`, `npm run audit:interior`, and the proposed `npm run audit:figma`. Do not repeatedly broaden tests once the relevant checks pass unless a new change/failure warrants it.

For the production runtime, start the existing Wrangler preview after building (e.g. `npx wrangler dev --port 8790`), wait for its ready URL, then run `npm run check:runtime -- http://127.0.0.1:8790/`. Use that built preview in Edge. Do not interpret a connection-refused result from an absent server as an application failure. Keep `CONTACT_ENABLED` and secrets unchanged; worker tests use stubs.

| Acceptance | Evidence required |
| --- | --- |
| AC01 | Built-page audit of 12+21 cards and order/links; Edge checks of both tabs and hover/focus |
| AC02 | Exact biography/content checks and all three profile grids viewed at 1280 and phone widths |
| AC03 | All 12 built routes compared against the content table; representative portrait/landscape pages visually compared; each product inspected for title/spec/form association |
| AC04 | Eleanor viewed on desktop/mobile; no old interview or studies rendered; existing route still resolves |
| AC05 | Registry has 17 null sources; built markup and Edge show blanks at all intended uses; no new photo network requests or broken icons |
| AC06 | 1280px comparison of Gallery, four profiles, James product, Edie product, Lucia product, and inferred Tiled Screen. Inspect the lower related/commission/footer sections as well as the opening viewport. |
| AC07 | Worker tests cover new IDs and commission name exception; browser validation/fallback checked without sending live email |
| AC08 | Build, route/asset audit and running-Worker runtime audit; sitemap and redirects checked |
| AC09 | Edge at 360/390, 768/820, 1024 and 1280/1440 widths; focus order, tab keyboard controls, touch captions, long artist names, reduced motion and overflow checked |
| AC10 | Existing audits pass; smoke-test Home, Collective, Mission, Journal, one legacy artist, one legacy product and existing contact controls |
| AC11 | Temporarily resolve one slot to a known local test image to confirm all repeat uses switch correctly, then restore null before committing; inspect metadata fallback and ensure blanks do not open lightboxes |

On mobile, inspect Gallery's fourth row, Lucia's fifth work, Earth Memory's two-part dimensions, James's long name and product artist line, the form button/error region and Eleanor's empty middle section. Ensure no width is forced by long names, dimensions or inline title separators. Restore temporary Edge viewport overrides after QA.

No-JavaScript verification must cover essential biography/specification text, ordinary page links, accessible tab fallback and visible email contact. Reduced-motion verification must not depend on animation completing to expose content.

## 11. Delivery, rollback and later photographs

There is no database migration or external service setup. This is content, static rendering and a small compatible contact-contract update. Existing routes and assets remain recoverable. Keep preview `noindex` behaviour as-is; launch/indexing is a separate decision.

After implementation, provide the branch/review location, exact validation results and representative screenshots. The user's “go” on this plan permits the build work; follow their current deployment instructions for any later push/preview or merge. Do not change Cloudflare accounts, domains, secrets or Resend settings as part of this scope.

Rollback is a revert of the implementation commits, including the collection schemas, catalogue, ledger and validation change together. There is no persistent data to backfill. Avoid deleting old Eleanor assets or other legacy media, which are also checked by the existing asset manifest.

When the photographs arrive, use the section 8 slot list as the checklist. Replace sources one slot at a time, set accurate alt/dimensions and adjust the crop only if required by the reference. Review every reused location, run the build/audits and confirm the corresponding “Photo pending” labels disappear. Remaining null slots continue to display blanks, making outstanding work visible.

## 12. Readiness and execution instruction

**Ready to build with the documented defaults.** The absent photographs are intentionally supported and do not block implementation. The pending dimension/Tiled Screen questions are editorial choices with explicit defaults, not hidden design work. The remaining uncertainty is original photo supply and the duplicated width label on Round Bud Vase; neither should be guessed away.

Completion record, updated 2026-10-10: T01–T10 implemented and verified on `codex/figma-artist-expansion`, with all 17 photo slots still blank. Build, four audits, 10 Worker tests and the runtime route audit pass. Edge review includes 119 responsive checks, static fallbacks, keyboard interaction, representative Figma comparisons and a reversible photo-replacement demonstration. See `docs/FIGMA-ARTIST-EXPANSION-EXECUTION.md` and `docs/RESPONSIVE-QA.md` for evidence, corrections and verification limits. No deployment was performed.

Executor: implement **T01–T10** in order/dependency order using this document, the project `AGENTS.md` and the linked red-area Figma references. Apply any new user answers first. Keep scope to these changes; verify every acceptance criterion before reporting completion. Authoritative plan: `docs/FIGMA-ARTIST-EXPANSION-PLAN.md`.
