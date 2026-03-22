import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { appointmentBooking, appointmentForm } from "@/db/appointment-schema";

export async function GET() {
  try {
    const hdrs = await headers();
    const session = await auth.api.getSession({ headers: hdrs });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select({
        id: appointmentBooking.id,
        formId: appointmentBooking.formId,
        slotId: appointmentBooking.slotId,
        guestName: appointmentBooking.guestName,
        guestEmail: appointmentBooking.guestEmail,
        guestPhone: appointmentBooking.guestPhone,
        startsAt: appointmentBooking.startsAt,
        endsAt: appointmentBooking.endsAt,
        status: appointmentBooking.status,
        formTitle: appointmentForm.title,
        formSlug: appointmentForm.slug,
        timezone: appointmentForm.timezone,
      })
      .from(appointmentBooking)
      .innerJoin(
        appointmentForm,
        eq(appointmentForm.id, appointmentBooking.formId),
      )
      .where(eq(appointmentBooking.guestEmail, session.user.email))
      .orderBy(desc(appointmentBooking.startsAt));

    return NextResponse.json({ bookings: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}
