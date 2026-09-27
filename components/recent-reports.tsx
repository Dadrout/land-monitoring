"use client";

import type { CitizenReport } from "@/lib/types";
import { ReportStatusPill } from "@/components/status-pill";

export function RecentReports({ reports, onSelect }: { reports: CitizenReport[]; onSelect: (report: CitizenReport) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between"><div><h3 className="font-semibold">Последние сигналы</h3><p className="mt-1 text-xs text-slate-500">Citizen reports from Telegram and inspectors</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">Live</span></div>
      <div className="space-y-2">
        {reports.slice(0, 6).map((report) => (
          <button key={report.id} onClick={() => onSelect(report)} className="w-full rounded-xl border border-slate-100 p-3 text-left transition hover:border-slate-200 hover:bg-slate-50">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{report.category}</div>
                <div className="mt-1 w-full truncate text-xs text-slate-500">{report.description}</div>
              </div>
              <div className="shrink-0 text-right">
                <ReportStatusPill status={report.status} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
