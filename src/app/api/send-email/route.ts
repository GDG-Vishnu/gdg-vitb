import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzPub-UF-Xh_TLekkXS4XynLHO63J_OjxT5z7CE2RkrgwMCaUw91qGHt0an-cMlG6uBJw/exec" ;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.mail || !body.name || !body.event_name || !body.date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Forward request to Google Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: body.mail,
        name: body.name,
        event_name: body.event_name,
        date: body.date,
      }),
      redirect: "follow",
    });

    const data = await response.json();

    if (data.status === "success") {
      return NextResponse.json({ success: true, message: "Email sent" });
    } else {
      console.error("Apps Script error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to send email" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
