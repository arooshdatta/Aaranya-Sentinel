import { OBSERVED_YEARS, type Hotspot, type ObservedYear, type Severity, type StateId, type StateMetrics, type StateProfile, type Trend, type Year } from "../types/forest-rights";

export const stateProfiles: Record<string, StateProfile> = {
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
  kerala: {
    id: "kerala",
    name: "Kerala",
    metricsByYear: {
      2020: metrics(84, 14200, 2180, 22, "Improving"),
      2021: metrics(83, 15100, 2340, 26, "Stable"),
      2022: metrics(82, 16050, 2520, 31, "Stable"),
      2023: metrics(80, 16900, 2850, 39, "Stable"),
      2024: metrics(78, 17750, 3210, 47, "Stable"),
    },
  },
  "andhra-pradesh": {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    metricsByYear: {
      2020: metrics(71, 16800, 3890, 36, "Stable"),
      2021: metrics(72, 18200, 3720, 33, "Stable"),
      2022: metrics(70, 19600, 4120, 40, "Stable"),
      2023: metrics(68, 20900, 4580, 49, "Stable"),
      2024: metrics(66, 22100, 5140, 58, "Critical"),
    },
  },
  "arunachal-pradesh": {
    id: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    metricsByYear: {
      2020: metrics(89, 8200, 1120, 18, "Improving"),
      2021: metrics(88, 8900, 1280, 22, "Improving"),
      2022: metrics(86, 9600, 1510, 29, "Stable"),
      2023: metrics(84, 10300, 1820, 37, "Stable"),
      2024: metrics(82, 11000, 2190, 46, "Stable"),
    },
  },
  uttaranchal: {
    id: "uttaranchal",
    name: "Uttarakhand",
    metricsByYear: {
      2020: metrics(80, 9400, 1850, 25, "Improving"),
      2021: metrics(79, 10100, 2020, 29, "Stable"),
      2022: metrics(77, 10800, 2310, 36, "Stable"),
      2023: metrics(75, 11500, 2690, 45, "Stable"),
      2024: metrics(73, 12200, 3120, 53, "Critical"),
    },
  },
  gujarat: {
    id: "gujarat",
    name: "Gujarat",
    metricsByYear: {
      2020: metrics(68, 14900, 3420, 37, "Stable"),
      2021: metrics(69, 16100, 3310, 34, "Stable"),
      2022: metrics(67, 17200, 3780, 42, "Stable"),
      2023: metrics(66, 18300, 4190, 48, "Stable"),
      2024: metrics(64, 19400, 4710, 55, "Critical"),
    },
  },
  "west-bengal": {
    id: "west-bengal",
    name: "West Bengal",
    metricsByYear: {
      2020: metrics(69, 13400, 3620, 42, "Stable"),
      2021: metrics(70, 14500, 3480, 39, "Stable"),
      2022: metrics(68, 15600, 3910, 46, "Stable"),
      2023: metrics(67, 16700, 4350, 52, "Critical"),
      2024: metrics(65, 17800, 4890, 61, "Critical"),
    },
  },
  "himachal-pradesh": {
    id: "himachal-pradesh",
    name: "Himachal Pradesh",
    metricsByYear: {
      2020: metrics(82, 7800, 1410, 23, "Improving"),
      2021: metrics(83, 8400, 1320, 20, "Improving"),
      2022: metrics(81, 9100, 1540, 27, "Stable"),
      2023: metrics(80, 9700, 1790, 33, "Stable"),
      2024: metrics(78, 10300, 2080, 41, "Stable"),
    },
  },
  meghalaya: {
    id: "meghalaya",
    name: "Meghalaya",
    metricsByYear: {
      2020: metrics(81, 6200, 1140, 24, "Improving"),
      2021: metrics(80, 6700, 1260, 27, "Stable"),
      2022: metrics(78, 7300, 1490, 34, "Stable"),
      2023: metrics(76, 7900, 1750, 42, "Stable"),
      2024: metrics(74, 8500, 2040, 50, "Critical"),
    },
  },
  bihar: {
    id: "bihar",
    name: "Bihar",
    metricsByYear: {
      2020: metrics(58, 8900, 3120, 55, "Critical"),
      2021: metrics(59, 9600, 3240, 52, "Stable"),
      2022: metrics(60, 10400, 3110, 48, "Stable"),
      2023: metrics(61, 11100, 2980, 44, "Stable"),
      2024: metrics(63, 11900, 2810, 39, "Improving"),
    },
  },
  "tamil-nadu": {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    metricsByYear: {
      2020: metrics(75, 12400, 2380, 28, "Improving"),
      2021: metrics(76, 13200, 2240, 25, "Improving"),
      2022: metrics(75, 14100, 2490, 31, "Stable"),
      2023: metrics(74, 14900, 2810, 38, "Stable"),
      2024: metrics(73, 15700, 3190, 45, "Stable"),
    },
  },
  "uttar-pradesh": {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    metricsByYear: {
      2020: metrics(61, 19400, 5980, 52, "Critical"),
      2021: metrics(62, 20900, 5810, 49, "Stable"),
      2022: metrics(61, 22400, 6240, 54, "Critical"),
      2023: metrics(60, 23800, 6720, 61, "Critical"),
      2024: metrics(59, 25100, 7280, 67, "Critical"),
    },
  },
  "jammu-and-kashmir": {
    id: "jammu-and-kashmir",
    name: "Jammu & Kashmir",
    metricsByYear: {
      2020: metrics(78, 8900, 1820, 26, "Improving"),
      2021: metrics(77, 9500, 1980, 30, "Stable"),
      2022: metrics(76, 10200, 2210, 36, "Stable"),
      2023: metrics(74, 10800, 2540, 44, "Stable"),
      2024: metrics(72, 11400, 2910, 51, "Critical"),
    },
  },
  punjab: {
    id: "punjab",
    name: "Punjab",
    metricsByYear: {
      2020: metrics(52, 4100, 1240, 61, "Critical"),
      2021: metrics(53, 4400, 1190, 58, "Critical"),
      2022: metrics(53, 4700, 1260, 59, "Critical"),
      2023: metrics(54, 5000, 1220, 56, "Critical"),
      2024: metrics(55, 5300, 1180, 53, "Critical"),
    },
  },
  haryana: {
    id: "haryana",
    name: "Haryana",
    metricsByYear: {
      2020: metrics(50, 3600, 1180, 64, "Critical"),
      2021: metrics(51, 3900, 1140, 61, "Critical"),
      2022: metrics(52, 4200, 1190, 60, "Critical"),
      2023: metrics(53, 4500, 1150, 57, "Critical"),
      2024: metrics(54, 4800, 1110, 54, "Critical"),
    },
  },
  sikkim: {
    id: "sikkim",
    name: "Sikkim",
    metricsByYear: {
      2020: metrics(91, 3400, 420, 14, "Improving"),
      2021: metrics(92, 3600, 380, 12, "Improving"),
      2022: metrics(90, 3900, 450, 16, "Improving"),
      2023: metrics(89, 4100, 520, 21, "Improving"),
      2024: metrics(88, 4300, 610, 27, "Stable"),
    },
  },
  goa: {
    id: "goa",
    name: "Goa",
    metricsByYear: {
      2020: metrics(77, 2800, 580, 26, "Improving"),
      2021: metrics(78, 3000, 540, 23, "Improving"),
      2022: metrics(76, 3300, 610, 31, "Stable"),
      2023: metrics(75, 3500, 720, 38, "Stable"),
      2024: metrics(73, 3700, 840, 46, "Stable"),
    },
  },
  manipur: {
    id: "manipur",
    name: "Manipur",
    metricsByYear: {
      2020: metrics(79, 4800, 940, 27, "Improving"),
      2021: metrics(78, 5200, 1020, 31, "Stable"),
      2022: metrics(76, 5600, 1210, 39, "Stable"),
      2023: metrics(73, 6000, 1540, 49, "Stable"),
      2024: metrics(70, 6400, 1890, 59, "Critical"),
    },
  },
  mizoram: {
    id: "mizoram",
    name: "Mizoram",
    metricsByYear: {
      2020: metrics(86, 5100, 720, 19, "Improving"),
      2021: metrics(85, 5500, 810, 22, "Improving"),
      2022: metrics(84, 5900, 940, 28, "Stable"),
      2023: metrics(82, 6300, 1120, 35, "Stable"),
      2024: metrics(80, 6700, 1340, 43, "Stable"),
    },
  },
  nagaland: {
    id: "nagaland",
    name: "Nagaland",
    metricsByYear: {
      2020: metrics(83, 4400, 780, 22, "Improving"),
      2021: metrics(82, 4700, 860, 26, "Stable"),
      2022: metrics(80, 5100, 990, 33, "Stable"),
      2023: metrics(78, 5400, 1180, 41, "Stable"),
      2024: metrics(76, 5800, 1410, 49, "Stable"),
    },
  },
  tripura: {
    id: "tripura",
    name: "Tripura",
    metricsByYear: {
      2020: metrics(76, 6800, 1320, 29, "Improving"),
      2021: metrics(77, 7300, 1240, 26, "Improving"),
      2022: metrics(75, 7800, 1480, 33, "Stable"),
      2023: metrics(74, 8300, 1720, 40, "Stable"),
      2024: metrics(72, 8800, 2050, 48, "Stable"),
    },
  },
  ladakh: {
    id: "ladakh",
    name: "Ladakh",
    metricsByYear: {
      2020: metrics(85, 2100, 340, 18, "Improving"),
      2021: metrics(86, 2300, 310, 15, "Improving"),
      2022: metrics(85, 2500, 370, 20, "Improving"),
      2023: metrics(84, 2700, 430, 26, "Improving"),
      2024: metrics(83, 2900, 510, 32, "Stable"),
    },
  },
};

