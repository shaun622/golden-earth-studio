import catalogue from "./catalogue.generated.ts";
import { createEnquiryEmails } from "./email-templates.ts";
import { ContactError, readJsonBody, validatePayload, type ContactPayload } from "./validation.ts";

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type TurnstileResult = { success?: boolean; hostname?: string; action?: string; "error-codes"?: string[] };

const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: jsonHeaders });

function configuredOrigins(value: string) {
  return new Set(value.split(",").map((origin) => origin.trim()).filter(Boolean));
}

async function verifyTurnstile(payload: ContactPayload, env: Env, origin: string, fetcher: Fetcher, request: Request) {
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: payload.turnstileToken, idempotency_key: payload.submissionId });
  const address = request.headers.get("CF-Connecting-IP");
  if (address) body.set("remoteip", address);
  let response: Response;
  try {
    response = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(6000) });
  } catch { throw new ContactError(502, "verification_unavailable", "Verification is temporarily unavailable. Please try again."); }
  if (!response.ok) throw new ContactError(502, "verification_unavailable", "Verification is temporarily unavailable. Please try again.");
  const result = await response.json() as TurnstileResult;
  if (!result.success) {
    const expired = result["error-codes"]?.some((code) => code === "timeout-or-duplicate");
    throw new ContactError(400, expired ? "verification_expired" : "verification_failed", expired ? "Verification expired. Please try again." : "Verification failed. Please try again.");
  }
  const expectedHostname = new URL(origin).hostname;
  if (result.hostname !== expectedHostname || result.action !== "contact") throw new ContactError(400, "verification_mismatch", "Verification did not match this website.");
}

async function sendEmail(payload: ContactPayload, env: Env, origin: string, fetcher: Fetcher) {
  const emails = createEnquiryEmails(payload, origin, { from: env.CONTACT_FROM, to: env.CONTACT_TO });
  let response: Response;
  try {
    response = await fetcher("https://api.resend.com/emails/batch", {
      method: "POST", signal: AbortSignal.timeout(8000),
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json", "Idempotency-Key": `ges-contact-pair/${payload.submissionId}` },
      body: JSON.stringify(emails),
    });
  } catch { throw new ContactError(502, "email_uncertain", "Delivery could not be confirmed. Please wait before retrying or use the email link."); }
  if (!response.ok) {
    let reason = "unknown";
    try {
      const error = await response.json() as { name?: unknown; message?: unknown };
      const message = typeof error.message === "string" ? error.message : "";
      if (/domain.*not verified/i.test(message)) reason = "domain_unverified";
      else if (/api key.*invalid|invalid.*api key/i.test(message)) reason = "invalid_api_key";
      else if (["missing_api_key", "restricted_api_key", "suspended_api_key", "invalid_permission", "daily_quota_exceeded", "monthly_quota_exceeded", "rate_limit_exceeded", "validation_error"].includes(String(error.name))) reason = String(error.name);
    } catch { /* Provider error bodies are optional; never log their raw content. */ }
    console.error(JSON.stringify({ event: "contact_email_rejected", providerStatus: response.status, reason }));
    throw new ContactError(502, "email_rejected", "Email delivery is temporarily unavailable. Please use the email link.");
  }
  const result = await response.json().catch(() => null) as { data?: Array<{ id?: unknown }> } | null;
  if (!Array.isArray(result?.data) || result.data.length !== emails.length || result.data.some(email => !email || typeof email.id !== "string" || !email.id)) {
    throw new ContactError(502, "email_uncertain", "Delivery could not be confirmed. Please wait before retrying or use the email link.");
  }
}

export async function handleContact(request: Request, env: Env, fetcher: Fetcher = fetch): Promise<Response> {
  try {
    if (env.CONTACT_ENABLED !== "true") throw new ContactError(503, "contact_disabled", "Online delivery is not active yet. Please use the email link.");
    if (request.method !== "POST") return new Response(null, { status: 405, headers: { allow: "POST", ...jsonHeaders } });
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new ContactError(415, "unsupported_media_type", "The form must be sent as JSON.");
    if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY || !env.CONTACT_FROM || !env.CONTACT_TO || !env.ALLOWED_ORIGINS) throw new ContactError(503, "contact_unconfigured", "Online delivery is not configured. Please use the email link.");
    const origin = request.headers.get("origin") || "";
    if (!configuredOrigins(env.ALLOWED_ORIGINS).has(origin)) throw new ContactError(403, "origin_denied", "This form cannot be submitted from that origin.");
    const input = await readJsonBody(request);
    const payload = validatePayload(input, catalogue);
    await verifyTurnstile(payload, env, origin, fetcher, request);
    await sendEmail(payload, env, origin, fetcher);
    return json({ ok: true });
  } catch (error) {
    const known = error instanceof ContactError ? error : new ContactError(500, "internal_error", "Something went wrong. Please use the email link.");
    console.error(JSON.stringify({ event: "contact_error", code: known.code, status: known.status }));
    return json({ ok: false, code: known.code, message: known.message }, known.status);
  }
}
