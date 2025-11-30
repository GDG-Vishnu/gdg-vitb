import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.teamMember.findMany({
      select: {
        id: true,
        name: true,
        rank: true,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Failed to fetch name/rank", err);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
