import { NextResponse } from "next/server";
import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "@/db";
import { appointmentForm, appointmentSlot } from "@/db/appointment-schema";

const parseDateRange = (dateParam?: string | null) => {
  if (!dateParam) return null;
  const parsed = new Date(`${dateParam}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  const start = parsed;
  const end = new Date(parsed);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const form = await db
      .select({ id: appointmentForm.id, isActive: appointmentForm.isActive })
      .from(appointmentForm)
      .where(eq(appointmentForm.slug, slug))
      .limit(1);

    if (form.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form[0].isActive) {
      return NextResponse.json({ error: "Form is inactive" }, { status: 404 });
    }

    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");
    const range = parseDateRange(dateParam);

    const now = new Date();

    const conditions = [
      eq(appointmentSlot.formId, form[0].id),
      eq(appointmentSlot.isActive, true),
      eq(appointmentSlot.status, "available"),
      gte(appointmentSlot.startAt, now),
    ];

    if (range) {
      conditions.push(gte(appointmentSlot.startAt, range.start));
      conditions.push(lte(appointmentSlot.startAt, range.end));
    }

    const slots = await db
      .select({
        id: appointmentSlot.id,
        startAt: appointmentSlot.startAt,
        endAt: appointmentSlot.endAt,
        status: appointmentSlot.status,
      })
      .from(appointmentSlot)
      .where(and(...conditions))
      .orderBy(appointmentSlot.startAt);

    return NextResponse.json({ slots }, { status: 200 });
  } catch (error) {
    console.error("Error fetching slots", error);
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 },
    );
  }
}
