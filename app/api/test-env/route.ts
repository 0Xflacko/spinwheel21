import { NextResponse } from "next/server";

export async function GET() {
  try {
    const envCheck = {
      hasGoogleSheetsId: !!process.env.GOOGLE_SHEETS_ID,
      hasGoogleProjectId: !!process.env.GOOGLE_PROJECT_ID,
      hasGooglePrivateKeyId: !!process.env.GOOGLE_PRIVATE_KEY_ID,
      hasGooglePrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasGoogleClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      // Show partial values for debugging (without exposing secrets)
      sheetsIdLength: process.env.GOOGLE_SHEETS_ID?.length || 0,
      projectIdPreview:
        process.env.GOOGLE_PROJECT_ID?.substring(0, 10) + "..." || "missing",
      clientEmailPreview:
        process.env.GOOGLE_CLIENT_EMAIL?.substring(0, 20) + "..." || "missing",
    };

    return NextResponse.json({
      status: "Environment check",
      ...envCheck,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check environment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
