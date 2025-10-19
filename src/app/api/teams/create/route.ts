import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, imageUrl, designation, position, linkedinUrl, mail } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const created = await prisma.teamMember.create({
      data: {
        name,
        imageUrl: imageUrl || "",
        designation: designation || "MEMBER",
        position: position || null,
        linkedinUrl: linkedinUrl || null,
        mail: mail || null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}
