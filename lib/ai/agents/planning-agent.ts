import {
  RoleType,
  SkillGap,
  LearningPhase,
  ProjectRecommendation,
  AgentExecutionNode,
} from "@/types";
import { generateLearningPlan, recommendProjects } from "@/lib/ai/tools";

export async function runCareerPlanningAgent(
  targetRole: RoleType,
  skillGaps: SkillGap[],
  readinessScore: number
): Promise<{
  plan: LearningPhase[];
  projects: ProjectRecommendation[];
  node: AgentExecutionNode;
}> {
  const startMs = performance.now();
  const logs: string[] = [];

  logs.push("Career Planning Agent initialized.");
  logs.push(`Synthesizing adaptive milestones for ${targetRole} (Current Readiness: ${readinessScore}%)...`);

  // Tool 1: generateLearningPlan
  const { plan } = await generateLearningPlan(targetRole, skillGaps, readinessScore);
  logs.push(`Generated ${plan.length} structured learning phases with measurable milestones.`);

  // Tool 2: recommendProjects
  const { projects } = await recommendProjects(targetRole, skillGaps);
  logs.push(`Designed ${projects.length} capstone project blueprints targeted at closing primary skill gaps.`);

  projects.forEach((proj) => {
    logs.push(`Blueprint "${proj.title}" targets: ${proj.targetedGaps.join(", ")}`);
  });

  const durationMs = Math.round(performance.now() - startMs);

  const node: AgentExecutionNode = {
    id: "career-planning-agent",
    name: "Career Planning Agent",
    description: "Synthesizes multi-phase learning roadmap and targeted project blueprints to close priority gaps.",
    status: "completed",
    durationMs,
    logs,
  };

  return { plan, projects, node };
}
