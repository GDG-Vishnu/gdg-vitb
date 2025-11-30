import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Missing name parameter" },
      { status: 400 }
    );
  }

  try {
    const member = await prisma.teamMember.findFirst({
     where: {
  name: {
    startsWith: name,   // "ABC"
    mode: "insensitive",
  },
},

    });

    if (!member) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (err) {
    console.error("GET /api/teams/get-by-name error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
