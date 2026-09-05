"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getEvidenceItems,
  getHotspotImpact,
  getHotspotPosition,
  getHotspotSeverity,
  getSeverityColor,
  getStateMetrics,
  getStateProfile,
  hotspots,
  stateProfiles,
} from "../../data/forest-rights";
import type { Hotspot, StateId, Year } from "../../types/forest-rights";

// ─── Types ────────────────────────────────────────────────────────────────────

type Pos = [number, number];

interface RawFeature {
  properties: { NAME_1: string };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: Pos[][] | Pos[][][] };
}

interface GeoData { features: RawFeature[] }

interface Feature {
  name: string;
  stateId: StateId | null;
  path: string;
  centroid: Pos;
  spanX: number;
  spanY: number;
}

export interface MapViewportProps {
  year: Year;
  selectedStateId: StateId | null;
  selectedHotspotId: string | null;
  onSelectState: (id: StateId) => void;
  onSelectHotspot: (id: string) => void;
  onClearSelection: () => void;
  onCloseDistrict: () => void;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

// Geographic projection bounds
const GEO = { minLon: 67.5, maxLon: 98, minLat: 6, maxLat: 37.5 };

// SVG coordinate space — India lives here
const VW = 560;
const VH = 620;

// Universal name-to-StateId resolver: supports all 36 Indian states & union territories
function nameToStateId(name: string): StateId {
  const custom: Record<string, string> = {
    Orissa: "odisha",
    Uttaranchal: "uttaranchal",
  };
  return (custom[name] ?? name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")) as StateId;
}

// Labels for prominent states across all regions of India
const STATE_LABELS: Array<{ id: StateId; name: string; geo: Pos }> = [
  { id: "rajasthan",        name: "Rajasthan",        geo: [73.87, 27.3] },
  { id: "madhya-pradesh",   name: "Madhya Pradesh",   geo: [78.42, 23.7] },
  { id: "maharashtra",      name: "Maharashtra",      geo: [76.60, 19.2] },
  { id: "karnataka",        name: "Karnataka",        geo: [75.60, 15.2] },
  { id: "chhattisgarh",     name: "Chhattisgarh",     geo: [81.80, 21.2] },
  { id: "odisha",           name: "Odisha",           geo: [85.00, 20.5] },
  { id: "jharkhand",        name: "Jharkhand",        geo: [85.50, 23.6] },
  { id: "assam",            name: "Assam",            geo: [92.80, 26.2] },
  { id: "kerala",           name: "Kerala",           geo: [76.40, 10.3] },
  { id: "andhra-pradesh",   name: "Andhra Pradesh",   geo: [79.90, 15.8] },
  { id: "gujarat",          name: "Gujarat",          geo: [71.50, 22.8] },
  { id: "arunachal-pradesh",name: "Arunachal Pradesh",geo: [94.50, 28.2] },
  { id: "uttaranchal",      name: "Uttarakhand",      geo: [79.20, 30.1] },
  { id: "west-bengal",      name: "West Bengal",      geo: [87.80, 23.2] },
  { id: "himachal-pradesh", name: "Himachal Pradesh", geo: [77.20, 31.8] },
  { id: "meghalaya",        name: "Meghalaya",        geo: [91.30, 25.5] },
  { id: "jammu-and-kashmir",name: "Jammu & Kashmir",  geo: [75.00, 33.7] },
  { id: "ladakh",           name: "Ladakh",           geo: [77.80, 34.5] },
  { id: "tamil-nadu",       name: "Tamil Nadu",       geo: [78.40, 11.1] },
  { id: "uttar-pradesh",    name: "Uttar Pradesh",    geo: [80.50, 26.8] },
  { id: "bihar",            name: "Bihar",            geo: [85.50, 25.7] },
  { id: "punjab",           name: "Punjab",           geo: [75.30, 31.0] },
  { id: "haryana",          name: "Haryana",          geo: [76.30, 29.2] },
  { id: "goa",              name: "Goa",              geo: [74.00, 15.3] },
  { id: "sikkim",           name: "Sikkim",           geo: [88.50, 27.5] },
  { id: "manipur",          name: "Manipur",          geo: [93.90, 24.8] },
  { id: "mizoram",          name: "Mizoram",          geo: [92.90, 23.3] },
  { id: "nagaland",         name: "Nagaland",         geo: [94.40, 26.1] },
  { id: "tripura",          name: "Tripura",          geo: [91.80, 23.8] },
];

// ─── Projection ─────────────────────────────────────────────────────────────────

function project([lon, lat]: Pos): Pos {
  return [
    ((lon - GEO.minLon) / (GEO.maxLon - GEO.minLon)) * VW,
    ((GEO.maxLat - lat) / (GEO.maxLat - GEO.minLat)) * VH,
  ];
}

// ─── GeoJSON processing (runs once on data load) ────────────────────────────────

function buildFeatures(raw: RawFeature[]): Feature[] {
  return raw
    .filter(f => f.properties.NAME_1 !== "Andaman and Nicobar" && f.properties.NAME_1 !== "Lakshadweep")
    .map(f => {
      const name = f.properties.NAME_1;
      const stateId = nameToStateId(name);

      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      let sumX = 0, sumY = 0, n = 0;

      const polys = f.geometry.type === "Polygon"
        ? [f.geometry.coordinates as Pos[][]]
        : f.geometry.coordinates as Pos[][][];

      const path = polys.map(poly =>
        poly.map(ring =>
          ring.map((pt, i) => {
            const [x, y] = project(pt);
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            sumX += x; sumY += y; n++;
            return (i === 0 ? "M " : "L ") + x.toFixed(1) + " " + y.toFixed(1);
          }).join(" ") + " Z"
        ).join(" ")
      ).join(" ");

      return {
        name,
        stateId,
        path,
        centroid: n > 0 ? [sumX / n, sumY / n] as Pos : [(minX + maxX) / 2, (minY + maxY) / 2] as Pos,
        spanX: Math.max(maxX - minX, 20),
        spanY: Math.max(maxY - minY, 20),
      };
    });
}

// ─── Camera computation ─────────────────────────────────────────────────────────
//
// Mathematically verified centering:
// ─── Camera computation ─────────────────────────────────────────────────────────
//
// Mathematically verified centering:
// S * P + t = C  ⟹  t = C - S * P
// Where C = [VW / 2, VH / 2].
// The clicked anomaly coordinate is ALWAYS the camera anchor:
// x = VW / 2 - scale * px
// y = VH / 2 - scale * py
// No offsets, no approximations, no clamping away from the coordinate.

function computeCamera(
  selectedStateId: StateId | null,
  selectedHotspot: Hotspot | null,
  features: Feature[],
): { scale: number; x: number; y: number } {
  if (!selectedStateId && !selectedHotspot) {
    return { scale: 1, x: 0, y: 0 };
  }

  // Hotspot investigation: anchor camera EXACTLY on anomaly coordinates
  if (selectedHotspot) {
    const [px, py] = project(getHotspotPosition(selectedHotspot));
    const scale = 2.1;
    return {
      scale,
      x: VW / 2 - scale * px,
      y: VH / 2 - scale * py,
    };
  }

  // State arrival: anchor camera on polygon's exact geometric centroid
  const feat = features.find(f => f.stateId === selectedStateId);
  const [cx, cy] = feat ? feat.centroid : [VW / 2, VH / 2];

  let scale = 1.9;
  if (feat) {
    const fitX = (VW * 0.52) / feat.spanX;
    const fitY = (VH * 0.52) / feat.spanY;
    scale = Math.min(Math.max(Math.min(fitX, fitY), 1.5), 2.2);
  }

  return {
    scale,
    x: VW / 2 - scale * cx,
    y: VH / 2 - scale * cy,
  };
}

// ─── Color helpers ──────────────────────────────────────────────────────────────

function stateHealthColor(score: number): string {
  if (score >= 72) return "#1E4D44";
  if (score >= 65) return "#5A4220";
  return "#5A2A26";
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function MapViewport({
  year,
  selectedStateId,
  selectedHotspotId,
  onSelectState,
  onSelectHotspot,
  onClearSelection,
  onCloseDistrict,
}: MapViewportProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [hoveredState, setHoveredState] = useState<StateId | null>(null);
  const prevYearRef = useRef(year);
  const [temporalFlash, setTemporalFlash] = useState(false);

  // Wow moment 4: Animated temporal transition when year changes
  useEffect(() => {
    if (prevYearRef.current !== year) {
      prevYearRef.current = year;
      setTemporalFlash(true);
      const t = setTimeout(() => setTemporalFlash(false), 900);
      return () => clearTimeout(t);
    }
  }, [year]);

  useEffect(() => {
    let alive = true;
    fetch("/india-states-simplified.geojson")
      .then(r => r.json())
      .then((d: GeoData) => { if (alive) setFeatures(buildFeatures(d.features)); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const allFeaturesPath = useMemo(
    () => features.map(f => f.path).join(" "),
    [features]
  );

  const selectedHotspot = useMemo(
    () => hotspots.find(h => h.id === selectedHotspotId) ?? null,
    [selectedHotspotId]
  );

  const selectedFeature = useMemo(
    () => features.find(f => f.stateId === selectedStateId) ?? null,
    [features, selectedStateId]
  );

  const camera = useMemo(
    () => computeCamera(selectedStateId, selectedHotspot, features),
    [selectedStateId, selectedHotspot, features]
  );

  // At national or state level, show all hotspots (national) or only state's (state+district)
  const shownHotspots = useMemo(() => {
    if (!selectedStateId) return hotspots;
    return hotspots.filter(h => h.stateId === selectedStateId);
  }, [selectedStateId]);

  const isDistrictView = Boolean(selectedHotspot);
  const isStateView = Boolean(selectedStateId && !selectedHotspot);
  const isNationalView = !selectedStateId && !selectedHotspot;

  return (
    <section
      className="relative h-full w-full overflow-hidden bg-[#060E1A]"
      onClick={onClearSelection}
      aria-label="India forest rights investigation map"
    >
      {/* Ambient depth gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_48%_at_50%_46%,rgba(10,25,42,0.92),#060E1A_80%)]" />

      {/* ── THE MAP — one SVG, one coordinate system, everything moves together ── */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full select-none"
      >
        <defs>
          {/* Subcontinent Atmospheric Breathing Aura */}
          <radialGradient id="subcontinent-aura" cx="50%" cy="48%" r="48%">
            <stop offset="0%" stopColor="#2E6B56" stopOpacity="0.24" />
            <stop offset="55%" stopColor="#1B4236" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#060E1A" stopOpacity="0" />
          </radialGradient>

          {/* Satellite Sweep Scanning Beam */}
          <linearGradient id="sat-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7EA38F" stopOpacity="0" />
            <stop offset="46%" stopColor="#7EA38F" stopOpacity="0.01" />
            <stop offset="50%" stopColor="#9DE3BE" stopOpacity="0.18" />
            <stop offset="54%" stopColor="#7EA38F" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#7EA38F" stopOpacity="0" />
          </linearGradient>

          {/* Tactile Forest Canopy Texture */}
          <pattern id="forest-canopy-texture" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.6" fill="#7EA38F" fillOpacity="0.12" />
            <circle cx="10" cy="9" r="0.75" fill="#5F8F7B" fillOpacity="0.1" />
            <path d="M 6 6 L 8 6 M 7 5 L 7 7" stroke="#9DE3BE" strokeWidth="0.3" strokeOpacity="0.08" />
          </pattern>

          {/* Temporal Transition Scanwave */}
          <linearGradient id="temporal-wave" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8FE3BD" stopOpacity="0" />
            <stop offset="50%" stopColor="#8FE3BD" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#8FE3BD" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── LIVING AMBIENCE (Goal 1 & Wow 1: India breathing with intelligence signals) ── */}
        {/* Slow atmospheric breathing glow */}
        <motion.ellipse
          cx={275}
          cy={305}
          rx={230}
          ry={260}
          fill="url(#subcontinent-aura)"
          animate={{
            opacity: [0.15, 0.28, 0.15],
            scale: [0.97, 1.04, 0.97],
          }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          pointerEvents="none"
        />

        {/* Subtle satellite sweep travelling across India */}
        <motion.g
          animate={{ x: [-240, VW + 140] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: "linear" }}
          pointerEvents="none"
        >
          <line
            x1="0"
            y1="0"
            x2={VW * 0.75}
            y2={VH}
            stroke="url(#sat-beam)"
            strokeWidth="70"
            strokeOpacity="0.65"
          />
        </motion.g>

        {/*
         * UNIFIED SPATIAL ROOT
         * Goal 2: 1200ms cinematic camera travel with smooth acceleration then deceleration.
         * Think Google Earth. Zero drift.
         */}
        <motion.g
          style={{ transformOrigin: "0 0" }}
          animate={{ x: camera.x, y: camera.y, scale: camera.scale }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Low-opacity geographic depth: Continental shelf & coastline bathymetry */}
          {allFeaturesPath && (
            <>
              <path
                d={allFeaturesPath}
                fill="none"
                stroke="#1B3F35"
                strokeWidth="10"
                strokeOpacity="0.12"
                pointerEvents="none"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={allFeaturesPath}
                fill="none"
                stroke="#2B5B49"
                strokeWidth="4"
                strokeOpacity="0.2"
                pointerEvents="none"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}

          {/* ── Layer 0: ALL STATES (base geography, always present) ── */}
          {features.map(f => {
            if (f.stateId === selectedStateId) return null; // drawn separately below
            const metrics = f.stateId ? getStateMetrics(f.stateId, year) : null;
            const hovered = f.stateId === hoveredState;
            // Goal 4: Dim surrounding states when a state or district is selected, but keep visible for context
            const dimmed = Boolean(selectedStateId);

            return (
              <motion.path
                key={f.name}
                d={f.path}
                vectorEffect="non-scaling-stroke"
                fill={metrics ? stateHealthColor(metrics.forestHealthScore) : "#0A1929"}
                className={f.stateId ? "cursor-pointer" : undefined}
                onClick={f.stateId ? e => { e.stopPropagation(); onSelectState(f.stateId!); } : undefined}
                onHoverStart={f.stateId ? () => setHoveredState(f.stateId) : undefined}
                onHoverEnd={f.stateId ? () => setHoveredState(null) : undefined}
                animate={{
                  fillOpacity: dimmed ? 0.08 : hovered ? 0.82 : metrics ? 0.42 : 0.18,
                  stroke: hovered && !dimmed ? "#A8BFC0" : dimmed ? "#0F2030" : "#1E3550",
                  strokeOpacity: dimmed ? 0.05 : hovered ? 0.9 : 0.32,
                  strokeWidth: hovered ? 1.1 : 0.55,
                }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            );
          })}

          {/* Faint forest canopy texture overlaid directly onto the Indian landmass */}
          {allFeaturesPath && (
            <path
              d={allFeaturesPath}
              fill="url(#forest-canopy-texture)"
              pointerEvents="none"
              opacity={isNationalView ? 0.8 : 0.35}
            />
          )}

          {/* ── Layer 1: SELECTED STATE EMERGENCE (State Arrival Physical Polish) ── */}
          {selectedFeature && (
            <g>
              {/* Soft ambient penumbra — diffused floor shadow settling naturally */}
              <motion.path
                d={selectedFeature.path}
                fill="#01060D"
                fillOpacity={0.82}
                stroke="#01060D"
                strokeWidth={13}
                strokeOpacity={0.7}
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 7 }}
                transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Crisp contact umbra — direct physical contact shadow */}
              <motion.path
                d={selectedFeature.path}
                fill="none"
                stroke="#010408"
                strokeWidth={4.5}
                strokeOpacity={0.92}
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 3 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Luminous perimeter aura — resolves smoothly as elevation settles */}
              <motion.path
                d={selectedFeature.path}
                fill="none"
                stroke="#5F8F7B"
                strokeWidth={2.4}
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.72 }}
                transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* The elevated state surface — physically lifts upward by y: -2.2 */}
              <motion.path
                d={selectedFeature.path}
                vectorEffect="non-scaling-stroke"
                fill={selectedFeature.stateId
                  ? stateHealthColor(getStateMetrics(selectedFeature.stateId, year).forestHealthScore)
                  : "#1a3530"}
                stroke="#E2F5EC"
                strokeWidth={1.4}
                initial={{ fillOpacity: 0.4, y: 0, strokeOpacity: 0.3 }}
                animate={{ fillOpacity: 0.94, y: -2.2, strokeOpacity: 0.92 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>
          )}

          {/* ── Layer 1.5: STATE INTELLIGENCE — revealed on state emergence ── */}
          {selectedStateId && !selectedHotspot && selectedFeature && (
            <StateIntelligence
              stateId={selectedStateId}
              year={year}
              hotspotCount={shownHotspots.length}
              centroid={selectedFeature.centroid}
            />
          )}

          {/* ── Layer 2: STATE LABELS ── */}
          {STATE_LABELS.map(({ id, name, geo }) => {
            const [lx, ly] = project(geo);
            const active = selectedStateId === id;
            const dimmed = Boolean(selectedStateId && !active);
            return (
              <text
                key={id}
                x={lx}
                y={ly}
                textAnchor="middle"
                fill={active ? "#E8F0EC" : "#6B8A90"}
                fontSize={active ? "8" : "6.5"}
                fontWeight={active ? "700" : "400"}
                opacity={dimmed ? 0.04 : active ? 0.92 : 0.42}
                pointerEvents="none"
                letterSpacing="0.04em"
              >
                {name}
              </text>
            );
          })}

          {/* ── Layer 3: HOTSPOT SIGNALS (Living intelligence pulses) ── */}
          {shownHotspots.map((h, idx) => {
            const [hx, hy] = project(getHotspotPosition(h));
            const severity = getHotspotSeverity(h, year);
            const color = getSeverityColor(severity);
            const isActive = selectedHotspot?.id === h.id;
            const inState = selectedStateId === h.stateId;

            return (
              <motion.g
                key={h.id}
                className="cursor-pointer"
                onClick={e => { e.stopPropagation(); onSelectHotspot(h.id); }}
                // Hide active hotspot's signal — it's replaced by the constellation center
                opacity={isActive ? 0 : 1}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: isActive ? 0 : 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: inState && !isNationalView ? 0.3 + idx * 0.07 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Living pulse ring — restrained pulse from active districts */}
                <PulseRing
                  cx={hx} cy={hy}
                  severity={severity}
                  color={color}
                  seed={h.id.length}
                  active={inState}
                />
                {/* Core dot */}
                <circle
                  cx={hx} cy={hy}
                  r={3.4}
                  fill={color}
                  stroke="#E8F0EC"
                  strokeOpacity="0.75"
                  strokeWidth="0.7"
                  vectorEffect="non-scaling-stroke"
                />

                {/*
                 * District labels — only visible at STATE zoom, not at national.
                 * Revealed by arriving at a state.
                 */}
                {isStateView && (
                  <g pointerEvents="none">
                    <text
                      x={hx + 5}
                      y={hy - 1}
                      fill="#C9D6D0"
                      fontSize="5"
                      fontWeight="600"
                    >
                      {h.districtName}
                    </text>
                    <text
                      x={hx + 5}
                      y={hy + 5}
                      fill={color}
                      fontSize="4"
                      fontWeight="500"
                      letterSpacing="0.06em"
                    >
                      {severity === "Red" ? "Critical" : severity === "Amber" ? "Watch" : "Stable"}
                    </text>
                  </g>
                )}
              </motion.g>
            );
          })}

          {/* ── Layer 4: DISTRICT INVESTIGATION SCENE (Hero Evidence Constellation) ── */}
          <AnimatePresence>
            {selectedHotspot && (
              <DistrictScene
                key={selectedHotspot.id + year}
                hotspot={selectedHotspot}
                year={year}
                onDismiss={onCloseDistrict}
              />
            )}
          </AnimatePresence>

          {/* ── TEMPORARY DEBUG MARKER 1: Hotspot Coordinate Target ── */}
          {selectedHotspot && (() => {
            const [hx, hy] = project(getHotspotPosition(selectedHotspot));
            return (
              <g pointerEvents="none">
                <circle cx={hx} cy={hy} r={7} fill="none" stroke="#FF3366" strokeWidth={1.2} strokeDasharray="2.5 1.5" />
                <circle cx={hx} cy={hy} r={1.5} fill="#FF3366" />
                <text x={hx + 8} y={hy - 6} fill="#FF3366" fontSize="4.2" fontWeight="bold">
                  HOTSPOT [{hx.toFixed(1)}, {hy.toFixed(1)}]
                </text>
              </g>
            );
          })()}

          {/* ── Temporal Transition Scanwave Overlay (Wow 4) ── */}
          {temporalFlash && (
            <motion.rect
              x="0"
              width={VW}
              height="35"
              fill="url(#temporal-wave)"
              initial={{ y: -35, opacity: 0.9 }}
              animate={{ y: VH + 35, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              pointerEvents="none"
            />
          )}

        </motion.g>

        {/* ── TEMPORARY DEBUG MARKER 2: Fixed Camera Viewport Center Target ── */}
        {isDistrictView && (
          <g pointerEvents="none" opacity={0.85}>
            <circle cx={VW / 2} cy={VH / 2} r={11} fill="none" stroke="#00FFAA" strokeWidth={1} strokeDasharray="3 2" />
            <circle cx={VW / 2} cy={VH / 2} r={1.5} fill="#00FFAA" />
            <line x1={VW / 2 - 14} y1={VH / 2} x2={VW / 2 + 14} y2={VH / 2} stroke="#00FFAA" strokeWidth={0.8} />
            <line x1={VW / 2} y1={VH / 2 - 14} x2={VW / 2} y2={VH / 2 + 14} stroke="#00FFAA" strokeWidth={0.8} />
            <text x={VW / 2 + 14} y={VH / 2 + 10} fill="#00FFAA" fontSize="4.2" fontWeight="bold">
              CENTER [{VW / 2}, {VH / 2}]
            </text>
          </g>
        )}
      </svg>

      {/* ── MINIMAL HUD OVERLAY ── */}
      {/* Navigation context — top left, always visible */}
      <div className="pointer-events-none absolute left-5 top-5 z-20 sm:left-7">
        <motion.div
          animate={{ opacity: 1 }}
          className="pointer-events-auto space-y-1"
        >
          {isNationalView && (
            <div className="flex items-center gap-2">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#2E4A5A]">
                India · {year}
              </p>
              {temporalFlash && (
                <span className="text-[8px] font-mono tracking-widest text-[#8FE3BD] animate-pulse">
                  // TEMPORAL SHIFT
                </span>
              )}
            </div>
          )}
          {isStateView && (
            <>
              <div className="flex items-center gap-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#3A5E50]">
                  {getStateProfile(selectedStateId!).name} · {year}
                </p>
                {temporalFlash && (
                  <span className="text-[8px] font-mono tracking-widest text-[#8FE3BD] animate-pulse">
                    // TEMPORAL SHIFT
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onClearSelection(); }}
                className="block text-[9px] font-medium text-[#4A7A6A] transition-opacity hover:opacity-70"
              >
                ← India
              </button>
            </>
          )}
          {isDistrictView && (
            <>
              <div className="flex items-center gap-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#3A5E50]">
                  {getStateProfile(selectedHotspot!.stateId).name} · {year}
                </p>
                {temporalFlash && (
                  <span className="text-[8px] font-mono tracking-widest text-[#8FE3BD] animate-pulse">
                    // TEMPORAL SHIFT
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onCloseDistrict(); }}
                className="block text-[9px] font-medium text-[#4A7A6A] transition-opacity hover:opacity-70"
              >
                ← {getStateProfile(selectedHotspot!.stateId).name}
              </button>
            </>
          )}
        </motion.div>
      </div>

      {/* Hover label — national view only */}
      <AnimatePresence>
        {hoveredState && isNationalView && (
          <motion.div
            className="pointer-events-none absolute bottom-6 left-5 z-20 text-[10px] font-semibold text-[#7EA38F] sm:left-7"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
          >
            {getStateProfile(hoveredState).name}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── PulseRing ──────────────────────────────────────────────────────────────────
// Animates SVG radius r only — cx/cy are fixed geographic coordinates.
// Zero drift guaranteed across all camera scales.
// Enhanced: Restrained pulse from active districts (Goal 1 & Wow 1).

function PulseRing({
  cx, cy, severity, color, seed, active,
}: {
  cx: number; cy: number;
  severity: "Green" | "Amber" | "Red";
  color: string; seed: number; active: boolean;
}) {
  const maxR = severity === "Red" ? 13 : severity === "Amber" ? 9 : 6;
  const dur = severity === "Red" ? 1.7 : severity === "Amber" ? 2.5 : 3.8;
  const initialOpacity = severity === "Red" ? 0.75 : severity === "Amber" ? 0.55 : 0.35;

  return (
    <motion.circle
      cx={cx} cy={cy}
      r={3}
      fill="none"
      stroke={color}
      strokeWidth="0.6"
      vectorEffect="non-scaling-stroke"
      animate={{ r: [3, maxR], opacity: [initialOpacity, 0] }}
      transition={{
        duration: dur,
        repeat: Infinity,
        ease: "easeOut",
        delay: (seed % 7) * 0.35,
      }}
    />
  );
}

// ─── DistrictScene ──────────────────────────────────────────────────────────────
//
// Goal 3 & Wow 3: District investigation is the hero.
// DO NOT open a card. DO NOT open a popup. DO NOT open a modal.
// The camera descends. The district becomes the center.
// The evidence constellation builds itself in a strict sequence:
// 1. beacon appears (t=0s)
// 2. leader lines draw (t=0.35s, 0.75s, 1.15s)
// 3. satellite node arrives (t=0.65s)
// 4. claims node arrives (t=1.05s)
// 5. field node arrives (t=1.45s)
// 6. action recommendation appears (t=1.75s)

function DistrictScene({
  hotspot, year, onDismiss,
}: {
  hotspot: Hotspot; year: Year; onDismiss: () => void;
}) {
  const [hx, hy] = project(getHotspotPosition(hotspot));
  const severity = getHotspotSeverity(hotspot, year);
  const color = getSeverityColor(severity);
  const evidence = getEvidenceItems(hotspot, year);
  const metrics = getStateMetrics(hotspot.stateId, year);
  const impact = getHotspotImpact(hotspot, year);

  // Sequenced node arrivals
  const nodes = [
    {
      dx: -56, dy: -50,
      lineDelay: 0.35,
      nodeDelay: 0.65,
      label: "SATELLITE OBSERVATION",
      detail: evidence[0]?.detail ?? "",
      proof: impact,
    },
    {
      dx: +60, dy: -18,
      lineDelay: 0.75,
      nodeDelay: 1.05,
      label: "CLAIM RECORDS",
      detail: evidence[1]?.detail ?? "",
      proof: `${metrics.pendingClaims.toLocaleString()} pending claims`,
    },
    {
      dx: +10, dy: +60,
      lineDelay: 1.15,
      nodeDelay: 1.45,
      label: "FIELD NOTE",
      detail: evidence[2]?.detail ?? "",
      proof: `Trend: ${metrics.trend}`,
    },
  ];

  const severityWord = { Red: "Critical", Amber: "Watch", Green: "Stable" }[severity];

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={e => e.stopPropagation()}
    >
      {/* ── Sequence Step 1: Central Beacon Appears (t=0s) ── */}
      <motion.circle
        cx={hx} cy={hy} r={3}
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        animate={{ r: [3, 12], opacity: [0.8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
      <circle cx={hx} cy={hy} r={4.5} fill={color} />
      <circle cx={hx} cy={hy} r={4.5} fill="none" stroke="#E8F0EC" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />

      {/* District header appears immediately following beacon */}
      <motion.g
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        <text
          x={hx} y={hy - 16}
          textAnchor="middle"
          fill="#E8F0EC"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="-0.02em"
        >
          {hotspot.districtName}
        </text>
        <text
          x={hx} y={hy - 8}
          textAnchor="middle"
          fill={color}
          fontSize="4.8"
          fontWeight="600"
          letterSpacing="0.1em"
        >
          {severityWord.toUpperCase()} · {hotspot.issueType.toUpperCase()}
        </text>
        <text
          x={hx} y={hy + 13}
          textAnchor="middle"
          fill="#3A5A70"
          fontSize="4.5"
        >
          Forest {metrics.forestHealthScore}/100 · Anomaly {metrics.anomalyScore}/100 · {impact}
        </text>
      </motion.g>

      {/* ── Sequence Steps 2–5: Leader Lines Draw and Evidence Nodes Arrive ── */}
      {nodes.map(({ dx, dy, lineDelay, nodeDelay, label, detail, proof }) => {
        const nx = hx + dx;
        const ny = hy + dy;
        const lineEndX = hx + dx * 0.85;
        const lineEndY = hy + dy * 0.85;
        const anchor = dx < 0 ? "end" : dx > 30 ? "start" : "middle";
        const labelX = dx < 0 ? nx - 7 : dx > 30 ? nx + 7 : nx;

        return (
          <g key={label}>
            {/* Step 2: Leader line draws */}
            <motion.path
              d={`M ${hx} ${hy} L ${lineEndX} ${lineEndY}`}
              stroke={color}
              strokeOpacity="0.35"
              strokeWidth="0.6"
              strokeDasharray="2.5 2.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, delay: lineDelay, ease: "easeOut" }}
            />

            {/* Steps 3–5: Node arrives */}
            <motion.g
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: nodeDelay, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Outer halo */}
              <circle
                cx={nx} cy={ny}
                r={5.5}
                fill={color}
                fillOpacity="0.12"
                stroke={color}
                strokeOpacity="0.5"
                strokeWidth="0.6"
                vectorEffect="non-scaling-stroke"
              />
              {/* Core node dot */}
              <circle cx={nx} cy={ny} r={1.6} fill={color} fillOpacity="0.9" />

              {/* Category label */}
              <text
                x={labelX}
                y={ny - 10}
                textAnchor={anchor}
                fill="#7EA38F"
                fontSize="4.2"
                fontWeight="700"
                letterSpacing="0.12em"
              >
                {label}
              </text>
              {/* Evidence detail */}
              <text
                x={labelX}
                y={ny - 3}
                textAnchor={anchor}
                fill="#4E6878"
                fontSize="4"
              >
                {detail}
              </text>
              {/* Proof line */}
              <text
                x={labelX}
                y={ny + 5}
                textAnchor={anchor}
                fill={color}
                fontSize="4.6"
                fontWeight="600"
              >
                {proof}
              </text>
            </motion.g>
          </g>
        );
      })}

      {/* ── Sequence Step 6: Action Recommendation Box Appears (t=1.75s) ── */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 1.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <rect
          x={hx - 74}
          y={hy + 74}
          width={148}
          height={18}
          rx={3}
          fill={color}
          fillOpacity="0.09"
          stroke={color}
          strokeOpacity="0.32"
          strokeWidth="0.6"
        />
        <text
          x={hx - 68}
          y={hy + 80}
          fill="#4A7568"
          fontSize="3.6"
          fontWeight="700"
          letterSpacing="0.16em"
        >
          ACTION // INTERVENTION PROTOCOL
        </text>
        <text
          x={hx - 68}
          y={hy + 88}
          fill="#9DE3BE"
          fontSize="4.2"
          fontWeight="500"
        >
          {hotspot.recommendedAction.length > 62
            ? hotspot.recommendedAction.slice(0, 62) + "…"
            : hotspot.recommendedAction}
        </text>
      </motion.g>

      {/* Dismiss target */}
      <g
        className="cursor-pointer"
        onClick={e => { e.stopPropagation(); onDismiss(); }}
      >
        <circle
          cx={hx + 74}
          cy={hy - 60}
          r="6.5"
          fill="#0A1929"
          fillOpacity="0.9"
          stroke="#2E4A5A"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        />
        <text
          x={hx + 74}
          y={hy - 57}
          textAnchor="middle"
          fill="#4A6A7A"
          fontSize="8"
          fontWeight="bold"
        >
          ×
        </text>
      </g>
    </motion.g>
  );
}

// ─── StateIntelligence ──────────────────────────────────────────────────────────
//
// Revealed ONLY after state arrival — none of this data is visible at national zoom.
// Anchored to the geographic centroid of the selected state.
// Designed for scale 1.6–2.4: fontSize=5–6 → 8–14px on screen.
//
// Layers of discovery:
//   1. State name (already in labels) → user arrived here intentionally
//   2. Forest health score → how is this state doing?
//   3. Anomaly score + trend → is it getting worse?
//   4. Pending / approved claims → the human weight of this data
//   5. Hotspot count → how many investigations await?

function StateIntelligence({
  stateId,
  year,
  hotspotCount,
  centroid,
}: {
  stateId: StateId;
  year: Year;
  hotspotCount: number;
  centroid: Pos;
}) {
  const metrics = getStateMetrics(stateId, year);
  const [cx, cy] = centroid;

  const trendColor = metrics.trend === "Critical"
    ? "#A85A52"
    : metrics.trend === "Improving"
    ? "#5F8F7B"
    : "#B78743";

  // Positioned below the centroid, below the state label text
  const oy = cy + 28; // y offset from centroid

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      pointerEvents="none"
    >
      {/* Separator line */}
      <line
        x1={cx - 44} y1={oy - 2}
        x2={cx + 44} y2={oy - 2}
        stroke="#1A3040"
        strokeWidth="0.5"
      />

      {/* Forest health — the most immediate signal */}
      <text
        x={cx} y={oy + 7}
        textAnchor="middle"
        fill={trendColor}
        fontSize="5.5"
        fontWeight="700"
      >
        {metrics.forestHealthScore} / 100
      </text>
      <text
        x={cx} y={oy + 14}
        textAnchor="middle"
        fill="#2E4A5A"
        fontSize="4"
        letterSpacing="0.1em"
        fontWeight="600"
      >
        FOREST HEALTH · {metrics.trend.toUpperCase()}
      </text>

      {/* Claims data — the human weight */}
      <text
        x={cx} y={oy + 23}
        textAnchor="middle"
        fill="#243848"
        fontSize="4"
      >
        {metrics.pendingClaims.toLocaleString()} pending · {metrics.approvedClaims.toLocaleString()} approved
      </text>

      {/* Anomaly + investigation count */}
      <text
        x={cx} y={oy + 31}
        textAnchor="middle"
        fill="#1E3040"
        fontSize="3.8"
      >
        Anomaly {metrics.anomalyScore}/100 · {hotspotCount} district{hotspotCount !== 1 ? "s" : ""} monitored
      </text>

      {/* Bottom separator */}
      <line
        x1={cx - 44} y1={oy + 35}
        x2={cx + 44} y2={oy + 35}
        stroke="#1A3040"
        strokeWidth="0.5"
      />
    </motion.g>
  );
}
