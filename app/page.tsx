import Link from "next/link";
import {
  Compass,
  ArrowRight,
  BrainCircuit,
  TrendingUp,
  Milestone,
  CheckCircle2,
  Cpu,
  ShieldAlert,
  Sparkles,
  Layers,
  BarChart3,
  Bot,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const agentWorkflowSteps = [
    { name: "Candidate Input", desc: "Profile & Resume upload" },
    { name: "Resume Extraction", desc: "Evidence-backed skill parsing" },
    { name: "Market Intelligence", desc: "100+ job requirements" },
    { name: "Deterministic Reasoning", desc: "Mathematical gap scoring" },
    { name: "Tool Execution", desc: "Explicit function calls" },
    { name: "Guardrail Validation", desc: "Injection & bounds checks" },
    { name: "Adaptive Action Plan", desc: "Milestones & capstones" },
    { name: "Evidence Re-Evaluation", desc: "Dynamic score updates" },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-700/40 text-blue-300 text-xs font-medium mb-6">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>Hackathon Prototype · Multi-Agent Career Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          CareerPilot <span className="text-blue-500">AI</span>
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-slate-300 mt-4">
          Your AI Career Intelligence Agent
        </p>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mt-4 leading-relaxed">
          Analyze your skills, understand real job-market requirements, identify
          your highest-impact gaps, and receive an adaptive career action plan.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all text-sm"
          >
            Start Career Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm"
          >
            Explore Live Dashboard
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Deterministic Scoring (Not Guessed)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>100+ Role Benchmark Dataset</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Prompt Injection Guardrails</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Dynamic Evidence Progress Loop</span>
          </div>
        </div>
      </section>

      {/* 3 Core Value Propositions */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-wider text-blue-400 font-bold">
            Value Propositions
          </h2>
          <p className="text-2xl font-bold text-white mt-1">
            Beyond Static Resume Keyword Matchers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Understand Your Current Skills
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Extract verified technical skills from your resume with concrete textual evidence.
              Our agent prevents hallucinations by requiring verifiable citations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Discover Market-Driven Skill Gaps
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Compare your competencies against real job market requirements across 100+ job records.
              Identify high, medium, and low-priority gaps based on hiring demand.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Milestone className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Get an Adaptive Action Plan
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Receive a sequenced milestone roadmap and recommended capstone projects that bundle
              multiple missing skills. Submit GitHub evidence to recalculate your career readiness score.
            </p>
          </div>
        </div>
      </section>

      {/* Agentic Workflow Pipeline Visualizer */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-2">
            <Bot className="h-3.5 w-3.5 text-blue-400" />
            Agentic AI Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Autonomous Multi-Agent Orchestration
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2">
            The platform coordinates specialized agents across data ingestion, market queries,
            transparent scoring, validation, and progress tracking.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {agentWorkflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0e1420] border border-slate-800/90 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold">
                  STEP 0{idx + 1}
                </span>
                <h4 className="text-sm font-semibold text-white mt-1">
                  {step.name}
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-gradient-to-b from-blue-950/20 to-transparent border-t border-slate-800/80 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white">
            Ready to Evaluate Your Career Readiness?
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
            Test the live hackathon workflow with our preloaded final-year Computer Science
            demo profile or upload your own resume.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              Launch Hackathon Demo
              <Zap className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
