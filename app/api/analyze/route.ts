import { NextRequest, NextResponse } from "next/server";
import { runCareerPilotOrchestrator } from "@/lib/ai/orchestrator";
import { RoleType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetRole, rawResumeText, candidateDetails } = body;

    const validatedRole = (targetRole || "Full Stack Developer") as RoleType;

    const result = await runCareerPilotOrchestrator({
      targetRole: validatedRole,
      rawResumeText,
      candidateDetails,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Analysis orchestrator error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error during analysis",
      },
      { status: 500 }
    );
  }
}
