import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

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

    return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
  } catch (err) {
    console.error("Enquiry create failed:", err);
    return NextResponse.json(
      { error: "Could not save enquiry. Please try again." },
      { status: 500 }
    );
  }
}
