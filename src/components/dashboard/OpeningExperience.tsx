"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface OpeningExperienceProps {
  onEnter: () => void;
}

type Position = [number, number];

interface GeoFeature {
  properties: { NAME_1: string };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: Position[][] | Position[][][] };
}

interface GeoCollection {
  features: GeoFeature[];
}

const bounds = { minLongitude: 67.5, maxLongitude: 98, minLatitude: 6, maxLatitude: 37.5 };
const viewBox = { width: 560, height: 620 };

export function OpeningExperience({ onEnter }: OpeningExperienceProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (phase >= 4) return;
    const timeout = window.setTimeout(() => setPhase((value) => value + 1), 980);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  return (
    <motion.main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#070B14] px-6 text-center" exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(95,143,123,0.1),transparent_46%)]" />
      <ForestIris phase={phase} />
      <IndiaEmergence phase={phase} />
      {phase < 4 && (
        <button type="button" onClick={() => setPhase(4)} className="absolute right-6 top-6 z-20 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B] transition-colors hover:text-[#E2E8F0]">
          Skip
        </button>
      )}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div className="relative z-10 max-w-xl" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7EA38F]">Aaranya Sentinel</p>
            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.055em] text-[#DCE8E1] sm:text-5xl">Monitoring Forest Rights<br />Across India</h1>
            <p className="mt-5 text-xs font-medium tracking-[0.18em] text-[#64748B]">2016 — 2026</p>
            {phase === 4 && (
              <motion.button type="button" onClick={onEnter} className="mt-10 rounded-full border border-[#7EA38F]/70 bg-[#5F8F7B] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F1F5F3] shadow-[0_14px_36px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#769f8c]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                Enter the atlas
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

function ForestIris({ phase }: { phase: number }) {
  return (
    <motion.div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 grid size-[min(74vw,38rem)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full" initial={{ opacity: 0 }} animate={{ opacity: phase < 3 ? 1 : 0.2, scale: phase === 0 ? 0.06 : phase === 1 ? 0.82 : 1.2 }} transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>
      <div className="absolute inset-0 rounded-full border border-[#7EA38F]/25 bg-[repeating-radial-gradient(circle_at_center,rgba(126,163,143,0.16)_0_1px,transparent_1px_13px)]" />
      <div className="absolute inset-[15%] rounded-full border border-[#94A3B8]/15" />
      <div className="absolute inset-[30%] rounded-full border border-[#5F8F7B]/25 bg-[#5F8F7B]/5" />
      <motion.span className="size-3 rounded-full bg-[#d8e5dd] shadow-[0_0_30px_rgba(126,163,143,0.65)]" animate={{ scale: phase === 0 ? [0.65, 1.35, 0.65] : 0.75, opacity: phase < 2 ? 1 : 0 }} transition={{ duration: 1.5, repeat: phase === 0 ? Infinity : 0 }} />
    </motion.div>
  );
}

function IndiaEmergence({ phase }: { phase: number }) {
  const [features, setFeatures] = useState<GeoFeature[]>([]);

  useEffect(() => {
    fetch("/india-states-simplified.geojson")
      .then((response) => response.json())
      .then((data: GeoCollection) => setFeatures(data.features.filter((feature) => feature.properties.NAME_1 !== "Andaman and Nicobar" && feature.properties.NAME_1 !== "Lakshadweep")))
      .catch(() => setFeatures([]));
  }, []);

  return (
    <motion.div aria-hidden="true" className="pointer-events-none absolute bottom-[-22%] left-1/2 w-[min(70vw,37rem)] -translate-x-1/2" animate={{ opacity: phase >= 2 ? 0.34 : 0, y: phase >= 2 ? 0 : 42, scale: phase >= 2 ? 1 : 0.94 }} transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}>
      <svg viewBox={"0 0 " + viewBox.width + " " + viewBox.height} className="h-auto w-full">
        {features.map((feature, index) => (
          <motion.path key={feature.properties.NAME_1} d={geometryPath(feature.geometry)} fill="#17352f" stroke="#C9D6D0" strokeOpacity={phase >= 3 ? 0.48 : 0.3} strokeWidth="0.6" initial={{ pathLength: 0 }} animate={{ pathLength: phase >= 2 ? 1 : 0 }} transition={{ duration: 0.7, delay: Math.min(index * 0.015, 0.42) }} />
        ))}
        {phase >= 3 && (
          <g fill="none" stroke="#7EA38F" strokeOpacity="0.38" strokeWidth="0.7" strokeDasharray="3 4">
            <motion.path d="M 118 250 C 220 185, 315 245, 420 176" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.15, ease: "easeOut" }} />
            <motion.path d="M 168 355 C 270 292, 345 360, 448 300" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.15, delay: 0.18, ease: "easeOut" }} />
          </g>
        )}
      </svg>
    </motion.div>
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
