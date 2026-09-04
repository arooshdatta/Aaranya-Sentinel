"use client";

import { motion } from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";
import { TIMELINE_YEARS, type Year } from "../../types/forest-rights";

interface TimelineSliderProps {
  year: Year;
  onSelectYear: (year: Year) => void;
}

const firstYear = TIMELINE_YEARS[0];
const lastYear = TIMELINE_YEARS[TIMELINE_YEARS.length - 1];

export function TimelineSlider({ year, onSelectYear }: TimelineSliderProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const progress = ((year - firstYear) / (lastYear - firstYear)) * 100;

  function setYearFromPointer(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) return;

    const bounds = rail.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
    const next = Math.round(firstYear + ratio * (lastYear - firstYear)) as Year;
    onSelectYear(next);
  }

  return (
    <section aria-labelledby="timeline-heading" className="mx-auto w-full max-w-5xl px-3 pb-3 sm:px-5">
      <div className="rounded-2xl border border-white/[0.09] bg-[#101824]/72 px-4 py-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-5">
          <div>
            <p id="timeline-heading" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">Historical archive</p>
            <p className="mt-1 text-xs leading-5 text-[#64748B]">Drag across a decade of claims, evidence, and district signals.</p>
          </div>
          <motion.div key={year} className="shrink-0 rounded-xl border border-[#5F8F7B]/30 bg-[#5F8F7B]/10 px-4 py-2 text-right" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Archive position</span>
            <strong className="mt-0.5 block text-xl font-semibold tracking-[-0.05em] text-[#E2E8F0]">{year}</strong>
          </motion.div>
        </div>

        <div
          ref={railRef}
          role="slider"
          tabIndex={0}
          aria-label="Historical investigation year"
          aria-valuemin={firstYear}
          aria-valuemax={lastYear}
          aria-valuenow={year}
          className={"relative mt-7 h-12 touch-none select-none outline-none " + (dragging ? "cursor-grabbing" : "cursor-grab")}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
            setYearFromPointer(event);
          }}
          onPointerMove={(event) => {
            if (dragging) setYearFromPointer(event);
          }}
          onPointerUp={(event) => {
            setYearFromPointer(event);
            setDragging(false);
          }}
          onPointerCancel={() => setDragging(false)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" && year > firstYear) onSelectYear((year - 1) as Year);
            if (event.key === "ArrowRight" && year < lastYear) onSelectYear((year + 1) as Year);
          }}
        >
          <div className="absolute inset-x-0 top-5 h-px bg-[#94A3B8]/25 shadow-[0_0_14px_rgba(226,232,240,0.08)]" />
          <motion.div className="absolute left-0 top-5 h-px bg-[#7EA38F] shadow-[0_0_12px_rgba(126,163,143,0.32)]" animate={{ width: progress + "%" }} transition={{ type: "spring", stiffness: 220, damping: 28 }} />

          {TIMELINE_YEARS.map((timelineYear) => {
            const position = ((timelineYear - firstYear) / (lastYear - firstYear)) * 100;
            const active = year === timelineYear;
            return (
              <button
                key={timelineYear}
                type="button"
                aria-label={"View archive for " + timelineYear}
                aria-pressed={active}
                onClick={() => onSelectYear(timelineYear)}
                className="absolute top-0 z-10 flex -translate-x-1/2 flex-col items-center outline-none"
                style={{ left: position + "%" }}
              >
                <motion.span className={"grid size-3 place-items-center rounded-full border transition-colors " + (active ? "border-[#E2E8F0] bg-[#5F8F7B] shadow-[0_0_0_4px_rgba(95,143,123,0.13)]" : "border-[#64748B] bg-[#101824] hover:border-[#94A3B8]")} animate={{ scale: active ? 1.18 : 1 }} transition={{ type: "spring", stiffness: 350, damping: 23 }} />
                <span className={"mt-3 text-[9px] font-semibold tracking-[0.04em] sm:text-[10px] " + (active ? "text-[#E2E8F0]" : "text-[#64748B]")}>{timelineYear}</span>
              </button>
            );
          })}

          <motion.span aria-hidden="true" className="absolute top-[9px] z-20 size-7 -translate-x-1/2 rounded-full border-2 border-[#E2E8F0] bg-[#5F8F7B] shadow-[0_7px_22px_rgba(0,0,0,0.34)]" animate={{ left: progress + "%" }} transition={{ type: "spring", stiffness: 270, damping: 28 }} />
        </div>
      </div>
    </section>
  );
}
