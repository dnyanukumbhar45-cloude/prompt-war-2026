import { NextRequest, NextResponse } from "next/server";
import { calculateSkillGap } from "@/lib/ai/tools";

export async function POST(req: NextRequest) {
  try {
    const { candidate, market } = await req.json();
    if (!candidate || !market) {
      return NextResponse.json(
        { success: false, error: "Candidate and market data required" },
        { status: 400 }
      );
    }

    const result = await calculateSkillGap(candidate, market);

    return NextResponse.json({
      success: true,
      gaps: result.gaps,
      log: result.log,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to calculate skill gap" },
      { status: 500 }
    );
  }
}
