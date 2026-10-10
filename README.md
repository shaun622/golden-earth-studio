# Golden Earth Studio

A code-first rebuild of [goldenearthstudio.co.uk](https://goldenearthstudio.co.uk), built with Astro and deployed as static assets on Cloudflare Workers.

## Local development

```powershell
npm install
npm run dev
```

Run `npm run check` for Astro and TypeScript validation, and `npm run build` to create the production output in `dist/`.

## Deployment workflow

1. Create a branch for a change.
2. Review the Cloudflare preview deployment.
3. Merge the approved change to `main`.
4. Cloudflare builds and deploys `main`.

Cloudflare Builds is connected to `shaun622/golden-earth-studio`. Production pushes run `npm run build` followed by `npx wrangler deploy`; other branches receive preview builds.

The complete public site is generated from local Markdown and typed data. Search indexing remains disabled during review; follow `docs/LAUNCH-CHECKLIST.md` when the custom domain moves from WordPress.

## Forms

The Worker endpoint supports general, footer, commission, and artwork enquiries through Resend and Cloudflare Turnstile. Delivery defaults to disabled until the sender, recipient, site key, and secrets are configured. Visitors always have a direct email fallback.

## Assets

The visual assets in `public/assets/` were captured from the existing Golden Earth Studio site for this authorized rebuild. Keep filenames stable unless every reference is updated.

See `docs/CONTENT-EDITING.md` for the Git editing workflow and run `npm run audit` after every production build.
