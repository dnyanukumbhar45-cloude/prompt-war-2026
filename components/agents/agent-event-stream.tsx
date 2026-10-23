"use client";

import { useEffect, useRef } from "react";
import { Terminal, Check, Info, AlertTriangle, ArrowRight } from "lucide-react";
import { AgentEvent } from "@/types";

interface EventStreamProps {
  events: AgentEvent[];
}

export function AgentEventStream({ events }: EventStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col h-[460px] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Agent Event Stream (SSE)
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          LIVE PIPELINE
        </span>
      </div>

      {/* Terminal Event Body */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2.5 text-slate-300"
      >
        {events.length === 0 ? (
          <div className="text-slate-600 italic">
            Connecting to orchestrator event stream...
          </div>
        ) : (
          events.map((ev, idx) => (
            <div
              key={ev.id || idx}
              className="flex items-start gap-2.5 leading-relaxed text-[11px]"
            >
              <span className="text-slate-500 shrink-0 select-none">
                [{ev.timestamp}]
              </span>

              <span
                className={`font-semibold shrink-0 px-1.5 py-0.2 rounded text-[10px] ${
                  ev.agentName === "Orchestrator"
                    ? "text-blue-300 bg-blue-950/60 border border-blue-800/40"
                    : ev.agentName === "Resume Intelligence Agent"
                    ? "text-cyan-300 bg-cyan-950/60 border border-cyan-800/40"
                    : ev.agentName === "Market Intelligence Agent"
                    ? "text-purple-300 bg-purple-950/60 border border-purple-800/40"
                    : ev.agentName === "Skill Gap Reasoning Agent"
                    ? "text-amber-300 bg-amber-950/60 border border-amber-800/40"
                    : ev.agentName === "Career Planning Agent"
                    ? "text-indigo-300 bg-indigo-950/60 border border-indigo-800/40"
                    : "text-emerald-300 bg-emerald-950/60 border border-emerald-800/40"
                }`}
              >
                {ev.agentName}
              </span>

              <span className="text-slate-200">{ev.message}</span>

              {ev.durationMs !== undefined && (
                <span className="text-slate-500 text-[10px] ml-auto shrink-0">
                  {ev.durationMs}ms
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer bar */}
      <div className="px-4 py-2 border-t border-slate-900 bg-slate-950 text-[10px] text-slate-500 flex items-center justify-between font-mono">
        <span>Events logged: {events.length}</span>
        <span>Protocol: Server-Sent Events / EventSource</span>
      </div>
    </div>
  );
}
