import { NextRequest } from "next/server";
import { runCareerPilotOrchestrator } from "@/lib/ai/orchestrator";
import { RoleType, AgentEvent } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { targetRole, rawResumeText, candidateDetails } = body;
  const validatedRole = (targetRole || "Full Stack Developer") as RoleType;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(data: Record<string, any>) {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      }

      try {
        const result = await runCareerPilotOrchestrator({
          targetRole: validatedRole,
          rawResumeText,
          candidateDetails,
          onEvent: (event: AgentEvent) => {
            sendEvent({ type: "agent_event", event });
          },
        });

        sendEvent({ type: "complete", result });
        controller.close();
      } catch (err: any) {
        sendEvent({
          type: "error",
          error: err?.message || "Agent execution failed",
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
