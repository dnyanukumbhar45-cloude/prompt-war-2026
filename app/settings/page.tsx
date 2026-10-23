"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Shield,
  Cpu,
  Key,
  Sliders,
  Database,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    demoMode: true,
    geminiModel: "gemini-2.5-flash",
    hasApiKey: false,
    bigQueryConnected: false,
    firebaseConnected: false,
    weights: {
      skillCoverage: 0.4,
      skillImportance: 0.25,
      projectEvidence: 0.2,
      marketAlignment: 0.15,
    },
  });

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.settings) {
          setSettings(json.settings);
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          demoMode: settings.demoMode,
          geminiModel: settings.geminiModel,
          apiKey: apiKeyInput ? apiKeyInput : undefined,
          weights: settings.weights,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSettings(json.settings);
        setMessage("Settings saved successfully!");
        setApiKeyInput("");
      }
    } catch (err: any) {
      setMessage("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <Settings className="h-3.5 w-3.5" />
          Environment & Engine Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Application & AI Engine Configuration
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure Google Gemini model selection, Demo vs Live AI mode, and scoring weights.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Mode Selector */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-400" />
                Execution Mode
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle between zero-dependency deterministic demo fallback and live Google Gemini API calls.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!settings.demoMode}
                onChange={(e) =>
                  setSettings({ ...settings, demoMode: !e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div
            className={`p-3 rounded-xl border text-xs font-medium ${
              settings.demoMode
                ? "bg-amber-950/20 border-amber-800/40 text-amber-300"
                : "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
            }`}
          >
            {settings.demoMode
              ? "🧪 Demo Mode Active: Guaranteed deterministic execution using 100+ benchmark market dataset and local mock LLM agents. Never breaks during presentation."
              : "⚡ Live AI Mode Active: Real-time queries sent to Google Gemini 2.5 API with strict prompt injection guardrails."}
          </div>
        </div>

        {/* Gemini API Key Configuration */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-purple-400" />
            Google Gemini API Key
          </h3>
          <p className="text-xs text-slate-400">
            Keys are strictly processed server-side in secure Node.js API handlers and are never exposed in browser JavaScript bundles.
          </p>

          <div className="flex items-center gap-3">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={
                settings.hasApiKey
                  ? "•••••••••••••••••••••••• (API Key Configured)"
                  : "Enter GEMINI_API_KEY (AIza...)"
              }
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Model Selection */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Gemini Model Selection
            </label>
            <select
              value={settings.geminiModel}
              onChange={(e) =>
                setSettings({ ...settings, geminiModel: e.target.value })
              }
              className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="gemini-2.5-flash">
                gemini-2.5-flash (Recommended: Low latency agent operations)
              </option>
              <option value="gemini-2.5-pro">
                gemini-2.5-pro (Deep reasoning & capstone planning)
              </option>
            </select>
          </div>
        </div>

        {/* Scoring Weights Customizer */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-400" />
            Deterministic Readiness Scoring Weights
          </h3>
          <p className="text-xs text-slate-400">
            Customize the linear coefficients for the career readiness calculation formula.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">
                Skill Coverage
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={settings.weights?.skillCoverage || 0.4}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    weights: {
                      ...settings.weights,
                      skillCoverage: parseFloat(e.target.value) || 0.4,
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">
                Skill Importance
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={settings.weights?.skillImportance || 0.25}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    weights: {
                      ...settings.weights,
                      skillImportance: parseFloat(e.target.value) || 0.25,
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">
                Project Evidence
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={settings.weights?.projectEvidence || 0.2}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    weights: {
                      ...settings.weights,
                      projectEvidence: parseFloat(e.target.value) || 0.2,
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">
                Market Alignment
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={settings.weights?.marketAlignment || 0.15}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    weights: {
                      ...settings.weights,
                      marketAlignment: parseFloat(e.target.value) || 0.15,
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Cloud Connection Badges */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Database className="h-3.5 w-3.5 text-purple-400" />
              BigQuery Market Layer:{" "}
              <strong className={settings.bigQueryConnected ? "text-emerald-400" : "text-amber-400"}>
                {settings.bigQueryConnected ? "Connected" : "Local Benchmark Fallback"}
              </strong>
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Resilient fallback architecture guarantees 100% hackathon uptime.
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
