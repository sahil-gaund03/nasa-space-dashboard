import { NextResponse } from "next/server";
import { geminiService } from "@/services/gemini";
import { dbService } from "@/lib/db-service";

export async function GET() {
  try {
    const chats = await dbService.getChats();
    // Format chats for frontend
    const formatted = chats.flatMap((c: any) => [
      { role: "user", text: c.prompt },
      { role: "ai", text: c.response }
    ]);
    return NextResponse.json(formatted);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to fetch chat logs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { prompt, history } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Call Gemini
    const responseText = await geminiService.generateChatResponse(prompt, history || []);

    // Persist chat in PostgreSQL
    await dbService.saveChat(prompt, responseText);

    return NextResponse.json({ response: responseText });
  } catch (e: any) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "Failed to generate chat response", details: e.message },
      { status: 500 }
    );
  }
}
