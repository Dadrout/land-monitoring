export type PlotStatus = "normal" | "pending" | "violation" | "in_progress" | "resolved" | "returned";
export type ReportStatus = "pending" | "violation" | "in_progress" | "resolved" | "rejected";

export type LandPlot = {
  id: string;
  cadastral_number: string;
  purpose: string;
  area_ha: number;
  latitude: number;
  longitude: number;
  status: PlotStatus;
  deadline: string | null;
  updated_at: string;
};

export type CitizenReport = {
  id: string;
  telegram_user_id: string | null;
  category: string;
  latitude: number;
  longitude: number;
  description: string;
  photo_url: string | null;
  status: ReportStatus;
  plot_id: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
};

export type LandApplication = {
  id: string;
  tracking_number: string;
  status: string;
  stage: string;
  description: string;
  eta: string;
  updated_at: string;
};

export type DashboardStats = {
  totalPlots: number;
  pending: number;
  violations: number;
  overdue: number;
};
