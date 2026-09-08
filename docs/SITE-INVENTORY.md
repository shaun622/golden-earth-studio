# Golden Earth Studio — migration inventory

Captured from the public WordPress page/post indexes and rendered pages on 8 September 2026. See `reference/inventory.json` for the machine-readable original inventory and `reference/content/<WP ID>.json` for copy, image references, links and source markup. Actions below are proposed defaults that become the implementation specification when this plan is approved.

## Main and supporting pages

| Original path | WP ID | Planned treatment |
| --- | --- | --- |
| `/` | 56 | Existing coded homepage; retain appearance, share catalogue/nav data, activate forms later. |
| `/gallery/` | 333 | Rebuild both Artists and Artwork panels; preserve source order and commission section. |
| `/collective/` | 424 | Rebuild editorial sections, 9 image lightboxes, Zine and collection links. |
| `/journal/` | 1947 | Rebuild 16-card index, overlays and contact section. |
| `/our-mission/` | 600 | Rebuild complete page; preserve `#about` founders anchor. |
| `/terms/` | 1528 | Migrate substantive text for owner review. |
| `/privacy-policy/` | 1823 | Migrate substantive text for owner review; document factual mismatch with new providers separately. |
| `/journal2/` | 478 | Preserve older archive and date anchors; keep out of main navigation. Contains unique podcast content. |
| `/directory/` | 2398 | 301 to `/gallery/`; old directory is a placeholder for the gallery and a commission form. |
| `/newsletter/` | 2464 | 301 to `/journal/`; rendered page is a broken `[newsletter]` shortcode, not a working signup. |
| `/global-styles/` | 50 | Do not publish design-kit/demo page; return standard 404. |

These 11 top-level pages include the homepage. Ten profiles plus 22 artwork pages below bring the page inventory to 43.

## Artist profiles and exact artwork URLs

Each path in the artwork column is relative to `/gallery/<artist-slug>/`. Preserve the literal path even when the title differs. The first eight profiles below form the current Artists tab, in the order shown.

| Artist slug | Profile WP ID | Variant | Artwork path → WP ID |
| --- | --- | --- | --- |
| `louis-vincent` | 2952 | Catalogue; listed | `wall-panel-i/` → 3007; `plate/` → 3039; `conical-bowl/` → 3017; `bowl/` → 2974; `wall-panel-ii/` → 3057 |
| `jihyun-kim` | 2837 | Catalogue; listed | `teoju/` → 2861; `small-teoju/` → 4387 |
| `jacob-chan` | 1439 | Catalogue; listed | `chess-set/` → 2753; `sake-set/` → 4453; `ginger-jar-2/` → 4433; `sake-bottle/` → 4470; `ginger-jar/` → 2826; `sake-bottle-2/` → 4475 |
| `alexandra-yan-wong` | 4262 | Catalogue; listed | `untitled-2025/` → 4270 |
| `adam-weismann` | 4332 | Catalogue; listed | `clay-2025/` → 4351 |
| `arran-gregory` | 4235 | Catalogue; listed | `the-universe-was-an-egg-which-cracked/` → 4257; `heart-of-matter/` → 4249 |
| `zahed-tajeddin` | 3072 | Catalogue; listed | `bulls-matter/` → 3133; `bowing-bull/` → 3107; `elevation/` → 3144; `stillness/` → 3155 |
| `rickie-cheuk` | 2872 | Catalogue; listed | `chopsticks/` → 2878 |
| `celia-dowson` | 1454 | Older editorial; not in current gallery panel | Three material-study images/captions and interview; no standalone artwork paths in page index. |
| `eleanor-herbosch` | 362 | Older editorial; not in current gallery panel | Three material-study images/captions and interview; no standalone artwork paths in page index. |

The artist source contains 8 displayed works for Jacob but only 6 linked detail pages. **Sake Cups** and **Teapot** must be captured as display-only records if their visible source presentation is confirmed. Do not invent URLs, prices or details for them.

