import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/client-ip";

const LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  message: 5000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Escapes text before it is interpolated into the notification email. Without it,
 * anyone using the public form can inject markup and links into the message the
 * studio owner opens — a phishing vector aimed at the site owner.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function field(body: unknown, key: string, max: number): string {
  const raw = (body as Record<string, unknown>)?.[key];
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, max);
}

export async function POST(req: Request) {
  // Unauthenticated, spends Resend quota, and lands in a human inbox.
  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`, { limit: 3, windowMs: 10 * 60_000 });
  if (!limit.success) {
    const retryAfterSec = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }

  const to = process.env.CONTACT_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!to || !from) {
    console.error("Contact API misconfigured: CONTACT_EMAIL and CONTACT_FROM_EMAIL must both be set.");
    return NextResponse.json(
      { error: "The contact form is temporarily unavailable. Please email us directly." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();

    const name = field(body, "name", LIMITS.name);
    const email = field(body, "email", LIMITS.email);
    // Newlines stripped before this value reaches a mail header.
    const subject = field(body, "subject", LIMITS.subject).replace(/[\r\n]+/g, " ");
    const message = field(body, "message", LIMITS.message);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const { data, error } = await getResend().emails.send({
      from,
      to: [to],
      subject: `New Inquiry: ${subject}`,
      replyTo: email,
      text: [
        "New Contact Form Submission",
        "",
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      // Don't surface the provider's message — it can leak configuration detail.
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
