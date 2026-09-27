import { NextResponse } from "next/server";
import { handleTelegramUpdate } from "@/lib/telegram";

export async function POST(request: Request) {
  try { await handleTelegramUpdate(await request.json()); return NextResponse.json({ ok: true }); }
  catch (error) { console.error(error); return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 }); }
}
