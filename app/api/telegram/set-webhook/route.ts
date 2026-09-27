import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-setup-secret");
  if (!process.env.WEBHOOK_SETUP_SECRET || secret !== process.env.WEBHOOK_SETUP_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const token = process.env.TELEGRAM_BOT_TOKEN; const appUrl = process.env.APP_URL?.replace(/\/$/, "");
  if (!token || !appUrl) return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN and APP_URL are required" }, { status: 400 });
  const url = `${appUrl}/api/telegram/webhook`;
  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, allowed_updates: ["message", "callback_query"] }) });
  const result = await response.json();
  return NextResponse.json({ webhook: url, telegram: result }, { status: response.ok ? 200 : 502 });
}
