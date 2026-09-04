"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { type PointerEvent, useState } from "react";
import { getSeverityColor, getStateMetrics, hotspots, stateProfiles } from "../../data/forest-rights";
import type { StateId, Year } from "../../types/forest-rights";
import { SpatialBackdrop } from "./SpatialBackdrop";

const INDIA_PATH =
  "M202 68 L229 50 L246 66 L265 56 L284 78 L305 77 L321 102 L344 113 L349 137 L372 153 L387 184 L408 194 L416 217 L402 239 L378 246 L366 269 L373 293 L355 309 L346 335 L333 359 L341 383 L323 407 L311 438 L299 465 L287 495 L275 526 L262 566 L247 600 L232 577 L225 544 L208 518 L196 487 L181 460 L169 428 L156 402 L144 368 L130 343 L114 317 L111 285 L97 260 L105 233 L99 205 L114 181 L126 154 L145 135 L158 106 L177 91 Z";

const stateShapes: Array<{ id: StateId; path: string }> = [
  { id: "rajasthan", path: "M117 128 L210 95 L224 208 L201 254 L108 267 L105 225 Z" },
  { id: "madhya-pradesh", path: "M193 221 L301 206 L316 300 L285 345 L183 333 L157 287 Z" },
  { id: "maharashtra", path: "M157 332 L286 341 L302 398 L259 432 L173 422 L140 379 Z" },
  { id: "karnataka", path: "M174 419 L262 428 L271 500 L238 548 L202 504 L175 467 Z" },
  { id: "chhattisgarh", path: "M301 207 L364 199 L361 290 L326 335 L285 302 Z" },
  { id: "odisha", path: "M324 329 L378 285 L364 368 L325 408 L297 392 Z" },
  { id: "jharkhand", path: "M329 246 L378 236 L379 289 L342 317 L315 292 Z" },
  { id: "assam", path: "M386 153 L422 150 L446 159 L463 177 L447 194 L423 193 L406 207 L385 184 Z" },
];

interface MapViewportProps {
  year: Year;
  selectedStateId: StateId | null;
  selectedHotspotId: string | null;
  onSelectState: (stateId: StateId) => void;
  onSelectHotspot: (hotspotId: string) => void;
  onClearSelection: () => void;
}

