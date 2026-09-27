"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/shell";
import { Stats } from "@/components/stats";
import { InspectorMap } from "@/components/map";
import { RecentReports } from "@/components/recent-reports";
import { ReportDrawer } from "@/components/report-drawer";
import { DemoCitizen } from "@/components/demo-citizen";
import type { CitizenReport, DashboardStats, LandPlot } from "@/lib/types";

export default function DashboardPage() {
  const [plots, setPlots] = useState<LandPlot[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [selected, setSelected] = useState<CitizenReport | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [p, r] = await Promise.all([fetch("/api/plots", { cache: "no-store" }), fetch("/api/reports", { cache: "no-store" })]);
    const [pj, rj] = await Promise.all([p.json(), r.json()]);
    setPlots(pj.plots); setReports(rj.reports);
  }, []);

  useEffect(() => { load(); const timer = setInterval(load, 5000); return () => clearInterval(timer); }, [load]);

  const stats: DashboardStats = useMemo(() => ({
    totalPlots: plots.length,
    pending: plots.filter((p) => p.status === "pending").length,
    violations: plots.filter((p) => p.status === "violation" || p.status === "in_progress").length,
    overdue: plots.filter((p) => p.deadline && new Date(p.deadline) < new Date() && !["resolved", "returned", "normal"].includes(p.status)).length,
  }), [plots]);

  function created(report: CitizenReport) {
    setReports((prev) => [report, ...prev]);
    setNotice("Новый сигнал получен — точка появилась на карте");
    setTimeout(() => setNotice(null), 3500);
    load();
  }
  function updated(report: CitizenReport) {
    setReports((prev) => prev.map((item) => item.id === report.id ? report : item)); setSelected(report); load();
  }

  return (
    <Shell title="Цифровой мониторинг земель" subtitle="Инспекторская GIS-панель • Taraz demo dataset">
      <main className="space-y-5 p-5 md:p-8">
        {notice && <div className="fixed right-5 top-24 z-[1200] rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-2xl">{notice}</div>}
        <Stats stats={stats} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <InspectorMap plots={plots} reports={reports} onSelectReport={setSelected} />
          <div className="space-y-5"><DemoCitizen plots={plots} onCreated={created} /><RecentReports reports={reports} onSelect={setSelected} /></div>
        </div>
      </main>
      <ReportDrawer report={selected} onClose={() => setSelected(null)} onUpdated={updated} />
    </Shell>
  );
}
