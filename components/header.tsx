"use client";

import { Bell, Search } from "lucide-react";

export function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 md:px-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">{title}</h1>
        <p className="mt-1 text-xs text-slate-500 md:text-sm">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 md:flex">
          <Search size={16} />
          <span>Поиск участка...</span>
        </div>
        <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-semibold text-white">DI</div>
      </div>
    </header>
  );
}
