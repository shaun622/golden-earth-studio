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

The current homepage uses absolute links back to the live WordPress site for pages that have not been rebuilt yet. Replace these with local routes as each destination is migrated.

Search indexing is disabled while this is a preview. Remove the `noindex` directive in `BaseLayout.astro` when the custom domain moves from WordPress to this build.

## Forms

The homepage contains the finished form layout, but email delivery is intentionally disabled during the visual build. The next integration phase will add a Worker endpoint backed by Resend and Cloudflare Turnstile. Store API keys with Wrangler secrets; never commit them.

## Assets

The visual assets in `public/assets/` were captured from the existing Golden Earth Studio site for this authorized rebuild. Keep filenames stable unless every reference is updated.
