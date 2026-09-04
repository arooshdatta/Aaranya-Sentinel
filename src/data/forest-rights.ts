import type { Hotspot, Severity, StateId, StateMetrics, StateProfile, Trend, Year } from "../types/forest-rights";

export const stateProfiles: Record<StateId, StateProfile> = {
  rajasthan: {
    id: "rajasthan",
    name: "Rajasthan",
    metricsByYear: {
      2020: metrics(65, 18240, 4130, 38, "Stable"),
      2021: metrics(64, 19560, 4620, 43, "Stable"),
      2022: metrics(62, 20780, 5190, 51, "Critical"),
      2023: metrics(60, 21840, 5780, 58, "Critical"),
      2024: metrics(59, 22890, 6120, 64, "Critical"),
    },
  },
  "madhya-pradesh": {
    id: "madhya-pradesh",
    name: "Madhya Pradesh",
    metricsByYear: {
      2020: metrics(71, 32460, 8860, 44, "Stable"),
      2021: metrics(72, 35210, 9210, 46, "Stable"),
      2022: metrics(70, 38120, 9820, 55, "Stable"),
      2023: metrics(69, 40670, 10340, 61, "Critical"),
      2024: metrics(68, 43180, 11210, 67, "Critical"),
    },
  },
  maharashtra: {
    id: "maharashtra",
    name: "Maharashtra",
    metricsByYear: {
      2020: metrics(74, 27480, 6240, 31, "Improving"),
      2021: metrics(75, 29630, 5980, 28, "Improving"),
      2022: metrics(74, 31820, 6420, 35, "Stable"),
      2023: metrics(72, 33710, 7120, 46, "Stable"),
      2024: metrics(70, 35490, 7980, 54, "Critical"),
    },
  },
  karnataka: {
    id: "karnataka",
    name: "Karnataka",
    metricsByYear: {
      2020: metrics(76, 22340, 4880, 27, "Improving"),
      2021: metrics(77, 24120, 4610, 24, "Improving"),
      2022: metrics(78, 25860, 4380, 22, "Improving"),
      2023: metrics(78, 27610, 4520, 25, "Improving"),
      2024: metrics(79, 29440, 4390, 21, "Improving"),
    },
  },
  chhattisgarh: {
    id: "chhattisgarh",
    name: "Chhattisgarh",
    metricsByYear: {
      2020: metrics(81, 18920, 3950, 24, "Improving"),
      2021: metrics(82, 20570, 3820, 21, "Improving"),
      2022: metrics(81, 21940, 4120, 26, "Stable"),
      2023: metrics(82, 23630, 3940, 22, "Improving"),
      2024: metrics(83, 25110, 3650, 19, "Improving"),
    },
  },
  odisha: {
    id: "odisha",
    name: "Odisha",
    metricsByYear: {
      2020: metrics(73, 24950, 5470, 36, "Stable"),
      2021: metrics(74, 26980, 5210, 32, "Improving"),
      2022: metrics(73, 28760, 5540, 39, "Stable"),
      2023: metrics(71, 30390, 6230, 49, "Stable"),
      2024: metrics(69, 32140, 7110, 58, "Critical"),
    },
  },
  jharkhand: {
    id: "jharkhand",
    name: "Jharkhand",
    metricsByYear: {
      2020: metrics(62, 15480, 5120, 63, "Critical"),
      2021: metrics(63, 17110, 5240, 59, "Stable"),
      2022: metrics(65, 18760, 4890, 52, "Stable"),
      2023: metrics(67, 20420, 4510, 43, "Improving"),
      2024: metrics(69, 22280, 4170, 36, "Improving"),
    },
  },
  assam: {
    id: "assam",
    name: "Assam",
    metricsByYear: {
      2020: metrics(72, 11740, 3340, 41, "Stable"),
      2021: metrics(70, 12580, 3680, 48, "Stable"),
      2022: metrics(68, 13490, 4130, 56, "Critical"),
      2023: metrics(66, 14220, 4610, 63, "Critical"),
      2024: metrics(65, 14980, 5020, 69, "Critical"),
    },
  },
};

