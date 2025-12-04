import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.events.findMany({
      orderBy: { Date: "desc" },
    });
    return NextResponse.json(events);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
