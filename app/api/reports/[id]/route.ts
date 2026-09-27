import { NextResponse } from "next/server";
import { z } from "zod";
import { demoUpdateReport } from "@/lib/demo-store";
import { adminSupabase } from "@/lib/supabase";

const patchSchema = z.object({ status: z.enum(["pending", "violation", "in_progress", "resolved", "rejected"]).optional(), deadline: z.string().nullable().optional(), plot_id: z.string().nullable().optional() });
const plotStatus: Record<"pending" | "violation" | "in_progress" | "resolved" | "rejected", "normal" | "pending" | "violation" | "in_progress" | "resolved"> = { pending: "pending", violation: "violation", in_progress: "in_progress", resolved: "resolved", rejected: "normal" };

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const db = adminSupabase();
  if (!db) {
    const report = demoUpdateReport(id, parsed.data);
    if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
    return NextResponse.json({ report, mode: "demo" });
  }
  const { data, error } = await db.from("citizen_reports").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (data.plot_id && parsed.data.status) await db.from("land_plots").update({ status: plotStatus[parsed.data.status], deadline: parsed.data.deadline ?? data.deadline, updated_at: new Date().toISOString() }).eq("id", data.plot_id);
  return NextResponse.json({ report: data, mode: "supabase" });
}
