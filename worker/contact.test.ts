import assert from "node:assert/strict";
import test from "node:test";
import { handleContact } from "./contact.ts";
import catalogue from "./catalogue.generated.ts";

const submissionId = "123e4567-e89b-42d3-a456-426614174000";
const enabledEnv = {
  CONTACT_ENABLED: "true", CONTACT_FROM: "Studio <site@example.com>", CONTACT_TO: "inbox@example.com",
  ALLOWED_ORIGINS: "https://goldenearthstudio.co.uk", RESEND_API_KEY: "test-key", TURNSTILE_SECRET_KEY: "test-secret",
} as Env;

function payload(overrides: Record<string, unknown> = {}) {
  return { variant: "general", firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", subject: "Hello", message: "A private message", sourcePath: "/", submissionId, turnstileToken: "token", ...overrides };
}

function request(body: unknown = payload(), init: RequestInit = {}) {
  return new Request("https://goldenearthstudio.co.uk/api/contact", {
    method: "POST", headers: { origin: "https://goldenearthstudio.co.uk", "content-type": "application/json", ...(init.headers || {}) },
    body: JSON.stringify(body), ...init,
  });
}

function successfulFetch(calls: Array<{ url: string; init?: RequestInit }> = []) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input); calls.push({ url, init });
    return url.includes("siteverify")
      ? Response.json({ success: true, hostname: "goldenearthstudio.co.uk", action: "contact" })
      : Response.json({ data: [{ id: "studio-email-id" }, { id: "confirmation-email-id" }] });
  };
}

async function responseBody(response: Response) {
  return await response.json() as { code?: string };
}

test("disabled mode returns a mailto-friendly 503 without upstream calls", async () => {
  let calls = 0;
  const response = await handleContact(request(), { ...enabledEnv, CONTACT_ENABLED: "false" }, async () => { calls++; return new Response(); });
  assert.equal(response.status, 503); assert.equal(calls, 0); assert.equal((await responseBody(response)).code, "contact_disabled");
});

test("rejects unsupported methods, media types, origins and absent configuration", async () => {
  assert.equal((await handleContact(new Request("https://goldenearthstudio.co.uk/api/contact", { method: "GET" }), enabledEnv)).status, 405);
  assert.equal((await handleContact(request(payload(), { headers: { origin: "https://goldenearthstudio.co.uk", "content-type": "text/plain" } }), enabledEnv)).status, 415);
  assert.equal((await handleContact(request(payload(), { headers: { origin: "https://attacker.example", "content-type": "application/json" } }), enabledEnv)).status, 403);
  assert.equal((await handleContact(request(), { ...enabledEnv, RESEND_API_KEY: "" })).status, 503);
});

test("rejects invalid fields, unknown artwork and oversized declared or streamed bodies", async () => {
  assert.equal((await handleContact(request(payload({ email: "bad" })), enabledEnv)).status, 400);
  assert.equal((await handleContact(request(payload({ variant: "artwork", artworkId: "missing/work" })), enabledEnv)).status, 400);
  const declared = request(payload(), { headers: { origin: "https://goldenearthstudio.co.uk", "content-type": "application/json", "content-length": "20000" } });
  assert.equal((await handleContact(declared, enabledEnv)).status, 413);
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(17000)); controller.close(); } });
  const streamed = new Request("https://goldenearthstudio.co.uk/api/contact", { method: "POST", headers: { origin: "https://goldenearthstudio.co.uk", "content-type": "application/json" }, body: stream, duplex: "half" } as RequestInit);
  assert.equal((await handleContact(streamed, enabledEnv)).status, 413);
});

test("handles failed, expired and hostname-mismatched verification", async () => {
  const failed = async () => Response.json({ success: false, "error-codes": ["invalid-input-response"] });
  const expired = async () => Response.json({ success: false, "error-codes": ["timeout-or-duplicate"] });
  const mismatch = async () => Response.json({ success: true, hostname: "other.example", action: "contact" });
  assert.equal((await responseBody(await handleContact(request(), enabledEnv, failed))).code, "verification_failed");
  assert.equal((await responseBody(await handleContact(request(), enabledEnv, expired))).code, "verification_expired");
  assert.equal((await responseBody(await handleContact(request(), enabledEnv, mismatch))).code, "verification_mismatch");
});

