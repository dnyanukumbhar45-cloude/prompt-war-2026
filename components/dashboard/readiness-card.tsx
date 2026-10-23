"use client";

import { ReadinessScoreBreakdown } from "@/types";
import { Gauge, Info, HelpCircle } from "lucide-react";
import { useState } from "react";

interface ReadinessCardProps {
  readiness: ReadinessScoreBreakdown;
  targetRole: string;
}

export function ReadinessCard({ readiness, targetRole }: ReadinessCardProps) {
  const [showFormula, setShowFormula] = useState(false);

  const score = readiness.overallScore;
  const strokeColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : "#f59e0b";

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Career Readiness Index
            </h3>
          </div>
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="text-slate-400 hover:text-white transition-colors"
            title="Inspect deterministic calculation"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>

        {/* Circular / Radial progress display */}
        <div className="flex items-center gap-6 my-6">
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke={strokeColor}
                strokeWidth="8"
                strokeDasharray={289}
                strokeDashoffset={289 - (289 * score) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white">{score}%</span>
              <span className="text-[10px] text-slate-400 font-medium">Readiness</span>
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="text-xs font-semibold text-slate-200">
              Target: <span className="text-blue-400">{targetRole}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {readiness.summaryReasoning}
            </p>
          </div>
        </div>

        {/* Breakdown Sub-scores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">Skill Coverage</span>
            <span className="text-sm font-bold text-slate-200">
              {readiness.skillCoverageScore}%
            </span>
            <span className="text-[9px] text-slate-500 block">Weight: 40%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">Importance</span>
            <span className="text-sm font-bold text-slate-200">
              {readiness.skillImportanceScore}%
            </span>
            <span className="text-[9px] text-slate-500 block">Weight: 25%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">Project Evidence</span>
            <span className="text-sm font-bold text-slate-200">
              {readiness.projectEvidenceScore}%
            </span>
            <span className="text-[9px] text-slate-500 block">Weight: 20%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block">Market Align</span>
            <span className="text-sm font-bold text-slate-200">
              {readiness.marketAlignmentScore}%
            </span>
            <span className="text-[9px] text-slate-500 block">Weight: 15%</span>
          </div>
        </div>
      </div>

      {/* Formula Explanation drawer */}
      {showFormula && (
        <div className="mt-4 p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[11px] font-mono text-blue-200">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-blue-300">
            <Info className="h-3.5 w-3.5" />
            Deterministic Formula (Zero Arbitrary Scoring):
          </div>
          {readiness.formulaExplanation}
        </div>
      )}
    </div>
  );
}