export function MapViewport({
  year,
  selectedStateId,
  selectedHotspotId,
  onSelectState,
  onSelectHotspot,
  onClearSelection,
}: MapViewportProps) {
  const reduceMotion = useReducedMotion();
  const [hoveredStateId, setHoveredStateId] = useState<StateId | null>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const mapX = useSpring(useTransform(pointerX, (value) => value * 0.035), { damping: 28, stiffness: 120 });
  const mapY = useSpring(useTransform(pointerY, (value) => value * 0.035), { damping: 28, stiffness: 120 });
  const glowX = useSpring(useTransform(pointerX, (value) => value * 0.09), { damping: 34, stiffness: 100 });
  const glowY = useSpring(useTransform(pointerY, (value) => value * 0.09), { damping: 34, stiffness: 100 });

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - bounds.left - bounds.width / 2);
    pointerY.set(event.clientY - bounds.top - bounds.height / 2);
  }

  function resetParallax() {
    pointerX.set(0);
    pointerY.set(0);
    setHoveredStateId(null);
  }

  return (
    <section
      aria-labelledby="map-heading"
      className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#070B14]"
      onClick={onClearSelection}
      onPointerLeave={resetParallax}
      onPointerMove={handlePointerMove}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_72%_at_51%_46%,rgba(20,184,166,0.18),transparent_54%),radial-gradient(ellipse_38%_55%_at_12%_76%,rgba(15,23,42,0.94),transparent_70%),radial-gradient(ellipse_42%_48%_at_90%_16%,rgba(20,184,166,0.08),transparent_72%),linear-gradient(140deg,#0b1528_0%,#070b14_56%,#05070d_100%)]" />
      <SpatialBackdrop />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[47%] size-[min(74vw,52rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#14B8A6]/[0.09] blur-3xl"
        style={{ x: glowX, y: glowY }}
        animate={reduceMotion ? undefined : { opacity: [0.32, 0.72, 0.32], scale: [0.92, 1.08, 0.92] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(148,163,184,0.48)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.48)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_76%)]" />

      <div className="absolute inset-x-5 top-8 z-10 sm:left-8 sm:top-9 lg:left-10">
        <motion.p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#14B8A6]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          National workspace · {year}
        </motion.p>
        <motion.h1 id="map-heading" className="mt-3 text-3xl font-medium tracking-[-0.055em] text-[#E2E8F0] sm:text-4xl" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08 }}>
          Investigation map
        </motion.h1>
      </div>

      <motion.div
        className="absolute left-1/2 top-[49%] z-10 w-[min(62vw,32rem)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(51vw,36rem)]"
        style={{ x: mapX, y: mapY }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg viewBox="0 0 520 660" className="h-auto w-full drop-shadow-[0_0_45px_rgba(20,184,166,0.3)]" role="img" aria-label="Interactive map of India with selectable states and hotspots">
          <defs>
            <linearGradient id="india-fill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#1d4f55" stopOpacity="0.94" />
              <stop offset="0.52" stopColor="#126b68" stopOpacity="0.72" />
              <stop offset="1" stopColor="#0b343d" stopOpacity="0.88" />
            </linearGradient>
            <filter id="india-glow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <clipPath id="india-clip"><path d={INDIA_PATH} /></clipPath>
          </defs>
          <path d={INDIA_PATH} fill="url(#india-fill)" stroke="#5eead4" strokeOpacity="0.56" strokeWidth="2" filter="url(#india-glow)" />
          <g clipPath="url(#india-clip)">
            {stateShapes.map((state) => {
              const metrics = getStateMetrics(state.id, year);
              const active = selectedStateId === state.id;
              const hovered = hoveredStateId === state.id;
              const color = stateColor(metrics.forestHealthScore);

              return (
                <motion.path
                  key={state.id}
                  d={state.path}
                  fill={color}
                  fillOpacity={active ? 0.7 : hovered ? 0.5 : 0.25}
                  stroke={active || hovered ? "#b8fff4" : "#99f6e4"}
                  strokeOpacity={active ? 0.9 : hovered ? 0.72 : 0.26}
                  strokeWidth={active ? 2.3 : 1}
                  className="cursor-pointer"
                  onClick={(event) => { event.stopPropagation(); onSelectState(state.id); }}
                  onHoverStart={() => setHoveredStateId(state.id)}
                  onHoverEnd={() => setHoveredStateId(null)}
                  animate={{
                    fill: color,
                    fillOpacity: active ? 0.7 : hovered ? 0.5 : 0.25,
                    strokeOpacity: active ? 0.9 : hovered ? 0.72 : 0.26,
                    strokeWidth: active ? 2.3 : 1,
                  }}
                  transition={{ duration: 0.48, ease: "easeOut" }}
                />
              );
            })}
          </g>
          <path d="M178 104 C205 130 177 167 206 195 C235 223 200 257 239 284 C270 307 236 340 274 375 C303 402 266 439 296 472" fill="none" stroke="#b8fff4" strokeOpacity="0.17" strokeWidth="1.5" />
          <path d="M143 173 C179 194 171 225 207 244 C244 263 223 302 263 326 C298 347 277 390 315 412" fill="none" stroke="#b8fff4" strokeOpacity="0.13" strokeWidth="1.5" />
          {hotspots.map((hotspot) => {
            const severity = hotspot.severityByYear[year];
            const color = getSeverityColor(severity);
            const active = selectedHotspotId === hotspot.id;

            return (
              <motion.g
                key={hotspot.id}
                className="cursor-pointer"
                onClick={(event) => { event.stopPropagation(); onSelectHotspot(hotspot.id); }}
                whileHover={{ scale: 1.25 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                {!reduceMotion && (
                  <motion.circle
                    cx={hotspot.position[0]}
                    cy={hotspot.position[1]}
                    r="10"
                    fill={color}
                    animate={{ opacity: [0.45, 0], r: [5, 14] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: hotspot.position[0] * 0.01 }}
                  />
                )}
                <motion.circle
                  cx={hotspot.position[0]}
                  cy={hotspot.position[1]}
                  r={active ? 6.5 : 4.5}
                  fill={color}
                  stroke="#e2e8f0"
                  strokeOpacity={active ? 0.9 : 0.55}
                  strokeWidth={active ? 1.5 : 1}
                  animate={{ fill: color, r: active ? 6.5 : 4.5, strokeOpacity: active ? 0.9 : 0.55 }}
                  transition={{ duration: 0.35 }}
                />
              </motion.g>
            );
          })}
        </svg>
      </motion.div>

      <AnimatePresence>
        {hoveredStateId && (
          <motion.div
            className="absolute bottom-32 left-5 z-20 border border-[#94A3B8]/15 bg-[#0F172A]/60 px-4 py-3 text-xs text-[#E2E8F0] shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:bottom-36 sm:left-8 lg:left-12"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <span className="mr-2 inline-block size-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_10px_#14B8A6]" />
            {stateProfiles[hoveredStateId].name} · select for intelligence
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function stateColor(score: number) {
  if (score >= 72) return "#0f766e";
  if (score >= 65) return "#a16207";
  return "#b91c1c";
}
