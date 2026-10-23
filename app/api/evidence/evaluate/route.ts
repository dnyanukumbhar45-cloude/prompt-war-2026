import { NextRequest, NextResponse } from "next/server";
import { evaluateSkillEvidence } from "@/lib/ai/tools";

export async function POST(req: NextRequest) {
  try {
    const { skillName, evidenceType, title, evidenceText, evidenceUrl } = await req.json();

    if (!skillName || !title || !evidenceText) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await evaluateSkillEvidence(
      skillName,
      evidenceType || "github",
      title,
      evidenceText,
      evidenceUrl
    );

    return NextResponse.json({
      success: true,
      evidenceRecord: result.evidenceRecord,
      log: result.log,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to evaluate evidence" },
      { status: 500 }
    );
  }
}
