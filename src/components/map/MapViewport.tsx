"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
import { getEvidenceItems, getHotspotImpact, getHotspotPosition, getHotspotSeverity, getSeverityColor, getStateMetrics, hotspots, stateProfiles } from "../../data/forest-rights";
import type { Hotspot, StateId, StateMetrics, Year } from "../../types/forest-rights";
import { SpatialBackdrop } from "./SpatialBackdrop";

type Position = [number, number];

interface GeoFeature {
  properties: { NAME_1: string };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: Position[][] | Position[][][] };
}

interface GeoCollection {
  features: GeoFeature[];
}

interface MapViewportProps {
  year: Year;
  selectedStateId: StateId | null;
  selectedHotspotId: string | null;
  onSelectState: (stateId: StateId) => void;
  onSelectHotspot: (hotspotId: string) => void;
  onClearSelection: () => void;
}

const mapProfiles: Record<string, StateId> = {
  Rajasthan: "rajasthan",
  "Madhya Pradesh": "madhya-pradesh",
  Maharashtra: "maharashtra",
  Karnataka: "karnataka",
  Chhattisgarh: "chhattisgarh",
  Orissa: "odisha",
  Jharkhand: "jharkhand",
  Assam: "assam",
};

const mapLabels: Array<{ id: StateId; position: Position }> = [
  { id: "rajasthan", position: [73.8, 27] },
  { id: "madhya-pradesh", position: [78.4, 23.7] },
  { id: "maharashtra", position: [76.6, 19.4] },
  { id: "karnataka", position: [75.6, 15] },
  { id: "chhattisgarh", position: [81.8, 21.2] },
  { id: "odisha", position: [85.4, 20.5] },
  { id: "jharkhand", position: [85.5, 23.6] },
  { id: "assam", position: [92.8, 26.2] },
];

const bounds = { minLongitude: 67.5, maxLongitude: 98, minLatitude: 6, maxLatitude: 37.5 };
const viewBox = { width: 560, height: 620 };

