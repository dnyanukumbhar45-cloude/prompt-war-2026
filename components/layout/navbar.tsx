"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  BrainCircuit,
  TrendingUp,
  Milestone,
  FolderGit2,
  Sparkles,
  Settings,
  History,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setIsDemoMode(data.settings.demoMode);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Skill Gap", href: "/skills", icon: BrainCircuit },
    { label: "Market Intel", href: "/market", icon: TrendingUp },
    { label: "Roadmap", href: "/roadmap", icon: Milestone },
    { label: "Projects", href: "/projects", icon: FolderGit2 },
    { label: "Evidence & Progress", href: "/progress", icon: Sparkles },
    { label: "History", href: "/history", icon: History },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0b0f17]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0b0f17]/80">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              CareerPilot <span className="text-blue-400 font-mono text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Agentic Career Intelligence</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Mode Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isDemoMode
                ? "bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50"
                : "bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isDemoMode ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
            {isDemoMode ? "Demo Mode (Offline Fallback)" : "Live AI Mode (Gemini 2.5)"}
          </Link>

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Analyze Career
          </Link>
        </div>
      </div>
    </header>
  );
}
