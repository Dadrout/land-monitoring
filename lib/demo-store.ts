import { randomUUID } from "crypto";
import { seedApplications, seedPlots, seedReports } from "@/lib/seed";
import type { CitizenReport, LandApplication, LandPlot, ReportStatus } from "@/lib/types";

type DemoState = {
  plots: LandPlot[];
  reports: CitizenReport[];
  applications: LandApplication[];
};

declare global {
  var __jerMonitorDemoState: DemoState | undefined;
}

const getState = (): DemoState => {
  if (!global.__jerMonitorDemoState) {
    global.__jerMonitorDemoState = {
      plots: structuredClone(seedPlots),
      reports: structuredClone(seedReports),
      applications: structuredClone(seedApplications),
    };
  }
  return global.__jerMonitorDemoState;
};

export function demoPlots() { return getState().plots; }
export function demoReports() { return getState().reports; }
export function demoApplications() { return getState().applications; }

export function demoCreateReport(input: Omit<CitizenReport, "id" | "created_at" | "updated_at">): CitizenReport {
  const now = new Date().toISOString();
  const report: CitizenReport = { ...input, id: `r-${randomUUID()}`, created_at: now, updated_at: now };
  getState().reports.unshift(report);
  if (report.plot_id) {
    const plot = getState().plots.find((item) => item.id === report.plot_id);
    if (plot) {
      plot.status = "pending";
      plot.updated_at = now;
    }
  }
  return report;
}

export function demoUpdateReport(id: string, patch: { status?: ReportStatus; deadline?: string | null; plot_id?: string | null }): CitizenReport | null {
  const state = getState();
  const report = state.reports.find((item) => item.id === id);
  if (!report) return null;
  Object.assign(report, patch, { updated_at: new Date().toISOString() });
  if (report.plot_id) {
    const plot = state.plots.find((item) => item.id === report.plot_id);
    if (plot) {
      if (patch.status === "pending") plot.status = "pending";
      if (patch.status === "violation") plot.status = "violation";
      if (patch.status === "in_progress") plot.status = "in_progress";
      if (patch.status === "resolved") plot.status = "resolved";
      if (patch.status === "rejected") plot.status = "normal";
      if (patch.deadline !== undefined) plot.deadline = patch.deadline;
      plot.updated_at = report.updated_at;
    }
  }
  return report;
}
