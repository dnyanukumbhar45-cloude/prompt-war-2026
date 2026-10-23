# CareerPilot AI 🧭
### Agentic Career Intelligence & Skill-Gap Optimization Platform

CareerPilot AI is an original, hackathon-ready agentic career intelligence platform built to solve the static, keyword-matching limitations of conventional resume scanners. Rather than giving arbitrary score feedback or generic motivational text, CareerPilot AI operates as an autonomous multi-agent system that ingests candidate resumes, extracts verified technical competencies with textual evidence citations, benchmarks competencies against structured job market requirements across 100+ synthetic job postings, deterministically computes a transparent Career Readiness Index, and provides an adaptive progress loop that recalculates readiness when verified evidence (e.g., GitHub projects) is submitted.

---

## 1. Hackathon Objective & Evaluation Mapping

| Hackathon Criterion | CareerPilot AI Implementation |
| :--- | :--- |
| **Security** | Resumes treated as untrusted data with strict sanitization; prompt injection regex defenses; server-side Gemini calls with zero secrets leaked to the frontend; Zod schema enforcement. |
| **Efficiency** | Lightweight, high-throughput model (`gemini-2.5-flash`); deterministic mathematical calculation of numerical scores instead of slow LLM math hallucinations; minimal token payload serialization. |
| **Technology Implemented** | Next.js 14 App Router, TypeScript, Tailwind CSS, Recharts, Zod, Server-Sent Events (SSE) streaming pipeline, and multi-agent directed acyclic graph (DAG). |
| **Performance** | Sub-6-second end-to-end multi-agent pipeline with real-time per-node telemetry execution timers and persistent session storage. |
| **Google Technology Used** | Google Gen AI SDK (`@google/genai`) with `gemini-2.5-flash` / `gemini-2.5-pro` integration; BigQuery market dataset schema with local fallback; Firebase persistence architecture. |
| **Intelligent Reasoning** | Specialized agents for Resume Parsing, Market Benchmark Analysis, Gap Prioritization, Milestone Synthesis, and Guardrail Validation. |
| **Automation & Evidence Loop** | Progress tracking loop (`evaluateSkillEvidence` & `recalculateReadiness`) that dynamically recalculates scores (e.g. 64% → 71%) upon GitHub project submission. |

---

## 2. Real-World Problem

Students and early-career candidates often struggle to know:
- Which skills they actually possess and how strongly they are backed by project evidence.
- What skills are actually required by current hiring trends for their target role.
- Which missing skills are most critical (high priority vs. optional).
- What milestone project to build next to close multiple high-impact gaps simultaneously.
- How their career readiness measurably improves when new evidence is produced.

Conventional resume analyzers simply count keywords. **CareerPilot AI** bridges this gap using autonomous multi-agent reasoning, deterministic scoring, and active evidence verification.

---

## 3. Autonomous Multi-Agent Architecture

```
                         USER INPUT
                             │
                             ▼
                     MASTER ORCHESTRATOR
                             │
             ┌───────────────┼───────────────┐
             ▼               ▼               ▼
     RESUME INTELLIGENCE   MARKET INTEL   PROFILE AGENT
     (Evidence Citations)  (100+ Jobs)    (Academic Data)
             │               │               │
             └───────────────┼───────────────┘
                             │
                             ▼
                 SKILL GAP REASONING AGENT
                (Demonstrated / Partial / Missing)
                             │
                             ▼
                     EXPLICIT TOOL CALLS
           (calculateSkillGap, calculateReadiness, etc.)
                             │
                             ▼
                   DETERMINISTIC ENGINE
             Readiness = 40% Cov + 25% Imp + 20% Ev + 15% Mkt
                             │
                             ▼
                   CAREER PLANNING AGENT
              (Roadmap Milestones & Capstones)
                             │
                             ▼
               VALIDATION & GUARDRAIL AGENT
         (Zod Schemas, Score Bounds, Prompt Injections)
                             │
                             ▼
                     INTERACTIVE DASHBOARD
                             │
                             ▼
                      PROGRESS TRACKER
                 (evaluateSkillEvidence)
                             │
                             ▼
                   RE-EVALUATION ENGINE
                    (+7% Score Delta)
```

### Specialized Agents

