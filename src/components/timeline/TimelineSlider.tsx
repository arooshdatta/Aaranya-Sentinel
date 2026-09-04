"use client";

import { motion } from "framer-motion";
import { TIMELINE_YEARS } from "../../types/forest-rights";
import type { Year } from "../../types/forest-rights";

interface TimelineSliderProps {
  year: Year;
  onSelectYear: (year: Year) => void;
}

export function TimelineSlider({ year, onSelectYear }: TimelineSliderProps) {
  return (
    <section aria-labelledby="timeline-heading" className="mx-auto w-full max-w-4xl border-t border-[#94A3B8]/15 bg-[#070B14]/25 px-1 pt-4 backdrop-blur-sm sm:px-2 sm:pt-5">
      <div className="flex items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-[0.18em]">
        <h2 id="timeline-heading" className="text-[#94A3B8]">Observation timeline</h2>
        <span className="text-[#14B8A6]">{year}</span>
      </div>
      <div className="relative mt-5 h-px w-full bg-[#94A3B8]/25">
        <motion.span className="absolute left-0 top-0 h-px bg-gradient-to-r from-[#14B8A6]/20 via-[#14B8A6] to-[#14B8A6]/20" animate={{ width: `${((year - 2020) / 4) * 100}%` }} transition={{ type: "spring", stiffness: 170, damping: 24 }} />
      </div>
      <div className="mt-3 grid grid-cols-5">
        {TIMELINE_YEARS.map((timelineYear) => {
          const active = year === timelineYear;

          return (
            <button key={timelineYear} type="button" onClick={() => onSelectYear(timelineYear)} className="group relative flex min-h-8 flex-col items-center text-[10px] font-medium tracking-[0.12em] text-[#94A3B8] transition-colors hover:text-[#E2E8F0]" aria-pressed={active}>
              <span className="absolute -top-[18px] size-2.5 rounded-full border-2 border-[#070B14] bg-[#1E293B] transition-colors group-hover:bg-[#14B8A6]">
                {active && <motion.span layoutId="timeline-current" className="absolute inset-0 rounded-full bg-[#14B8A6] shadow-[0_0_16px_rgba(20,184,166,0.85)]" transition={{ type: "spring", stiffness: 260, damping: 24 }} />}
              </span>
              <span className={active ? "text-[#E2E8F0]" : undefined}>{timelineYear}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