export function MapViewport({
  year,
  selectedStateId,
  selectedHotspotId,
  onSelectState,
  onSelectHotspot,
  onClearSelection,
}: MapViewportProps) {
  const [features, setFeatures] = useState<GeoFeature[]>([]);
  const [hoveredStateId, setHoveredStateId] = useState<StateId | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let active = true;
    fetch("/india-states-simplified.geojson")
      .then((response) => response.json())
      .then((data: GeoCollection) => {
        if (active) setFeatures(data.features.filter((feature) => feature.properties.NAME_1 !== "Andaman and Nicobar" && feature.properties.NAME_1 !== "Lakshadweep"));
      })
      .catch(() => active && setFeatures([]));

    return () => {
      active = false;
    };
  }, []);

  const selectedHotspot = hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? null;
  const focus = mapFocus(selectedStateId, selectedHotspot, year);
  const selectedMetrics = selectedStateId ? getStateMetrics(selectedStateId, year) : null;

  function handleMapMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setParallax({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 7,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 5,
    });
  }

  return (
    <section aria-labelledby="map-heading" className="relative h-full min-h-[32rem] overflow-hidden bg-[#09111d]" onClick={onClearSelection} onMouseMove={handleMapMove} onMouseLeave={() => setParallax({ x: 0, y: 0 })}>
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#101925_0%,#09111d_58%,#080e17_100%)]" />
      <SpatialBackdrop />
      <div aria-hidden="true" className="absolute inset-[10%] rounded-[48%] border border-[#5F8F7B]/10 bg-[radial-gradient(ellipse_at_center,rgba(95,143,123,0.12),transparent_64%)] blur-2xl" />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(148,163,184,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.55)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="absolute left-5 top-7 z-20 sm:left-8 sm:top-8 lg:left-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7EA38F]">India · {year}</p>
        <h1 id="map-heading" className="mt-2 text-lg font-semibold tracking-[-0.04em] text-[#D6E1DC] sm:text-xl">Forest rights atlas</h1>
      </div>

      <motion.div className="absolute bottom-5 left-1/2 top-14 z-10 w-[min(78vw,44rem)] -translate-x-1/2 sm:bottom-6 sm:top-8" animate={{ x: parallax.x, y: parallax.y }} transition={{ type: "spring", stiffness: 95, damping: 22 }}>
        {features.length === 0 ? (
          <div className="grid h-full place-items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">India archive</div>
        ) : (
          <svg viewBox={"0 0 " + viewBox.width + " " + viewBox.height} className="h-full w-full drop-shadow-[0_28px_34px_rgba(0,0,0,0.38)]" role="img" aria-label="India map with state boundaries and district signals">
            <motion.g fillRule="evenodd" style={{ transformOrigin: "0 0" }} animate={{ x: focus.x, y: focus.y, scale: focus.scale }} transition={{ type: "spring", stiffness: 115, damping: 23 }}>
              {features.map((feature) => {
                const stateId = mapProfiles[feature.properties.NAME_1];
                const metrics = stateId ? getStateMetrics(stateId, year) : null;
                const active = stateId === selectedStateId;
                const muted = Boolean(selectedStateId && stateId !== selectedStateId);
                const hovered = stateId === hoveredStateId;

                return (
                  <motion.path
                    key={feature.properties.NAME_1}
                    d={geometryPath(feature.geometry)}
                    fill={metrics ? stateColor(metrics.forestHealthScore) : "#182432"}
                    stroke={active || hovered ? "#dce8e1" : "#64748b"}
                    className={stateId ? "cursor-pointer" : undefined}
                    onClick={stateId ? (event) => { event.stopPropagation(); onSelectState(stateId); } : undefined}
                    onHoverStart={stateId ? () => setHoveredStateId(stateId) : undefined}
                    onHoverEnd={stateId ? () => setHoveredStateId(null) : undefined}
                    animate={{
                      fillOpacity: active ? 0.9 : muted ? 0.16 : hovered ? 0.68 : metrics ? 0.5 : 0.66,
                      strokeOpacity: active ? 0.94 : muted ? 0.2 : hovered ? 0.8 : 0.42,
                      strokeWidth: active ? 1.45 : 0.65,
                      y: active ? -3 : 0,
                    }}
                    transition={{ duration: 0.48, ease: "easeOut" }}
                  />
                );
              })}

              {mapLabels.map((label) => {
                const point = project(label.position);
                const active = selectedStateId === label.id;
                const muted = Boolean(selectedStateId && !active);
                return <motion.text key={label.id} x={point[0]} y={point[1]} textAnchor="middle" fill="#dce8e1" fontSize="8" fontWeight="600" pointerEvents="none" animate={{ opacity: active ? 0.94 : muted ? 0.12 : 0.48 }}>{stateProfiles[label.id].name}</motion.text>;
              })}

              {hotspots.map((hotspot) => {
                const point = project(getHotspotPosition(hotspot, year));
                const severity = getHotspotSeverity(hotspot, year);
                const color = getSeverityColor(severity);
                const visible = !selectedStateId || hotspot.stateId === selectedStateId;
                const active = selectedHotspot?.id === hotspot.id;

                return (
                  <motion.g key={hotspot.id} className={visible ? "cursor-pointer" : "pointer-events-none"} onClick={visible ? (event) => { event.stopPropagation(); onSelectHotspot(hotspot.id); } : undefined} whileHover={visible ? { scale: 1.16 } : undefined} animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }} transition={{ duration: 0.34 }}>
                    {visible && <motion.circle cx={point[0]} cy={point[1]} r="4" fill="none" stroke={color} strokeWidth="0.7" initial={{ opacity: 0.3, scale: 0.7 }} animate={{ opacity: [0.3, 0], scale: [0.7, 2] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: (hotspot.id.length % 5) * 0.22 }} />}
                    {active && <motion.circle cx={point[0]} cy={point[1]} r="12" fill="none" stroke={color} strokeWidth="1" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 0.76, scale: 1 }} />}
                    <motion.circle cx={point[0]} cy={point[1]} r={active ? 5.8 : 4} fill={color} stroke="#dce8e1" strokeOpacity={active ? 0.92 : 0.55} strokeWidth={active ? 1.35 : 0.8} animate={{ r: active ? 5.8 : 4, y: active ? -2 : 0 }} transition={{ duration: 0.32 }} />
                  </motion.g>
                );
              })}

              {selectedStateId && selectedMetrics && <StatePortal stateId={selectedStateId} metrics={selectedMetrics} />}
              {selectedHotspot && <DistrictScene hotspot={selectedHotspot} year={year} onDismiss={onClearSelection} />}
            </motion.g>
          </svg>
        )}
      </motion.div>

      <AnimatePresence>
        {hoveredStateId && !selectedStateId && (
          <motion.div className="absolute bottom-7 left-5 z-20 rounded-full border border-white/[0.1] bg-[#111b28]/75 px-4 py-2 text-[10px] font-medium text-[#C9D6D0] shadow-[0_12px_26px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:left-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            {stateProfiles[hoveredStateId].name}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StatePortal({ stateId, metrics }: { stateId: StateId; metrics: StateMetrics }) {
  const anchor = project(mapLabels.find((label) => label.id === stateId)?.position ?? [82.8, 22.5]);
  const card = { x: Math.min(Math.max(anchor[0] + 26, 14), viewBox.width - 180), y: Math.min(Math.max(anchor[1] - 130, 14), viewBox.height - 136) };
  const districts = hotspots.filter((hotspot) => hotspot.stateId === stateId).length;
  const trendColor = metrics.trend === "Improving" ? "#7EA38F" : metrics.trend === "Stable" ? "#B78743" : "#A85A52";

  return (
    <motion.g initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 22 }}>
      <motion.path d={"M " + anchor[0] + " " + anchor[1] + " L " + (card.x + 12) + " " + (card.y + 118)} stroke="#94A3B8" strokeOpacity="0.55" strokeWidth="0.8" strokeDasharray="2 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45 }} />
      <foreignObject x={card.x} y={card.y} width="168" height="132" pointerEvents="all">
        <div className="h-full rounded-xl border border-white/[0.14] bg-[#111b28]/88 px-3.5 py-3 text-left shadow-[0_16px_38px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[6px] font-semibold uppercase tracking-[0.14em] text-[#7EA38F]">State portal</p>
              <p className="mt-1 text-[11px] font-semibold leading-none text-[#E2E8F0]">{stateProfiles[stateId].name}</p>
            </div>
            <span className="mt-0.5 size-1.5 rounded-full" style={{ backgroundColor: trendColor }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/[0.08] pt-2.5">
            <PortalMetric label="Forest" value={metrics.forestHealthScore + " / 100"} />
            <PortalMetric label="Claims" value={(metrics.approvedClaims + metrics.pendingClaims).toLocaleString("en-IN")} />
            <PortalMetric label="Districts" value={String(districts).padStart(2, "0")} />
            <PortalMetric label="Anomaly" value={metrics.anomalyScore + " / 100"} />
          </div>
          <p className="mt-2 text-[7px] font-semibold uppercase tracking-[0.12em]" style={{ color: trendColor }}>{metrics.trend} trend</p>
        </div>
      </foreignObject>
    </motion.g>
  );
}

