import Link from "next/link";
import { AlertCircle, ArrowUpRight, Flame } from "lucide-react";
import { SkillGap } from "@/types";

interface GapPrioritiesProps {
  skillGaps: SkillGap[];
}

export function GapPriorities({ skillGaps }: GapPrioritiesProps) {
  // Filter for missing or partial gaps
  const missingGaps = skillGaps
    .filter((g) => g.status !== "demonstrated")
    .sort((a, b) => {
      const pOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
      return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
    })
    .slice(0, 5);

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Top Priority Skill Gaps
            </h3>
          </div>
          <Link
            href="/skills"
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            All Gaps ({skillGaps.length}) <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {missingGaps.map((gap) => (
            <div
              key={gap.skillName}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {gap.skillName}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      gap.priority === "high"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : gap.priority === "medium"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-slate-700/30 text-slate-400"
                    }`}
                  >
                    {gap.priority} Priority
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                  {gap.reason}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-slate-200">
                  {gap.marketFrequency}%
                </span>
                <span className="text-[10px] text-slate-500 block">Demand</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60">
        <Link
          href="/progress"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-950/30 border border-blue-800/40"
        >
          Submit Evidence & Close a Gap →
        </Link>
      </div>
    </div>
  );
}
