"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Polygon, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import { plotStatusMeta } from "@/lib/status";
import type { CitizenReport, LandPlot, PlotStatus } from "@/lib/types";
import { PlotStatusPill, ReportStatusPill } from "@/components/status-pill";

function FitCenter() {
  const map = useMap();
  useEffect(() => { map.setView([42.9000, 71.3700], 13); }, [map]);
  return null;
}

function squareAround(lat: number, lng: number, area: number): [number, number][] {
  const size = 0.0013 + Math.min(area, 2.5) * 0.00035;
  return [
    [lat - size, lng - size * 1.2],
    [lat - size, lng + size * 1.2],
    [lat + size, lng + size * 1.2],
    [lat + size, lng - size * 1.2],
  ];
}

export function MapClient({ plots, reports, onSelectReport }: { plots: LandPlot[]; reports: CitizenReport[]; onSelectReport?: (report: CitizenReport) => void }) {
  const [filter, setFilter] = useState<"all" | PlotStatus>("all");
  const filtered = useMemo(() => filter === "all" ? plots : plots.filter((plot) => plot.status === filter), [filter, plots]);
  return (
    <div className="relative h-full min-h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="absolute left-4 top-4 z-[500] flex max-w-[calc(100%-2rem)] flex-wrap gap-2 rounded-xl bg-white/95 p-2 shadow-lg backdrop-blur">
        {(["all", "normal", "pending", "violation", "in_progress"] as const).map((value) => {
          const label = value === "all" ? "Все" : plotStatusMeta[value].label;
          return <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${filter === value ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{label}</button>;
        })}
      </div>
      <MapContainer center={[42.9000, 71.3700]} zoom={13} scrollWheelZoom className="h-full min-h-[520px] w-full">
        <FitCenter />
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtered.map((plot) => {
          const meta = plotStatusMeta[plot.status];
          return (
            <Polygon key={plot.id} positions={squareAround(plot.latitude, plot.longitude, plot.area_ha)} pathOptions={{ color: meta.hex, weight: 2, fillColor: meta.hex, fillOpacity: 0.22 }}>
              <Tooltip sticky>{plot.cadastral_number}</Tooltip>
              <Popup minWidth={245}>
                <div className="space-y-3 p-1">
                  <div><div className="text-xs text-slate-500">Кадастровый номер</div><div className="font-semibold">{plot.cadastral_number}</div></div>
                  <PlotStatusPill status={plot.status} />
                  <div className="grid grid-cols-2 gap-2 text-xs"><div><span className="text-slate-500">Площадь</span><br />{plot.area_ha} га</div><div><span className="text-slate-500">Назначение</span><br />{plot.purpose}</div></div>
                  {plot.deadline && <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs">Контрольный срок: <strong>{plot.deadline}</strong></div>}
                </div>
              </Popup>
            </Polygon>
          );
        })}
        {reports.filter((r) => r.status !== "resolved" && r.status !== "rejected").map((report) => (
          <CircleMarker key={report.id} center={[report.latitude, report.longitude]} radius={report.status === "pending" ? 10 : 8} pathOptions={{ color: report.status === "pending" ? "#eab308" : report.status === "violation" ? "#dc2626" : "#f97316", fillOpacity: .9, weight: 3 }} eventHandlers={{ click: () => onSelectReport?.(report) }}>
            <Tooltip>{report.category}</Tooltip>
            <Popup minWidth={250}>
              <div className="space-y-2 p-1">
                <div className="font-semibold">{report.category}</div>
                <ReportStatusPill status={report.status} />
                <p className="text-xs leading-5 text-slate-600">{report.description}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
