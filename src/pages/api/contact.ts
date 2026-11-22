// POST /api/contact — sends the contact form via Resend.
// Env vars (.env locally, Cloudflare in production): RESEND_API_KEY, CONTACT_TO, CONTACT_FROM
import type { APIRoute } from "astro";
// import { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } from "astro:env/server";

export const prerender = false;

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  // Honeypot: pretend success so bots move on
  if (clip(body.company, 200)) return json({ ok: true });

  const firstName = clip(body.firstName, 80);
  const lastName = clip(body.lastName, 80);
  const email = clip(body.email, 200);
  const phone = clip(body.phone, 40);
  const topic = clip(body.topic, 40);
  const topicLabel = clip(body.topicLabel, 80);
  const message = clip(body.message, 4000);

  if (
    !firstName ||
    !lastName ||
    !message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return json({ error: "Missing or invalid fields" }, 400);
  }

  const subject = `New message${topicLabel ? `: ${topicLabel}` : ""} from ${firstName} ${lastName}`;
  const html = `
    <p><strong>Name:</strong> ${esc(firstName)} ${esc(lastName)}</p>
    <p><strong>E-mail:</strong> ${esc(email)}</p>
    ${phone ? `<p><strong>Phone:</strong> ${esc(phone)}</p>` : ""}
    ${topic ? `<p><strong>Topic:</strong> ${esc(topicLabel || topic)} (${esc(topic)})</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${esc(message).replace(/\n/g, "<br />")}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      //   Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({
    //   from: CONTACT_FROM,
    //   to: CONTACT_TO,
    //   reply_to: email,
    //   subject,
    //   html,
    // }),
  });

  if (!res.ok) return json({ error: "Could not send" }, 502);
  return json({ ok: true });
};
