import { NextRequest, NextResponse } from "next/server";
import { getMarketRequirements } from "@/lib/ai/tools";
import { RoleType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { targetRole } = await req.json();
    const result = await getMarketRequirements((targetRole || "Full Stack Developer") as RoleType);

    return NextResponse.json({
      success: true,
      market: result.market,
      log: result.log,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to analyze market" },
      { status: 500 }
    );
  }
}
