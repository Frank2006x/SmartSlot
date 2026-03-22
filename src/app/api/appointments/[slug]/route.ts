import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { appointmentForm } from "@/db/appointment-schema";

const buildShareUrl = (origin: string | null, slug: string) => {
  const base = origin || process.env.NEXT_PUBLIC_APP_URL || "";
  return `${base}/book?form=${slug}`;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(appointmentForm)
      .where(eq(appointmentForm.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const form = result[0];
    if (!form.isActive) {
      return NextResponse.json({ error: "Form is inactive" }, { status: 404 });
    }

    const hdrs = await headers();
    const shareUrl = buildShareUrl(hdrs.get("origin"), form.slug);

    const response = {
      id: form.id,
      slug: form.slug,
      title: form.title,
      description: form.description,
      coverColor: form.coverColor,
      durationMinutes: form.durationMinutes,
      slotGapMinutes: form.slotGapMinutes,
      startsOn: form.startsOn,
      endsOn: form.endsOn,
      dayStartTime: form.dayStartTime,
      dayEndTime: form.dayEndTime,
      timezone: form.timezone,
      isActive: form.isActive,
      shareUrl,
    };

    return NextResponse.json({ form: response }, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointment form", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment form" },
      { status: 500 },
    );
  }
}
