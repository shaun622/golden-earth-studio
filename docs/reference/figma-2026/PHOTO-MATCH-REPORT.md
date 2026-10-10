# Updated Gallery Images — photo matching

Imported on 10 October 2026 from the owner's [Updated Gallery Images folder](https://drive.google.com/drive/folders/1SsbjhCxPYUGBu3lEB3tYaQTB8HuDDe6q), following the request to use these files and compare them with the red area in [GES Figma](https://www.figma.com/design/AEQdADBXl4tl09FtBeNxlx/GES?node-id=5061-156).

Reviewed all 33 PNG files across five folders. Selected 17 clean images; excluded 16 screenshots with baked captions, darkening or portrait crossfades. The selected subjects match the intended artists/artworks. The remaining problem is missing clean images or the wrong crop, rather than a different artist's work.

## Images still required

These four slots deliberately remain blank and display “Photo pending”.

| Required image | Available file and why it cannot fill this slot | Figma reference |
| --- | --- | --- |
| Edie — Earth Memory, full wide product photo | The portrait card crop cuts off the sphere. Need the complete rock and sphere together. | Product node `5060-103` |
| Edie — Bedrock, full wide product photo | The portrait card crop is a close-up and cuts off the bowl's sides. Need the complete bowl. | Product node `5060-106` |
| Edie — Fragmentation 1, full wide product photo | The portrait card crop cuts off the sphere. Need the complete object. | Product node `5060-109` |
| Eleanor — clean painting image for Gallery hover | Eleanor's dedicated folder is empty. Shared screenshot at 14.48.18 has her faded portrait baked over the painting. | Gallery hover node `5060-46` |

Eleanor's portrait is present in the shared New Artists folder and is installed. Edie's profile cards are also filled; only her three product-page image areas are missing.

## Selected source files

Every name below is `Screenshot 2026-10-10 at <time>.png`. The full file IDs, Drive links, dimensions, hashes and output paths are in `photo-import.json` beside this report.

| Source folder | Time | Matched image | Site use |
| --- | --- | --- | --- |
| New Artists for Artists Page | 14.46.32 | Lucia portrait | Gallery and artist profile |
| New Artists for Artists Page | 14.46.40 | James portrait | Gallery and artist profile |
| New Artists for Artists Page | 14.46.46 | Edie portrait | Gallery and artist profile |
| New Artists for Artists Page | 14.46.54 | Eleanor portrait | Gallery and artist profile |
| James Galbraith Kirkptrick | 15.14.29 | Square Plate | Profile card, product page and viewer |
| James Galbraith Kirkptrick | 15.14.36 | Cup I | Profile card, product page, viewer and Gallery hover |
| James Galbraith Kirkptrick | 15.14.45 | Bowl | Profile card, product page and viewer |
| James Galbraith Kirkptrick | 15.14.56 | Cup II | Profile card, product page and viewer |
| Edie Evans | 15.11.23 | Earth Memory portrait crop | Profile card only |
| Edie Evans | 15.11.30 | Bedrock portrait crop | Profile card and Gallery hover |
| Edie Evans | 15.11.37 | Fragmentation 1 portrait crop | Profile card only |
| Lucia Ocejo | 15.04.43 | Round Bud Vase | Profile card, product page, viewer and Gallery hover |
| Lucia Ocejo | 15.04.50 | Tea Bowl | Profile card, product page and viewer |
| Lucia Ocejo | 15.04.58 | Mug | Profile card, product page and viewer |
| Lucia Ocejo | 15.05.15 | Jug | Profile card, product page and viewer |
| Lucia Ocejo | 15.05.29 | Tiled Screen portrait crop | Profile card only |
| Lucia Ocejo | 15.10.44 | Complete three-panel Tiled Screen | Product page and viewer |

The James folder spelling is copied here solely to identify the source folder; the site retains “James Galbraith Kirkpatrick”. Tiled Screen has no separate detail frame in the red area: its previously approved matching product template now displays the supplied complete image at its natural aspect ratio.

## Excluded screenshots

- New Artists: 14.47.33, 14.47.49, 14.47.58 and 14.48.18 already contain faded portraits over artwork. The clean portraits and clean artworks let CSS create the Gallery transition without applying it twice. Eleanor still needs a clean painting.
- James: 15.15.06, 15.15.12, 15.15.21 and 15.15.30 contain dark hover overlays and text.
- Edie: 15.11.47, 15.11.55 and 15.12.03 contain hover overlays/text, including measurements that conflict with individual product frames.
- Lucia: 15.07.08, 15.07.15, 15.07.24, 15.07.33 and 15.07.39 contain hover overlays/text. The Mug hover measurement also conflicts with its product frame.

The site renders captions and hover effects itself. Existing product-frame measurements remain authoritative, as recorded in the implementation plan; importing pixels does not change prices, dimensions or copy.

## Asset handling

The 17 selected screenshots were encoded to WebP at their existing pixel dimensions and crops, without upscaling or reconstructing cut-off content. Selected PNGs totalled 16,102,054 bytes; the WebP assets total 1,303,282 bytes. The originals are retained only in ignored local staging under `.tmp/drive-gallery/`. Public assets contain only selected WebP photos; the manifest stores ordinary Drive links, never authenticated download URLs.

Artist profile frames preserve the intended Figma proportions using CSS cropping. The supplied portraits are Gallery crops, so fuller original portraits would improve exact profile framing. Original image exports would also provide better viewing quality than screenshots. These do not prevent use of the supplied files.