test("verification for another action or without an action never sends an email", async () => {
  for (const action of ["login", undefined]) {
    let calls = 0;
    const verify = async () => {
      calls++;
      return Response.json({ success: true, hostname: "goldenearthstudio.co.uk", action });
    };
    const response = await handleContact(request(), enabledEnv, verify);
    assert.equal((await responseBody(response)).code, "verification_mismatch");
    assert.equal(calls, 1);
  }
});

test("returns no success when Resend rejects or an upstream request throws", async () => {
  let call = 0;
  const rejected = async () => ++call === 1 ? Response.json({ success: true, hostname: "goldenearthstudio.co.uk", action: "contact" }) : Response.json({ error: "no" }, { status: 500 });
  assert.equal((await handleContact(request(), enabledEnv, rejected)).status, 502);
  assert.equal((await handleContact(request(), enabledEnv, async () => { throw new Error("timeout"); })).status, 502);
});

test("sends valid forms with fixed routing and stable retry idempotency", async () => {
  const firstCalls: Array<{ url: string; init?: RequestInit }> = [];
  const secondCalls: Array<{ url: string; init?: RequestInit }> = [];
  assert.equal((await handleContact(request(payload({ variant: "artwork", artworkId: "jacob-chan/chess-set" })), enabledEnv, successfulFetch(firstCalls))).status, 200);
  assert.equal((await handleContact(request(), enabledEnv, successfulFetch(secondCalls))).status, 200);
  const firstEmail = firstCalls.find((call) => call.url.includes("resend"));
  const secondEmail = secondCalls.find((call) => call.url.includes("resend"));
  assert.equal(firstEmail?.url, "https://api.resend.com/emails/batch");
  assert.equal(new Headers(firstEmail?.init?.headers).get("Idempotency-Key"), `ges-contact-pair/${submissionId}`);
  assert.equal(new Headers(secondEmail?.init?.headers).get("Idempotency-Key"), `ges-contact-pair/${submissionId}`);
  const [sent, confirmation] = JSON.parse(String(firstEmail?.init?.body));
  assert.deepEqual(sent.to, ["inbox@example.com"]); assert.equal(sent.reply_to, "ada@example.com");
  assert.match(sent.subject, /Chess Set by Jacob Chan/); assert.doesNotMatch(sent.text, /test-key|test-secret/);
  assert.deepEqual(confirmation.to, ["ada@example.com"]);
  assert.equal(confirmation.from, enabledEnv.CONTACT_FROM);
  assert.equal(confirmation.reply_to, "info@goldenearthstudio.co.uk");
  assert.equal(confirmation.subject, "Your enquiry — Golden Earth Studio");
  assert.match(confirmation.text, /Chess Set by Jacob Chan/);
  assert.ok(confirmation.text.includes("A private message"));
  assert.equal(confirmation.cc, undefined); assert.equal(confirmation.bcc, undefined);
  assert.equal(sent.cc, undefined); assert.equal(sent.bcc, undefined);
});

test("structured error logs do not include submitted private content", async () => {
  const messages: string[] = [];
  const original = console.error;
  console.error = (message) => messages.push(String(message));
  try { await handleContact(request(payload({ email: "private@example.com", message: "secret words", turnstileToken: "" })), enabledEnv); }
  finally { console.error = original; }
  assert.equal(messages.length, 1); assert.doesNotMatch(messages[0], /private@example|secret words/);
});

test("provider rejection diagnostics classify setup failures without leaking provider content", async () => {
  const messages: string[] = [];
  const original = console.error;
  console.error = (message) => messages.push(String(message));
  try {
    for (const [message, reason] of [
      ["The goldenearthstudio.co.uk domain is not verified. private@example.com", "domain_unverified"],
      ["API key is invalid: test-key", "invalid_api_key"],
      ["Unexpected error containing secret words", "unknown"],
    ]) {
      const fetcher: typeof fetch = async (input) => String(input).includes("siteverify")
        ? Response.json({ success: true, hostname: "goldenearthstudio.co.uk", action: "contact" })
        : Response.json({ name: "unrecognized private content", message }, { status: 403 });
      const response = await handleContact(request(), enabledEnv, fetcher);
      assert.equal(response.status, 502);
      assert.equal((await responseBody(response)).code, "email_rejected");
      assert.deepEqual(JSON.parse(messages.at(-2)!), { event: "contact_email_rejected", providerStatus: 403, reason });
    }
  } finally { console.error = original; }
  assert.doesNotMatch(messages.join("\n"), /private@example|secret words|test-key|unrecognized private/);
});

