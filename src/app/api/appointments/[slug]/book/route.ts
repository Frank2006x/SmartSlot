import { NextResponse } from "next/server";
import { and, eq, gte } from "drizzle-orm";

import { db } from "@/db";
import {
  appointmentBooking,
  appointmentForm,
  appointmentSlot,
} from "@/db/appointment-schema";

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const body = await request.json();
    const { guestName, guestEmail, guestPhone, slotId } = body || {};

    if (!guestName || !guestEmail || !slotId) {
      return NextResponse.json(
        { error: "guestName, guestEmail, and slotId are required" },
        { status: 400 },
      );
    }

    const formResult = await db
      .select({ id: appointmentForm.id, isActive: appointmentForm.isActive })
      .from(appointmentForm)
      .where(eq(appointmentForm.slug, slug))
      .limit(1);

    if (formResult.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!formResult[0].isActive) {
      return NextResponse.json({ error: "Form is inactive" }, { status: 400 });
    }

    const now = new Date();

    const updatedSlots = await db
      .update(appointmentSlot)
      .set({ status: "booked" })
      .where(
        and(
          eq(appointmentSlot.id, slotId),
          eq(appointmentSlot.formId, formResult[0].id),
          eq(appointmentSlot.isActive, true),
          eq(appointmentSlot.status, "available"),
          gte(appointmentSlot.startAt, now),
        ),
      )
      .returning();

    if (updatedSlots.length === 0) {
      return NextResponse.json(
        { error: "Slot not available" },
        { status: 409 },
      );
    }

    const slot = updatedSlots[0];

    try {
      const [created] = await db
        .insert(appointmentBooking)
        .values({
          id: crypto.randomUUID(),
          formId: formResult[0].id,
          slotId: slot.id,
          guestName,
          guestEmail,
          guestPhone: guestPhone || null,
          startsAt: slot.startAt,
          endsAt: slot.endAt,
          status: "confirmed",
        })
        .returning();

      return NextResponse.json({ booking: created }, { status: 201 });
    } catch (err) {
      await db
        .update(appointmentSlot)
        .set({ status: "available" })
        .where(
          and(
            eq(appointmentSlot.id, slot.id),
            eq(appointmentSlot.status, "booked"),
          ),
        );

      console.error("Error creating booking", err);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error creating booking", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
