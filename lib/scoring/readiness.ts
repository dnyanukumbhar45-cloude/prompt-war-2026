import {
  CandidateProfile,
  MarketAnalysisResult,
  SkillGap,
  ScoringWeights,
  ReadinessScoreBreakdown,
  EvidenceRecord,
} from "@/types";

export const DEFAULT_WEIGHTS: ScoringWeights = {
  skillCoverage: 0.40,
  skillImportance: 0.25,
  projectEvidence: 0.20,
  marketAlignment: 0.15,
};

/**
 * Deterministic mathematical calculation of Career Readiness.
 * Never allows arbitrary LLM hallucination for numerical scoring.
 */
export function calculateCareerReadiness(
  candidate: CandidateProfile,
  market: MarketAnalysisResult,
  skillGaps: SkillGap[],
  evidenceList: EvidenceRecord[] = [],
  customWeights?: Partial<ScoringWeights>
): ReadinessScoreBreakdown {
  const weights: ScoringWeights = {
    ...DEFAULT_WEIGHTS,
    ...customWeights,
  };

  const totalRequiredMarketSkills = market.marketRequirements.filter(
    (r) => r.isRequired
  );

  // 1. Skill Coverage Score (0 - 100)
  // Ratio of required skills demonstrated or partially demonstrated
  let coveredCount = 0;
  totalRequiredMarketSkills.forEach((req) => {
    const gap = skillGaps.find(
      (g) => g.skillName.toLowerCase() === req.skillName.toLowerCase()
    );
    if (gap) {
      if (gap.status === "demonstrated") {
        coveredCount += 1.0;
      } else if (gap.status === "partial") {
        coveredCount += 0.5;
      }
    }
  });

  const skillCoverageScore =
    totalRequiredMarketSkills.length > 0
      ? Math.round((coveredCount / totalRequiredMarketSkills.length) * 100)
      : 50;

  // 2. Skill Importance Weighted Score (0 - 100)
  // Sum(candidate_coverage * market_importance) / Sum(market_importance)
  let weightedEarned = 0;
  let totalPossibleWeight = 0;

  market.marketRequirements.forEach((req) => {
    const importance = req.averageImportance || 5;
    totalPossibleWeight += importance;

    const gap = skillGaps.find(
      (g) => g.skillName.toLowerCase() === req.skillName.toLowerCase()
    );
    if (gap) {
      if (gap.status === "demonstrated") {
        weightedEarned += importance * Math.max(0.8, gap.candidateConfidence);
      } else if (gap.status === "partial") {
        weightedEarned += importance * 0.45;
      }
    }
  });

  const skillImportanceScore =
    totalPossibleWeight > 0
      ? Math.round((weightedEarned / totalPossibleWeight) * 100)
      : 50;

  // 3. Project Evidence Score (0 - 100)
  // Measures whether claimed skills are actually backed by demonstrable project evidence
  const candidateSkills = candidate.extractedSkills;
  let evidenceBackedCount = 0;

  candidateSkills.forEach((skill) => {
    const hasResumeEvidence =
      skill.evidence && skill.evidence.trim().length > 15;
    const hasExternalEvidence = evidenceList.some(
      (e) =>
        e.skillName.toLowerCase() === skill.name.toLowerCase() && e.verified
    );

    if (hasExternalEvidence) {
      evidenceBackedCount += 1.0;
    } else if (hasResumeEvidence) {
      evidenceBackedCount += 0.85;
    } else {
      evidenceBackedCount += 0.3;
    }
  });

  // Also bonus for newly submitted evidence items that closed gaps
  const additionalEvidencePoints = evidenceList.reduce(
    (acc, curr) => acc + (curr.verified ? curr.scoreImprovement : 0),
    0
  );

  const rawProjectScore =
    candidateSkills.length > 0
      ? (evidenceBackedCount / candidateSkills.length) * 100
      : 40;

  const projectEvidenceScore = Math.min(
    100,
    Math.round(rawProjectScore + additionalEvidencePoints)
  );

  // 4. Market Alignment Score (0 - 100)
  // How closely candidate skills match the top 10 most demanded skills in current postings
  const top10Skills = market.topSkillsDemanded.slice(0, 10);
  let topMatches = 0;

  top10Skills.forEach((topSkill) => {
    const match = candidateSkills.find(
      (s) => s.name.toLowerCase() === topSkill.skill.toLowerCase()
    );
    const hasProgressEvidence = evidenceList.some(
      (e) =>
        e.skillName.toLowerCase() === topSkill.skill.toLowerCase() && e.verified
    );

    if (match || hasProgressEvidence) {
      topMatches += 1;
    }
  });

  const marketAlignmentScore =
    top10Skills.length > 0
      ? Math.round((topMatches / top10Skills.length) * 100)
      : 50;

  // 5. Overall Weighted Readiness Calculation
  const overallScoreFloat =
    skillCoverageScore * weights.skillCoverage +
    skillImportanceScore * weights.skillImportance +
    projectEvidenceScore * weights.projectEvidence +
    marketAlignmentScore * weights.marketAlignment;

  const overallScore = Math.min(
    100,
    Math.max(0, Math.round(overallScoreFloat))
  );

  const formulaExplanation = `Career Readiness = (${Math.round(
    weights.skillCoverage * 100
  )}% × Skill Coverage [${skillCoverageScore}]) + (${Math.round(
    weights.skillImportance * 100
  )}% × Skill Importance [${skillImportanceScore}]) + (${Math.round(
    weights.projectEvidence * 100
  )}% × Project Evidence [${projectEvidenceScore}]) + (${Math.round(
    weights.marketAlignment * 100
  )}% × Market Alignment [${marketAlignmentScore}]) = ${overallScore}%`;

  let summaryReasoning = "";
  if (overallScore >= 85) {
    summaryReasoning =
      "Candidate demonstrates strong industry alignment with high evidence-backed coverage across critical requirements.";
  } else if (overallScore >= 65) {
    summaryReasoning =
      "Solid foundational skills demonstrated. Targeted execution on high-priority missing frameworks and REST APIs will accelerate placement readiness.";
  } else {
    summaryReasoning =
      "Early-stage profile. Significant skill gaps exist in core role requirements. Structured milestone projects are strongly recommended.";
  }

  return {
    overallScore,
    skillCoverageScore,
    skillImportanceScore,
    projectEvidenceScore,
    marketAlignmentScore,
    weights,
    formulaExplanation,
    summaryReasoning,
  };
}
