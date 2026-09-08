# Golden Earth Studio — execution checklist

Status: planned; implementation has not started. This document is the progress record for the approved plan in `IMPLEMENTATION-PLAN.md`.

## Planning evidence complete

- [x] Existing homepage architecture and deployed Git workflow inspected.
- [x] 43 public pages and 7 posts inventoried.
- [x] 16 Journal pop-up bodies captured; demo pop-up identified separately.
- [x] 9 Collective image/lightbox links identified.
- [x] Original routes, template variants and legacy handling recorded.
- [x] Actionable implementation plan and provider setup requirements written.

## Implementation

- [ ] Phase 1: refresh scope; route/media ledgers; content schemas; all content and local media populated.
- [ ] Phase 2: shared interior shell, metadata, progressive navigation/motion/dialogs; homepage regression pass.
- [ ] Phase 3: gallery tabs, 10 profiles and all 22 artwork details complete.
- [ ] Phase 4: Collective, Mission, Terms and Privacy complete.
- [ ] Phase 5: 16 Journal cards/overlays, 17 article pages, archive and legacy route handling complete.
- [ ] Phase 6: forms implemented and mock-tested; API routing/type checks pass.
- [ ] Phase 7: all-route/content/media/interaction audits pass; branch preview verified; handover docs complete.
- [ ] Rebuilt preview accepted by user.
- [ ] Phase 8: provider activation and domain cutover completed only with the required configuration/authorization.

## Coverage totals (update from the actual route ledger)

| Item | Target baseline | Completed | Evidence |
| --- | ---: | ---: | --- |
| Original records given migrate/redirect/not-found treatment | 50 | 0 | |
| Original routes retained, including homepage/archive | 40 | 1 | Existing homepage |
| Artist profiles | 10 | 0 | |
| Artwork detail pages | 22 | 0 | |
| Current Journal stories/cards | 16 | 0 | |
| Readable Journal article URLs, including archive podcast | 17 | 0 | |
| Collective lightbox entries | 9 | 0 | |
| Explicit redirects | 5 | 0 | |
| Excluded placeholder routes returning 404 | 5 | 0 | |

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

## Final handover evidence to fill in

- Branch and commit:
- Cloudflare branch preview URL and successful build:
- Build/type/route/media checks:
- Desktop/mobile reference comparisons:
- Gallery/lightbox/Journal history checks:
- Mock form tests:
- Real email test (only if authorized/configured):
- Complete route count and deviations from baseline:
- Known content questions and launch dependencies:
