import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSessionEvidence, getAllSessions } from "@/lib/data/storage";
import { evaluateSkillEvidence, recalculateReadiness } from "@/lib/ai/tools";
import { EvidenceRecord } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, skillName, evidenceType, title, evidenceText, evidenceUrl } = body;

    let targetSessionId = sessionId;
    if (!targetSessionId) {
      const all = await getAllSessions();
      if (all.length > 0) {
        targetSessionId = all[0].sessionId;
      }
    }

    const session = await getSession(targetSessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Analysis session not found. Please run an analysis first." },
        { status: 404 }
      );
    }

    // Step 1: Tool execution: evaluateSkillEvidence
    const { evidenceRecord } = await evaluateSkillEvidence(
      skillName,
      evidenceType || "github",
      title || `${skillName} Project Verification`,
      evidenceText || `Implemented comprehensive ${skillName} features.`,
      evidenceUrl
    );

    const oldScore = session.readinessScore.overallScore;

    // Step 2: Tool execution: recalculateReadiness
    const currentEvidenceList: EvidenceRecord[] = [
      evidenceRecord,
      ...(session.evidenceRecords || []),
    ];

    const { newReadiness } = await recalculateReadiness(
      session.candidate,
      session.marketAnalysis,
      session.skillGaps,
      currentEvidenceList
    );

    const scoreDelta = newReadiness.overallScore - oldScore;

    // Step 3: Persist update in storage
    const updatedSession = await updateSessionEvidence(
      targetSessionId,
      evidenceRecord,
      newReadiness
    );

    return NextResponse.json({
      success: true,
      previousScore: oldScore,
      newScore: newReadiness.overallScore,
      scoreDelta,
      evidenceRecord,
      newReadiness,
      session: updatedSession,
    });
  } catch (error: any) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update progress" },
      { status: 500 }
    );
  }
}
