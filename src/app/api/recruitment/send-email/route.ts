import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_EMAIL_URL = "https://script.google.com/macros/s/AKfycbx_7NdVF6_rfkP9_2QovKC9SnnJqvdL4fajTR-8NQjStw2GH8ee_IFgIkZf-wHsT_G1GQ/exec";
const ADMIN_CC_EMAILS = ["team@vishnu.edu.in"]; // Hardcoded admin email for security

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { to, fullName, roleTitle, applicationId, subject, submittedAtIso } = body;

    if (!to || !fullName || !roleTitle) {
      return NextResponse.json(
        { error: "Missing required fields: to, fullName, roleTitle" },
        { status: 400 },
      );
    }

    // Forward request to Google Apps Script
    const response = await fetch(APPS_SCRIPT_EMAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        fullName,
        roleTitle,
        applicationId,
        subject,
        submittedAtIso,
        ccEmails: ADMIN_CC_EMAILS,
      }),
      redirect: "follow",
    });

    const data = await response.json();

    if (data.ok) {
      return NextResponse.json({ success: true, message: data.message });
    } else {
      console.error("Apps Script Email error:", data);
      return NextResponse.json(
        { error: data.error || "Failed to send email" },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("[Recruitment Email] error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
