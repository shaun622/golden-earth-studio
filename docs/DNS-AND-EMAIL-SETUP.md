# Golden Earth Studio DNS and email setup

Originally prepared on 10 October 2026. The DNS and deployment snapshots below record that preparation; later status takes precedence.

## Current status — 15 October 2026

The owner authorized the nameserver switch on 14 October. Cloudflare is active with `christian.ns.cloudflare.com` and `eve.ns.cloudflare.com`, and apex/www serve the rebuilt Worker over HTTPS. Titan remains the mailbox provider: its MX priorities, SPF and DKIM are intact.

Contact delivery is enabled. The approved sender is `Golden Earth Studio <info@goldenearthstudio.co.uk>` and enquiries go to `info@goldenearthstudio.co.uk`. These values and `CONTACT_ENABLED=true` are kept in `wrangler.jsonc` so Git deployments retain them. Visitors' addresses are used as Reply-To, never as the sending identity.

The first authorized tests on 15 October passed Turnstile but Resend rejected them with HTTP 403 (`domain_unverified`). The owner then explicitly authorized transferring `goldenearthstudio.co.uk` from the inaccessible original Resend team to the existing `poolmatehq` team, creating a sending-only key restricted to this domain, and storing it in the Golden Earth Worker's encrypted secret. This supersedes the earlier instruction to retain the original account. The domain transfer revoked the original team's Resend sending access; Titan mailbox service was unaffected.

The current Resend domain ID is `1a8ec67c-c07d-4da1-9d58-715f9e813a8e`, in Tokyo (`ap-northeast-1`). Ownership was proven with an additional root TXT record, and only `resend._domainkey` needed its sending value replaced; both existing sending CNAMEs remained valid. Resend confirms **Verified** for the domain and all three sending records. Receiving remains disabled. Titan MX/SPF/DKIM, MailerLite and the public email fallback are preserved.

The dedicated key is **Golden Earth Studio - Website**, ID `dd4c5336-ad0b-49bb-8e99-a161ade3f37a`, with **Sending access** limited to **goldenearthstudio.co.uk**. Its value was transferred directly from Resend's one-time display into Cloudflare's encrypted production `RESEND_API_KEY` binding without being printed, written to a file or committed. The existing `TURNSTILE_SECRET_KEY` is retained. Other Poolmate keys were not changed or revoked.

A live homepage form test from `info@goldenearthstudio.co.uk` to the owner-approved test recipient `shaun@3md.com.au` passed Turnstile and completed successfully. Resend reports **Delivered**; the test form's email address was `shaun@elitewalls.com.au` for Reply-To. The temporary recipient was restored to `info@goldenearthstudio.co.uk` immediately afterward. The Titan inbox itself has not been inspected or sent a separate test. Public setup metadata is recorded in `reference/resend-2026-10-15.json`.

Enquiry emails use a shared responsive HTML design matching the site's pale paper, muted olive, fine rules and serif typography, with a plain-text alternative. Every accepted submission sends two separate messages: the studio notification to `CONTACT_TO`, with Reply-To set to the visitor, and a confirmation copy to the visitor, with Reply-To set to `info@goldenearthstudio.co.uk`. Both include the original message, subject, contact details and any artwork context. All submitted values are escaped in HTML.

The pair is submitted through Resend's batch endpoint with one stable `ges-contact-pair/<submissionId>` idempotency key. The form reports success only when Resend acknowledges two message IDs. Existing origin restrictions and Turnstile checks run before either email is requested. No additional runtime secret or access permission is needed. The owner authorized sending both design previews to `shaun@3md.com.au`; the temporary studio test recipient must be restored to the info inbox afterward.

To move sending back later, recover the original Resend login, verify/transfer the domain into the chosen team, update its exact DKIM/sending records, and install a dedicated restricted key from that team. Verify delivery before revoking this dedicated Poolmate key or removing the Poolmate domain. Do not remove the Poolmate setup while the live Worker depends on it.

## Original preparation snapshot — 10 October 2026

