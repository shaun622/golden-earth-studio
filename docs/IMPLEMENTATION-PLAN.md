# Golden Earth Studio — complete website implementation plan

Prepared 8 September 2026. Status: ready for approval and execution by Sol.

## 1. Execution instruction

When the user says **“Okay, go”** after switching to Sol, execute this plan in order. Read `AGENTS.md`, this document, `SITE-INVENTORY.md`, and `reference/README.md` first. Use the implement-plan skill. The user wants the complete remaining website implemented, not another planning pass or a single sample page.

Work sequentially through the phases, keeping `MIGRATION-CHECKLIST.md` current. Commit coherent milestones. Continue across phases without asking for approval for each routine implementation decision. If an external dependency is unavailable, finish independent work, document exactly what is missing, and do not represent that integration as working. Do not invent missing content, contact details, prices, availability, or successful email delivery.

Use the Edge browser extension for reference inspection and browser validation; do not use PC control. Use GitHub account wrappers (`gh-for-repo`, or `C:\Users\USER\bin\gh-shaun622.cmd`) and the repository's `github.account=shaun622`. Never switch shared GitHub authentication. No sub-agents are required by this plan.

Create `codex/full-site-rebuild` from the planning branch containing these documents. Before starting, check for user edits and changes to `origin/main`; incorporate newer work without overwriting it. The application baseline inspected for this plan is `82b3145` on `main`.

## 2. Outcome and scope

Recreate the full public site faithfully using the existing Astro project, with all content and media needed for the rebuilt site stored in Git. The working workflow remains Claude/Codex → GitHub → Cloudflare Workers. The owner edits Markdown/data/code through Git; there is no CMS, visual editor, database, checkout, customer login, or WordPress runtime.

The existing homepage is the design baseline. Extend its typography, palette, spacing and animation system, preserving its current sections and video. Fix shared accessibility or routing defects where necessary; do not redesign the homepage during this work.

The inspected source contains **43 WordPress pages, 7 WordPress posts, 16 linked Journal article pop-ups, and 9 Collective image entries**. Ten artist profile URLs exist: eight are currently listed in the gallery and two are older editorial profiles. There are 22 artwork detail URLs. All discovered routes and their intended handling are in `SITE-INVENTORY.md` and `reference/inventory.json`.

Two completion states must be reported separately:

1. **Website rebuild complete:** every route has its planned treatment; all real content, media and interactions work on the Cloudflare preview; email code is tested with mocks; configuration requirements are documented.
2. **Production launch complete:** real email delivery has been configured and verified, the owner has settled content/legal questions, the domain is connected, and indexing is enabled correctly. The current request approves planning; subsequent approval of the build authorizes implementation and preview deployment. It does not imply a DNS cutover or unrequested messages to external recipients.

## 3. Confirmed findings that affect implementation

- The gallery has **Artists / Artwork tabs**, not a single static list. Preserve both panels and their manual ordering.
- Artist pages combine a portrait, biography, artwork grid, back link and bespoke commission form. Celia Dowson and Eleanor Herbosch additionally have material studies and three-part interviews; retain these using an editorial variant.
- Artwork pages have a two-column desktop layout: title/artist, dimensions, materials, optional price, description and enquiry form on the left; a main image and linked image thumbnails on the right. Related works follow. The enquiry fields are name, email, phone and message. The displayed title is sometimes different from its URL slug.
- Journal cards open an overlay with an image and article text, including long interviews. The current overlay can overflow horizontally. Preserve the visual concept while fixing overflow and keyboard behaviour. Source bodies have been captured in `reference/popups/`.
- Collective entries link to **images in a lightbox**, not nine separate project articles. The extra Arran Gregory pop-up embedded in the Collective HTML is globally included markup; do not mistake it for another Collective project.
- `/our-mission/` includes the `#about` founders anchor. Preserve this deep link.
- `/journal2/` has six older timeline entries, including a podcast story absent from the modern Journal. It is not safe to discard this content as a duplicate.
- `/newsletter/` visibly renders `[newsletter]`; it is not a working mailing-list integration. The globally embedded “15% coupon” pop-up is demo content. Neither creates a requirement to build a newsletter product.
- Some legacy post URLs are only titles and empty comment forms. Explicit route decisions below replace them; do not implement comments.
- Some source copy has errors: the hiring article displays `20256`; Arran's card and article show different July dates; some artist names and artwork titles vary. Preserve meaningful source content, record uncertainty, and do not silently invent corrections to facts. Remove obvious editor placeholders such as “Add Your Heading Text Here”.
- Current legal text mentions an older Outlook address, old legislation, cookies and services that may not describe the new implementation. Migrate the text faithfully for review. Record specific factual differences for the owner; do not claim the current policy is suitable for launch or generate legal assurances.

