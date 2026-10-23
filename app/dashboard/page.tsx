"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Briefcase,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Layers,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { CareerPilotAnalysisResult } from "@/types";
import { ReadinessCard } from "@/components/dashboard/readiness-card";
import { SkillsChart } from "@/components/dashboard/skills-chart";
import { GapPriorities } from "@/components/dashboard/gap-priorities";
import { MarketAlignment } from "@/components/dashboard/market-alignment";
import { NextActions } from "@/components/dashboard/next-actions";
import { AgentActivity } from "@/components/dashboard/agent-activity";

function DashboardContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [session, setSession] = useState<CareerPilotAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const url = sessionId
          ? `/api/dashboard?sessionId=${sessionId}`
          : "/api/dashboard";
        const res = await fetch(url);
        const json = await res.json();

        if (json.success && json.session) {
          setSession(json.session);
        } else {
          setError(json.error || "Failed to load dashboard data");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch session");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <h3 className="text-base font-semibold text-white">
          Loading Career Intelligence Dashboard...
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Retrieving agent execution graph and market analytics
        </p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-10 w-10 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Dashboard Initialization</h2>
        <p className="text-slate-400 text-sm mt-2">{error || "No active session found."}</p>
        <Link
          href="/onboarding"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md"
        >
          Start New Career Analysis
        </Link>
      </div>
    );
  }

  const demonstratedSkillsCount = session.skillGaps.filter(
    (g) => g.status === "demonstrated"
  ).length;

  const missingGapsCount = session.skillGaps.filter(
    (g) => g.status !== "demonstrated"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
              Target Role
            </span>
            <span className="text-xs text-slate-400">
              Session ID: <span className="font-mono text-slate-300">{session.sessionId}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {session.targetRole}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {session.candidate.name}
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
              {session.candidate.degree} ({session.candidate.graduationYear})
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Validation Guard: Approved
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/progress"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Submit Evidence
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* 4 Quick Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Career Readiness</span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {session.readinessScore.overallScore}%
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Compass className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Demonstrated Skills</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">
              {demonstratedSkillsCount}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Identified Gaps</span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">
              {missingGapsCount}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Project Blueprints</span>
            <span className="text-2xl font-bold text-purple-400 mt-1 block">
              {session.recommendedProjects.length}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <ReadinessCard
            readiness={session.readinessScore}
            targetRole={session.targetRole}
          />
        </div>
        <div className="lg:col-span-7 flex flex-col">
          <SkillsChart skillGaps={session.skillGaps} />
        </div>
      </div>

      {/* Main Grid: Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <GapPriorities skillGaps={session.skillGaps} />
        <MarketAlignment market={session.marketAnalysis} />
        <NextActions
          recommendedProjects={session.recommendedProjects}
          learningPlan={session.learningPlan}
        />
      </div>

      {/* Multi-Agent Execution & Tool Telemetry */}
      <AgentActivity
        agentExecutions={session.agentExecutions}
        toolLogs={session.toolLogs}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <h3 className="text-base font-semibold text-white">
            Loading Career Intelligence Dashboard...
          </h3>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
