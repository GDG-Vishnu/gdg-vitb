import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name } = body || {};

    if (!id && !name) {
      return NextResponse.json(
        { error: "Provide id or name to delete" },
        { status: 400 }
      );
    }

    if (id) {
      // delete by id (string id from Prisma)
      const deleted = await prisma.teamMember.delete({ where: { id } });
      return NextResponse.json({ success: true, deleted }, { status: 200 });
    }

    // fallback: delete by name (may delete multiple rows)
    const result = await prisma.teamMember.deleteMany({ where: { name } });
    return NextResponse.json(
      { success: true, deletedCount: result.count },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Failed to delete member:", err?.message ?? err);
    if (err?.code === "P2025") {
      // record not found
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
