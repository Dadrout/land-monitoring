"use client";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/shell";
import { ReportDrawer } from "@/components/report-drawer";
import { ReportStatusPill } from "@/components/status-pill";
import type { CitizenReport } from "@/lib/types";

export default function ReportsPage(){
  const [reports,setReports]=useState<CitizenReport[]>([]); const [selected,setSelected]=useState<CitizenReport|null>(null); const [query,setQuery]=useState('');
  async function load(){const r=await fetch('/api/reports',{cache:'no-store'}); const j=await r.json(); setReports(j.reports);}
  useEffect(()=>{load();},[]);
  const filtered=useMemo(()=>reports.filter(r=>`${r.category} ${r.description} ${r.id}`.toLowerCase().includes(query.toLowerCase())),[reports,query]);
  return <Shell title="Сигналы граждан" subtitle="Единая очередь сообщений из Telegram и инспекторских проверок"><main className="p-5 md:p-8"><div className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between"><div><h2 className="font-semibold">Народный контроль</h2><p className="mt-1 text-xs text-slate-500">{reports.length} сигналов в текущем наборе</p></div><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по сигналам" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none md:w-72"/></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Тип</th><th className="px-5 py-3">Источник</th><th className="px-5 py-3">Дата</th><th className="px-5 py-3">Статус</th><th className="px-5 py-3"></th></tr></thead><tbody>{filtered.map(r=><tr key={r.id} className="border-t border-slate-100"><td className="px-5 py-4 font-mono text-xs text-slate-500">{r.id.slice(0,12)}</td><td className="px-5 py-4 font-medium">{r.category}</td><td className="px-5 py-4 text-slate-500">{r.telegram_user_id?'Telegram':'Inspector'}</td><td className="px-5 py-4 text-slate-500">{new Date(r.created_at).toLocaleString('ru-RU')}</td><td className="px-5 py-4"><ReportStatusPill status={r.status}/></td><td className="px-5 py-4"><button onClick={()=>setSelected(r)} className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white">Открыть</button></td></tr>)}</tbody></table></div></div></main><ReportDrawer report={selected} onClose={()=>setSelected(null)} onUpdated={(r)=>{setSelected(r);load();}}/></Shell>
}
