import { NextResponse } from "next/server";
import { nasaService } from "@/services/nasa";

export async function GET() {
  try {
    const weather = await nasaService.getSpaceWeather();
    return NextResponse.json(weather);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to fetch space weather", details: e.message },
      { status: 500 }
    );
  }
}
