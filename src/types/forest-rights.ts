export const TIMELINE_YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] as const;
export const OBSERVED_YEARS = [2020, 2021, 2022, 2023, 2024] as const;

export type Year = (typeof TIMELINE_YEARS)[number];
export type ObservedYear = (typeof OBSERVED_YEARS)[number];

export type StateId =
  | "andhra-pradesh"
  | "arunachal-pradesh"
  | "assam"
  | "bihar"
  | "chandigarh"
  | "chhattisgarh"
  | "dadra-and-nagar-haveli"
  | "daman-and-diu"
  | "delhi"
  | "goa"
  | "gujarat"
  | "haryana"
  | "himachal-pradesh"
  | "jammu-and-kashmir"
  | "jharkhand"
  | "karnataka"
  | "kerala"
  | "ladakh"
  | "madhya-pradesh"
  | "maharashtra"
  | "manipur"
  | "meghalaya"
  | "mizoram"
  | "nagaland"
  | "odisha"
  | "puducherry"
  | "punjab"
  | "rajasthan"
  | "sikkim"
  | "tamil-nadu"
  | "tripura"
  | "uttar-pradesh"
  | "uttaranchal"
  | "west-bengal"
  | (string & {});

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
  metricsByYear: Record<ObservedYear, StateMetrics>;
}

export interface Hotspot {
  id: string;
  stateId: StateId;
  districtName: string;
  issueType: string;
  recommendedAction: string;
  position: [number, number];
  severityByYear: Record<ObservedYear, Severity>;
  impactByYear: Record<ObservedYear, string>;
}
