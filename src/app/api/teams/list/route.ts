import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(members,{
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
