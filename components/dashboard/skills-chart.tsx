"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SkillGap } from "@/types";
import { BarChart3 } from "lucide-react";

interface SkillsChartProps {
  skillGaps: SkillGap[];
}

export function SkillsChart({ skillGaps }: SkillsChartProps) {
  // Select top 8 critical skills for visualization
  const topSkills = skillGaps.slice(0, 8);

  const chartData = topSkills.map((gap) => {
    const candidateScore =
      gap.status === "demonstrated"
        ? Math.round(gap.candidateConfidence * 100)
        : gap.status === "partial"
        ? 45
        : 0;

    const marketDemand = gap.marketFrequency;

    return {
      skill: gap.skillName,
      "Your Demonstrated Level": candidateScore,
      "Market Demand %": marketDemand,
      Gap: Math.max(0, marketDemand - candidateScore),
    };
  });

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Competency vs Market Benchmark
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">Recharts Visualization</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="skill"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              angle={-25}
              textAnchor="end"
            />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#f8fafc",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
              iconType="circle"
            />
            <Bar
              dataKey="Your Demonstrated Level"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="Market Demand %"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
