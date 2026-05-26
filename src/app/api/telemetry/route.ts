import { NextResponse } from "next/server";
import { issService } from "@/services/iss";
import { spacexService } from "@/services/spacex";
import { nasaService } from "@/services/nasa";
import { dbService } from "@/lib/db-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Resolve all telemetry in parallel with error catchers so one API failure doesn't crash the dashboard
    const [iss, nextLaunch, asteroids, weather] = await Promise.all([
      issService.getLiveTelemetry().catch(() => ({ lat: 28.4, lng: 142.7, alt: 408.2, velocity: 27580 })),
      spacexService.getNextLaunch().catch(() => null),
      nasaService.getAsteroidsToday().catch(() => []),
      nasaService.getSpaceWeather().catch(() => null),
    ]);

    // Create system log updates dynamically when telemetry is pulled
    await dbService.addSystemLog("TLE", `ISS state vector updated · Lat: ${iss.lat}° Lng: ${iss.lng}°`);
    if (asteroids.length > 0) {
      await dbService.addSystemLog("NEO", `Today's asteroid sweep active · ${asteroids.length} objects tracked`);
    }

    const payload = {
      iss,
      nextLaunch,
      asteroids,
      weather,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(payload);
  } catch (e: any) {
    console.error("Telemetry API error:", e);
    return NextResponse.json(
      { error: "Failed to aggregate telemetry data", details: e.message },
      { status: 500 }
    );
  }
}
