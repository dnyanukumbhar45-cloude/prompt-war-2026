import { NextRequest, NextResponse } from "next/server";
import { generateLearningPlan } from "@/lib/ai/tools";
import { RoleType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { targetRole, skillGaps, readinessScore } = await req.json();
    const result = await generateLearningPlan(
      (targetRole || "Full Stack Developer") as RoleType,
      skillGaps || [],
      readinessScore || 50
    );

    return NextResponse.json({
      success: true,
      plan: result.plan,
      log: result.log,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate learning plan" },
      { status: 500 }
    );
  }
}
