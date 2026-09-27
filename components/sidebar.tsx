"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, FileSearch, LandPlot, LayoutDashboard, Map, ShieldCheck } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Карта", icon: Map },
  { href: "/reports", label: "Сигналы", icon: ClipboardList },
  { href: "/applications", label: "Заявления", icon: FileSearch },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-soft">
          <LandPlot size={22} />
        </div>
        <div>
          <div className="font-semibold tracking-tight">JerMonitor</div>
          <div className="text-xs text-slate-500">Land Control System</div>
        </div>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>
              <Icon size={18} />{label}
            </Link>
          );
        })}
      </nav>
      <div className="m-4 rounded-2xl bg-emerald-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800"><ShieldCheck size={17} /> MVP online</div>
        <p className="text-xs leading-5 text-emerald-700">Citizen reports, deadlines and land-status workflow in one inspector workspace.</p>
      </div>
    </aside>
  );
}
