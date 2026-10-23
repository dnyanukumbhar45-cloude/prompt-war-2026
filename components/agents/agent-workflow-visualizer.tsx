"use client";

import {
  Compass,
  FileSearch,
  BarChart2,
  Brain,
  Milestone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { AgentExecutionNode } from "@/types";

interface VisualizerProps {
  nodes: AgentExecutionNode[];
  activeAgentId?: string;
}

export function AgentWorkflowVisualizer({
  nodes,
  activeAgentId,
}: VisualizerProps) {
  const agentIcons: Record<string, any> = {
    "orchestrator": Compass,
    "resume-intelligence-agent": FileSearch,
    "market-intelligence-agent": BarChart2,
    "skill-gap-reasoning-agent": Brain,
    "career-planning-agent": Milestone,
    "validation-guardrail-agent": ShieldCheck,
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" />
            Agent Workflow Visualizer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-agent architecture execution graph with deterministic node timing
          </p>
        </div>
        <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
          DAG Pipeline
        </span>
      </div>

      <div className="space-y-3">
        {nodes.map((node, index) => {
          const Icon = agentIcons[node.id] || Compass;
          const isActive = node.status === "running" || activeAgentId === node.id;
          const isCompleted = node.status === "completed";
          const isFailed = node.status === "failed";
          const isPending = node.status === "pending";

          return (
            <div
              key={node.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isActive
                  ? "bg-blue-950/30 border-blue-500 shadow-md shadow-blue-500/10"
                  : isCompleted
                  ? "bg-slate-950/60 border-slate-800/90 hover:border-slate-700"
                  : isFailed
                  ? "bg-red-950/20 border-red-800/60"
                  : "bg-slate-950/30 border-slate-900 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isActive
                        ? "bg-blue-600 text-white animate-pulse"
                        : isCompleted
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : isFailed
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">0{index + 1}</span>
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        {node.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {node.description}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0 flex items-center gap-1.5">
                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Running
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      {(node.durationMs / 1000).toFixed(2)}s
                    </span>
                  )}
                  {isFailed && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                      <AlertTriangle className="h-3 w-3" />
                      Failed
                    </span>
                  )}
                  {isPending && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 px-2 py-0.5">
                      <Clock className="h-3 w-3" />
                      Waiting
                    </span>
                  )}
                </div>
              </div>

              {/* Node Internal Execution Logs Preview */}
              {node.logs && node.logs.length > 0 && isCompleted && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 pl-11">
                  <span className="text-[10px] text-slate-400 font-mono block">
                    ✓ {node.logs[node.logs.length - 1]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
