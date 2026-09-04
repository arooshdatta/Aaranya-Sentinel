export const TIMELINE_YEARS = [2020, 2021, 2022, 2023, 2024] as const;

export type Year = (typeof TIMELINE_YEARS)[number];

export type StateId =
  | "rajasthan"
  | "madhya-pradesh"
  | "maharashtra"
  | "karnataka"
  | "chhattisgarh"
  | "odisha"
  | "jharkhand"
  | "assam";

export type Trend = "Improving" | "Stable" | "Critical";
export type Severity = "Green" | "Amber" | "Red";

export interface StateMetrics {
  forestHealthScore: number;
  approvedClaims: number;
  pendingClaims: number;
  anomalyScore: number;
  trend: Trend;
}

export interface StateProfile {
  id: StateId;
  name: string;
  metricsByYear: Record<Year, StateMetrics>;
}

export interface Hotspot {
  id: string;
  stateId: StateId;
  districtName: string;
  issueType: string;
  recommendedAction: string;
  position: [number, number];
  severityByYear: Record<Year, Severity>;
  impactByYear: Record<Year, string>;
}
