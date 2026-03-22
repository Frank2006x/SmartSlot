import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  appointmentBooking,
  appointmentForm,
  appointmentSlot,
} from "@/db/appointment-schema";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const hdrs = await headers();
    const session = await auth.api.getSession({ headers: hdrs });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formRows = await db
      .select({ id: appointmentForm.id, userId: appointmentForm.userId })
      .from(appointmentForm)
      .where(eq(appointmentForm.slug, slug))
      .limit(1);

    if (formRows.length === 0) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const form = formRows[0];
    if (form.userId !== session.session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rows = await db
      .select({
        id: appointmentBooking.id,
        guestName: appointmentBooking.guestName,
        guestEmail: appointmentBooking.guestEmail,
        guestPhone: appointmentBooking.guestPhone,
        startsAt: appointmentBooking.startsAt,
        endsAt: appointmentBooking.endsAt,
        status: appointmentBooking.status,
        slotId: appointmentBooking.slotId,
        slotStart: appointmentSlot.startAt,
        slotEnd: appointmentSlot.endAt,
      })
      .from(appointmentBooking)
      .leftJoin(appointmentSlot, eq(appointmentSlot.id, appointmentBooking.slotId))
      .where(eq(appointmentBooking.formId, form.id))
      .orderBy(desc(appointmentBooking.startsAt));

    return NextResponse.json({ bookings: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings for form", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}
