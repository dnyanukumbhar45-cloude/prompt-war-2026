import { AgentExecutionNode, ToolExecutionLog } from "@/types";
import { Bot, CheckCircle2, Terminal, Wrench } from "lucide-react";

interface AgentActivityProps {
  agentExecutions: AgentExecutionNode[];
  toolLogs: ToolExecutionLog[];
}

export function AgentActivity({
  agentExecutions,
  toolLogs,
}: AgentActivityProps) {
  const totalExecutionTimeMs = agentExecutions.reduce(
    (acc, curr) => acc + curr.durationMs,
    0
  );

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Recent Multi-Agent Pipeline Activity
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Total Duration: {(totalExecutionTimeMs / 1000).toFixed(2)}s
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Agent Nodes Summary */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 block mb-1">
            Autonomous Agents
          </span>
          {agentExecutions.map((node) => (
            <div
              key={node.id}
              className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">{node.name}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {(node.durationMs / 1000).toFixed(2)}s
              </span>
            </div>
          ))}
        </div>

        {/* Real Tool Execution Logs */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 block mb-1">
            Explicit Tool Calls ({toolLogs.length})
          </span>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {toolLogs.length === 0 ? (
              <div className="p-3 text-xs text-slate-500 bg-slate-950/40 rounded-xl">
                No tool calls logged in this view.
              </div>
            ) : (
              toolLogs.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/60 flex items-center justify-between text-[11px] font-mono"
                >
                  <div className="flex items-center gap-1.5 text-blue-300 truncate max-w-[200px]">
                    <Wrench className="h-3 w-3 text-slate-400 shrink-0" />
                    <span>{tool.toolName}()</span>
                  </div>
                  <span className="text-emerald-400 text-[10px]">
                    ✓ {tool.executionTimeMs}ms
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
