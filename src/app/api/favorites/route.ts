import { NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";

export async function GET() {
  try {
    const favorites = await dbService.getFavorites();
    return NextResponse.json(favorites);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to read favorites" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemType, itemId, metadata } = body;
    if (!itemType || !itemId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    const fav = await dbService.addFavorite(itemType, itemId, metadata);
    return NextResponse.json(fav);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const itemType = url.searchParams.get("itemType");
    const itemId = url.searchParams.get("itemId");
    
    if (!itemType || !itemId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    await dbService.removeFavorite(itemType, itemId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to delete favorite" }, { status: 500 });
  }
}
