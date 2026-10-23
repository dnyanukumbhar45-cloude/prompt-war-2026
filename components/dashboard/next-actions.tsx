import Link from "next/link";
import { Sparkles, ArrowRight, FolderGit2, CheckCircle2 } from "lucide-react";
import { ProjectRecommendation, LearningPhase } from "@/types";

interface NextActionsProps {
  recommendedProjects: ProjectRecommendation[];
  learningPlan: LearningPhase[];
}

export function NextActions({
  recommendedProjects,
  learningPlan,
}: NextActionsProps) {
  const topProject = recommendedProjects[0];
  const currentPhase = learningPlan[0];

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Recommended Next Action
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            High Impact
          </span>
        </div>

        {topProject && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  Recommended Capstone Project
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {topProject.title}
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                ~{topProject.estimatedHours} hrs
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {topProject.description}
            </p>

            <div>
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">
                Simultaneously Closes Gaps:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {topProject.targetedGaps.map((gap) => (
                  <span
                    key={gap}
                    className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-[11px] font-medium"
                  >
                    ✓ {gap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPhase && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Current Phase:</span>
            <span className="font-semibold text-slate-200">
              Phase 1: {currentPhase.phaseTitle} ({currentPhase.estimatedWeeks} wks)
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-800/60">
        <Link
          href="/projects"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg text-xs transition-colors"
        >
          <FolderGit2 className="h-3.5 w-3.5" />
          View Project Architecture
        </Link>
        <Link
          href="/roadmap"
          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
        >
          Full Roadmap →
        </Link>
      </div>
    </div>
  );
}
