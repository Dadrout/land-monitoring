import { plotStatusMeta, reportStatusMeta } from "@/lib/status";
import type { PlotStatus, ReportStatus } from "@/lib/types";

export function PlotStatusPill({ status }: { status: PlotStatus }) {
  const meta = plotStatusMeta[status];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${meta.bg} ${meta.color}`}>{meta.label}</span>;
}

export function ReportStatusPill({ status }: { status: ReportStatus }) {
  const meta = reportStatusMeta[status];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${meta.bg} ${meta.color}`}>{meta.label}</span>;
}
