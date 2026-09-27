import { AlertTriangle, Clock3, LandPlot, ScanSearch } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

const cardBase = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

export function Stats({ stats }: { stats: DashboardStats }) {
  const items = [
    { label: "Всего участков", value: stats.totalPlots, icon: LandPlot, hint: "в тестовом массиве" },
    { label: "На проверке", value: stats.pending, icon: ScanSearch, hint: "новые сигналы" },
    { label: "Нарушения", value: stats.violations, icon: AlertTriangle, hint: "требуют действий" },
    { label: "Просрочено", value: stats.overdue, icon: Clock3, hint: "контрольный срок" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon, hint }) => (
        <div key={label} className={cardBase}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700"><Icon size={19} /></div>
          </div>
          <p className="mt-3 text-xs text-slate-400">{hint}</p>
        </div>
      ))}
    </div>
  );
}
