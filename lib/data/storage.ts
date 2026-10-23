import { CareerPilotAnalysisResult, EvidenceRecord, ReadinessScoreBreakdown } from "@/types";
import * as fs from "fs";
import * as path from "path";

// In-memory cache for fast dev/demo
const memorySessions: Map<string, CareerPilotAnalysisResult> = new Map();

function getStorageFilePath(): string {
  const dir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, "sessions.json");
}

function loadSessionsFromFile(): Record<string, CareerPilotAnalysisResult> {
  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to read sessions from disk:", err);
  }
  return {};
}

function persistSessionsToFile(sessions: Record<string, CareerPilotAnalysisResult>): void {
  try {
    const filePath = getStorageFilePath();
    fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist sessions to disk:", err);
  }
}

export async function saveSession(session: CareerPilotAnalysisResult): Promise<void> {
  memorySessions.set(session.sessionId, session);
  const diskSessions = loadSessionsFromFile();
  diskSessions[session.sessionId] = session;
  persistSessionsToFile(diskSessions);
}

export async function getSession(sessionId: string): Promise<CareerPilotAnalysisResult | null> {
  if (memorySessions.has(sessionId)) {
    return memorySessions.get(sessionId)!;
  }
  const diskSessions = loadSessionsFromFile();
  if (diskSessions[sessionId]) {
    memorySessions.set(sessionId, diskSessions[sessionId]);
    return diskSessions[sessionId];
  }
  return null;
}

export async function getAllSessions(): Promise<CareerPilotAnalysisResult[]> {
  const diskSessions = loadSessionsFromFile();
  Object.values(diskSessions).forEach((s) => {
    memorySessions.set(s.sessionId, s);
  });
  return Array.from(memorySessions.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updateSessionEvidence(
  sessionId: string,
  evidence: EvidenceRecord,
  newReadiness: ReadinessScoreBreakdown
): Promise<CareerPilotAnalysisResult | null> {
  const session = await getSession(sessionId);
  if (!session) return null;

  // Append evidence record
  session.evidenceRecords = [evidence, ...(session.evidenceRecords || [])];
  session.readinessScore = newReadiness;

  // Update gap status if evidence closes a gap
  session.skillGaps = session.skillGaps.map((gap) => {
    if (gap.skillName.toLowerCase() === evidence.skillName.toLowerCase()) {
      return {
        ...gap,
        status: "demonstrated",
        candidateConfidence: Math.max(gap.candidateConfidence, 0.9),
        reason: `Verified with project evidence: ${evidence.title}`,
      };
    }
    return gap;
  });

  await saveSession(session);
  return session;
}
