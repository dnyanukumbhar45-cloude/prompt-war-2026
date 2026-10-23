export type RoleType =
  | "Full Stack Developer"
  | "Frontend Developer"
  | "Backend Developer"
  | "Data Analyst"
  | "Data Scientist"
  | "AI/ML Engineer"
  | "Cloud Engineer"
  | "Software Engineer";

export type SkillCategory =
  | "Programming Language"
  | "Frontend"
  | "Backend"
  | "Database"
  | "Cloud & Infrastructure"
  | "Tools & DevOps"
  | "Architecture & APIs"
  | "AI & Data"
  | "Core CS & Testing";

export interface ExtractedSkill {
  name: string;
  category: SkillCategory | string;
  confidence: number;
  evidence: string;
}

export interface CandidateProject {
  title: string;
  description: string;
  technologies: string[];
  evidence: string;
}

export interface CandidateExperience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface CandidateProfile {
  name: string;
  email?: string;
  education: string;
  degree: string;
  branch: string;
  graduationYear: number;
  targetRole: RoleType;
  summary: string;
  extractedSkills: ExtractedSkill[];
  projects: CandidateProject[];
  experience: CandidateExperience[];
  certifications: string[];
  rawResumeText?: string;
}

export interface MarketJob {
  job_id: string;
  role: string;
  company_type: string;
  company_name: string;
  experience_level: string;
  skills: string[];
  skill_importance: Record<string, number>;
  required_skills: string[];
  optional_skills: string[];
  location: string;
  salary_range: string;
  technology_stack: string[];
  dataset_source: string;
}

export interface MarketRequirement {
  skillName: string;
  frequency: number; // percentage of jobs demanding this skill
  averageImportance: number; // 1-10
  isRequired: boolean;
  category: string;
}

export interface MarketAnalysisResult {
  targetRole: RoleType;
  totalJobsAnalyzed: number;
  marketRequirements: MarketRequirement[];
  topSkillsDemanded: { skill: string; frequency: number; importance: number }[];
  salaryDistribution: Record<string, number>;
  topCompanyTypes: string[];
  source: string;
}

export type SkillStatus = "demonstrated" | "partial" | "missing";
export type PriorityLevel = "high" | "medium" | "low";

export interface SkillGap {
  skillName: string;
  category: string;
  status: SkillStatus;
  candidateConfidence: number;
  marketImportance: number; // 1 - 10
  marketFrequency: number; // %
  isRequired: boolean;
  priority: PriorityLevel;
  reason: string;
  recommendedAction: string;
}

export interface ScoringWeights {
  skillCoverage: number;
  skillImportance: number;
  projectEvidence: number;
  marketAlignment: number;
}

export interface ReadinessScoreBreakdown {
  overallScore: number;
  skillCoverageScore: number;
  skillImportanceScore: number;
  projectEvidenceScore: number;
  marketAlignmentScore: number;
  weights: ScoringWeights;
  formulaExplanation: string;
  summaryReasoning: string;
}

export interface LearningPhase {
  phaseNumber: number;
  phaseTitle: string;
  targetSkills: string[];
  estimatedWeeks: number;
  learningObjectives: string[];
  suggestedProject: string;
  completionEvidenceRequired: string[];
  isCompleted?: boolean;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  targetedGaps: string[];
  estimatedHours: number;
  architectureBlueprint: string[];
  keyFeatures: string[];
  evidenceChecklist: string[];
  isCompleted?: boolean;
}

export type AgentNodeStatus = "pending" | "running" | "completed" | "failed";

export interface AgentExecutionNode {
  id: string;
  name: string;
  description: string;
  status: AgentNodeStatus;
  durationMs: number;
  logs: string[];
  error?: string;
}

export interface AgentEvent {
  id: string;
  timestamp: string;
  agentName: string;
  status: AgentNodeStatus;
  message: string;
  durationMs?: number;
  metadata?: Record<string, any>;
}

export interface ToolExecutionLog {
  toolName: string;
  input: any;
  output: any;
  executionTimeMs: number;
  success: boolean;
  error?: string;
}

export interface EvidenceRecord {
  id: string;
  skillName: string;
  evidenceType: "github" | "project_desc" | "certificate" | "manual";
  title: string;
  evidenceUrl?: string;
  evidenceText: string;
  verified: boolean;
  dateAdded: string;
  scoreImprovement: number;
  aiVerificationNotes?: string;
}

export interface CareerPilotAnalysisResult {
  sessionId: string;
  createdAt: string;
  candidate: CandidateProfile;
  targetRole: RoleType;
  marketAnalysis: MarketAnalysisResult;
  skillGaps: SkillGap[];
  readinessScore: ReadinessScoreBreakdown;
  learningPlan: LearningPhase[];
  recommendedProjects: ProjectRecommendation[];
  agentExecutions: AgentExecutionNode[];
  toolLogs: ToolExecutionLog[];
  evidenceRecords: EvidenceRecord[];
  isDemoMode: boolean;
  validationPassed: boolean;
  confidenceScore: number;
}
