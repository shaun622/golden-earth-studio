import assert from "node:assert/strict";
import test from "node:test";
import { handleContact } from "./contact.ts";

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
      : Response.json({ id: "email-id" });
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
  assert.equal(new Headers(firstEmail?.init?.headers).get("Idempotency-Key"), `ges-contact/${submissionId}`);
  assert.equal(new Headers(secondEmail?.init?.headers).get("Idempotency-Key"), `ges-contact/${submissionId}`);
  const sent = JSON.parse(String(firstEmail?.init?.body));
  assert.deepEqual(sent.to, ["inbox@example.com"]); assert.equal(sent.reply_to, "ada@example.com");
  assert.match(sent.subject, /Chess Set by Jacob Chan/); assert.doesNotMatch(sent.text, /test-key|test-secret/);
});

test("structured error logs do not include submitted private content", async () => {
  const messages: string[] = [];
  const original = console.error;
  console.error = (message) => messages.push(String(message));
  try { await handleContact(request(payload({ email: "private@example.com", message: "secret words", turnstileToken: "" })), enabledEnv); }
  finally { console.error = original; }
  assert.equal(messages.length, 1); assert.doesNotMatch(messages[0], /private@example|secret words/);
});
