import { NextResponse } from "next/server";
import { nasaService } from "@/services/nasa";
import { geminiService } from "@/services/gemini";
import { dbService } from "@/lib/db-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const urlObj = new URL(req.url);
    const date = urlObj.searchParams.get("date") || undefined;
    
    const apod = await nasaService.getAPOD(date);

    // If summary doesn't exist in cache, generate it using Gemini
    if (!apod.aiSummary) {
      try {
        const summary = await geminiService.generateApodSummary(apod.title, apod.explanation);
        if (summary) {
          const updated = await dbService.saveApod(
            apod.date,
            apod.title,
            apod.explanation,
            apod.imageUrl,
            apod.hdImageUrl || undefined,
            summary,
            apod.copyright || undefined
          );
          apod.aiSummary = summary;
        }
      } catch (geminiError) {
        console.error("Failed to generate Gemini summary for APOD:", geminiError);
      }
    }

    return NextResponse.json(apod);
  } catch (e: any) {
    console.error("APOD API error:", e);
    return NextResponse.json(
      { error: "Failed to fetch APOD", details: e.message },
      { status: 500 }
    );
  }
}