1. **Resume Intelligence Agent (`resume-agent.ts`)**: Converts uploaded resume text into structured candidate records, extracting technical skills, confidence scores, and verbatim evidence citations. Rejects instructions embedded inside documents.
2. **Market Intelligence Agent (`market-agent.ts`)**: Analyzes target-role requirements across 100+ synthetic job postings benchmark (or live Google Cloud BigQuery when configured). Computes skill frequencies and required vs. optional weights.
3. **Skill Gap Reasoning Agent (`reasoning-agent.ts`)**: Evaluates candidate skills against market requirements, classifying competencies into demonstrated, partial, and missing gaps, prioritized as High, Medium, or Low.
4. **Career Planning Agent (`planning-agent.ts`)**: Sequences high-priority gaps into phased learning roadmaps and generates multi-competency capstone project blueprints.
5. **Validation & Guardrail Agent (`validation-agent.ts`)**: Enforces strict Zod schema validation, asserts that scores are bounded in $[0, 100]$, validates that all candidate skills possess evidence, and sanitizes untrusted input.

---

## 4. Deterministic Scoring Methodology

To prevent model hallucination in numerical calculations, CareerPilot AI uses transparent deterministic algorithms:

$$\text{Career Readiness Index} = (0.40 \times \text{Skill Coverage}) + (0.25 \times \text{Skill Importance}) + (0.20 \times \text{Project Evidence}) + (0.15 \times \text{Market Alignment})$$

- **Skill Coverage (40%)**: Ratio of required role skills demonstrated or partially covered by the candidate.
- **Skill Importance (25%)**: Market-weighted sum of demonstrated skills normalized against total requirement weights.
- **Project Evidence (20%)**: Degree to which claimed skills are backed by verifiable project citations, code repositories, or certificates.
- **Market Alignment (15%)**: Overlap with the top 10 most demanded technical competencies in current postings.

---

## 5. Explicit Tools / Function Calling

Every agent operation executes typed TypeScript tools with execution timing and success logging:
- `extractResumeData()`: Structured extraction of candidate profile and evidence citations.
- `getMarketRequirements()`: Aggregates role-specific requirements, frequencies, and salaries.
- `calculateSkillGap()`: Identifies demonstrated, partial, and missing technical competencies.
- `calculateCareerReadiness()`: Deterministic multi-factor mathematical readiness calculation.
- `getSkillPriority()`: Evaluates requirement criticality based on market demand.
- `recommendProjects()`: Generates capstone blueprints engineered to solve multiple gaps.
- `generateLearningPlan()`: Synthesizes phased milestone action plans.
- `evaluateSkillEvidence()`: Verifies submitted GitHub URLs or project descriptions.
- `recalculateReadiness()`: Dynamically updates the Career Readiness Index with evidence bonuses.

---

## 6. Project Folder Structure

```
careerpilot-ai/
├── app/
│   ├── page.tsx                    # Landing page with value props & CTA
│   ├── onboarding/page.tsx         # Profile form & demo resume loader
│   ├── analyze/page.tsx            # Live agent visualizer & SSE stream
│   ├── dashboard/page.tsx          # Career intelligence dashboard
│   ├── skills/page.tsx             # Skill gap reasoning matrix
│   ├── market/page.tsx             # 100+ job benchmark analytics
│   ├── roadmap/page.tsx            # Phased milestone learning roadmap
│   ├── projects/page.tsx           # Capstone project recommendation blueprints
│   ├── progress/page.tsx           # Evidence loop & dynamic recalculation
│   ├── history/page.tsx            # Session audit trail
│   ├── settings/page.tsx           # Demo mode, Gemini model, weights config
│   └── api/
│       ├── analyze/route.ts        # POST orchestrator execution
│       ├── analyze/stream/route.ts # Server-Sent Events live stream
│       ├── resume/parse/route.ts   # Resume parser tool API
│       ├── market/analyze/route.ts # Market intelligence API
│       ├── skills/gap/route.ts     # Skill gap calculation API
│       ├── roadmap/generate/route.ts# Learning plan generation API
│       ├── projects/recommend/route.ts# Project recommendation API
│       ├── progress/update/route.ts # Evidence submission & delta recalculation
│       ├── evidence/evaluate/route.ts# Artifact verification API
│       ├── dashboard/route.ts      # Active session loader
│       └── settings/route.ts       # Runtime configuration API
├── components/
│   ├── layout/navbar.tsx           # Navigation bar with Mode Badge
│   ├── layout/footer.tsx           # Footer with tech credits
│   ├── dashboard/                  # Modular dashboard widgets (Recharts, Gauge, Gaps)
│   └── agents/                     # AgentWorkflowVisualizer & AgentEventStream
├── lib/
│   ├── ai/
│   │   ├── orchestrator.ts         # Master DAG orchestrator
│   │   ├── agents/                 # Specialized agent implementations
│   │   ├── tools/                  # 10 explicit typed tools with logs
│   │   ├── schemas/                # Zod validation schemas
│   │   └── prompts/                # Strict prompts with prompt injection defenses
│   ├── scoring/readiness.ts        # Deterministic mathematical scoring engine
│   └── data/                       # Market benchmark query & session persistence
├── data/
│   ├── demo-jobs.json              # 113 realistic synthetic benchmark jobs
│   └── demo-resume.json            # Final-year B.Tech Full Stack candidate
├── scripts/
│   ├── generate-jobs.js            # Generator for 100+ benchmark jobs
│   └── test-pipeline.js            # 6-step automated verification test suite
├── .env.example
├── .env.local
├── package.json
└── tsconfig.json
```

