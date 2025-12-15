import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const galleryItems = await prisma.gallery.findMany({
        orderBy: { id: 'asc' },
    });

    return NextResponse.json(galleryItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery items" },
      { status: 500 }   
    );
  }
}