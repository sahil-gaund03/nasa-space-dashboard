import { NextResponse } from "next/server";
import { spacexService } from "@/services/spacex";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const launch = await spacexService.getNextLaunch();
    return NextResponse.json(launch);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch SpaceX launch", details: e.message },
      { status: 500 }
    );
  }
}
