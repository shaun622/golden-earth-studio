# Golden Earth Studio launch checklist

The rebuilt site is live on the public domain and stable Workers URL following the owner-authorized nameserver switch on 14 October 2026. Cloudflare is active and Titan still hosts incoming email. Contact delivery is enabled using the owner-approved temporary Poolmate Resend setup. A live form test to Shaun was delivered. See `DNS-AND-EMAIL-SETUP.md` for current status and the dated preparation snapshot.

## Contact delivery activation

- [x] With explicit owner approval, transfer the domain to the existing `poolmatehq` Resend team as a temporary setup.
- [x] Publish the exact Resend ownership/signing records in Cloudflare; retain Titan mail routing and MailerLite authentication. Resend confirms the domain and all sending records are verified.
- [x] Verify the approved sender `Golden Earth Studio <info@goldenearthstudio.co.uk>` and preserve all existing MX/mail records.
- [x] Deploy the contact-capable Worker through Git; Cloudflare's main build succeeded and runtime variables/secrets are available.
- [x] Confirm `CONTACT_FROM` and the actual `CONTACT_TO` inbox: the owner approved `Golden Earth Studio <info@goldenearthstudio.co.uk>` and delivery to `info@goldenearthstudio.co.uk` on 15 October.
- [x] Create a managed Cloudflare Turnstile widget for the production domain and exact stable Workers review hostname, with pre-clearance disabled.
- [x] Set Cloudflare build variable `PUBLIC_TURNSTILE_SITE_KEY` so Git builds embed verification in the forms.
- [x] Replace production `RESEND_API_KEY` with a dedicated Poolmate sending-only key restricted to Golden Earth; retain `TURNSTILE_SECRET_KEY` and confirm encrypted bindings. No key value is stored in the repository.
- [x] Set `ALLOWED_ORIGINS`, `CONTACT_FROM`, `CONTACT_TO`, and `CONTACT_ENABLED=true` in the production Worker configuration. The temporary test recipient was restored to the approved info inbox. Arbitrary version-preview hosts remain outside the origin/Turnstile allowlists.
- [x] The owner-authorized live homepage form test to `shaun@3md.com.au` succeeded and Resend reports Delivered. Sender: info; form email/Reply-To: `shaun@elitewalls.com.au`. No separate Titan-inbox test was sent; artwork context and verification failures are covered by mocked Worker tests.

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
