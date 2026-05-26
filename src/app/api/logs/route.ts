import { NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";

export async function GET() {
  try {
    const logs = await dbService.getSystemLogs();
    return NextResponse.json(logs);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to read system logs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tag, message } = body;
    if (!tag || !message) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    const log = await dbService.addSystemLog(tag, message);
    return NextResponse.json(log);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to add system log" }, { status: 500 });
  }
}
