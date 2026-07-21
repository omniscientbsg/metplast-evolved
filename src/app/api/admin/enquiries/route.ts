import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public endpoint — receives enquiry / quote / brochure-download leads
// from the frontend forms and stores them for the admin dashboard.
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = (body.name || "").toString().trim();
    const phone = (body.phone || "").toString().trim();
    const email = (body.email || "").toString().trim();

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
      body.message    ? `Message: ${body.message}`              : null,
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