function DistrictScene({ hotspot, year, onDismiss }: { hotspot: Hotspot; year: Year; onDismiss: () => void }) {
  const anchor = project(getHotspotPosition(hotspot, year));
  const severity = getHotspotSeverity(hotspot, year);
  const color = getSeverityColor(severity);
  const card = { x: Math.min(Math.max(anchor[0] + 28, 12), viewBox.width - 204), y: Math.min(Math.max(anchor[1] - 174, 10), viewBox.height - 180) };
  const evidence = getEvidenceItems(hotspot, year);

  return (
    <motion.g initial={{ opacity: 0, y: 14, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 22 }}>
      <motion.path d={"M " + anchor[0] + " " + anchor[1] + " L " + (card.x + 14) + " " + (card.y + 156)} stroke={color} strokeOpacity="0.8" strokeWidth="1" strokeDasharray="3 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45 }} />
      <foreignObject x={card.x} y={card.y} width="196" height="176" pointerEvents="all">
        <motion.div drag dragMomentum={false} onPointerDown={(event) => event.stopPropagation()} className="h-full cursor-grab rounded-2xl border border-white/[0.16] bg-[#111b28]/92 px-4 py-3 text-left shadow-[0_22px_50px_rgba(0,0,0,0.42)] backdrop-blur-2xl active:cursor-grabbing">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#7EA38F]">District scene · {year}</p>
              <p className="mt-1 text-sm font-semibold tracking-[-0.03em] text-[#E2E8F0]">{hotspot.districtName}</p>
            </div>
            <button type="button" onClick={(event) => { event.stopPropagation(); onDismiss(); }} className="grid size-5 place-items-center rounded-full border border-white/[0.1] text-[10px] text-[#94A3B8] transition-colors hover:bg-white/[0.08] hover:text-[#E2E8F0]" aria-label="Dismiss district scene">×</button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-y border-white/[0.08] py-2.5">
            <PortalMetric label="Forest status" value={severity} color={color} />
            <PortalMetric label="Verification" value={severity === "Red" ? "Required" : "In review"} />
            <PortalMetric label="Satellite change" value={getHotspotImpact(hotspot, year)} />
            <PortalMetric label="Evidence" value={String(evidence.length).padStart(2, "0") + " records"} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-[7px]">
            <span className="leading-3 text-[#94A3B8]">{evidence[0].detail}</span>
            <span className="shrink-0 font-semibold uppercase tracking-[0.09em] text-[#7EA38F]">Report ready</span>
          </div>
        </motion.div>
      </foreignObject>
    </motion.g>
  );
}

