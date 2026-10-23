import Link from "next/link";
import { Cpu, Database, Shield, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#070a10] text-slate-400 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="font-semibold text-slate-200">CareerPilot AI</span>
          <span className="text-slate-500">— Autonomous Multi-Agent Career Optimization</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Cpu className="h-3 w-3 text-blue-400" /> Google Gemini 2.5
          </span>
          <span className="inline-flex items-center gap-1">
            <Database className="h-3 w-3 text-purple-400" /> BigQuery / Benchmark Dataset
          </span>
          <span className="inline-flex items-center gap-1">
            <Shield className="h-3 w-3 text-emerald-400" /> Prompt Injection Guardrails
          </span>
        </div>

        <div className="text-[11px] text-slate-500">
          Built for AI Hackathon · Deterministic Reasoning & Verified Evidence
        </div>
      </div>
    </footer>
  );
}
