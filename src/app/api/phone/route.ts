import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { phoneNumber } from "@/db/auth-schema";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select({ phoneNumber: phoneNumber.phoneNumber })
    .from(phoneNumber)
    .where(eq(phoneNumber.userId, session.session.userId))
    .limit(1);

  return NextResponse.json({
    hasPhone: Boolean(existing?.phoneNumber),
    phoneNumber: existing?.phoneNumber ?? null,
  });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawPhone =
    typeof (body as { phoneNumber?: unknown })?.phoneNumber === "string"
      ? (body as { phoneNumber: string }).phoneNumber.trim()
      : "";

  if (!rawPhone) {
    return NextResponse.json(
      { error: "Phone number is required" },
      { status: 400 },
    );
  }

  await db
    .insert(phoneNumber)
    .values({
      userId: session.session.userId,
      phoneNumber: rawPhone,
    })
    .onConflictDoUpdate({
      target: phoneNumber.userId,
      set: {
        phoneNumber: rawPhone,
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ phoneNumber: rawPhone });
}
