import { z } from "zod";

export const ExtractedSkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  confidence: z.number().min(0).max(1),
  evidence: z.string().min(5),
});

export const CandidateProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  technologies: z.array(z.string()),
  evidence: z.string().optional().default(""),
});

export const CandidateProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().optional(),
  education: z.string().min(1),
  degree: z.string().min(1),
  branch: z.string().min(1),
  graduationYear: z.number().int().min(2000).max(2035),
  targetRole: z.string().min(1),
  summary: z.string(),
  extractedSkills: z.array(ExtractedSkillSchema),
  projects: z.array(CandidateProjectSchema),
  experience: z.array(z.any()).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  rawResumeText: z.string().optional(),
});

export const SkillGapSchema = z.object({
  skillName: z.string().min(1),
  category: z.string(),
  status: z.enum(["demonstrated", "partial", "missing"]),
  candidateConfidence: z.number().min(0).max(1),
  marketImportance: z.number().min(1).max(10),
  marketFrequency: z.number().min(0).max(100),
  isRequired: z.boolean(),
  priority: z.enum(["high", "medium", "low"]),
  reason: z.string(),
  recommendedAction: z.string(),
});

export const ReadinessScoreSchema = z.object({
  overallScore: z.number().min(0).max(100),
  skillCoverageScore: z.number().min(0).max(100),
  skillImportanceScore: z.number().min(0).max(100),
  projectEvidenceScore: z.number().min(0).max(100),
  marketAlignmentScore: z.number().min(0).max(100),
  formulaExplanation: z.string().min(10),
  summaryReasoning: z.string().min(10),
});

export const LearningPhaseSchema = z.object({
  phaseNumber: z.number().int().min(1),
  phaseTitle: z.string().min(3),
  targetSkills: z.array(z.string()).min(1),
  estimatedWeeks: z.number().min(1),
  learningObjectives: z.array(z.string()).min(1),
  suggestedProject: z.string().min(3),
  completionEvidenceRequired: z.array(z.string()).min(1),
});

export const ProjectRecommendationSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string().min(10),
  targetedGaps: z.array(z.string()).min(1),
  estimatedHours: z.number().min(5),
  architectureBlueprint: z.array(z.string()).min(1),
  keyFeatures: z.array(z.string()).min(1),
  evidenceChecklist: z.array(z.string()).min(1),
});

export const EvidenceRecordInputSchema = z.object({
  sessionId: z.string().min(1),
  skillName: z.string().min(1),
  evidenceType: z.enum(["github", "project_desc", "certificate", "manual"]),
  title: z.string().min(3),
  evidenceUrl: z.string().optional(),
  evidenceText: z.string().min(10),
});
