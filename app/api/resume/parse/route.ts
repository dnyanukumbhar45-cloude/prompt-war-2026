import { NextRequest, NextResponse } from "next/server";
import { extractResumeData } from "@/lib/ai/tools";

export async function POST(req: NextRequest) {
  try {
    const { rawText, candidateDetails } = await req.json();
    const result = await extractResumeData(rawText, candidateDetails);

    return NextResponse.json({
      success: true,
      profile: result.profile,
      log: result.log,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to parse resume" },
      { status: 500 }
    );
  }
}
