import { NextResponse } from "next/server";
import { issService } from "@/services/iss";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [telemetry, crew] = await Promise.all([
      issService.getLiveTelemetry(),
      issService.getCrew(),
    ]);

    return NextResponse.json({ telemetry, crew });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch ISS data", details: e.message },
      { status: 500 }
    );
  }
}
