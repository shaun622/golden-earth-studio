# Golden Earth Studio launch checklist

The visual rebuild and form code are deployed at the stable Workers review URL while delivery stays disabled. On 10 October 2026, the owner authorized domain/DNS preparation without a nameserver switch, then authorized deploying the newer Worker. Both Worker custom domains and the copied email/service records are staged in a pending Cloudflare Free zone. Hostinger remains authoritative and the live WordPress site is unchanged. See `DNS-AND-EMAIL-SETUP.md` for records, deployment evidence and remaining dependencies.

## Contact delivery activation

- [x] Select the owner's existing `goldenearthstudio` Resend account and domain.
- [x] Stage the three exact Resend sending/verification records and optional DMARC in Cloudflare; retain Titan mail routing and MailerLite authentication. Start verification (currently pending).
- [ ] Verify an approved sender on `goldenearthstudio.co.uk`; add only the Resend records required for sending and preserve all existing MX/mail records.
- [x] Deploy the contact-capable Worker through Git; Cloudflare's main build succeeded and runtime variables/secrets are available.
- [ ] Confirm `CONTACT_FROM` and the actual `CONTACT_TO` inbox.
- [x] Create a managed Cloudflare Turnstile widget for the production domain and exact stable Workers review hostname, with pre-clearance disabled.
- [x] Set Cloudflare build variable `PUBLIC_TURNSTILE_SITE_KEY` so Git builds embed verification in the forms.
- [x] Set production runtime secrets `RESEND_API_KEY` (owner entry) and `TURNSTILE_SECRET_KEY`; confirm encrypted bindings in Cloudflare.
- [ ] Set `ALLOWED_ORIGINS`, `CONTACT_FROM`, `CONTACT_TO`, and `CONTACT_ENABLED=true` in the production Worker configuration. Keep preview delivery disabled unless a specific recipient test is authorized.
- [ ] Submit one authorized test, confirm inbox receipt and Reply-To, then test an artwork enquiry and a failed/expired Turnstile path.

## Content and domain launch

- [ ] Resolve the owner decisions in `CONTENT-QUESTIONS.md`, especially the legal text and Arran portrait.
- [x] Record current DNS and mail records, copy them to Cloudflare, and verify original Hostinger records/nameservers unchanged (10 October snapshot).
- [ ] Reconcile any DNS changes since the snapshot before cutover.
- [ ] Export/archive the WordPress site and media.
- [x] Merge the accepted branch and record the deployed application commit/Worker version (PR #3, commit `1fa9831`, Worker version `958907dd`; see `docs/reference/dns-2026-10-10/deployment.json`).
- [x] Stage apex/www Worker custom domain bindings without changing authoritative nameservers or mail routing.
- [x] Record both custom domain bindings and enabled Workers review URLs in `wrangler.jsonc` for the next Git deployment.
- [ ] Approve and activate the prepared www-to-apex redirect draft (automatic approval review blocked activation).
- [ ] Verify www-to-apex canonical behavior before launch.
- [ ] At owner-approved cutover only: check DNSSEC/DS, re-confirm assigned Cloudflare nameservers, and switch registrar nameservers. Confirm Cloudflare active status, certificates and unchanged mailbox sending/receiving.
- [ ] Change the production layout default from `noindex` to `index`, while retaining the Workers preview `X-Robots-Tag: noindex` rule.
- [ ] Verify canonical URLs, sitemap, robots, five redirects, genuine 404s, HTTPS, apex/www behavior, and `/our-mission/#about`.
- [ ] Re-run build, Worker tests, route audit, browser checks, and the authorized production email check.
