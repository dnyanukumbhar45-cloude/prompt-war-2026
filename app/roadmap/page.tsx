"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Milestone,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  FolderGit2,
  BookOpen,
} from "lucide-react";
import { CareerPilotAnalysisResult, LearningPhase } from "@/types";

export default function RoadmapPage() {
  const [session, setSession] = useState<CareerPilotAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.session) {
          setSession(json.session);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400">
        Loading personalized roadmap...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-slate-400">No active session found.</p>
        <Link href="/onboarding" className="text-blue-400 underline mt-2 block">
          Run an analysis first
        </Link>
      </div>
    );
  }

  const roadmap = session.learningPlan;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Milestone className="h-3.5 w-3.5" />
            Career Planning Agent
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Personalized Career Learning Roadmap
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sequenced milestones specifically designed to bridge your highest-priority gaps for {session.targetRole}.
          </p>
        </div>

        <Link
          href="/progress"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Mark Milestones Completed
        </Link>
      </div>

      {/* Phased Roadmap Timeline */}
      <div className="space-y-6">
        {roadmap.map((phase, idx) => (
          <div
            key={phase.phaseNumber}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  {phase.phaseNumber}
                </span>
                <div>
                  <span className="text-[10px] text-blue-400 uppercase tracking-wider font-mono">
                    Phase 0{phase.phaseNumber}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {phase.phaseTitle}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  Estimated Effort: {phase.estimatedWeeks} Weeks
                </span>
              </div>
            </div>

            {/* Target Skills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">Target Skills:</span>
              {phase.targetSkills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-0.5 rounded-lg bg-blue-950/50 border border-blue-800/40 text-blue-300 text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Objectives & Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-blue-400" />
                  Learning Objectives
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {phase.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <FolderGit2 className="h-3.5 w-3.5 text-emerald-400" />
                  Suggested Milestone Project & Evidence
                </span>
                <p className="text-xs font-semibold text-emerald-300">
                  {phase.suggestedProject}
                </p>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300 block">Required Evidence:</span>
                  {phase.completionEvidenceRequired.map((ev, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
