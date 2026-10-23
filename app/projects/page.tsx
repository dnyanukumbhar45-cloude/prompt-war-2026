"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Code,
} from "lucide-react";
import { CareerPilotAnalysisResult, ProjectRecommendation } from "@/types";

export default function ProjectsPage() {
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
        Loading project recommendations...
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

  const projects = session.recommendedProjects;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <FolderGit2 className="h-3.5 w-3.5" />
            Capstone Project Recommendation Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            High-Impact Portfolio Capstone Blueprints
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Projects engineered to demonstrate multiple missing competencies simultaneously for {session.targetRole}.
          </p>
        </div>

        <Link
          href="/progress"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Verify Built Project
        </Link>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono">
                    Targeted Gaps Multi-solver
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {proj.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0">
                  ~{proj.estimatedHours} hrs
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {proj.description}
              </p>

              {/* Targeted Gaps Covered */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Simultaneously Validates Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.targetedGaps.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture Blueprint */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  Architecture Blueprint
                </span>
                <ul className="space-y-1 text-xs text-slate-400">
                  {proj.architectureBlueprint.map((arc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{arc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evidence Checklist */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-slate-300 block">
                  Required Verification Checklist:
                </span>
                {proj.evidenceChecklist.map((chk, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>{chk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Blueprint ID: {proj.id}
              </span>
              <Link
                href={`/progress?project=${encodeURIComponent(proj.title)}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-colors"
              >
                Submit Evidence for this Project <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
