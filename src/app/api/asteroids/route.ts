import { NextResponse } from "next/server";
import { nasaService } from "@/services/nasa";

export async function GET() {
  try {
    const asteroids = await nasaService.getAsteroidsToday();
    return NextResponse.json(asteroids);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch asteroid feed", details: e.message },
      { status: 500 }
    );
  }
}
