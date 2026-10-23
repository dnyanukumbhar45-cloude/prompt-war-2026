"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Github,
  FileCode,
  Award,
  Link2,
  Loader2,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { CareerPilotAnalysisResult, EvidenceRecord } from "@/types";

function ProgressContent() {
  const searchParams = useSearchParams();
  const preselectedSkill = searchParams.get("skill") || "React";

  const [session, setSession] = useState<CareerPilotAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastUpdateResult, setLastUpdateResult] = useState<any>(null);

  const [form, setForm] = useState({
    skillName: preselectedSkill,
    evidenceType: "github" as "github" | "project_desc" | "certificate" | "manual",
    title: `Full-Stack ${preselectedSkill} Integration Application`,
    evidenceUrl: "https://github.com/aaravsharma/student-placement-portal",
    evidenceText: `Architected and implemented a modular ${preselectedSkill} application featuring reusable component hierarchy, React hooks (useState, useEffect, useMemo), custom context providers, and typed API consumption.`,
  });

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.session) {
          setSession(json.session);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleQuickDemoSubmit = async (skillToProve: string = "React") => {
    setIsSubmitting(true);
    try {
      const payload = {
        sessionId: session?.sessionId,
        skillName: skillToProve,
        evidenceType: "github",
        title: `Production ${skillToProve} Capstone Project`,
        evidenceUrl: `https://github.com/aaravsharma/fullstack-${skillToProve.toLowerCase()}-app`,
        evidenceText: `Engineered complete web application utilizing ${skillToProve} with state management, unit tests, and production REST API integration.`,
      };

      const res = await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setLastUpdateResult(json);
        if (json.session) {
          setSession(json.session);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session?.sessionId,
          ...form,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setLastUpdateResult(json);
        if (json.session) {
          setSession(json.session);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400">
        Loading evidence verification interface...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-slate-400">No active session found.</p>
        <Link href="/onboarding" className="text-blue-400 underline mt-2 block">
          Run an analysis first
        </Link>
      </div>
    );
  }

  const missingSkills = session.skillGaps.filter((g) => g.status !== "demonstrated");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Agentic Evidence Loop & Adaptive Re-Evaluation
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Evidence Verification & Score Recalculation
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Submit demonstrable proof (GitHub repository, project writeup, certification) to close skill gaps and dynamically recalculate your Career Readiness score.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Score:</span>
          <span className="text-lg font-extrabold text-blue-400">
            {session.readinessScore.overallScore}%
          </span>
        </div>
      </div>

      {/* Dynamic Recalculation Score Delta Card (Shown when an evidence is submitted) */}
      {lastUpdateResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-blue-950/30 border border-emerald-500/50 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">
                Evidence Verified & Career Readiness Recalculated!
              </span>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
              +{lastUpdateResult.scoreDelta}% Improvement
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Previous Score</span>
              <span className="text-base font-bold text-slate-300">
                {lastUpdateResult.previousScore}%
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-emerald-400" />
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-emerald-500/40">
              <span className="text-emerald-400 block text-[10px] font-bold">New Score</span>
              <span className="text-base font-bold text-emerald-300">
                {lastUpdateResult.newScore}%
              </span>
            </div>
            <div className="text-slate-300 text-xs leading-relaxed max-w-lg pl-2">
              {lastUpdateResult.evidenceRecord.aiVerificationNotes}
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 underline"
            >
              View Updated Dashboard Overview →
            </Link>
          </div>
        </div>
      )}

      {/* One-Click Hackathon Demo Shortcut Card */}
      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-bold">
            Hackathon 1-Click Verification Demo
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Demonstrate React Gap Closure Instantly
          </h4>
          <p className="text-xs text-slate-400">
            Submit verified GitHub capstone project for React to trigger evaluateSkillEvidence() and recalculateReadiness().
          </p>
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleQuickDemoSubmit("React")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shrink-0 shadow-md shadow-blue-500/20"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Prove React Skill (+7% Readiness)
        </button>
      </div>

      {/* Evidence Submission Form */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-blue-400" />
          Submit Custom Evidence for Skill Gap
        </h3>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Skill Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Skill Gap to Close
              </label>
              <select
                value={form.skillName}
                onChange={(e) => setForm({ ...form, skillName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {missingSkills.map((gap) => (
                  <option key={gap.skillName} value={gap.skillName}>
                    {gap.skillName} ({gap.priority} priority gap)
                  </option>
                ))}
              </select>
            </div>

            {/* Evidence Type */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Evidence Format
              </label>
              <select
                value={form.evidenceType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    evidenceType: e.target.value as any,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="github">GitHub Project Repository</option>
                <option value="project_desc">Production Project Description</option>
                <option value="certificate">Accredited Course / Certification</option>
                <option value="manual">Portfolio Demo Entry</option>
              </select>
            </div>

            {/* Evidence Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Project / Artifact Title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Evidence URL */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Repository or Verification URL
              </label>
              <input
                type="url"
                value={form.evidenceUrl}
                onChange={(e) => setForm({ ...form, evidenceUrl: e.target.value })}
                placeholder="https://github.com/username/project"
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Evidence Technical Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Detailed Technical Implementation Summary
              </label>
              <textarea
                rows={4}
                required
                value={form.evidenceText}
                onChange={(e) => setForm({ ...form, evidenceText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg p-3 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Evaluated by evaluateSkillEvidence() tool for architectural depth, unit test coverage, and framework proficiency.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-colors"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Submit Evidence & Recalculate
            </button>
          </div>
        </form>
      </div>

      {/* Previously Verified Evidence List */}
      {session.evidenceRecords && session.evidenceRecords.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">
            Verified Artifact Ledger ({session.evidenceRecords.length})
          </h3>
          <div className="space-y-2">
            {session.evidenceRecords.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{ev.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                      {ev.skillName} Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{ev.evidenceText}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-emerald-400 font-bold">
                    +{ev.scoreImprovement}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {new Date(ev.dateAdded).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 text-slate-400">
          Loading evidence verification interface...
        </div>
      }
    >
      <ProgressContent />
    </Suspense>
  );
}
