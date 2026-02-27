import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    const snap = await adminDb
      .collection("team_members")
      .orderBy("name", "asc")
      .get();

    const members = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        imageUrl: data.imageUrl,
        logo: data.logo ?? null,
        name: data.name,
        designation: data.designation,
        position: data.position ?? null,
        linkedinUrl: data.linkedinUrl ?? null,
        mail: data.mail ?? null,
        dept_logo: data.dept_logo ?? null,
        bgColor: data.bgColor ?? null,
        rank: data.rank ?? 0,
        dept_rank: data.dept_rank ?? 0,
      };
    });

    return NextResponse.json(members, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Failed to fetch team members:", err);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 },
    );
  }
}