export const hotspots: Hotspot[] = [
  hotspot("sawai-madhopur", "rajasthan", "Sawai Madhopur", "Boundary pressure", [163, 184], ["Green", "Amber", "Amber", "Red", "Red"], ["260 ha", "340 ha", "420 ha", "610 ha", "780 ha"], "Prioritize field boundary verification."),
  hotspot("barwani", "madhya-pradesh", "Barwani", "Claim verification delay", [246, 294], ["Green", "Green", "Amber", "Amber", "Red"], ["180 claims", "210 claims", "270 claims", "340 claims", "410 claims"], "Expedite document review with local teams."),
  hotspot("balaghat", "madhya-pradesh", "Balaghat", "Forest fringe change", [286, 256], ["Amber", "Amber", "Amber", "Red", "Red"], ["190 ha", "230 ha", "310 ha", "440 ha", "530 ha"], "Schedule satellite and ground-truth review."),
  hotspot("gadchiroli", "maharashtra", "Gadchiroli", "Pending claim cluster", [229, 358], ["Green", "Green", "Amber", "Amber", "Red"], ["120 claims", "150 claims", "220 claims", "290 claims", "360 claims"], "Coordinate a district claim resolution drive."),
  hotspot("kodagu", "karnataka", "Kodagu", "Habitat fragmentation", [218, 456], ["Amber", "Green", "Green", "Green", "Green"], ["175 ha", "150 ha", "120 ha", "105 ha", "90 ha"], "Maintain restoration monitoring across corridors."),
  hotspot("kanker", "chhattisgarh", "Kanker", "Tenure overlap", [328, 284], ["Amber", "Amber", "Green", "Green", "Green"], ["230 claims", "210 claims", "180 claims", "150 claims", "120 claims"], "Continue joint tenure reconciliation."),
  hotspot("keonjhar", "odisha", "Keonjhar", "Extraction anomaly", [350, 351], ["Green", "Amber", "Amber", "Red", "Red"], ["140 ha", "190 ha", "260 ha", "390 ha", "480 ha"], "Open a targeted compliance assessment."),
  hotspot("west-singhbhum", "jharkhand", "West Singhbhum", "Claim backlog", [354, 277], ["Red", "Amber", "Amber", "Green", "Green"], ["380 claims", "330 claims", "280 claims", "220 claims", "170 claims"], "Sustain the district-level verification cell."),
  hotspot("kokrajhar", "assam", "Kokrajhar", "Encroachment signal", [428, 176], ["Green", "Amber", "Amber", "Red", "Red"], ["95 ha", "130 ha", "190 ha", "280 ha", "350 ha"], "Deploy a coordinated forest boundary survey."),
  hotspot("dibrugarh", "assam", "Dibrugarh", "Riparian stress", [447, 182], ["Green", "Green", "Amber", "Amber", "Red"], ["70 ha", "88 ha", "115 ha", "140 ha", "190 ha"], "Validate hydrology and forest-edge change."),
];

export function getStateMetrics(stateId: StateId, year: Year) {
  return stateProfiles[stateId].metricsByYear[year];
}

export function getMockAnalystSummary(stateId: StateId, year: Year) {
  const profile = stateProfiles[stateId];
  const current = profile.metricsByYear[year];
  const baseline = profile.metricsByYear[2020];
  const pendingChange = Math.round(((current.pendingClaims - baseline.pendingClaims) / baseline.pendingClaims) * 100);
  const priority = current.anomalyScore >= 65 ? "High" : current.anomalyScore >= 45 ? "Medium" : "Routine";
  const direction = pendingChange > 0 ? "risen" : "reduced";

  return `${profile.name} is ${current.trend.toLowerCase()} in ${year}. Pending claims have ${direction} by ${Math.abs(pendingChange)}% since 2020. The current anomaly score is ${current.anomalyScore}/100. Verification priority: ${priority}.`;
}

export function getSeverityColor(severity: Severity) {
  return { Green: "#14B8A6", Amber: "#F59E0B", Red: "#EF4444" }[severity];
}

export function getClaimStatus(severity: Severity) {
  return { Green: "Verified", Amber: "Under review", Red: "Pending verification" }[severity];
}

export function getEvidenceItems(hotspot: Hotspot, year: Year) {
  return [
    { label: "Satellite observation", detail: `Change signal recorded · ${year}` },
    { label: "Claim register correlation", detail: `${hotspot.issueType} linked to district records` },
    { label: "Field verification note", detail: "Review queue prepared for investigator" },
  ];
}

export function getHotspotAnalystSummary(hotspot: Hotspot, year: Year) {
  const severity = hotspot.severityByYear[year].toLowerCase();
  return `${hotspot.districtName} has a ${severity}-severity ${hotspot.issueType.toLowerCase()} signal in ${year}. Cross-check the listed evidence before escalating the recommended action.`;
}

function metrics(forestHealthScore: number, approvedClaims: number, pendingClaims: number, anomalyScore: number, trend: Trend): StateMetrics {
  return { forestHealthScore, approvedClaims, pendingClaims, anomalyScore, trend };
}

function hotspot(
  id: string,
  stateId: StateId,
  districtName: string,
  issueType: string,
  position: [number, number],
  severities: Severity[],
  impacts: string[],
  recommendedAction: string,
): Hotspot {
  const years: Year[] = [2020, 2021, 2022, 2023, 2024];
  const severityByYear = Object.fromEntries(years.map((year, index) => [year, severities[index]])) as Record<Year, Severity>;
  const impactByYear = Object.fromEntries(years.map((year, index) => [year, impacts[index]])) as Record<Year, string>;

  return { id, stateId, districtName, issueType, recommendedAction, position, severityByYear, impactByYear };
}