## 4. Architecture decisions

### Static site and content

Keep Astro's `output: "static"` and the existing package versions unless a specific compatibility problem requires a change. Use generated nested routes with `getStaticPaths()`. Use local Astro content collections with `glob()` and schema validation for repeatable content. No runtime fetches or build dependencies on WordPress.

Recommended structure:

```text
src/
  content.config.ts
  content/
    artists/<artist-slug>.md
    artworks/<artist-slug>/<artwork-slug>.md
    journal/<article-slug>.md
  data/
    site.ts                    # navigation, brand, contact display, site URL
    home.ts                    # homepage selection IDs, no duplicate catalogue records
    gallery.ts                 # explicit gallery order and editorial selection
    collective.ts              # nine image/caption records and external links
    legacy-routes.ts           # or JSON; source path, action, destination, reason
  layouts/
    BaseLayout.astro
    InteriorLayout.astro
    ArtistLayout.astro
    ArtworkLayout.astro
    ArticleLayout.astro
  components/
    Header.astro, Footer.astro, ArtistCard.astro, ArtworkCard.astro
    ContactForm.astro, ContactSection.astro
    GalleryTabs.astro, ImageGallery.astro, Lightbox.astro
    JournalCard.astro, JournalArticleBody.astro, JournalDialog.astro
  scripts/
    navigation.ts, motion.ts, gallery-tabs.ts, lightbox.ts, journal.ts, contact.ts
  pages/
    index.astro, 404.astro
    gallery/index.astro
    gallery/[artist]/index.astro
    gallery/[artist]/[artwork].astro
    collective.astro, our-mission.astro
    journal/index.astro, journal/[slug].astro
    journal2.astro
    terms.astro, privacy-policy.astro
    sitemap.xml.ts, robots.txt.ts
worker/
  index.ts, contact.ts, validation.ts
scripts/
  check-site.mjs                # generated routes, local links and media audit
public/assets/                 # fonts, images, local video
public/_headers
public/_redirects
docs/
  IMPLEMENTATION-PLAN.md, SITE-INVENTORY.md, MIGRATION-CHECKLIST.md
  CONTENT-QUESTIONS.md, CONTENT-EDITING.md, LAUNCH-CHECKLIST.md
  reference/                   # planning evidence only, never shipped in dist
```

Treat this as the intended division of responsibilities, not a demand to create unused components. Prefer scoped Astro styles for new templates; do not expand every page's styles into one large global file.

### Content contracts

- **Artist:** stable ID, exact `slug`, display name, discipline, portrait and hover-media references, `profileVariant: catalogue | editorial`, `listedInGallery`, ordered artwork IDs, material-study images and interview blocks where applicable, optional external links, SEO description; Markdown body contains biography. Use `listedInGallery: false` for the two older editorial profiles while preserving their URLs and related-profile links.
- **Artwork:** stable ID such as `jacob-chan/sake-bottle-2`, exact `artistSlug` and `slug`, display title, dimensions string, materials string, optional price string, main image, ordered gallery images/captions, explicit related IDs, SEO description; Markdown body contains full description. Optional values stay absent when not stated. Distinct URLs with identical visible titles remain distinct records.
- **Journal:** stable slug, card title, article title when different, source date label(s), normalized date only when supported, explicit display order, `legacyPopupId`, cover image/caption, `showInIndex`, SEO description and Markdown body. Preserve paragraphs, interview questions, emphasis and external links. The podcast becomes a seventeenth content record for the archive, excluded from the current 16-card index by default.
- **Collective:** ID, display caption, creator label, thumbnail, full image, alt text, explicit order. These are image records, not fabricated article pages.
- **Media:** local path, original URL, intrinsic width/height, format, alt text, caption/credit, optional crop/focal point. Keep a source-to-local asset manifest. Inspect actual file format; an extension inherited from a URL is not proof of format.
- **Route ledger:** every discovered original URL gets `migrate`, `redirect`, or `not-found`, a destination where applicable, source reference, reason and validation status. Reject duplicate generated paths and unresolved content references at build time.

