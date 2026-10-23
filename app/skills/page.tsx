"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { SkillGap, CareerPilotAnalysisResult } from "@/types";

export default function SkillsPage() {
  const [session, setSession] = useState<CareerPilotAnalysisResult | null>(null);
  const [filter, setFilter] = useState<string>("all");
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
        Loading skill analysis...
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

  const filteredGaps = session.skillGaps.filter((g) => {
    if (filter === "demonstrated") return g.status === "demonstrated";
    if (filter === "missing") return g.status === "missing";
    if (filter === "high-priority") return g.priority === "high" && g.status !== "demonstrated";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <BrainCircuit className="h-3.5 w-3.5" />
            Skill Gap Reasoning Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Technical Competencies & Gap Analysis
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Deterministic gap classification comparing candidate resume evidence against {session.targetRole} market benchmarks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["all", "high-priority", "missing", "demonstrated"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGaps.map((gap) => {
          const isDemonstrated = gap.status === "demonstrated";
          const isHighPriority = gap.priority === "high";

          return (
            <div
              key={gap.skillName}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isDemonstrated
                  ? "bg-slate-950/40 border-slate-800/80"
                  : isHighPriority
                  ? "bg-red-950/10 border-red-900/40 shadow-sm shadow-red-900/10"
                  : "bg-slate-950/60 border-slate-800"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                      {gap.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {gap.skillName}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isDemonstrated
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : isHighPriority
                        ? "bg-red-500/10 text-red-400 border border-red-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {gap.status} · {gap.priority}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800/60">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Candidate Confidence</span>
                    <span className="font-mono font-bold text-slate-200">
                      {Math.round(gap.candidateConfidence * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Hiring Demand</span>
                    <span className="font-mono font-bold text-purple-400">
                      {gap.marketFrequency}% of jobs
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-semibold text-slate-400 block">
                    Reasoning / Evidence:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {gap.reason}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">
                  {gap.isRequired ? "Mandatory Core Requirement" : "Preferred Competency"}
                </span>
                {!isDemonstrated && (
                  <Link
                    href={`/progress?skill=${encodeURIComponent(gap.skillName)}`}
                    className="text-blue-400 hover:text-blue-300 font-semibold text-xs flex items-center gap-1"
                  >
                    Submit Proof →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
