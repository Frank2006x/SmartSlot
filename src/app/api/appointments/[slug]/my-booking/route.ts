import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, desc, eq, ne } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { appointmentBooking, appointmentForm } from "@/db/appointment-schema";

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
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select({
        id: appointmentBooking.id,
        startsAt: appointmentBooking.startsAt,
        endsAt: appointmentBooking.endsAt,
        status: appointmentBooking.status,
      })
      .from(appointmentBooking)
      .innerJoin(
        appointmentForm,
        eq(appointmentBooking.formId, appointmentForm.id),
      )
      .where(
        and(
          eq(appointmentForm.slug, slug),
          eq(appointmentBooking.guestEmail, email),
          ne(appointmentBooking.status, "cancelled"),
        ),
      )
      .orderBy(desc(appointmentBooking.createdAt))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ booking: null }, { status: 200 });
    }

    return NextResponse.json({ booking: rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error checking existing booking", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}