Keep raw Elementor snapshots outside `src` and `public`. Convert source content into clean Markdown/data and semantic components. Never inject `referenceHtml` wholesale into production. It contains old layout wrappers and may contain irrelevant templates or unsanitized links despite script removal.

### Shared shell and interactions

`Header.astro` needs explicit overlay/light and interior/dark variants. The current absolute white header only suits the homepage hero. Interior headers participate in normal flow. Set `aria-current` correctly for nested gallery and Journal routes; centralize navigation using local URLs.

Separate motion/menu/form scripts from `BaseLayout.astro`. Give every form instance unique IDs. Handle mobile menu close, Escape, accessible button label changes and focus restoration. Provide usable navigation without JS. Keep content visible by default if motion initialization fails; respect reduced motion for reveals, parallax and autoplay video, including preference changes during a session.

Gallery tabs: initial Artists view; expose stable `#artists` and `#artwork` links. With JS, use tab semantics and keyboard arrow/Home/End navigation. Without JS, both labelled sections remain available through anchor links. Do not mark content as hidden until enhancement initializes. Preserve focus and selected panel on history navigation.

Lightboxes: use native `<dialog>` and one reusable controller with captions, close button, previous/next controls and arrow/Escape keys. Thumbnails remain links to their local full image without JS. Restore focus to the opener, constrain images to the viewport, prevent background scrolling and close cleanly on navigation. A one-image gallery does not show meaningless next/previous controls.

Journal: create real `/journal/<slug>/` links and static article pages. For ordinary unmodified clicks on index cards, enhance them into the original-style overlay using the same server-rendered article-body component. The modest 16-article collection can use inert `<template>` bodies and a single dialog; avoid a client framework or an additional JSON API. Activate one template at a time and lazy-load its media. Modified clicks and new-tab actions follow the normal link. Record `#article=<slug>` when opened from the index; close/Back restores the listing, scroll and focus; Forward reopens the correct article. Direct article URLs always render as pages.

Also map the 16 observed legacy `#elementor-action...popup...` fragments to article IDs on `/journal/`. Fragments never reach the server: this is a small client-side compatibility map, not a Cloudflare redirect. Parse only the expected fragment structure and known IDs; never execute decoded content. For unknown IDs, leave a usable Journal index.

### Email integration

Keep all pages static. Add one small Worker only for `POST /api/contact`; native `fetch` is sufficient for Resend and Turnstile. No Astro SSR adapter is needed. Add `main: "worker/index.ts"`, `assets.binding: "ASSETS"`, and `assets.run_worker_first: ["/api/*"]` to Wrangler; retain `not_found_handling: "404-page"`. Unknown API endpoints return API 404; other paths fall back to `env.ASSETS.fetch(request)` if the handler is invoked. Verify this with Wrangler, including a browser navigation to an API route.

Use three variants of one form system: general/contact, compact/footer, and artwork enquiry. Preserve each variant's fields; normalize into a shared server contract. Artwork enquiries include a stable artwork ID and source path; the server looks up title/artist/URL from a compact generated catalogue map, never trusts a client-supplied recipient or title as authoritative. Do not bundle image binaries or the entire content snapshot into the Worker.

Endpoint contract:

- Accept only POST with the supported JSON body; 405 for other methods. Enforce a 16 KiB body limit while reading, even if `Content-Length` is absent or false; reject unsupported content types and malformed JSON.
- Body: `kind`, `name` (or first/last normalized by client), `email`, optional `phone`, `subject`, `message`, `artworkId`, relative `sourcePath`, UUID `submissionId`, Turnstile token, and honeypot value. Validate kind-specific requirements server-side: name/email always required; subject required for general form; message required for footer; artwork ID required for artwork enquiries. Preserve the current optional message/phone behaviour where applicable. Bound names to 160, email to 254, phone to 50, subject to 200, message to 5000 characters. Reject CR/LF in header fields and invalid/mismatched artist/artwork IDs.
- Validate the requesting Origin against explicit owned hosts; no wildcard CORS. Turnstile server verification must succeed and match the expected hostname and `action`. Honeypot and in-flight button disabling supplement that check. Do not describe Origin checking as complete bot protection.
- Server-configured recipient and verified sender only. Visitor address is `reply_to`, never `from`. Send plain text or properly escaped HTML. Include source page and artwork context. Do not log form bodies, tokens, email addresses or names.
- Await Resend acceptance before returning `{ ok: true }`; this means accepted for delivery, not guaranteed inbox receipt. Never use a fire-and-forget send or return success from a mock in live mode.
- Return safe actionable errors: validation 400/422, verification/origin 403, oversize 413, method 405, unsupported content 415, disabled/missing configuration 503, upstream failure 502/503. Mark responses `Cache-Control: no-store`. Preserve entered text on failure.
- Generate one submission UUID per attempted message. Disable concurrent submits. Reuse the UUID and identical normalized email payload on retry after an uncertain network/upstream result; do not include token, current timestamp or other changing data in that email payload. Use Resend's idempotency header. Obtain a fresh Turnstile token for a new frontend retry; use Turnstile's own idempotency key only to retry the same verification call. Reset widget state after consumed/expired tokens. Rotate the submission UUID after success or edited content. Do not claim exactly-once delivery indefinitely or add a database merely for this form.
- Set bounded upstream timeouts. Do not automatically loop through multiple email sends. Manual retry is supported with the same idempotency key; distinguish expired verification from uncertain email acceptance in the UI.
- Use an accessible `idle → validating → submitting → success/error` UI with `aria-live`; no false success screens. Without JS, display a usable mailto link; hide/disable the JS-dependent submit so form values cannot accidentally become query parameters.

Required setup values: `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` as runtime secrets; `CONTACT_FROM`, `CONTACT_TO`, `ALLOWED_ORIGINS`, `CONTACT_ENABLED` as server configuration; `PUBLIC_TURNSTILE_SITE_KEY` at build time. Store only placeholders in `.env.example`/`.dev.vars.example`. `CONTACT_ENABLED` defaults false. Preview hosts cannot send to a real recipient unless explicitly configured for a requested delivery test; production host checks must not rely solely on the build's `main` branch. The current `workers.dev` site is a review environment.

The main-site inbox visible today is `info@goldenearthstudio.co.uk`, but the actual delivery recipient, sender identity and provider account must be confirmed before activation. If credentials are unavailable, implement and mock-test the endpoint and all UI states, publish the complete visual site with clear mailto fallback, and report the precise remaining setup. Do not block the page migration or silently omit the email phase. No newsletter subscription or autoresponder is part of this plan.

## 5. Ordered implementation phases

### Phase 1 — source verification, content and media foundation

**Depends on:** approved plan. **Goal:** a complete, locally owned content set before mass page generation.

1. Read the captured inventory and reference notes. Refresh the live page/post indexes to detect changes since 8 September; append genuinely new content to the route ledger rather than overwriting the snapshot. Inspect representative desktop/mobile pages in Edge, including both artist variants, both gallery tabs, one artwork, a short/long Journal overlay, Collective and Mission.
2. Create the content schemas and route/media ledgers. Populate all 10 artists, 22 artwork details, 16 current Journal stories and the archive podcast. Preserve source order and duplicate-title variants. Record the two display-only Jacob works separately instead of inventing detail URLs.
3. Download original media referenced by those records, including thumbnail `href` targets, `srcset` images, background images, linked documents and relevant video. Do not select files merely because they have similar filenames. Match images visually to the exact artist/work; record crop dimensions and credits. Reuse the homepage's correct assets.
4. Optimize image derivatives locally using the project's available tooling. Prefer responsive image variants for new large media, explicit dimensions and lazy loading below the fold. Keep art detail sharp. Local site builds must work with WordPress unreachable. Do not download third-party films/podcasts just to replace legitimate outbound links.
5. Populate `CONTENT-QUESTIONS.md` with concrete inconsistencies and the source evidence. Do not turn an uncertain date or missing optional price into a build-wide blocker.

**Files:** content collections/data/media; `docs/CONTENT-QUESTIONS.md`; route and asset manifests. **Schema/migrations:** local content only; no database. **Validation:** all expected IDs unique, all parent/relation references resolve, correct file signatures and nonzero assets; manually compare representative media to Edge. **Rollback:** isolated branch and intact captured source; no WordPress or domain changes.

### Phase 2 — reusable page shell and interaction foundations