export function getStateProfile(stateId: StateId): StateProfile {
  if (stateProfiles[stateId]) return stateProfiles[stateId];
  const name = stateId
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    id: stateId,
    name,
    metricsByYear: {
      2020: metrics(70, 14000, 3200, 35, "Stable"),
      2021: metrics(71, 15200, 3400, 33, "Stable"),
      2022: metrics(70, 16400, 3700, 38, "Stable"),
      2023: metrics(69, 17500, 4100, 42, "Stable"),
      2024: metrics(68, 18600, 4500, 46, "Stable"),
    },
  };
}

export const hotspots: Hotspot[] = [
  hotspot("sawai-madhopur", "rajasthan", "Sawai Madhopur", "Boundary pressure", [76.35, 26.02], ["Green", "Amber", "Amber", "Red", "Red"], ["260 ha", "340 ha", "420 ha", "610 ha", "780 ha"], "Prioritize field boundary verification."),
  hotspot("barwani", "madhya-pradesh", "Barwani", "Claim verification delay", [74.9, 22.03], ["Green", "Green", "Amber", "Amber", "Red"], ["180 claims", "210 claims", "270 claims", "340 claims", "410 claims"], "Expedite document review with local teams."),
  hotspot("balaghat", "madhya-pradesh", "Balaghat", "Forest fringe change", [80.18, 21.82], ["Amber", "Amber", "Amber", "Red", "Red"], ["190 ha", "230 ha", "310 ha", "440 ha", "530 ha"], "Schedule satellite and ground-truth review."),
  hotspot("gadchiroli", "maharashtra", "Gadchiroli", "Pending claim cluster", [80.0, 20.18], ["Green", "Green", "Amber", "Amber", "Red"], ["120 claims", "150 claims", "220 claims", "290 claims", "360 claims"], "Coordinate a district claim resolution drive."),
  hotspot("kodagu", "karnataka", "Kodagu", "Habitat fragmentation", [75.73, 12.34], ["Amber", "Green", "Green", "Green", "Green"], ["175 ha", "150 ha", "120 ha", "105 ha", "90 ha"], "Maintain restoration monitoring across corridors."),
  hotspot("kanker", "chhattisgarh", "Kanker", "Tenure overlap", [81.5, 20.27], ["Amber", "Amber", "Green", "Green", "Green"], ["230 claims", "210 claims", "180 claims", "150 claims", "120 claims"], "Continue joint tenure reconciliation."),
  hotspot("keonjhar", "odisha", "Keonjhar", "Extraction anomaly", [85.58, 21.63], ["Green", "Amber", "Amber", "Red", "Red"], ["140 ha", "190 ha", "260 ha", "390 ha", "480 ha"], "Open a targeted compliance assessment."),
  hotspot("west-singhbhum", "jharkhand", "West Singhbhum", "Claim backlog", [85.3, 22.55], ["Red", "Amber", "Amber", "Green", "Green"], ["380 claims", "330 claims", "280 claims", "220 claims", "170 claims"], "Sustain the district-level verification cell."),
  hotspot("kokrajhar", "assam", "Kokrajhar", "Encroachment signal", [89.9, 26.4], ["Green", "Amber", "Amber", "Red", "Red"], ["95 ha", "130 ha", "190 ha", "280 ha", "350 ha"], "Deploy a coordinated forest boundary survey."),
  hotspot("dibrugarh", "assam", "Dibrugarh", "Riparian stress", [94.9, 27.48], ["Green", "Green", "Amber", "Amber", "Red"], ["70 ha", "88 ha", "115 ha", "140 ha", "190 ha"], "Validate hydrology and forest-edge change."),
  // Additional regional anomalies across India
  hotspot("wayanad", "kerala", "Wayanad", "Canopy corridor degradation", [76.13, 11.68], ["Green", "Amber", "Amber", "Amber", "Red"], ["85 ha", "110 ha", "145 ha", "190 ha", "240 ha"], "Establish wildlife corridor protection protocol."),
  hotspot("visakhapatnam", "andhra-pradesh", "Visakhapatnam", "Tenure conflict zone", [82.80, 18.05], ["Green", "Green", "Amber", "Red", "Red"], ["150 claims", "190 claims", "240 claims", "310 claims", "420 claims"], "Audit community forest resource titling records."),
  hotspot("changlang", "arunachal-pradesh", "Changlang", "Canopy density shift", [95.73, 27.12], ["Green", "Green", "Green", "Amber", "Amber"], ["60 ha", "75 ha", "95 ha", "130 ha", "175 ha"], "Initiate satellite verification of primary canopy."),
  hotspot("chamoli", "uttaranchal", "Chamoli", "High-altitude timberline stress", [79.35, 30.40], ["Green", "Amber", "Amber", "Red", "Red"], ["110 ha", "140 ha", "185 ha", "240 ha", "310 ha"], "Deploy altitude drone survey in eco-sensitive belt."),
  hotspot("dangs", "gujarat", "The Dangs", "Claim rejection surge", [73.68, 20.85], ["Amber", "Amber", "Amber", "Red", "Red"], ["210 claims", "260 claims", "320 claims", "410 claims", "530 claims"], "Convene state appellate committee review."),
  hotspot("sundarbans", "west-bengal", "Sundarbans", "Mangrove tidal fringe pressure", [88.85, 21.95], ["Amber", "Amber", "Red", "Red", "Red"], ["130 ha", "175 ha", "225 ha", "300 ha", "390 ha"], "Activate coastal zone bio-monitoring sensor array."),
  hotspot("kinnaur", "himachal-pradesh", "Kinnaur", "Hydropower forest diversion", [78.35, 31.55], ["Green", "Green", "Amber", "Amber", "Red"], ["90 ha", "115 ha", "140 ha", "180 ha", "230 ha"], "Cross-examine catchment diversion compliance."),
  hotspot("east-khasi-hills", "meghalaya", "East Khasi Hills", "Sacred grove boundary stress", [91.89, 25.57], ["Green", "Green", "Amber", "Amber", "Amber"], ["45 ha", "60 ha", "80 ha", "105 ha", "135 ha"], "Engage traditional village councils for demarcation."),
];

