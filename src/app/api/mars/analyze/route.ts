import { NextResponse } from "next/server";
import { geminiService } from "@/services/gemini";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "Missing imageUrl parameter" }, { status: 400 });
    }

    const summary = await geminiService.analyzeMarsPhoto(imageUrl);
    return NextResponse.json({ summary });
  } catch (e: any) {
    console.error("Mars photo analysis API error:", e);
    return NextResponse.json(
      { error: "Failed to analyze Mars photo", details: e.message },
      { status: 500 }
    );
  }
}