The owner subsequently authorized deploying the newer Worker. [PR #3](https://github.com/shaun622/golden-earth-studio/pull/3) was merged into `main`, and Cloudflare successfully deployed commit `1fa98319ca8f0477f7848e349337d750a40f1978` as Worker version `958907dd` (100% traffic). The rebuilt site is available at [the stable Workers review URL](https://golden-earth-studio.shaun-02d.workers.dev/). Contact delivery remains disabled; this deployment does not switch public-domain traffic or nameservers.

## Staged in Cloudflare

- Free zone: `goldenearthstudio.co.uk`, status **pending**.
- Worker: `golden-earth-studio` in Shaun's existing Cloudflare account.
- Production custom domain bindings: `goldenearthstudio.co.uk` and `www.goldenearthstudio.co.uk`.
- Thirteen ordinary DNS records plus two Cloudflare-managed Worker entries are present. All ordinary records are DNS-only; the two Worker entries are proxied and managed by Cloudflare.
- Existing Titan mailbox routing, MailerLite authentication, Google verification and FTP were preserved, including their TTLs and MX priorities.
- Hostinger's nine original records and nameservers were read again and checked unchanged.

The copied Hostinger apex ALIAS initially became a Cloudflare apex CNAME. That CNAME and the copied `www` CNAME prevented Worker custom domain registration. Their names were changed to `wordpress-origin` and `wordpress-www`, preserving the original targets and TTLs for rollback, then both Worker custom domains were successfully added. This only changes the pending Cloudflare zone; Hostinger was not edited.

Cloudflare's dashboard accepted both bindings while the zone was pending. This is preparation, not evidence that the public domain serves the Worker or that its TLS certificate is ready. A read-only public NS lookup also confirmed the two Hostinger nameservers are still authoritative.

| Name | Type | Target/value | TTL | Purpose |
| --- | --- | --- | --- | --- |
| `@` | Worker | `golden-earth-studio` | Auto | New website, Cloudflare-managed |
| `www` | Worker | `golden-earth-studio` | Auto | New website, Cloudflare-managed |
| `wordpress-origin` | CNAME | `goldenearthstudio.co.uk.cdn.hstgr.net` | 300 | Preserved WordPress apex target |
| `wordpress-www` | CNAME | `www.goldenearthstudio.co.uk.cdn.hstgr.net` | 300 | Preserved WordPress www target |
| `ftp` | A | `178.16.135.99` | 1800 | Existing FTP |
| `@` | MX | `mx1.titan.email`, priority 10 | 3600 | Existing incoming email |
| `@` | MX | `mx2.titan.email`, priority 20 | 3600 | Existing incoming email |
| `@` | TXT | `v=spf1 include:_spf.mlsend.com include:spf.titan.email ~all` | 14400 | Existing Titan/MailerLite SPF |
| `@` | TXT | Existing Google verification, full value in backup | 14400 | Existing Google ownership |
| `titan1._domainkey` | TXT | Existing Titan DKIM, full public key in backup | 300 | Existing Titan email signing |
| `litesrv._domainkey` | CNAME | `litesrv._domainkey.mlsend.com` | 3600 | Existing MailerLite signing |
| `resend._domainkey` | TXT | Resend public DKIM key, full value in backup | 300 | New Resend verification |
| `rsend` | CNAME | `rsend-apne1.forge.rmta.net` | 3600 | New Resend sending |
| `send` | CNAME | `send.forge.rmta.net` | 3600 | New Resend sending |
| `_dmarc` | TXT | `v=DMARC1; p=none;` | 300 | Resend's optional monitoring policy |

## Resend

The existing `goldenearthstudio` Resend account already contained this domain. Its selected region is Tokyo (`ap-northeast-1`); it was retained. Domain ID: `bf4035ba-096d-495f-954d-03323ec00269`.

The exact three required records shown by this account's dashboard were added, plus its optional DMARC record. The two sending records are CNAMEs. Do not substitute older examples using `send` MX/TXT records.

**Verify DNS Records** was clicked once. Resend now shows **pending** / **Looking for DNS records**, as expected while Hostinger remains authoritative and does not have these new records. Check verification again after the approved nameserver switch; a long delay may require restarting verification.

Sending is selected. Receiving remains disabled. No Resend receiving MX was added, and Titan remains the mail provider. The root SPF was not replaced or duplicated.

The owner installed `RESEND_API_KEY` directly in the Worker's production runtime secrets. Its encrypted binding was confirmed in Cloudflare Settings. The value was not read, printed, copied into this repository or added as a build variable.

## Turnstile

A managed widget named **Golden Earth Studio Contact** was created on 10 October 2026. Its configured hostnames are `goldenearthstudio.co.uk` (which also covers `www` under Turnstile's subdomain rules) and the exact stable review hostname `golden-earth-studio.shaun-02d.workers.dev`. Pre-clearance is disabled. Other Workers projects and arbitrary version-preview hostnames were not added.

The widget's public site key is saved as the Cloudflare **build variable** `PUBLIC_TURNSTILE_SITE_KEY`, so Git builds embed it in the static forms. Its private verification key is installed only as the production **runtime Secret** `TURNSTILE_SECRET_KEY`. The private value was kept out of chat, files and source control. Both runtime secret bindings display **Value encrypted**.

Each form uses its own verification container and refreshes that container after success or error. Managed verification appears only when interaction is needed, using the compact size to fit narrow forms. Submitting before verification finishes gives an accessible error and keeps the email link available. The Worker validates tokens with Cloudflare Siteverify, checks the submitting hostname and requires the `contact` action before calling Resend. Eleven Worker tests pass, including rejection of missing/wrong actions without an email request. See `reference/dns-2026-10-10/turnstile.json` for the public setup metadata. A live email test remains pending; delivery stays disabled until the remaining dependencies below are complete.

## Contact form dependency

The contact-capable Worker is now deployed through GitHub and the existing Cloudflare build (`npm run build`, `npx wrangler deploy`). The former static-only runtime-secret blocker is resolved: Settings now displays **Runtime variables and secrets** with **Add variable** available. A public GET to `/api/contact` returns the expected disabled-delivery response (`503`, JSON code `contact_disabled`), and `/api/missing` returns a genuine JSON `404`. No email was sent.

To complete form activation:

1. Confirm the actual receiving inbox and choose a sender on the verified domain. A proposed sender is `Golden Earth Studio <website@goldenearthstudio.co.uk>`; this is not yet approved/configured.
2. Complete Resend domain verification after the separately approved DNS cutover. The required DNS records are already staged in Cloudflare.
3. Keep `CONTACT_ENABLED=false` until the domain verifies and the production setup is ready. Configure `CONTACT_FROM` and `CONTACT_TO` through the repository's deployment configuration so a future Git deployment retains them. `ALLOWED_ORIGINS` already contains the apex, www and exact stable Workers review origins; do not add arbitrary preview origins or enable their delivery without an approved recipient test.
4. When explicitly authorized, enable delivery and send one test to the confirmed inbox; check receipt, Reply-To, artwork context and a rejected/expired Turnstile response. No email test was sent during DNS preparation, deployment verification or Turnstile setup.

Both custom domain bindings are recorded in the deployed `wrangler.jsonc`, with `workers_dev` and `preview_urls` explicitly enabled, so future Git deployments retain the bindings and review URLs. The stable review URL remains `https://golden-earth-studio.shaun-02d.workers.dev`. The custom hostnames still await the separately approved DNS cutover.

## Prepared www redirect

A Single Redirect named `Golden Earth Studio: www to apex` is saved as an inactive draft (ID `3d2b0b3d264947b0996410df80ecce48`). Its exact condition is `(http.host eq "www.goldenearthstudio.co.uk")`; its dynamic target is `concat("https://goldenearthstudio.co.uk", http.request.uri.path)`. Status: 301. Preserve query string: checked. For example, `https://www.goldenearthstudio.co.uk/gallery/?artist=edie` should redirect to `https://goldenearthstudio.co.uk/gallery/?artist=edie`. Both HTTP and HTTPS match the hostname condition; the apex and other subdomains do not.

Automatic approval review blocked activation of the earlier wildcard version because the persistent redirect was not clearly authorized beyond domain staging and its pattern had not been clearly validated. The rule was then simplified to the exact hostname condition above. Cloudflare's form reported **Rule validation passed**, and the saved list showed **Disabled / 0 active**. Do not activate it without explicit owner approval. The draft has no effect on current traffic. After activation/cutover, verify representative HTTP/HTTPS paths and query strings; form submissions should originate from the canonical apex host.

## Validation completed

During DNS preparation, all thirteen ordinary records matched expected values, TTLs and MX priorities; both managed Worker bindings were present. Hostinger's nine records and nameservers were unchanged, and a public DNS lookup confirmed the original nameservers. `npm run build` passed with zero Astro errors/warnings; `npx wrangler deploy --dry-run` passed with delivery disabled. `verification.json` records that earlier preparation snapshot.

During the subsequently authorized deployment, the merged site passed the build, ten Worker tests, route/content audits, and Edge desktop/mobile checks. Cloudflare's preview and production builds succeeded. The stable public Workers URL passed all 72 generated page routes, five redirects and five not-found checks, plus the missing API check. Production Settings confirmed that runtime variables/secrets are now supported. `deployment.json` records the application commit, build and Worker version. No secret installation, live email test or nameserver switch was performed.

## Nameservers and eventual cutover

| State | Nameserver 1 | Nameserver 2 |
| --- | --- | --- |
| Current, unchanged | `ns1.dns-parking.com` | `ns2.dns-parking.com` |
| Assigned by Cloudflare | `christian.ns.cloudflare.com` | `eve.ns.cloudflare.com` |

Do not switch yet. When launch is approved, re-read Hostinger DNS first and copy any changes made since this snapshot. Export the WordPress website/media, confirm the accepted Git version is deployed, complete the contact dependencies, check DNSSEC/registrar DS compatibility, and verify Cloudflare's assigned nameservers have not changed. Free pending zones can be removed after 28 days, so re-check if launch is delayed.

At the approved switch, change only the registrar nameservers to the two assigned Cloudflare servers. Keep the registrar and Titan mail service. After propagation, check Cloudflare active status, both hostnames, HTTPS certificates, www canonical behavior, preserved email records and mailbox sending/receiving. Verify Resend, then enable and test the form. Complete the separate indexing/content checks in `LAUNCH-CHECKLIST.md`.

Do not cancel Hostinger hosting until WordPress backup and the new production site are confirmed. A rollback can restore the original nameservers, or restore the two Hostinger website targets within Cloudflare while retaining the copied email records. Renamed rollback records preserve values; they do not make WordPress serve those alternative hostnames automatically.

## Backups and evidence

The files under `docs/reference/dns-2026-10-10/` contain public DNS data only:

- `hostinger-records.json`: original nine records and unchanged original nameservers.
- `resend-records.json`: exact three required records and optional DMARC, with the full public DKIM key.
- `cloudflare-records.json`: final thirteen ordinary records and two managed Worker entries.
- `cloudflare-staged.zone`: portable ordinary records in BIND format. **Worker bindings are not included in the import format and must be recreated through Workers Domains.**
- `verification.json`: value, TTL, priority and DNS-only comparisons; nameserver and Resend status.
- `deployment.json`: subsequent successful contact-capable Worker deployment and public-runtime verification.
- Screenshots: `cloudflare-dns.jpg`, `cloudflare-domains.jpg`, `hostinger-unchanged.jpg`, `resend-pending.jpg`, `runtime-secret-blocker.jpg`, `www-redirect-prepared.jpg`, `www-redirect-draft.jpg`.

Sources: [Cloudflare custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [Wrangler route management](https://developers.cloudflare.com/workers/wrangler/configuration/), [Cloudflare pending zones](https://developers.cloudflare.com/dns/zone-setups/reference/domain-status/), [Resend with Cloudflare DNS](https://resend.com/docs/guides/dns/cloudflare).

Turnstile references: [Hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/), [Widget configurations](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/), [Server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
