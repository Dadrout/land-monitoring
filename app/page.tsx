"use client";

import { Send } from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/shell";
import { Stats } from "@/components/stats";
import { InspectorMap } from "@/components/map";
import { RecentReports } from "@/components/recent-reports";
import { ReportDrawer } from "@/components/report-drawer";
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
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl bg-blue-50 p-5 border border-blue-100">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-500 text-white shadow-sm">
                <Send size={20} className="-ml-0.5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-blue-950">Тестирование бота</div>
                <div className="mt-1 text-xs text-blue-800">
                  Отправьте сигнал через <a href="https://t.me/JerMonitor_Bot" target="_blank" rel="noreferrer" className="font-bold underline hover:text-blue-600">@JerMonitor_Bot</a>
                </div>
              </div>
            </div>
            <RecentReports reports={reports} onSelect={setSelected} />
          </div>
        </div>
      </main>
      <ReportDrawer report={selected} onClose={() => setSelected(null)} onUpdated={updated} />
    </Shell>
  );
}