**Depends on:** Phase 1 contracts. **Goal:** extend shared components without damaging the homepage.

1. Implement interior header/layout, local navigation data, shared contact section and footer, page-specific metadata, canonical pathname and fallback social image. Home retains the overlay header.
2. Extract/revise browser scripts with progressive enhancement. Add accessible tabs, dialog/lightbox and mobile navigation. Add `id="contact"` on the home contact section for direct links.
3. Support page props for SEO and indexing. Preview defaults to `noindex, nofollow`; canonical URLs point to each final public pathname, never the homepage for every page. Unknown pages get a genuine 404 and no misleading homepage canonical.
4. Verify shared CSS selector scope, no-JS navigation and content, focus states, reduced motion and failed-media fallbacks.

**Validation:** run `npm run build`; inspect homepage and a temporary interior route at 390/768/1440 px widths in Edge, removing any temporary test route afterward. **Rollback:** revert this milestone if shared homepage layout or build regresses; do not continue cloning a faulty template.

### Phase 3 — gallery and every artist/artwork page

**Depends on:** Phases 1–2. **Goal:** complete the full catalogue, not only the homepage's featured records.

1. Build `/gallery/` with Artists/Artwork tabs, the eight listed artist cards and the exact current artwork-card order. Include commission copy/form. Keep the other two profiles accessible through their own URLs and existing related-profile links.
2. Build the standard artist template and all eight catalogue profiles. Add the two editorial profiles with material images, captions, Q&A and related artists. Include back-to-artists links and the correct biography/portrait on every route.
3. Build the artwork template and generate all 22 detail URLs exactly. Include each description, dimensions, materials, price if supplied, main image, detail lightbox, artist link, enquiry context and related artwork links. No basket or payment flow.
4. Include Sake Cups and Teapot as source-backed display-only Jacob entries if confirmed visible; do not create unsupported pages. Keep `stillness/` available even though it is not currently in the main artwork panel.
5. Switch homepage catalogue links to their generated local paths. Share the catalogue data rather than duplicating names, URLs and image mappings.

**Validation:** build plus route/media/link audit. Open all 10 profiles and 22 detail pages at least once; compare the two artist templates and varied artwork shapes on desktop/mobile in Edge. Exercise tabs and lightbox with keyboard. Confirm artwork enquiries retain distinct IDs for same-title items. **Rollback:** commit schema/template work separately from bulk content where useful; preserve the last passing catalogue milestone.

### Phase 4 — Collective, Mission and legal pages

**Depends on:** Phases 1–2; may follow catalogue in the same branch. **Goal:** complete remaining main-menu and footer destinations.

1. Rebuild Collective: introductory message, explanatory copy, “Absent Boundaries”, nine images/captions with lightbox, extended invitation, Clay Zine link and clay collection/Instagram guidance. Preserve external destinations from the snapshot.
2. Rebuild Mission: statistics/attribution as source content, circularity statement, mission text, founders section and images. Preserve `#about`; do not replace a source's dated factual claim with a new claim without evidence.
3. Migrate Terms and Privacy Policy with readable semantic headings/paragraphs instead of Elementor's huge heading blocks. Preserve substantive text for owner review, documenting its provider/address/cookie mismatches separately.
4. Connect all main navigation/footer links locally. Keep valid external/social/email links external. Avoid adding a cookie banner unless the actual introduced technology requires one; do not add analytics during this migration.

**Validation:** build; all nine lightbox images/captions; full-width and narrow layouts; Mission anchor; long legal text wrapping and footer. **Rollback:** page/content commits can be reverted without touching other templates.

### Phase 5 — Journal, article overlays and legacy routes

**Depends on:** Phases 1–2 and shared dialogs. **Goal:** preserve every story and old meaningful URL.

1. Build `/journal/` with all 16 current cards in the source order, correct covers/dates and contact section. Remove editor/demo placeholders.
2. Build the article template and all 17 content routes listed in the inventory (16 current plus archive podcast). Reuse the same content for full pages and the index's overlay. Preserve entire interviews, not summaries.
3. Implement overlay URL/history/focus behaviour and known Elementor fragment mapping. Long articles scroll vertically inside the dialog; no page-wide horizontal scrollbar. Real links and plain pages work without JS.
4. Retain `/journal2/` as a non-navigation archive with its six original date anchors and source content, referencing shared article data where the content matches. Preserve the archive's date labels when they disagree; record the discrepancy.
5. Add only the explicit old-page redirects in `SITE-INVENTORY.md`. Verify `/directory/`, `/newsletter/` and the three matched old post redirects. Dummy/empty unrelated URLs receive the normal 404. Never add a blanket redirect of every missing URL to home.

