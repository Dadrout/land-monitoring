import { NextResponse } from "next/server";
import { demoApplications } from "@/lib/demo-store";
import { adminSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url); const tracking = url.searchParams.get("tracking")?.trim().toUpperCase();
  if (!tracking) return NextResponse.json({ error: "tracking is required" }, { status: 400 });
  const db = adminSupabase();
  if (!db) {
    const application = demoApplications().find((item) => item.tracking_number === tracking);
    return application ? NextResponse.json({ application, mode: "demo" }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const { data, error } = await db.from("land_applications").select("*").eq("tracking_number", tracking).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return data ? NextResponse.json({ application: data, mode: "supabase" }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
