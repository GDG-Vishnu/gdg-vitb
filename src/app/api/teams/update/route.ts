import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      originalName,
      name,
      imageUrl,
      designation,
      position,
      linkedinUrl,
      mail,
      bgColor,
      logo,
      rank,
    } = body;

    // We need either an id or originalName to identify the member
    if (!id && !originalName) {
      return NextResponse.json(
        {
          error: "Either id or originalName is required to identify the member",
        },
        { status: 400 }
      );
    }

    // Find the member first
    let member;
    if (id) {
      member = await prisma.teamMember.findUnique({
        where: { id },
      });
    } else {
      member = await prisma.teamMember.findFirst({
        where: { name: { equals: originalName, mode: "insensitive" } },
      });
    }

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Update the member with provided fields
    const updated = await prisma.teamMember.update({
      where: { id: member.id },
      data: {
        name: name ?? member.name,
        imageUrl: imageUrl ?? member.imageUrl,
        designation: designation ?? member.designation,
        position: position !== undefined ? position : member.position,
        linkedinUrl:
          linkedinUrl !== undefined ? linkedinUrl : member.linkedinUrl,
        mail: mail !== undefined ? mail : member.mail,
        bgColor: bgColor !== undefined ? bgColor : member.bgColor,
        logo: logo !== undefined ? logo : member.logo,
        rank: rank !== undefined ? rank : member.rank,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}
