"use client";

import dynamic from "next/dynamic";
import type { CitizenReport, LandPlot } from "@/lib/types";

const DynamicMap = dynamic(() => import("@/components/map-client").then((mod) => mod.MapClient), {
  ssr: false,
  loading: () => <div className="grid min-h-[520px] place-items-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">Загрузка карты...</div>,
});

export function InspectorMap(props: { plots: LandPlot[]; reports: CitizenReport[]; onSelectReport?: (report: CitizenReport) => void }) {
  return <DynamicMap {...props} />;
}
