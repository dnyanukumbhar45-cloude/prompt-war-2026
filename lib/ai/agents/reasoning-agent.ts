import {
  CandidateProfile,
  MarketAnalysisResult,
  SkillGap,
  ReadinessScoreBreakdown,
  AgentExecutionNode,
  EvidenceRecord,
} from "@/types";
import { calculateSkillGap, calculateReadiness } from "@/lib/ai/tools";
import { SKILL_GAP_REASONING_PROMPT } from "@/lib/ai/prompts/system-prompts";

export async function runSkillGapReasoningAgent(
  candidate: CandidateProfile,
  market: MarketAnalysisResult,
  evidenceList: EvidenceRecord[] = []
): Promise<{
  gaps: SkillGap[];
  readiness: ReadinessScoreBreakdown;
  node: AgentExecutionNode;
}> {
  const startMs = performance.now();
  const logs: string[] = [];

  logs.push("Skill Gap Reasoning Agent initialized.");
  logs.push(`Comparing ${candidate.extractedSkills.length} candidate skills against ${market.marketRequirements.length} market requirements.`);

  // 1. Tool execution: calculateSkillGap
  const { gaps } = await calculateSkillGap(candidate, market);

  const demonstratedCount = gaps.filter((g) => g.status === "demonstrated").length;
  const partialCount = gaps.filter((g) => g.status === "partial").length;
  const missingCount = gaps.filter((g) => g.status === "missing").length;
  const highPriorityGaps = gaps.filter((g) => g.priority === "high" && g.status !== "demonstrated");

  logs.push(`Gap classification: ${demonstratedCount} Demonstrated, ${partialCount} Partial, ${missingCount} Missing.`);
  logs.push(`Critical high-priority gaps detected: ${highPriorityGaps.map((g) => g.skillName).join(", ") || "None"}.`);

  // 2. Tool execution: calculateCareerReadiness (Deterministic numerical computation)
  logs.push("Executing deterministic mathematical readiness scoring algorithm...");
  const { readiness } = await calculateReadiness(candidate, market, gaps, evidenceList);

  logs.push(`Mathematical Readiness Score calculated: ${readiness.overallScore}%`);
  logs.push(`Formula breakdown: ${readiness.formulaExplanation}`);

  // Optional: Gemini enrichment of gap reasoning if API key available and not in demo mode
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && process.env.DEMO_MODE !== "true") {
    try {
      logs.push("Querying Gemini for contextual gap prioritization narrative...");
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
${SKILL_GAP_REASONING_PROMPT}

Candidate: ${candidate.name}
Target: ${market.targetRole}
Readiness Score: ${readiness.overallScore}%
Missing Skills: ${highPriorityGaps.map((g) => g.skillName).join(", ")}

Generate a 2-sentence executive summary explaining why closing these specific gaps will maximize hiring conversion.
`;
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        contents: prompt,
      });

      if (response.text) {
        readiness.summaryReasoning = response.text.trim();
        logs.push("Gemini contextual reasoning incorporated.");
      }
    } catch {
      logs.push("Gemini narrative enrichment skipped; deterministic explanation retained.");
    }
  }

  const durationMs = Math.round(performance.now() - startMs);

  const node: AgentExecutionNode = {
    id: "skill-gap-reasoning-agent",
    name: "Skill Gap Reasoning Agent",
    description: "Evaluates demonstrated vs missing competencies and calculates weighted career readiness.",
    status: "completed",
    durationMs,
    logs,
  };

  return { gaps, readiness, node };
}