Current main Artwork tab has 21 cards (Stillness is on Zahed's page but absent from this panel). Store its explicit order using stable IDs:

1. `jacob-chan/chess-set`
2. `alexandra-yan-wong/untitled-2025`
3. `louis-vincent/bowl`
4. `louis-vincent/wall-panel-i`
5. `jihyun-kim/teoju`
6. `arran-gregory/the-universe-was-an-egg-which-cracked`
7. `jacob-chan/sake-set`
8. `zahed-tajeddin/bowing-bull`
9. `adam-weismann/clay-2025`
10. `louis-vincent/conical-bowl`
11. `zahed-tajeddin/bulls-matter`
12. `jihyun-kim/small-teoju`
13. `jacob-chan/ginger-jar-2`
14. `rickie-cheuk/chopsticks`
15. `louis-vincent/wall-panel-ii`
16. `louis-vincent/plate`
17. `jacob-chan/sake-bottle-2`
18. `arran-gregory/heart-of-matter`
19. `jacob-chan/sake-bottle`
20. `zahed-tajeddin/elevation`
21. `jacob-chan/ginger-jar`

The repeated-title variants above were resolved from `reference/content/333.json` links. Display names include `Clay 1666` at the `clay-2025` path, `Teoju #1` at `teoju`, and two wall-panel titles that vary between roman and Arabic numerals. Keep slug identity separate from display copy.

## Journal content

The following 16 stories appear on `/journal/`, in the order shown. Each has a complete body and image reference in `reference/popups/<ID>.json`. Generate the proposed readable URL as well as preserving overlay behaviour and old popup-ID fragments.

| Index title | Card date | Popup ID | Proposed article path |
| --- | --- | --- | --- |
| We're Hiring | 14 January 2026 | 4602 | `/journal/were-hiring/` |
| Reframing Waste | 12 November 2025 | 4586 | `/journal/reframing-waste/` |
| 735kg Reclaimed | 29 October 2025 | 4590 | `/journal/735kg-reclaimed/` |
| Ekta Bagri Residency | 5 October 2025 | 4580 | `/journal/ekta-bagri-residency/` |
| Subsurface by Hal Strode | 16 September 2025 | 4573 | `/journal/subsurface-by-hal-strode/` |
| Arran Gregory Interview | 17 July 2025 | 3685 | `/journal/arran-gregory-interview/` |
| CHP Masterclass | 17 June 2025 | 3700 | `/journal/chp-masterclass/` |
| London Craft Week | 12 May 2025 | 3708 | `/journal/london-craft-week/` |
| GES Workshop Masterclass | 17 May 2025 | 2503 | `/journal/ges-workshop-masterclass/` |
| Meet Olla Ceramics | 5 January 2025 | 2452 | `/journal/meet-olla-ceramics/` |
| Ceramics Monthly | 15 September 2024 | 2430 | `/journal/ceramics-monthly/` |
| Circular Ceramics | 1 April 2023 | 2170 | `/journal/circular-ceramics/` |
| Excavation | 31 January 2022 | 2168 | `/journal/excavation/` |
| Piling Begins | 29 January 2022 | 2164 | `/journal/piling-begins/` |
| Grand Designs | 8 May 2022 | 2096 | `/journal/grand-designs/` |
| Material Collection | 17 February 2022 | 2166 | `/journal/material-collection/` |

Retain manual order; it is not perfectly chronological. Do not silently reorder while normalizing dates.

Also create `/journal/the-circular-economy-podcast/` from the **actual podcast story** in `reference/content/478.json`, not the empty old post record. Set `showInIndex: false` to preserve the current 16-card listing; link it from the legacy archive. The archive has six anchors: `#2008`, `#0104`, `#0805`, `#1704`, `#3101`, `#2901`. Preserve them on `/journal2/`. The old archive labels some dates/years differently; keep its labels and log the inconsistencies.

Known content questions: Hiring body says `20256` while its card says 2026, and its deadline has passed; Arran's card says 17 July while the article says 14 July. The plan does not authorize pretending the vacancy is currently open or changing uncertain event dates. Preserve the historical content and note owner decisions. Clear typographic correction of `20256` to the card's 2026 may be made with an entry in the content-question log; other factual changes require evidence.

Popup **28** is a globally included demo coupon/subscription form. It is captured as evidence but must not be rebuilt.

## Collective image entries

All nine are image links/lightboxes. Image targets and displayed captions are captured in `reference/content/424.json`. Keep their order, actual artwork imagery and captions, recording uncertain spelling rather than inventing corrections.

1. Josef Stoger — 3D printed ceramic lamp
2. Ekta Bagria — Rammed earth sculpture
3. Isabel Fletcher — Repositioned; Clay and Stone
4. Rosie Williams — Fossilised Curiosities
5. Jeanne Francois — Alger's house
6. Victoria Coxall — London, project 01
7. Shaoqi Tan — Pangea
8. Uiqi Atelier — Collaborative Sculpture
9. Jacob Chan — Clay Body Blends

The Clay Zine's external submission link is `https://forms.gle/ZJZKaECPYKiSs7bw8`. Preserve its destination; do not submit the external form during validation. Clay availability points visitors to Instagram. Neither requires a local application or booking system.

## Seven legacy posts

Rendered checks confirmed the six non-demo posts are titles plus empty comment forms, with no article body or media in the main content. Three have meaningful matching stories elsewhere; map those instead of creating empty pages. Source records include `renderedEvidence` so this decision is not based solely on an empty REST response.

| Old path | WP ID | Treatment |
| --- | --- | --- |
| `/circular-ceramics-book/` | 955 | 301 to `/journal/circular-ceramics/`. |
| `/grand-designs-live/` | 135 | 301 to `/journal/grand-designs/`. |
| `/the-circular-economy-podcast/` | 133 | 301 to `/journal/the-circular-economy-podcast/`. |
| `/glas-allt-shielf/` | 131 | Empty unrelated shell; standard 404. |
| `/the-art-relief-series/` | 129 | Empty unrelated shell; standard 404. |
| `/bear/` | 122 | Empty unrelated shell; standard 404. |
| `/hello-world/` | 1 | WordPress starter post/demo comment; standard 404. |

This gives **5 explicit redirects** (including Directory and Newsletter), **5 excluded placeholder URLs** (including Global Styles), and **40 original routes to retain** (including the existing homepage and the legacy Journal archive). Add **17 new readable article URLs**. With an unchanged inventory, expected acceptance is **57 content routes + a 404 page + sitemap/robots**, with all 50 original records accounted for. Do not confuse 16 popup bodies with another 16 old HTTP routes.

## Additional discovery checks during Phase 1

The public page/post index is the observed baseline, not proof that no other URL exists. Before locking the route ledger, inspect available sitemap indexes and links in every source record for custom post types, meaningful attachment/document links, old query-style links and fragments. Include newly discovered real content; record exclusions. Do not crawl administration, authentication, feeds or arbitrary external sites. If no additional content is found, the counts above are the target.
