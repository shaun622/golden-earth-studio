# Golden Earth Studio launch checklist

The visual rebuild and form code can be reviewed while delivery stays disabled. Do not connect the custom domain until the preview is accepted.

## Contact delivery activation

- [ ] Create or select the owner-approved Resend account.
- [ ] Verify an approved sender on `goldenearthstudio.co.uk`; add only the Resend records required for sending and preserve all existing MX/mail records.
- [ ] Confirm `CONTACT_FROM` and the actual `CONTACT_TO` inbox.
- [ ] Create a Cloudflare Turnstile widget for the production hostname and review/preview hosts used for testing.
- [ ] Set build variable `PUBLIC_TURNSTILE_SITE_KEY`.
- [ ] Set Worker secrets with `wrangler secret put RESEND_API_KEY` and `wrangler secret put TURNSTILE_SECRET_KEY`.
- [ ] Set `ALLOWED_ORIGINS`, `CONTACT_FROM`, `CONTACT_TO`, and `CONTACT_ENABLED=true` in the production Worker configuration. Keep preview delivery disabled unless a specific recipient test is authorized.
- [ ] Submit one authorized test, confirm inbox receipt and Reply-To, then test an artwork enquiry and a failed/expired Turnstile path.

## Content and domain launch

- [ ] Resolve the owner decisions in `CONTENT-QUESTIONS.md`, especially the legal text and Arran portrait.
- [ ] Export/archive the WordPress site and media; record current DNS and mail records.
- [ ] Merge the accepted branch and record the deployed commit/Worker version.
- [ ] Connect apex/www without changing mail routing.
- [ ] Change the production layout default from `noindex` to `index`, while retaining the Workers preview `X-Robots-Tag: noindex` rule.
- [ ] Verify canonical URLs, sitemap, robots, five redirects, genuine 404s, HTTPS, apex/www behavior, and `/our-mission/#about`.
- [ ] Re-run build, Worker tests, route audit, browser checks, and the authorized production email check.
