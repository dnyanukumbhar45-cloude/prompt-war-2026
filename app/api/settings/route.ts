import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_WEIGHTS } from "@/lib/scoring/readiness";

let runtimeSettings = {
  demoMode: process.env.DEMO_MODE === "true" || !process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  weights: DEFAULT_WEIGHTS,
  bigQueryConnected: Boolean(process.env.BIGQUERY_DATASET),
  firebaseConnected: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
};

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: {
      ...runtimeSettings,
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { demoMode, geminiModel, apiKey, weights } = body;

    if (typeof demoMode === "boolean") {
      runtimeSettings.demoMode = demoMode;
      process.env.DEMO_MODE = demoMode ? "true" : "false";
    }

    if (geminiModel) {
      runtimeSettings.geminiModel = geminiModel;
      process.env.GEMINI_MODEL = geminiModel;
    }

    if (apiKey) {
      process.env.GEMINI_API_KEY = apiKey;
      runtimeSettings.hasApiKey = true;
      runtimeSettings.demoMode = false;
      process.env.DEMO_MODE = "false";
    }

    if (weights) {
      runtimeSettings.weights = {
        ...runtimeSettings.weights,
        ...weights,
      };
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: runtimeSettings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
