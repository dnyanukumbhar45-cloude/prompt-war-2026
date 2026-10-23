import { NextRequest, NextResponse } from "next/server";
import { getSession, getAllSessions } from "@/lib/data/storage";
import { runCareerPilotOrchestrator } from "@/lib/ai/orchestrator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const session = await getSession(sessionId);
      if (session) {
        return NextResponse.json({ success: true, session });
      }
    }

    const sessions = await getAllSessions();
    if (sessions.length > 0) {
      return NextResponse.json({ success: true, session: sessions[0] });
    }

    // Auto-generate initial benchmark session if none exists
    const initialSession = await runCareerPilotOrchestrator({
      targetRole: "Full Stack Developer",
    });

    return NextResponse.json({ success: true, session: initialSession });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