---

## 7. Quickstart & Local Setup

### Prerequisites
- Node.js 18+ or 20+
- npm

### Installation
```bash
# Clone or navigate to the project directory
cd careerpilot-ai

# Install dependencies
npm install

# Run automated tests
node scripts/test-pipeline.js

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 8. Environment Variables & Demo Mode

The application operates with a **zero-dependency Demo Mode** out of the box. Cloud credentials are completely optional:

```env
# Google Gemini Configuration
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-2.5-flash

# Google Cloud BigQuery (Optional, falls back to local 100+ dataset)
GOOGLE_CLOUD_PROJECT=
GOOGLE_APPLICATION_CREDENTIALS=
BIGQUERY_DATASET=
BIGQUERY_TABLE=

# Firebase Configuration (Optional, falls back to local storage)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Set to 'true' for deterministic hackathon demo without external dependencies
DEMO_MODE=true
```

To enable live Google Gemini calls:
1. Provide a `GEMINI_API_KEY` in `.env.local` or through `/settings` in the UI.
2. Toggle off Demo Mode in the Settings page.

---

## 9. 3–5 Minute Hackathon Presentation Script

1. **Landing Page (`/`)**: Show the CareerPilot AI hero, the value propositions, and explain why static keyword scanners fail students.
2. **Onboarding (`/onboarding`)**: Select "Full Stack Developer", click **"Use Demo Resume"** to load candidate Aarav Sharma (final-year B.Tech CS), and click **"Analyze My Career"**.
3. **Live Agent Execution (`/analyze`)**: Observe the live DAG visualizer and real-time Server-Sent Events stream showing the Orchestrator, Resume Agent, Market Agent, Gap Reasoning Agent, Planning Agent, and Validation Agent executing with exact execution timers.
4. **Dashboard Overview (`/dashboard`)**:
   - Inspect the **Career Readiness Index (64%)** and open the formula explanation showing the 40/25/20/15 linear weights.
   - Review the Recharts **Competency vs. Market Benchmark** bar chart.
   - Note the top priority missing gaps (React, Node.js, SQL, REST APIs).
5. **Market Intelligence (`/market`)**: Review the 113 benchmark job records across startups, scale-ups, and enterprise fintechs.
6. **Actionable Roadmap (`/roadmap`) & Projects (`/projects`)**: Show how missing skills are mapped to the "Student Placement & Hiring Portal" capstone project.
7. **The Agentic Evidence Loop (`/progress`)**:
   - Click **"Prove React Skill (+7% Readiness)"**.
   - Watch the agent evaluate the submitted GitHub evidence, update the ledger, and deterministically recalculate the score from **64% → 71% (+7% improvement)**!

---

## 10. Security & Prompt Injection Protections

1. **Untrusted Data Isolation**: Resumes are parsed strictly as raw data payloads, never interpolated as instructions into system prompts.
2. **Quarantine Patterns**: Regular expressions actively detect and neutralize strings like `ignore previous instructions` or `reveal credentials`.
3. **No Frontend Secrets**: All Gemini API calls, API keys, and database writes are strictly isolated to server-side Next.js route handlers.
4. **Strict Schema Validation**: Zod parses all input payloads and agent outputs before state commits.
