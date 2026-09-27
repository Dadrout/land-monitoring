import type { PlotStatus, ReportStatus } from "@/lib/types";

export const plotStatusMeta: Record<PlotStatus, { label: string; color: string; bg: string; hex: string }> = {
  normal: { label: "Без нарушений", color: "text-emerald-700", bg: "bg-emerald-50", hex: "#16a34a" },
  pending: { label: "На проверке", color: "text-amber-700", bg: "bg-amber-50", hex: "#eab308" },
  violation: { label: "Нарушение", color: "text-red-700", bg: "bg-red-50", hex: "#dc2626" },
  in_progress: { label: "В устранении", color: "text-orange-700", bg: "bg-orange-50", hex: "#f97316" },
  resolved: { label: "Устранено", color: "text-emerald-700", bg: "bg-emerald-50", hex: "#22c55e" },
  returned: { label: "Возвращено государству", color: "text-sky-700", bg: "bg-sky-50", hex: "#0284c7" },
};

export const reportStatusMeta: Record<ReportStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "На проверке", color: "text-amber-700", bg: "bg-amber-50" },
  violation: { label: "Нарушение подтверждено", color: "text-red-700", bg: "bg-red-50" },
  in_progress: { label: "В устранении", color: "text-orange-700", bg: "bg-orange-50" },
  resolved: { label: "Устранено", color: "text-emerald-700", bg: "bg-emerald-50" },
  rejected: { label: "Отклонено", color: "text-slate-600", bg: "bg-slate-100" },
};
