"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Database,
  Building,
  DollarSign,
  CheckCircle,
  HelpCircle,
  Briefcase,
  Layers,
} from "lucide-react";
import { MarketAnalysisResult, RoleType } from "@/types";

export default function MarketPage() {
  const [targetRole, setTargetRole] = useState<RoleType>("Full Stack Developer");
  const [market, setMarket] = useState<MarketAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  const roles: RoleType[] = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "Data Scientist",
    "AI/ML Engineer",
    "Cloud Engineer",
    "Software Engineer",
  ];

  useEffect(() => {
    setLoading(true);
    fetch("/api/market/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetRole }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.market) {
          setMarket(json.market);
        }
      })
      .finally(() => setLoading(false));
  }, [targetRole]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Market Intelligence Agent
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Role Benchmark Analytics & Demand Trends
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time aggregated market requirements, skill demand frequencies, and hiring distributions.
          </p>
        </div>

        {/* Role Selector */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Target Role Query
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value as RoleType)}
            className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dataset Source Alert Note */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 flex items-center justify-between text-xs text-purple-200">
        <div className="flex items-center gap-2.5">
          <Database className="h-4 w-4 text-purple-400 shrink-0" />
          <span>
            <strong className="text-white">Dataset Source:</strong> {market?.source || "Demo Market Dataset (100+ Synthetic Job Postings Benchmark)"}. Transparently labeled as demo data when BigQuery cloud table is unconfigured.
          </span>
        </div>
        <span className="font-mono text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-700/50">
          {market?.totalJobsAnalyzed || 0} Records
        </span>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading market analysis...</div>
      ) : market ? (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Total Analyzed Roles</span>
              <h3 className="text-2xl font-bold text-white">
                {market.totalJobsAnalyzed} Postings
              </h3>
              <p className="text-[11px] text-slate-500">
                Segmented across startups, enterprise, and fintech
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Key Competencies</span>
              <h3 className="text-2xl font-bold text-purple-400">
                {market.marketRequirements.length} Tracked Skills
              </h3>
              <p className="text-[11px] text-slate-500">
                Ranked by demand frequency and hiring weight
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Active Hiring Sectors</span>
              <h3 className="text-2xl font-bold text-emerald-400">
                {market.topCompanyTypes.length} Sectors
              </h3>
              <p className="text-[11px] text-slate-500">
                {market.topCompanyTypes.join(", ")}
              </p>
            </div>
          </div>

          {/* Skill Demand Table */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">
              Skill Frequency & Importance Index ({market.targetRole})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Skill Name</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Requirement Type</th>
                    <th className="pb-3 font-semibold">Demand Frequency</th>
                    <th className="pb-3 font-semibold">Avg Importance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {market.marketRequirements.map((req) => (
                    <tr key={req.skillName} className="hover:bg-slate-800/30">
                      <td className="py-3 font-bold text-white">{req.skillName}</td>
                      <td className="py-3 text-slate-400">{req.category}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            req.isRequired
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {req.isRequired ? "Required Core" : "Optional / Preferred"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${req.frequency}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-300">
                            {req.frequency}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-slate-300">
                        {req.averageImportance} / 10
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
