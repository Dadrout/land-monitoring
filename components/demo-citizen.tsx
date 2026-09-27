"use client";

import { useState } from "react";
import { Camera, MapPin, Send, Smartphone } from "lucide-react";
import type { CitizenReport, LandPlot } from "@/lib/types";

export function DemoCitizen({ plots, onCreated }: { plots: LandPlot[]; onCreated: (report: CitizenReport) => void }) {
  const [category, setCategory] = useState("Стихийная свалка");
  const [description, setDescription] = useState("На участке появилась стихийная свалка. Просим провести проверку.");
  const [busy, setBusy] = useState(false);
  async function send() {
    setBusy(true);
    try {
      const target = plots.find((p) => p.status === "normal") ?? plots[0];
      const response = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ telegram_user_id: "demo-phone", category, latitude: target.latitude + 0.0007, longitude: target.longitude + 0.0005, description, photo_url: null, status: "pending", plot_id: target.id, deadline: null }) });
      if (!response.ok) throw new Error("Не удалось отправить сигнал");
      const data = await response.json();
      onCreated(data.report);
    } finally { setBusy(false); }
  }
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-soft">
      <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><Smartphone size={19} /></div><div><div className="font-semibold">Demo Citizen</div><div className="text-xs text-slate-400">Эмуляция Telegram для локального демо</div></div></div>
      <div className="mt-5 space-y-3">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm outline-none"><option className="text-slate-950">Стихийная свалка</option><option className="text-slate-950">Земля не используется</option><option className="text-slate-950">Самозахват</option><option className="text-slate-950">Другое</option></select>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm outline-none placeholder:text-slate-500" />
        <div className="flex gap-2 text-xs text-slate-300"><span className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1.5"><MapPin size={13} /> Геолокация</span><span className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1.5"><Camera size={13} /> Фото</span></div>
        <button disabled={busy} onClick={send} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"><Send size={16} /> {busy ? "Отправляем..." : "Отправить сигнал"}</button>
      </div>
    </div>
  );
}
