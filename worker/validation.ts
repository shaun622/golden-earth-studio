export const MAX_BODY_BYTES = 16 * 1024;

export type ContactPayload = {
  variant: "general" | "compact" | "commission" | "artwork";
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  artworkId?: string;
  sourcePath: string;
  submissionId: string;
  turnstileToken: string;
};

export class ContactError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function stringField(input: Record<string, unknown>, key: string, max: number, required = true) {
  const value = typeof input[key] === "string" ? input[key].trim() : "";
  if (required && !value) throw new ContactError(400, `invalid_${key}`, `Please provide ${key}.`);
  if (value.length > max) throw new ContactError(400, `invalid_${key}`, `${key} is too long.`);
  return value;
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) throw new ContactError(413, "payload_too_large", "Your message is too large.");
  if (!request.body) throw new ContactError(400, "empty_body", "Please provide a message.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new ContactError(413, "payload_too_large", "Your message is too large.");
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(body));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("object required");
    return parsed as Record<string, unknown>;
  } catch {
    throw new ContactError(400, "invalid_json", "The form data could not be read.");
  }
}

export function validatePayload(input: Record<string, unknown>, catalogue: Readonly<Record<string, { title: string; artist: string }>>): ContactPayload {
  const variant = stringField(input, "variant", 20) as ContactPayload["variant"];
  if (!["general", "compact", "commission", "artwork"].includes(variant)) throw new ContactError(400, "invalid_variant", "Unknown form type.");
  const firstName = stringField(input, "firstName", 80, false);
  const lastName = stringField(input, "lastName", 80, false);
  const name = stringField(input, "name", 120, false) || `${firstName} ${lastName}`.trim();
  if (!name) throw new ContactError(400, "invalid_name", "Please provide your name.");
  const email = stringField(input, "email", 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ContactError(400, "invalid_email", "Please provide a valid email address.");
  const phone = stringField(input, "phone", 40, false) || undefined;
  const message = stringField(input, "message", 4000);
  const sourcePath = stringField(input, "sourcePath", 300);
  if (!sourcePath.startsWith("/") || sourcePath.startsWith("//")) throw new ContactError(400, "invalid_source", "Unknown source page.");
  const submissionId = stringField(input, "submissionId", 64);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) throw new ContactError(400, "invalid_submission", "Please refresh the page and try again.");
  const turnstileToken = stringField(input, "turnstileToken", 2048);
  let artworkId: string | undefined;
  let subject = stringField(input, "subject", 160, false) || "Website enquiry";
  if (variant === "artwork") {
    artworkId = stringField(input, "artworkId", 160);
    const artwork = catalogue[artworkId];
    if (!artwork) throw new ContactError(400, "unknown_artwork", "This artwork could not be identified.");
    subject = `Artwork enquiry: ${artwork.title} by ${artwork.artist}`;
  }
  if (variant === "commission" && subject === "Website enquiry") subject = "Bespoke commission enquiry";
  return { variant, name, email, phone, subject, message, artworkId, sourcePath, submissionId, turnstileToken };
}