**Validation:** 16 overlay openings and 17 direct article loads; long interview fidelity; Back/Forward, Escape, new tab, refresh, direct legacy fragment and invalid fragment; redirect status/destination/loop checks through Wrangler. **Rollback:** retain source IDs and URL ledger; restore the previous Journal implementation if history regression appears.

### Phase 6 — working form code and provider setup

**Depends on:** shared forms, catalogue IDs and completed pages. **Goal:** replace preview submit handlers with the real integration defined in section 4.

1. Build endpoint, validation, email formatting and client states; reuse them for general, footer, commission and artwork forms.
2. Add Wrangler API routing/bindings and generated Worker types. Keep Node compatibility off unless an actual imported dependency needs it. Use separate Worker/client TypeScript scopes if needed to prevent global type collisions.
3. Add focused automated tests with mocked upstream calls. Cover valid variants, missing/invalid fields, optional fields, unknown artwork, oversized/chunked payload, unsupported method/type, disallowed origin, failed/expired/hostname-mismatched Turnstile, absent config, upstream timeout/rejection, same-ID retries and changed payloads. Assert no success on email failure and no private content in logs.
4. Document actual provider setup in `LAUNCH-CHECKLIST.md`: verified sender domain, destination inbox, sending API key, Turnstile hostname/sitekey/secret and runtime/build configuration. Reuse authorized existing accounts; do not replace existing domain mail records. Ask for missing configuration once the exact requirements are established, continuing other phases while waiting.
5. Exercise mock success/failure in local Wrangler. Enable a real test only after the user authorizes a recipient; verify receipt and Reply-To, then check the deployed form path. Missing provider setup means “integration awaiting activation”, not “all forms work”.

**Validation:** focused tests, Astro build, Worker type check, Wrangler dry run; HTTP API versus static asset routing; disabled mode returns 503/mailto fallback; real delivery only when authorized/configured. **Rollback:** set `CONTACT_ENABLED=false` to disable delivery while retaining useful mailto links; redeploy a known-good Worker if necessary.

### Phase 7 — full-site acceptance and preview handover

**Depends on:** Phases 1–6 (provider activation may remain explicitly pending). **Goal:** prove complete coverage and publish a reviewable result.

1. Implement/run a deterministic audit over `dist`: each migrate route exists; each redirect resolves; not-found fixtures return 404; every internal link/fragment/asset resolves; no duplicate IDs, dangling references or unintended absolute WordPress navigation remain. Scan shipped output for `/wp-content/`, Elementor actions/scripts, raw shortcodes, development URLs and placeholder messages. Exempt only documented legacy-fragment compatibility data and genuinely intentional external references.
2. Produce sitemap from canonical content routes, excluding redirects, dummy pages and the legacy archive if designated noindex. Production robots/sitemap URL must use the real domain. Keep preview indexing disabled and verify that future enablement cannot accidentally index branch previews. In `public/_headers`, use the documented `https://:version.:subdomain.workers.dev/*` pattern with `X-Robots-Tag: noindex` for Workers preview hosts, and test matching against both the stable review URL and branch/version URLs. Keep noindex responses crawlable so crawlers can read that directive; do not rely on a robots disallow rule as a deindexing mechanism. At launch, a production sitemap/robots response may be shared by static builds across hosts, but the hostname-specific noindex header must continue excluding previews.
3. Run the full build, route/media audit, Worker type check and focused interaction/form tests. Check meaningful browser behaviour in Edge: shared menu, tabs, lightbox, Journal history, all form variants, no-JS content, reduced motion, navigation and 404. Test representative templates at 390, 768 and 1440 px; include touch-sized controls and portrait/landscape media. Restore any temporary browser viewport override.
4. Compare each template against the original at matching viewport sizes: heading scale, page margins, whitespace, card order, crops, greyscale/hover effects, overlays and footer. Inspect all routes for missing content; do not infer completeness from a successful homepage screenshot or build.
5. Push the implementation branch and verify Cloudflare's branch build/preview. Open a draft PR if useful for reviewing the complete diff. Keep `main` and the original WordPress domain unchanged until the user accepts the rebuilt preview. Avoid direct Wrangler production deploys that bypass this branch review.
6. Deliver preview URL, route coverage counts, completed checks, exact known issues and provider/launch dependencies. Update `CONTENT-EDITING.md` with concrete examples for adding an artist, artwork and Journal article through Git; include source fields, images, ordering and validation commands. A new image/price/story should not require editing template markup.

