import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { sendLeadNotification } from "@/lib/mail";

// Allowed lead statuses — mirrors the values documented on Enquiry.status.
const ENQUIRY_STATUSES = ["NEW", "IN_PROGRESS", "CLOSED"] as const;

// Public endpoint — receives enquiry / quote / brochure-download leads
// from the frontend forms and stores them for the admin dashboard.
const ENQUIRY_RATE_LIMIT = 6;       // submissions
const ENQUIRY_RATE_WINDOW = 60_000; // per 60s per IP
const MAX_FIELD_CHARS = 5000;       // cap any single field to keep payloads sane

export async function POST(req: Request) {
  try {
    // 1) Rate limit per IP to stop bot flooding of the leads table.
    const ip = getClientIp(req);
    const rl = rateLimit(`enquiry:${ip}`, ENQUIRY_RATE_LIMIT, ENQUIRY_RATE_WINDOW);
    if (!rl.ok) return tooManyRequests(rl.retryAfter);

    const body = await req.json();

    // 2) Honeypot: a hidden form field real users never fill. If it has a
    // value, silently accept (201) without storing so bots get no signal.
    if (body.hp && body.hp.toString().trim() !== "") {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const clip = (v: unknown) => (v || "").toString().trim().slice(0, MAX_FIELD_CHARS);
    const name = clip(body.name);
    const phone = clip(body.phone);
    const email = clip(body.email);

    if (!name && !phone && !email) {
      return NextResponse.json(
        { error: "Name, phone or email is required." },
        { status: 400 }
      );
    }

    // The Enquiry model stores name/email/phone/message — pack the
    // project context fields into the message so nothing is lost.
    const contextLines = [
      body.company    ? `Farm / Company: ${body.company}`       : null,
      body.country    ? `Country: ${body.country}`              : null,
      body.birdType   ? `Bird Type: ${body.birdType}`           : null,
      body.requirement? `Requirement: ${body.requirement}`      : null,
      body.birdCapacity ? `Approx Capacity: ${body.birdCapacity}` : null,
      body.timeline   ? `Timeline: ${body.timeline}`            : null,
      body.product    ? `Product: ${body.product}`              : null,
      body.type       ? `Lead Type: ${body.type}`               : null,
      body.sourceUrl  ? `Source: ${body.sourceUrl}`             : null,
      body.message    ? `Message: ${clip(body.message)}`        : null,
    ].filter(Boolean);

    const enquiry = await prisma.enquiry.create({
      data: {
        name: name || "(not provided)",
        email: email || "(not provided)",
        phone: phone || "(not provided)",
        message: contextLines.join("\n") || "(no details)",
      },
    });

    // Notify sales. sendLeadNotification never throws and no-ops when SMTP is
    // unconfigured — the lead is already saved either way, so a mail problem
    // must never turn a successful submission into an error for the customer.
    const emailed = await sendLeadNotification({
      name,
      email,
      phone,
      company: clip(body.company),
      country: clip(body.country),
      birdType: clip(body.birdType),
      requirement: clip(body.requirement),
      birdCapacity: clip(body.birdCapacity),
      timeline: clip(body.timeline),
      product: clip(body.product),
      type: clip(body.type),
      sourceUrl: clip(body.sourceUrl),
      message: clip(body.message),
    });

    return NextResponse.json({ ok: true, id: enquiry.id, emailed }, { status: 201 });
  } catch (err) {
    console.error("Enquiry create failed:", err);
    // Surface ONLY Prisma's error code (e.g. P2021 "table does not exist",
    // P1010 "access denied"). Codes are not sensitive and turn a blind
    // "could not save" into something diagnosable from the browser; the full
    // message and stack stay in the server log.
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code: unknown }).code)
        : undefined;
    return NextResponse.json(
      { error: "Could not save enquiry. Please try again.", code },
      { status: 500 }
    );
  }
}

// Admin-only: update a lead's status from the dashboard. Session-gated so it
// can never be driven by the public forms that hit POST above.
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  let body: { id?: unknown; status?: unknown };
  try {
    body = (await req.json()) as { id?: unknown; status?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const status = typeof body.status === "string" ? body.status : "";
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  if (!ENQUIRY_STATUSES.includes(status as (typeof ENQUIRY_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updated = await prisma.enquiry.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code: unknown }).code)
        : undefined;
    // P2025 = record not found.
    if (code === "P2025") {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }
    console.error("Enquiry status update failed:", err);
    return NextResponse.json({ error: "Could not update enquiry", code }, { status: 500 });
  }
}
