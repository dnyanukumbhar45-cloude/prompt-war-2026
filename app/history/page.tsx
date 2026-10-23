"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  Compass,
  ArrowRight,
  Calendar,
  User,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { CareerPilotAnalysisResult } from "@/types";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<CareerPilotAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.session) {
          setSessions([json.session]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <History className="h-3.5 w-3.5" />
            Session Archives
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Analysis History & Audit Trail
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Revisit past agent pipeline executions and track longitudinal career readiness progression.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Run New Session
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading session history...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No historical analysis sessions recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((sess) => (
            <div
              key={sess.sessionId}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {sess.targetRole}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    [{sess.sessionId}]
                  </span>
                  {sess.isDemoMode && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Demo Mode
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> {sess.candidate.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />{" "}
                    {new Date(sess.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-blue-400">
                    {sess.readinessScore.overallScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">Readiness</span>
                </div>

                <Link
                  href={`/dashboard?sessionId=${sess.sessionId}`}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1"
                >
                  View Dashboard <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