**Rollback:** branch work and preview are isolated; no production domain changes. If a branch preview lacks required runtime bindings, fix its configuration or demonstrate the documented disabled mode rather than merging to test on production.

### Phase 8 — production launch, after preview acceptance

**Depends on:** owner accepts full preview and authorizes domain cutover; provider config and content decisions settled.

1. Merge the reviewed change; verify Cloudflare's automatic `main` deployment. Record commit and Worker version for rollback.
2. Preserve/export the old WordPress site and media before decommissioning. Record current DNS and mail-related records. Ensure all necessary local media and legacy mappings are already in the deployed build.
3. Configure the intended custom domain without changing mail routing. Set approved production form origins and verify sender DNS using additive records only where necessary.
4. Enable production indexing; confirm production canonical URLs, robots, sitemap, redirects, 404 status, HTTPS, apex/www handling and the Mission anchor. Confirm branch/Workers preview hosts still carry noindex.
5. Run the authorized production email check, confirm reply behaviour and disable test modes. Check the relevant owner-approved policy/contact details.
6. If cutover fails, restore recorded domain/DNS state and the previous Worker version where needed. Keep WordPress available during validation; do not cancel its hosting as part of the build.

**This phase is a launch runbook, not authority to cut over the domain during the implementation phase.**

## 6. Acceptance requirements and risk decisions

- **Completeness:** “one template per type” is not enough; the content ledger must account for every record. The 16 pop-ups and two older artist interviews are mandatory content.
- **Visual fidelity:** retained design and responsive behaviour; fix accidental scrollbars, inaccessible controls and clear editor artifacts without inventing new branding or layouts.
- **Portability:** runtime and CI do not require the old WordPress host. Git contains all source needed to build; no media hotlinks to WordPress. External article/book/film links remain external.
- **Integrity:** prices/dimensions/artists/media and same-title variants verified individually. No checkout, inferred sold status, made-up dates or implied newsletter subscription.
- **Concurrency:** Git branch isolates site work. Browser controllers scope state per dialog/form, lock concurrent submits, and restore state on history changes. Resend idempotency limits duplicates on retries; it is not a durable guarantee beyond the provider's retention period.
- **Failure:** missing JS leaves navigation/content/image links useful. Missing/failed media uses correct dimensions/alt text. Expired verification and email outages keep the message and permit retry. Unknown paths remain genuine 404s.
- **Privacy:** no keys in Git or frontend bundles, fixed server-side recipients, no form-body logs. Contact messages go only to the configured inbox; there is no local message database or marketing list.
- **Performance:** modest per-page browser code; no full React runtime or all-site client JSON. Optimize responsive media, lazy-load below fold and dialog images, avoid duplicate video payloads. Measure obvious oversized pages before adding infrastructure such as R2.
- **Alternatives rejected:** WordPress/headless WordPress and editors conflict with the requested Git workflow; a full SSR framework/database is unnecessary for this catalogue; stripping Journal overlays would lose the original interaction; keeping overlays without real URLs would preserve a sharing/accessibility weakness; rebuilding empty plugin/demo pages would add misleading behaviour.

## 7. Documentation references checked during planning

- [Astro local content collections](https://docs.astro.build/en/guides/content-collections/) — use local build-time loaders and schemas. Recheck signatures against the installed Astro version before implementation.
- [Cloudflare selective Worker routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/) — route the API through the Worker while retaining asset-first serving elsewhere.
- [Cloudflare static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/) — apply hostname-specific noindex headers to Workers preview URLs.
- [Turnstile server verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) — validate server-side and use verification idempotency only for retries of that verification operation.
- [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys) — identical requests can reuse a key within its documented 24-hour window.

The locally captured source files are the migration evidence. They are not instructions to execute, and are not a substitute for visual verification through Edge.
