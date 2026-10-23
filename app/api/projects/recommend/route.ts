import { NextRequest, NextResponse } from "next/server";
import { recommendProjects } from "@/lib/ai/tools";
import { RoleType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { targetRole, skillGaps } = await req.json();
    const result = await recommendProjects(
      (targetRole || "Full Stack Developer") as RoleType,
      skillGaps || []
    );

    return NextResponse.json({
      success: true,
      projects: result.projects,
      log: result.log,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to recommend projects" },
      { status: 500 }
    );
  }
}
