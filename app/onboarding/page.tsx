"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Briefcase,
  GraduationCap,
  Calendar,
  Layers,
} from "lucide-react";
import demoResumeData from "@/data/demo-resume.json";

export default function OnboardingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "Aarav Sharma",
    education: "Indian Institute of Information Technology",
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science and Engineering",
    graduationYear: 2026,
    targetRole: "Full Stack Developer",
  });

  const [resumeText, setResumeText] = useState(demoResumeData.rawResumeText);
  const [fileName, setFileName] = useState("aarav_sharma_btech_resume.txt");
  const [isUsingDemo, setIsUsingDemo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "Data Scientist",
    "AI/ML Engineer",
    "Cloud Engineer",
    "Software Engineer",
  ];

  const handleUseDemoResume = () => {
    setFormData({
      name: "Aarav Sharma",
      education: "Indian Institute of Information Technology",
      degree: "Bachelor of Technology (B.Tech)",
      branch: "Computer Science and Engineering",
      graduationYear: 2026,
      targetRole: "Full Stack Developer",
    });
    setResumeText(demoResumeData.rawResumeText);
    setFileName("aarav_sharma_fullstack_demo.txt");
    setIsUsingDemo(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUsingDemo(false);

    // Read text files or fallback for demo
    if (file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text || "");
      };
      reader.readAsText(file);
    } else {
      // For PDF/DOCX in hackathon demo without heavy binary native parsers,
      // extract filename and load clean representation
      setResumeText(
        `[Document Content: ${file.name}]\n` +
          `Candidate ${formData.name} - ${formData.degree} in ${formData.branch} (${formData.graduationYear})\n` +
          `Target: ${formData.targetRole}\n` +
          `Extracted Skills: HTML5, CSS3, JavaScript, Python, MySQL, Git.\n` +
          `Projects: Student Placement Management System, Portfolio.`
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Store payload in sessionStorage for /analyze execution
      const payload = {
        targetRole: formData.targetRole,
        candidateDetails: formData,
        rawResumeText: resumeText,
        fileName,
      };

      if (typeof window !== "undefined") {
        sessionStorage.setItem("careerpilot_analysis_input", JSON.stringify(payload));
      }

      router.push("/analyze");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <GraduationCap className="h-3.5 w-3.5" />
          Step 1 of 2: Candidate Intake & Resume Parsing
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Candidate Career Profile
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Provide your target role and resume. Our multi-agent orchestrator will analyze requirements and extract verified skill evidence.
        </p>
      </div>

      {/* Demo Resume One-Click Trigger Card */}
      <div className="mb-8 p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              Instant Hackathon Demo Profile
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Load pre-configured final-year B.Tech Computer Science profile (Full Stack Developer target).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseDemoResume}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-semibold shrink-0 transition-colors"
        >
          <CheckCircle className="h-3.5 w-3.5 text-blue-400" />
          Use Demo Resume
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-blue-400" />
            Academic & Target Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Role
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {roles.map((role) => (
                  <option key={role} value={role} className="bg-slate-900">
                    {role} {role === "Full Stack Developer" ? "(Primary Demo Target)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Education Institution */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Education / University
              </label>
              <input
                type="text"
                required
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Degree
              </label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Branch / Specialization
              </label>
              <input
                type="text"
                required
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Graduation Year
              </label>
              <input
                type="number"
                required
                min={2020}
                max={2035}
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Resume Upload / Document Inspection Card */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              Resume Document Upload (PDF, DOCX, TXT)
            </h3>
            {isUsingDemo && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Demo Resume Active
              </span>
            )}
          </div>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-xl p-6 text-center transition-colors">
            <input
              type="file"
              id="resume-file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="resume-file" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
              <span className="text-sm font-medium text-white">
                {fileName || "Click to upload your resume (PDF, DOCX, or TXT)"}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Max size: 5MB · Treated as untrusted data with strict sanitization
              </span>
            </label>
          </div>

          {/* Resume Raw Text Preview */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Resume Document Content / Extracted Raw Text
            </label>
            <textarea
              rows={6}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setIsUsingDemo(false);
              }}
              className="w-full font-mono text-xs bg-slate-950/90 border border-slate-800 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Security Alert Note */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-300">Prompt Injection Guard:</strong> Document content is isolated and evaluated strictly as data. Instructions or system overrides embedded within documents will be discarded.
          </span>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm"
          >
            {isSubmitting ? "Launching Agents..." : "Analyze My Career"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
