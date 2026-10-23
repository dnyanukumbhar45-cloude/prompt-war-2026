import {
  CandidateProfile,
  RoleType,
  CareerPilotAnalysisResult,
  AgentEvent,
  AgentExecutionNode,
  ToolExecutionLog,
} from "@/types";
import { runResumeIntelligenceAgent } from "@/lib/ai/agents/resume-agent";
import { runMarketIntelligenceAgent } from "@/lib/ai/agents/market-agent";
import { runSkillGapReasoningAgent } from "@/lib/ai/agents/reasoning-agent";
import { runCareerPlanningAgent } from "@/lib/ai/agents/planning-agent";
import { runValidationAgent } from "@/lib/ai/agents/validation-agent";
import { toolExecutionLogs } from "@/lib/ai/tools";
import { saveSession } from "@/lib/data/storage";

export interface OrchestratorOptions {
  rawResumeText?: string;
  candidateDetails?: Partial<CandidateProfile>;
  targetRole: RoleType;
  onEvent?: (event: AgentEvent) => void;
}

export async function runCareerPilotOrchestrator(
  options: OrchestratorOptions
): Promise<CareerPilotAnalysisResult> {
  const sessionId = `cp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const startTime = Date.now();
  const emit = (event: Omit<AgentEvent, "id">) => {
    if (options.onEvent) {
      options.onEvent({
        ...event,
        id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      });
    }
  };

  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Orchestrator",
    status: "running",
    message: "Initializing multi-agent pipeline and security sandboxes...",
  });

  const agentNodes: AgentExecutionNode[] = [];
  const initialToolLogCount = toolExecutionLogs.length;

  // STEP 1: RESUME INTELLIGENCE AGENT
  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Resume Intelligence Agent",
    status: "running",
    message: "Extracting candidate profile, technical skills, and evidence citations...",
  });

  const { profile, node: resumeNode } = await runResumeIntelligenceAgent(
    options.rawResumeText,
    {
      ...options.candidateDetails,
      targetRole: options.targetRole,
    }
  );
  agentNodes.push(resumeNode);

  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Resume Intelligence Agent",
    status: "completed",
    message: `Extracted ${profile.extractedSkills.length} skills with verified evidence.`,
    durationMs: resumeNode.durationMs,
  });

  // STEP 2: MARKET INTELLIGENCE AGENT
  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Market Intelligence Agent",
    status: "running",
    message: `Analyzing benchmark market requirements for ${options.targetRole}...`,
  });

  const { market, node: marketNode } = await runMarketIntelligenceAgent(
    options.targetRole
  );
  agentNodes.push(marketNode);

  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Market Intelligence Agent",
    status: "completed",
    message: `Processed ${market.totalJobsAnalyzed} job records. Computed demand frequencies.`,
    durationMs: marketNode.durationMs,
  });

  // STEP 3: SKILL GAP REASONING AGENT
  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Skill Gap Reasoning Agent",
    status: "running",
    message: "Computing weighted coverage, missing competencies, and deterministic readiness...",
  });

  const { gaps, readiness, node: reasoningNode } = await runSkillGapReasoningAgent(
    profile,
    market,
    []
  );
  agentNodes.push(reasoningNode);

  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Skill Gap Reasoning Agent",
    status: "completed",
    message: `Readiness calculated at ${readiness.overallScore}%. Identified ${gaps.filter((g) => g.priority === "high" && g.status !== "demonstrated").length} priority gaps.`,
    durationMs: reasoningNode.durationMs,
  });

  // STEP 4: CAREER PLANNING AGENT
  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Career Planning Agent",
    status: "running",
    message: "Synthesizing multi-phase learning plan and portfolio project blueprints...",
  });

  const { plan, projects, node: planningNode } = await runCareerPlanningAgent(
    options.targetRole,
    gaps,
    readiness.overallScore
  );
  agentNodes.push(planningNode);

  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Career Planning Agent",
    status: "completed",
    message: `Synthesized ${plan.length} phases and ${projects.length} capstone project recommendations.`,
    durationMs: planningNode.durationMs,
  });

  // STEP 5: VALIDATION & GUARDRAIL AGENT
  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Validation & Guardrail Agent",
    status: "running",
    message: "Validating schema conformity, score bounds, hallucination guards, and prompt security...",
  });

  const { report, node: validationNode } = await runValidationAgent(
    profile,
    gaps,
    readiness,
    plan,
    projects
  );
  agentNodes.push(validationNode);

  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Validation & Guardrail Agent",
    status: "completed",
    message: `Validation ${report.passed ? "PASSED" : "FLAGGED WITH ADVISORIES"}. Confidence: ${(report.confidenceScore * 100).toFixed(0)}%.`,
    durationMs: validationNode.durationMs,
  });

  // Assemble final result
  const sessionToolLogs: ToolExecutionLog[] = toolExecutionLogs.slice(initialToolLogCount);

  const result: CareerPilotAnalysisResult = {
    sessionId,
    createdAt: new Date().toISOString(),
    candidate: profile,
    targetRole: options.targetRole,
    marketAnalysis: market,
    skillGaps: gaps,
    readinessScore: readiness,
    learningPlan: plan,
    recommendedProjects: projects,
    agentExecutions: agentNodes,
    toolLogs: sessionToolLogs,
    evidenceRecords: [],
    isDemoMode: process.env.DEMO_MODE === "true" || !process.env.GEMINI_API_KEY,
    validationPassed: report.passed,
    confidenceScore: report.confidenceScore,
  };

  await saveSession(result);

  emit({
    timestamp: new Date().toLocaleTimeString(),
    agentName: "Orchestrator",
    status: "completed",
    message: `Analysis completed successfully in ${((Date.now() - startTime) / 1000).toFixed(2)}s. Session saved.`,
  });

  return result;
}