export function getStateMetrics(stateId: StateId, year: Year) {
  const profile = getStateProfile(stateId);
  const observedYear = nearestObservedYear(year);
  const observed = profile.metricsByYear[observedYear];

  if (year === observedYear) return observed;

  const direction = year < 2020 ? -1 : 1;
  const distance = Math.abs(year - observedYear);
  const adjacent = profile.metricsByYear[direction < 0 ? 2021 : 2023];
  const healthDelta = observed.forestHealthScore - adjacent.forestHealthScore;
  const approvedDelta = observed.approvedClaims - adjacent.approvedClaims;
  const pendingDelta = observed.pendingClaims - adjacent.pendingClaims;
  const anomalyDelta = observed.anomalyScore - adjacent.anomalyScore;
  const anomalyScore = clamp(Math.round(observed.anomalyScore + anomalyDelta * distance), 8, 92);

  return {
    forestHealthScore: clamp(Math.round(observed.forestHealthScore + healthDelta * distance), 35, 95),
    approvedClaims: Math.max(0, Math.round(observed.approvedClaims + approvedDelta * distance)),
    pendingClaims: Math.max(0, Math.round(observed.pendingClaims + pendingDelta * distance)),
    anomalyScore,
    trend: anomalyScore >= 58 ? "Critical" : anomalyScore <= 32 ? "Improving" : "Stable",
  } satisfies StateMetrics;
}

