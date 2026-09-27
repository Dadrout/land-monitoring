"use client";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { InspectorMap } from "@/components/map";
import { ReportDrawer } from "@/components/report-drawer";
import type { CitizenReport, LandPlot } from "@/lib/types";

export default function MapPage() {
  const [plots, setPlots] = useState<LandPlot[]>([]); const [reports, setReports] = useState<CitizenReport[]>([]); const [selected, setSelected] = useState<CitizenReport | null>(null);
  async function load(){ const [a,b]=await Promise.all([fetch('/api/plots',{cache:'no-store'}),fetch('/api/reports',{cache:'no-store'})]); const [aj,bj]=await Promise.all([a.json(),b.json()]); setPlots(aj.plots); setReports(bj.reports); }
  useEffect(()=>{load();},[]);
  return <Shell title="Карта земель" subtitle="Участки, сигналы и контрольные статусы"><main className="p-5 md:p-8"><div className="h-[calc(100vh-145px)]"><InspectorMap plots={plots} reports={reports} onSelectReport={setSelected}/></div></main><ReportDrawer report={selected} onClose={()=>setSelected(null)} onUpdated={(r)=>{setSelected(r);load();}}/></Shell>;
}
