"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { AgentExecutionNode, AgentEvent, CareerPilotAnalysisResult } from "@/types";
import { AgentWorkflowVisualizer } from "@/components/agents/agent-workflow-visualizer";
import { AgentEventStream } from "@/components/agents/agent-event-stream";

const INITIAL_NODES: AgentExecutionNode[] = [
  {
    id: "orchestrator",
    name: "Master Orchestrator",
    description: "Coordinates multi-agent flow, lifecycle management, and event streaming.",
    status: "running",
    durationMs: 0,
    logs: ["Initializing pipeline..."],
  },
  {
    id: "resume-intelligence-agent",
    name: "Resume Intelligence Agent",
    description: "Parses candidate profile, extract technical competencies with concrete evidence.",
    status: "pending",
    durationMs: 0,
    logs: [],
  },
  {
    id: "market-intelligence-agent",
    name: "Market Intelligence Agent",
    description: "Queries role benchmark demand, skill frequencies, and salary distributions.",
    status: "pending",
    durationMs: 0,
    logs: [],
  },
  {
    id: "skill-gap-reasoning-agent",
    name: "Skill Gap Reasoning Agent",
    description: "Computes deterministic coverage and mathematical weighted readiness score.",
    status: "pending",
    durationMs: 0,
    logs: [],
  },
  {
    id: "career-planning-agent",
    name: "Career Planning Agent",
    description: "Synthesizes multi-phase learning roadmap and targeted project blueprints.",
    status: "pending",
    durationMs: 0,
    logs: [],
  },
  {
    id: "validation-guardrail-agent",
    name: "Validation & Guardrail Agent",
    description: "Enforces strict schemas, score bounds, hallucination prevention, and injection safety.",
    status: "pending",
    durationMs: 0,
    logs: [],
  },
];

export default function AnalyzePage() {
  const router = useRouter();

  const [nodes, setNodes] = useState<AgentExecutionNode[]>(INITIAL_NODES);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string>("orchestrator");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<CareerPilotAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [executionStartTime, setExecutionStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<string>("0.0");

  useEffect(() => {
    let timer: any;
    if (!isCompleted && !errorMsg) {
      timer = setInterval(() => {
        setElapsedSeconds(((Date.now() - executionStartTime) / 1000).toFixed(1));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [executionStartTime, isCompleted, errorMsg]);

  useEffect(() => {
    let isCancelled = false;

    async function startExecution() {
      setExecutionStartTime(Date.now());

      let payload: any = {
        targetRole: "Full Stack Developer",
      };

      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("careerpilot_analysis_input");
        if (stored) {
          try {
            payload = JSON.parse(stored);
          } catch {}
        }
      }

      try {
        const response = await fetch("/api/analyze/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok || !response.body) {
          throw new Error("Failed to connect to agent streaming endpoint");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!isCancelled) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const message = JSON.parse(line.slice(6));

                if (message.type === "agent_event") {
                  const ev: AgentEvent = message.event;
                  setEvents((prev) => [...prev, ev]);

                  // Update node visual state
                  setNodes((currentNodes) =>
                    currentNodes.map((node) => {
                      if (
                        node.name.toLowerCase().includes(ev.agentName.toLowerCase()) ||
                        ev.agentName.toLowerCase().includes(node.name.toLowerCase())
                      ) {
                        return {
                          ...node,
                          status: ev.status,
                          durationMs: ev.durationMs || node.durationMs,
                          logs: [...node.logs, ev.message],
                        };
                      }
                      return node;
                    })
                  );

                  if (ev.status === "running") {
                    setActiveAgentId(ev.agentName);
                  }
                } else if (message.type === "complete") {
                  const result: CareerPilotAnalysisResult = message.result;
                  setAnalysisResult(result);
                  setIsCompleted(true);
                  setActiveAgentId("");

                  // Mark all nodes completed
                  setNodes((current) =>
                    current.map((n) => ({
                      ...n,
                      status: "completed",
                    }))
                  );
                } else if (message.type === "error") {
                  setErrorMsg(message.error || "Analysis error");
                }
              } catch (parseErr) {
                console.error("Stream parse error:", parseErr);
              }
            }
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          setErrorMsg(err?.message || "Connection to orchestrator lost.");
        }
      }
    }

    startExecution();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Live Multi-Agent Orchestration
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            CareerPilot AI — Execution Pipeline
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time execution of Resume Intelligence, Market Query, Gap Reasoning, Planning, and Validation agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-mono">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400">Time:</span>
            <span className="font-bold text-white">{elapsedSeconds}s</span>
          </div>

          {isCompleted && (
            <Link
              href={`/dashboard?sessionId=${analysisResult?.sessionId || ""}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md shadow-blue-600/30 transition-colors"
            >
              Go to Career Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && analysisResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-emerald-950/30 to-slate-900/60 border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              All Agents Completed Successfully & Verified
            </div>
            <h3 className="text-lg font-bold text-white">
              Career Readiness Calculated: {analysisResult.readinessScore.overallScore}%
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              {analysisResult.readinessScore.summaryReasoning}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/skills"
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
            >
              View Skill Gaps
            </Link>
            <Link
              href={`/dashboard?sessionId=${analysisResult.sessionId}`}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              Open Dashboard →
            </Link>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span>Execution alert: {errorMsg}. Running with cached benchmark fallback.</span>
          </div>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-900 text-white font-semibold"
          >
            Continue to Dashboard
          </Link>
        </div>
      )}

      {/* Main Dual View: Visualizer & Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Workflow Visualizer (5 cols) */}
        <div className="lg:col-span-5">
          <AgentWorkflowVisualizer nodes={nodes} activeAgentId={activeAgentId} />
        </div>

        {/* Right: Live Event Stream (7 cols) */}
        <div className="lg:col-span-7">
          <AgentEventStream events={events} />
        </div>
      </div>
    </div>
  );
}
