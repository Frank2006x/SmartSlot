import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { appointmentForm } from "@/db/appointment-schema";

const randomSlug = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z0-9]/g, "")
    .slice(2, 10);

const timeToMinutes = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const minutesToTime = (minutes: number) => {
  const safeMinutes = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(safeMinutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (safeMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

const computeDayEndTime = (
  dayStartTime: string,
  durationMinutes: number,
  slotGapMinutes: number,
  slotCount: number,
) => {
  const startMinutes = timeToMinutes(dayStartTime);
  if (startMinutes === null) return null;
  if (durationMinutes <= 0 || slotCount <= 0 || slotGapMinutes < 0) return null;

  const totalGapMinutes = (slotCount - 1) * slotGapMinutes;
  const totalDuration = slotCount * durationMinutes + totalGapMinutes;
  const endMinutes = startMinutes + totalDuration;
  return minutesToTime(endMinutes);
};

const generateUniqueSlug = async () => {
  let attempt = randomSlug();
  // Loop until the slug is unique across appointment forms
  // Given randomness, collisions are unlikely; capped attempts prevent runaway loops.
  for (let i = 0; i < 5; i += 1) {
    const exists = await db
      .select({ id: appointmentForm.id })
      .from(appointmentForm)
      .where(eq(appointmentForm.slug, attempt))
      .limit(1);

    if (exists.length === 0) return attempt;
    attempt = randomSlug();
  }
  return `${attempt}-${Date.now().toString(36)}`;
};

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description = "",
      coverColor = "#10b981",
      startsOn,
      endsOn = startsOn,
      dayStartTime,
      durationMinutes,
      slotGapMinutes = 0,
      slotCount = 1,
      timezone,
      isActive = true,
    } = body;

    if (!title || !startsOn || !dayStartTime || !durationMinutes || !timezone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const computedDayEndTime = computeDayEndTime(
      dayStartTime,
      Number(durationMinutes),
      Number(slotGapMinutes ?? 0),
      Number(slotCount ?? 1),
    );

    if (!computedDayEndTime) {
      return NextResponse.json(
        { error: "Invalid time configuration" },
        { status: 400 },
      );
    }

    const slug = await generateUniqueSlug();

    const [inserted] = await db
      .insert(appointmentForm)
      .values({
        id: crypto.randomUUID(),
        userId: session.session.userId,
        slug,
        title,
        description,
        coverColor,
        durationMinutes: Number(durationMinutes),
        slotGapMinutes: Number(slotGapMinutes ?? 0),
        startsOn,
        endsOn,
        dayStartTime,
        dayEndTime: computedDayEndTime,
        timezone,
        isActive: Boolean(isActive),
      })
      .returning();

    return NextResponse.json({ form: inserted }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment form", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}
