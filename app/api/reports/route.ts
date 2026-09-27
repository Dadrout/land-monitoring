import { NextResponse } from "next/server";
import { z } from "zod";
import { demoCreateReport, demoReports } from "@/lib/demo-store";
import { adminSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const reportSchema = z.object({
  telegram_user_id: z.string().nullable().optional().default(null),
  category: z.string().min(2),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().min(2),
  photo_url: z.string().url().nullable().optional().default(null),
  status: z.enum(["pending", "violation", "in_progress", "resolved", "rejected"]).default("pending"),
  plot_id: z.string().nullable().optional().default(null),
  deadline: z.string().nullable().optional().default(null),
});

export async function GET() {
  const db = adminSupabase();
  if (!db) return NextResponse.json({ reports: demoReports(), mode: "demo" });
  const { data, error } = await db.from("citizen_reports").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reports: data, mode: "supabase" });
}

export async function POST(request: Request) {
  const parsed = reportSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const db = adminSupabase();
  if (!db) return NextResponse.json({ report: demoCreateReport(parsed.data), mode: "demo" }, { status: 201 });
  const { data, error } = await db.from("citizen_reports").insert(parsed.data).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (data.plot_id) await db.from("land_plots").update({ status: "pending", updated_at: new Date().toISOString() }).eq("id", data.plot_id);
  return NextResponse.json({ report: data, mode: "supabase" }, { status: 201 });
}
