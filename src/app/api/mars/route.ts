import { NextResponse } from "next/server";
import { nasaService } from "@/services/nasa";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const rover = url.searchParams.get("rover") || "perseverance";
    const camera = url.searchParams.get("camera") || "navcam";
    const page = parseInt(url.searchParams.get("page") || "1");

    const photos = await nasaService.getMarsPhotos(rover, camera, page);
    return NextResponse.json(photos);
  } catch (e: any) {
    console.error("Mars Rover API error:", e);
    return NextResponse.json(
      { error: "Failed to fetch Mars photos", details: e.message },
      { status: 500 }
    );
  }
}