function PortalMetric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-[6px] uppercase tracking-[0.08em] text-[#64748B]">{label}</p>
      <p className="mt-0.5 text-[8px] font-semibold leading-none text-[#E2E8F0]" style={color ? { color } : undefined}>{value}</p>
    </div>
  );
}

function project([longitude, latitude]: Position): Position {
  return [
    ((longitude - bounds.minLongitude) / (bounds.maxLongitude - bounds.minLongitude)) * viewBox.width,
    ((bounds.maxLatitude - latitude) / (bounds.maxLatitude - bounds.minLatitude)) * viewBox.height,
  ];
}

function geometryPath(geometry: GeoFeature["geometry"]) {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates as Position[][]] : geometry.coordinates as Position[][][];
  return polygons.map((polygon) => polygon.map((ring) => ring.map((point, index) => {
    const projected = project(point);
    return (index === 0 ? "M " : "L ") + projected[0].toFixed(2) + " " + projected[1].toFixed(2);
  }).join(" ") + " Z").join(" ")).join(" ");
}

function stateColor(score: number) {
  if (score >= 72) return "#276860";
  if (score >= 65) return "#8a6827";
  return "#8a4038";
}

function mapFocus(selectedStateId: StateId | null, selectedHotspot: Hotspot | null, year: Year) {
  const point = selectedHotspot
    ? project(getHotspotPosition(selectedHotspot, year))
    : selectedStateId
      ? project(mapLabels.find((label) => label.id === selectedStateId)?.position ?? [82.8, 22.5])
      : null;
  const scale = selectedHotspot ? 1.42 : selectedStateId ? 1.18 : 1;

  if (!point) return { scale, x: 0, y: 0 };
  return { scale, x: (viewBox.width / 2 - point[0]) * (scale - 1), y: (viewBox.height / 2 - point[1]) * (scale - 1) };
}
