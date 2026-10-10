# Golden Earth Studio — execution checklist

Status: website rebuild complete and verified on the Cloudflare version preview. This document is the progress record for the approved plan in `IMPLEMENTATION-PLAN.md`.

## Planning evidence complete

- [x] Existing homepage architecture and deployed Git workflow inspected.
- [x] 43 public pages and 7 posts inventoried.
- [x] 16 Journal pop-up bodies captured; demo pop-up identified separately.
- [x] 9 Collective image/lightbox links identified.
- [x] Original routes, template variants and legacy handling recorded.
- [x] Actionable implementation plan and provider setup requirements written.

## Implementation

- [x] Phase 1: refresh scope; route/media ledgers; content schemas; all content and local media populated.
- [x] Phase 2: shared interior shell, metadata, progressive navigation/motion/dialogs; homepage regression pass.
- [x] Phase 3: gallery tabs, 10 profiles and all 22 artwork details complete.
- [x] Phase 4: Collective, Mission, Terms and Privacy complete.
- [x] Phase 5: 16 Journal cards/overlays, 17 article pages, archive and legacy route handling complete.
- [x] Phase 6: forms implemented and mock-tested; API routing/type checks pass.
- [x] Phase 7: all-route/content/media/interaction audits pass; branch preview verified; handover docs complete.
- [ ] Rebuilt preview accepted by user.
- [ ] Phase 8: provider activation and domain cutover completed only with the required configuration/authorization.

## Coverage totals (update from the actual route ledger)

| Item | Target baseline | Completed | Evidence |
| --- | ---: | ---: | --- |
| Original records given migrate/redirect/not-found treatment | 50 | 50 | `SITE-INVENTORY.md` and `route-ledger.json` |
| Original routes retained, including homepage/archive | 40 | 40 | Built route ledger |
| Artist profiles | 10 | 10 | Astro content collection and generated routes |
| Artwork detail pages | 22 | 22 | Astro content collection and generated routes |
| Current Journal stories/cards | 16 | 16 | `/journal/` |
| Readable Journal article URLs, including archive podcast | 17 | 17 | Generated Journal routes |
| Collective lightbox entries | 9 | 9 | `collective.generated.json` |
| Explicit redirects | 5 | 5 | `public/_redirects` and runtime audit |
| Excluded placeholder routes returning 404 | 5 | 5 | Runtime audit |

Record actual routes individually in the implementation route ledger; do not use this summary table as a substitute.

## External setup ledger

| Dependency | State at planning | Required action |
| --- | --- | --- |
| GitHub private repo + Cloudflare Builds | Existing and connected | Reuse; verify branch preview and automatic build. |
| Resend account/API key | Not established in this planning pass | Supply/configure a sending key as a runtime secret. |
| Verified sender | Not established | Confirm sender/domain and add required verification records without disturbing email. |
| Destination inbox | Site displays info@goldenearthstudio.co.uk; not confirmed as test recipient | Confirm actual delivery inbox and authorization for a real test. |
| Turnstile widget | Not established | Configure site key, secret, permitted hostname(s), matching action. |
| Runtime form activation | Disabled by default in planned implementation | Keep previews disabled unless explicitly enabled for testing. |
| Legal/contact copy | Existing source has outdated/inconsistent references | Owner review before domain launch. |
| Domain cutover | Not authorized as part of planning | Review preview, then authorize production launch. |

## Milestone log

| Date | Phase | Commit | Checks/result | Remaining issue |
| --- | --- | --- | --- | --- |
| 2026-09-08 | Planning | See Git history | Source capture and implementation specification | Awaiting build approval |
| 2026-09-08 | 1 | `199b111` | 10 artists, 22 artworks, 17 Journal records, 9 Collective entries, 93 local media files | Arran source portrait unavailable |
| 2026-09-08 | 2–5 | `f97a4cb` | 58-page Astro build; all catalogue and Journal routes opened in Edge | Owner content decisions remain |
| 2026-09-08 | 6–7 | `de11725`, `5e2a4bb` | 7 Worker test groups; static and 57-route runtime audits pass locally and remotely; Cloudflare build `f725a884` and preview version `d5798811` pass | Provider activation and owner acceptance pending |

## Final handover evidence to fill in

- Branch and commit: `codex/full-site-rebuild` at website commit `5e2a4bb` (plus this checklist update).
- Cloudflare branch preview URL and successful build: `https://d5798811-golden-earth-studio.shaun-02d.workers.dev/`; Workers Build `f725a884-e8ff-41f5-84f1-3486005bdc40` passed.
- Build/type/route/media checks: Astro reports 0 errors/warnings/hints and builds 58 pages; static audit reports 57 content routes, 5 redirects, 5 explicit not-found paths and 93 local migrated assets (8,918,944 bytes).
- Desktop/mobile reference comparisons: desktop gallery, varied artist pages, artwork details, Mission, and long Journal overlay checked in Edge. Responsive rules and no-JS fallbacks were verified in shipped HTML/CSS; the Edge extension did not expose viewport emulation for a separate narrow-screen screenshot.
- Gallery/lightbox/Journal history checks: all 10 artist, 22 artwork and 17 Journal article pages opened in Edge; current and legacy Journal fragment paths resolve to the correct dialog content.
- Mock form tests: 7 test groups pass across disabled/config/error/success/idempotency/privacy cases; local disabled endpoint returns the documented 503 and email fallback message.
- Real email test (only if authorized/configured): not run; recipient, Resend and Turnstile are intentionally unconfigured.
- Complete route count and deviations from baseline: all planned routes accounted for; Arran Gregory uses a documented source-backed fallback portrait because the original upload now returns 404.
- Known content questions and launch dependencies: see `CONTENT-QUESTIONS.md` and `LAUNCH-CHECKLIST.md`.
