import Link from "next/link";
import { TrendingUp, DollarSign, Building2, ArrowUpRight } from "lucide-react";
import { MarketAnalysisResult } from "@/types";

interface MarketAlignmentProps {
  market: MarketAnalysisResult;
}

export function MarketAlignment({ market }: MarketAlignmentProps) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Market Intelligence Alignment
            </h3>
          </div>
          <Link
            href="/market"
            className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            Explore Dataset <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-300">Top Hiring Sectors</span>
            </div>
            <span className="text-xs font-semibold text-white">
              {market.topCompanyTypes.slice(0, 2).join(", ")}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-slate-300">Benchmark Salary Range</span>
            </div>
            <span className="text-xs font-semibold text-emerald-400">
              $85k – $125k / yr
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Top 5 Role Requirements
            </span>
            <div className="flex flex-wrap gap-1.5">
              {market.topSkillsDemanded.slice(0, 5).map((s) => (
                <span
                  key={s.skill}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1"
                >
                  {s.skill}
                  <span className="text-[10px] text-purple-400 font-mono">
                    {s.frequency}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-800/60">
        Data Source: {market.source}
      </div>
    </div>
  );
}
