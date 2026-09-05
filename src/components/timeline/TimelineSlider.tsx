"use client";

import { motion } from "framer-motion";
import { useRef, useState, type PointerEvent, type WheelEvent } from "react";
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
    const ratio = Math.min(Math.max(1 - (event.clientY - bounds.top) / bounds.height, 0), 1);
    onSelectYear(Math.round(firstYear + ratio * (lastYear - firstYear)) as Year);
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.deltaY === 0) return;
    const next = Math.min(lastYear, Math.max(firstYear, year + (event.deltaY > 0 ? -1 : 1))) as Year;
    onSelectYear(next);
  }

  return (
    <section aria-label="Archive time navigation" className="w-[5.25rem]">
      <div className="rounded-2xl border border-white/[0.1] bg-[#111b28]/72 px-3 py-3 shadow-[0_18px_42px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <motion.div key={year} className="mb-4 rounded-lg border border-[#7EA38F]/30 bg-[#5F8F7B]/10 px-1 py-2 text-center" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <span className="block text-[7px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Archive</span>
          <strong className="mt-0.5 block text-sm font-semibold tracking-[-0.04em] text-[#E2E8F0]">{year}</strong>
        </motion.div>
        <div
          ref={railRef}
          role="slider"
          tabIndex={0}
          aria-label="Historical investigation year"
          aria-valuemin={firstYear}
          aria-valuemax={lastYear}
          aria-valuenow={year}
          className={"relative mx-auto h-[min(48svh,27rem)] w-10 touch-none select-none outline-none " + (dragging ? "cursor-grabbing" : "cursor-grab")}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
            setYearFromPointer(event);
          }}
          onPointerMove={(event) => dragging && setYearFromPointer(event)}
          onPointerUp={(event) => {
            setYearFromPointer(event);
            setDragging(false);
          }}
          onPointerCancel={() => setDragging(false)}
          onWheel={handleWheel}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && year > firstYear) onSelectYear((year - 1) as Year);
            if (event.key === "ArrowUp" && year < lastYear) onSelectYear((year + 1) as Year);
          }}
        >
          <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-[#94A3B8]/22 shadow-[0_0_12px_rgba(226,232,240,0.06)]" />
          <motion.div className="absolute bottom-0 left-1/2 w-px -translate-x-1/2 bg-[#7EA38F] shadow-[0_0_10px_rgba(126,163,143,0.3)]" animate={{ height: progress + "%" }} transition={{ type: "spring", stiffness: 220, damping: 28 }} />
          {TIMELINE_YEARS.map((timelineYear) => {
            const position = 100 - ((timelineYear - firstYear) / (lastYear - firstYear)) * 100;
            const active = year === timelineYear;
            return (
              <button key={timelineYear} type="button" onClick={() => onSelectYear(timelineYear)} aria-label={"View archive for " + timelineYear} aria-pressed={active} className="absolute left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap outline-none" style={{ top: position + "%" }}>
                <motion.span className={"size-2 rounded-full border " + (active ? "border-[#E2E8F0] bg-[#7EA38F] shadow-[0_0_0_3px_rgba(126,163,143,0.14)]" : "border-[#64748B] bg-[#111b28]")} animate={{ scale: active ? 1.2 : 1 }} transition={{ type: "spring", stiffness: 330, damping: 22 }} />
                <span className={"absolute left-4 text-[8px] font-semibold tracking-[0.04em] transition-colors " + (active ? "text-[#E2E8F0]" : "text-[#64748B] hover:text-[#CBD5E1]")}>{timelineYear}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