export function getMockAnalystSummary(stateId: StateId, year: Year): string {
  const profile = getStateProfile(stateId);
  const current = getStateMetrics(stateId, year);
  const baseline = profile.metricsByYear[2020];
  const pendingChange = Math.round(((current.pendingClaims - baseline.pendingClaims) / baseline.pendingClaims) * 100);
  const priority = current.anomalyScore >= 65 ? "High" : current.anomalyScore >= 45 ? "Medium" : "Routine";
  const direction = pendingChange > 0 ? "risen" : "reduced";

  return `${profile.name} is ${current.trend.toLowerCase()} in ${year}. Pending claims have ${direction} by ${Math.abs(pendingChange)}% since 2020. The current anomaly score is ${current.anomalyScore}/100. Verification priority: ${priority}.`;
}

export function getSeverityColor(severity: Severity) {
  return { Green: "#5F8F7B", Amber: "#B78743", Red: "#A85A52" }[severity];
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
  const severity = getHotspotSeverity(hotspot, year).toLowerCase();
  return `${hotspot.districtName} has a ${severity}-severity ${hotspot.issueType.toLowerCase()} signal in ${year}. Cross-check the listed evidence before escalating the recommended action.`;
}

export function getHotspotSeverity(hotspot: Hotspot, year: Year) {
  return hotspot.severityByYear[nearestObservedYear(year)];
}

export function getHotspotImpact(hotspot: Hotspot, year: Year) {
  return hotspot.impactByYear[nearestObservedYear(year)];
}

export function getHotspotPosition(hotspot: Hotspot): [number, number] {
  return hotspot.position;
}

function metrics(forestHealthScore: number, approvedClaims: number, pendingClaims: number, anomalyScore: number, trend: Trend): StateMetrics {
  return { forestHealthScore, approvedClaims, pendingClaims, anomalyScore, trend };
}

function nearestObservedYear(year: Year): ObservedYear {
  if (year <= 2020) return 2020;
  if (year >= 2024) return 2024;
  return year as ObservedYear;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
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
  const severityByYear = Object.fromEntries(OBSERVED_YEARS.map((year, index) => [year, severities[index]])) as Record<ObservedYear, Severity>;
  const impactByYear = Object.fromEntries(OBSERVED_YEARS.map((year, index) => [year, impacts[index]])) as Record<ObservedYear, string>;

  return { id, stateId, districtName, issueType, recommendedAction, position, severityByYear, impactByYear };
}
