import { NextResponse } from "next/server";
import { demoPlots } from "@/lib/demo-store";
import { adminSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = adminSupabase();
  if (!db) return NextResponse.json({ plots: demoPlots(), mode: "demo" });
  const { data, error } = await db.from("land_plots").select("*").order("cadastral_number");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ plots: data, mode: "supabase" });
}
