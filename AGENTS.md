# Golden Earth Studio agent guidance

## Workflow

- Use Astro, TypeScript, CSS, and small browser-native scripts.
- Keep the site statically generated. Add Worker code only for a feature that requires server-side behavior.
- Work on a branch, run `npm run build`, and review the result in Edge before merging.
- Do not deploy secrets or place them in source control.

## Design

- Treat the existing Golden Earth Studio site as the visual reference until a design change is explicitly requested.
- Preserve the restrained palette, generous whitespace, fine typography, image-led layouts, and subtle motion.
- Respect `prefers-reduced-motion`, keyboard navigation, semantic headings, and useful image alternative text.
- Keep animations progressive: content must remain available when JavaScript does not run.

## Content

- Keep repeated content in typed data files under `src/data/`.
- While migration is incomplete, links to unreconstructed pages may point to the live WordPress site.
- Retain current public URLs when each page is rebuilt, or document the required redirect.

## Validation

- Run `npm run build` after code changes.
- Check desktop and mobile layouts in the Edge extension.
- Verify navigation, focus states, hover effects, reduced motion, media fallbacks, and overflow.
