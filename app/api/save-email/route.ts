import { NextRequest, NextResponse } from "next/server";
import { saveEmailToSheet, initializeSheet } from "@/lib/googleSheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, prizeAmount } = body;

    // Validate required fields
    if (!email || !prizeAmount) {
      return NextResponse.json(
        { error: "Email and prize amount are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get client information
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "Unknown";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Prepare submission data
    const submission = {
      email,
      prizeAmount,
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent,
    };

    // Initialize sheet if needed (first time setup)
    await initializeSheet();

    // Save to Google Sheets
    const success = await saveEmailToSheet(submission);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Email saved successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to save email to Google Sheets" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
