import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/data/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(params.id);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load session" },
      { status: 500 }
    );
  }
}
