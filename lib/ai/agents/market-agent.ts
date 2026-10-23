import { MarketAnalysisResult, RoleType, AgentExecutionNode } from "@/types";
import { getMarketRequirements } from "@/lib/ai/tools";

export async function runMarketIntelligenceAgent(
  targetRole: RoleType
): Promise<{ market: MarketAnalysisResult; node: AgentExecutionNode }> {
  const startMs = performance.now();
  const logs: string[] = [];

  logs.push("Market Intelligence Agent initialized.");
  logs.push(`Querying requirements for target role: "${targetRole}"...`);

  // Call the deterministic Market Requirements Tool
  const { market } = await getMarketRequirements(targetRole);

  logs.push(`Source: ${market.source}`);
  logs.push(`Analyzed ${market.totalJobsAnalyzed} job records.`);
  logs.push(`Identified ${market.marketRequirements.length} technical competencies.`);
  logs.push(`Top in-demand skills: ${market.topSkillsDemanded.slice(0, 4).map((s) => `${s.skill} (${s.frequency}%)`).join(", ")}`);

  const durationMs = Math.round(performance.now() - startMs);

  const node: AgentExecutionNode = {
    id: "market-intelligence-agent",
    name: "Market Intelligence Agent",
    description: "Analyzes industry demand, skill frequencies, and salary distributions for target role.",
    status: "completed",
    durationMs,
    logs,
  };

  return { market, node };
}