test("three-field commissions work without a name and escape submitted HTML", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const body = payload({ variant: "commission", firstName: "", lastName: "", message: "<script>private</script>", subject: "" });
  assert.equal((await handleContact(request(body), enabledEnv, successfulFetch(calls))).status, 200);
  const [email, confirmation] = JSON.parse(String(calls.find((call) => call.url.includes("resend"))?.init?.body));
  assert.equal(email.subject, "Bespoke commission enquiry");
  assert.doesNotMatch(email.text, /Name:/);
  assert.match(email.html, /&lt;script&gt;private&lt;\/script&gt;/);
  assert.doesNotMatch(email.html, /<script>/);
  assert.doesNotMatch(confirmation.text, /Name:/);
  assert.match(confirmation.html, /&lt;script&gt;private&lt;\/script&gt;/);
  assert.doesNotMatch(confirmation.html, /<script>/);
  for (const overrides of [{ email: "" }, { email: "invalid" }, { message: "" }]) {
    const response = await handleContact(request({ ...body, ...overrides }), enabledEnv);
    assert.equal(response.status, 400);
  }
});

test("general, compact and artwork forms still require a name", async () => {
  for (const variant of ["general", "compact", "artwork"]) {
    const response = await handleContact(request(payload({ variant, firstName: "", lastName: "", artworkId: "jacob-chan/chess-set" })), enabledEnv);
    assert.equal(response.status, 400);
    assert.equal((await responseBody(response)).code, "invalid_name");
  }
});

test("new artist catalogue IDs route enquiries to their authoritative titles", async () => {
  const entries = Object.entries(catalogue).filter(([id]) => /^(james-galbraith-kirkpatrick|edie-evans|lucia-ocejo)\//.test(id));
  assert.equal(entries.length, 11);
  for (const [artworkId, artwork] of entries) {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const response = await handleContact(request(payload({ variant: "artwork", artworkId, subject: "untrusted title" })), enabledEnv, successfulFetch(calls));
    assert.equal(response.status, 200, artworkId);
    const [email, confirmation] = JSON.parse(String(calls.find((call) => call.url.includes("resend"))?.init?.body));
    assert.equal(email.subject, `Artwork enquiry: ${artwork.title} by ${artwork.artist}`);
    assert.ok(email.text.includes(`Artwork: ${artwork.title} by ${artwork.artist}`));
    assert.ok(confirmation.text.includes(`Artwork: ${artwork.title} by ${artwork.artist}`));
  }
});

test("both messages stay separate when studio and sender share the test inbox", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const response = await handleContact(request(payload({ email: "inbox@example.com" })), enabledEnv, successfulFetch(calls));
  assert.equal(response.status, 200);
  const emails = JSON.parse(String(calls.find(call => call.url.includes("resend"))?.init?.body));
  assert.equal(emails.length, 2);
  assert.deepEqual(emails.map((email: { to: string[] }) => email.to), [["inbox@example.com"], ["inbox@example.com"]]);
  assert.notEqual(emails[0].subject, emails[1].subject);
});

test("does not report success until Resend acknowledges both messages", async () => {
  for (const result of [{}, { data: [{ id: "only-one" }] }, { data: [{ id: "one" }, {}] }, { data: null }]) {
    const fetcher = async (input: RequestInfo | URL) => String(input).includes("siteverify")
      ? Response.json({ success: true, hostname: "goldenearthstudio.co.uk", action: "contact" })
      : Response.json(result);
    const response = await handleContact(request(), enabledEnv, fetcher);
    assert.equal(response.status, 502);
    assert.equal((await responseBody(response)).code, "email_uncertain");
  }
});

test("styled copies escape submitted content and preserve message line breaks", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const body = payload({ name: '<img src=x onerror="alert(1)">', subject: '<em>Subject & test</em>', message: 'First line\n<script>alert("private")</script>\nLast line', sourcePath: '/\\attacker.example/' });
  const response = await handleContact(request(body), enabledEnv, successfulFetch(calls));
  assert.equal(response.status, 200);
  const emails = JSON.parse(String(calls.find(call => call.url.includes("resend"))?.init?.body));
  for (const email of emails) {
    assert.match(email.html, /First line<br \/>&lt;script&gt;/);
    assert.match(email.html, /&lt;img src=x onerror=&quot;/);
    assert.match(email.html, /&lt;em&gt;Subject &amp; test&lt;\/em&gt;/);
    assert.doesNotMatch(email.html, /<script>|<img src=x|href="https:\/\/attacker/);
    assert.ok(email.text.includes(body.message));
    assert.match(email.html, /max-width:600px/);
  }
});
