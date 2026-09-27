"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, MapPin, X, XCircle } from "lucide-react";
import type { CitizenReport, ReportStatus } from "@/lib/types";
import { ReportStatusPill } from "@/components/status-pill";

export function ReportDrawer({ report, onClose, onUpdated }: { report: CitizenReport | null; onClose: () => void; onUpdated: (report: CitizenReport) => void }) {
  const [busy, setBusy] = useState(false);
  const defaultDeadline = useMemo(() => {
    const date = new Date(); date.setDate(date.getDate() + 7); return date.toISOString().slice(0, 10);
  }, []);
  const [deadline, setDeadline] = useState(defaultDeadline);
  if (!report) return null;

  async function update(status: ReportStatus) {
    if (!report) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/reports/${report.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, deadline: ["violation", "in_progress"].includes(status) ? deadline : status === "resolved" ? null : report.deadline }) });
      if (!response.ok) throw new Error("Не удалось обновить статус");
      const data = await response.json();
      onUpdated(data.report);
    } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end bg-slate-950/25 backdrop-blur-[2px]" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Народный контроль</p><h2 className="mt-2 text-xl font-semibold">{report.category}</h2></div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"><X size={17} /></button>
        </div>
        <div className="mt-4"><ReportStatusPill status={report.status} /></div>
        <div className="mt-6 overflow-hidden rounded-2xl bg-slate-100">
          {report.photo_url ? <img src={report.photo_url} alt="Фото нарушения" className="h-56 w-full object-cover" /> : <div className="grid h-48 place-items-center text-sm text-slate-400">Фото будет загружено из Telegram</div>}
        </div>
        <div className="mt-6 space-y-4">
          <section className="rounded-2xl border border-slate-200 p-4"><div className="mb-2 flex items-center gap-2 text-sm font-semibold"><MapPin size={16} /> Координаты</div><div className="text-sm text-slate-600">{report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}</div></section>
          <section className="rounded-2xl border border-slate-200 p-4"><div className="mb-2 text-sm font-semibold">Описание</div><p className="text-sm leading-6 text-slate-600">{report.description}</p></section>
          <section className="rounded-2xl border border-slate-200 p-4"><label className="mb-2 flex items-center gap-2 text-sm font-semibold"><CalendarClock size={16} /> Контрольный срок</label><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" /></section>
        </div>
        <div className="mt-6 grid gap-2">
          {report.status === "pending" && <><button disabled={busy} onClick={() => update("violation")} className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">Подтвердить нарушение</button><button disabled={busy} onClick={() => update("rejected")} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"><XCircle size={16} /> Отклонить сигнал</button></>}
          {report.status === "violation" && <button disabled={busy} onClick={() => update("in_progress")} className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50">Начать устранение</button>}
          {report.status === "in_progress" && <button disabled={busy} onClick={() => update("resolved")} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"><CheckCircle2 size={17} /> Нарушение устранено</button>}
        </div>
      </aside>
    </div>
  );
}
