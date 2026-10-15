import { site } from "../src/data/site.ts";
import catalogue from "./catalogue.generated.ts";
import type { ContactPayload } from "./validation.ts";

export type EnquiryEmail = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
  headers?: Record<string, string>;
};

const colours = { paper: "#f2f2f2", card: "#faf9f6", ink: "#595952", olive: "#8a887f", line: "#d9d8d1" };
const serif = "Georgia, 'Times New Roman', serif";
const sans = "'Gill Sans', 'Segoe UI', Arial, sans-serif";
const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
const multiline = (value: string) => escape(value).replace(/\r\n|\r|\n/g, "<br />");

function sourceLink(path: string) {
  try {
    const url = new URL(path, site.url);
    return url.origin === new URL(site.url).origin ? url.href : site.url;
  } catch { return site.url; }
}

function detail(label: string, value: string) {
  return `<tr><td style="padding:14px 0;border-bottom:1px solid ${colours.line};word-break:break-word;overflow-wrap:anywhere;">
    <div style="margin:0 0 5px;font:11px/1.5 ${sans};letter-spacing:1.5px;text-transform:uppercase;">${escape(label)}</div>
    <div style="font:16px/1.6 ${sans};">${escape(value)}</div>
  </td></tr>`;
}

function template(options: { kind: string; title: string; introduction: string; preheader: string; details: string; message: string; actionLabel: string; actionUrl: string; footnote: string }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><meta name="color-scheme" content="light" /><title>${escape(options.title)} — ${site.name}</title>
<style>@media screen and (max-width:620px){.email-pad{padding-left:24px!important;padding-right:24px!important}.email-title{font-size:30px!important}.email-shell{padding-top:16px!important;padding-bottom:16px!important}}</style></head>
<body style="margin:0;padding:0;background:${colours.paper};color:${colours.ink};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;">${escape(options.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colours.paper};"><tr><td class="email-shell" align="center" style="padding:40px 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;table-layout:fixed;background:${colours.card};border-top:4px solid ${colours.olive};">
<tr><td class="email-pad" style="padding:34px 40px 28px;border-bottom:1px solid ${colours.line};">
  <a href="${site.url}/" style="color:${colours.ink};font:27px/1.3 ${serif};text-decoration:none;">Golden Earth <em>Studio</em></a>
  <p style="margin:10px 0 0;font:11px/1.5 ${sans};letter-spacing:1.6px;text-transform:uppercase;">Art for the Anthropocene</p>
</td></tr>
<tr><td class="email-pad" style="padding:36px 40px 14px;">
  <p style="margin:0 0 16px;font:11px/1.5 ${sans};letter-spacing:1.7px;text-transform:uppercase;">${escape(options.kind)}</p>
  <h1 class="email-title" style="margin:0 0 22px;font:400 36px/1.18 ${serif};letter-spacing:-.5px;">${escape(options.title)}</h1>
  <p style="margin:0;font:16px/1.75 ${sans};">${escape(options.introduction)}</p>
</td></tr>
<tr><td class="email-pad" style="padding:10px 40px 28px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed;">${options.details}</table>
</td></tr>
<tr><td class="email-pad" style="padding:0 40px 30px;">
  <p style="margin:0 0 12px;font:11px/1.5 ${sans};letter-spacing:1.5px;text-transform:uppercase;">Message</p>
  <div style="padding:22px 24px;border-left:2px solid ${colours.olive};background:${colours.paper};font:17px/1.8 ${serif};word-break:break-word;overflow-wrap:anywhere;">${multiline(options.message)}</div>
</td></tr>
<tr><td class="email-pad" style="padding:0 40px 32px;">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${colours.ink};border:1px solid ${colours.ink};mso-padding-alt:14px 22px;">
    <a href="${escape(options.actionUrl)}" style="display:inline-block;padding:14px 22px;color:${colours.paper};font:16px/1.3 ${serif};text-decoration:none;">${escape(options.actionLabel)}</a>
  </td></tr></table>
  <p style="margin:20px 0 0;font:13px/1.7 ${sans};word-break:break-word;overflow-wrap:anywhere;">${escape(options.footnote)}</p>
</td></tr>
<tr><td class="email-pad" style="padding:24px 40px 28px;border-top:1px solid ${colours.line};">
  <p style="margin:0 0 10px;font:16px/1.5 ${serif};">Golden Earth <em>Studio</em></p>
  <p style="margin:0;font:12px/1.8 ${sans};"><a href="mailto:${site.email}" style="color:${colours.ink};text-decoration:underline;">${site.email}</a><br />
  <a href="${site.url}/" style="color:${colours.ink};text-decoration:underline;">goldenearthstudio.co.uk</a><br /><em>Established 2022</em></p>
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
}

export function createEnquiryEmails(payload: ContactPayload, origin: string, routing: { from: string; to: string }): [EnquiryEmail, EnquiryEmail] {
  const artwork = payload.artworkId ? catalogue[payload.artworkId as keyof typeof catalogue] : null;
  const artworkDescription = artwork ? `${artwork.title} by ${artwork.artist}` : "";
  const facts = [
    ...(payload.name ? [["Name", payload.name]] : []),
    ["Email", payload.email],
    ...(payload.phone ? [["Phone", payload.phone]] : []),
    ...(artwork ? [["Artwork", artworkDescription]] : []),
    ["Subject", payload.subject],
  ];
  const details = facts.map(([label, value]) => detail(label, value)).join("");
  const textDetails = facts.map(([label, value]) => `${label}: ${value}`).join("\n");
  const contactFooter = `${site.name}\n${site.email}\n${site.url}`;
  const studio: EnquiryEmail = {
    from: routing.from, to: [routing.to], reply_to: payload.email, subject: payload.subject,
    text: `${site.name}\nNew website enquiry\n\n${textDetails}\nSource: ${origin}${payload.sourcePath}\n\nMessage:\n${payload.message}\n\nReply to ${payload.email}\n\n${contactFooter}`,
    html: template({
      kind: artwork ? "Artwork enquiry" : payload.variant === "commission" ? "Bespoke commission enquiry" : "Studio enquiry",
      title: "A new enquiry.",
      introduction: "A new message has arrived through the Golden Earth Studio website. The enquiry details are below.",
      preheader: `A new enquiry${payload.name ? ` from ${payload.name}` : ""}: ${payload.subject}`,
      details, message: payload.message, actionLabel: "Reply to enquiry",
      actionUrl: `mailto:${encodeURIComponent(payload.email)}?subject=${encodeURIComponent(`Re: ${payload.subject}`)}`,
      footnote: `Sent from ${sourceLink(payload.sourcePath)}. Reply to this email to get in touch with the sender.`,
    }),
  };
  const confirmation: EnquiryEmail = {
    from: routing.from, to: [payload.email], reply_to: site.email,
    subject: `Your enquiry — ${site.name}`,
    headers: { "Auto-Submitted": "auto-generated", "X-Auto-Response-Suppress": "All" },
    text: `${site.name}\nThank you for getting in touch.\n\nWe have received your message. Here is a copy for your records. We will be in touch about your enquiry.\n\n${textDetails}\n\nYour message:\n${payload.message}\n\nTo add anything, reply to this email.\n\n${contactFooter}`,
    html: template({
      kind: "Your enquiry",
      title: "Thank you for getting in touch.",
      introduction: "We’ve received your message. Here is a copy for your records. We’ll be in touch about your enquiry.",
      preheader: "Your message has reached Golden Earth Studio. Here is a copy of your enquiry.",
      details, message: payload.message, actionLabel: "Explore the gallery", actionUrl: `${site.url}/gallery/`,
      footnote: "If you’d like to add anything, simply reply to this email.",
    }),
  };
  return [studio, confirmation];
}
