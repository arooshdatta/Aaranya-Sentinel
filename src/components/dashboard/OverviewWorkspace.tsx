"use client";

import { motion } from "framer-motion";
import { getHotspotSeverity, hotspots, stateProfiles } from "../../data/forest-rights";
import type { Year } from "../../types/forest-rights";

export function OverviewWorkspace({ year, onInvestigate }: { year: Year; onInvestigate: () => void }) {
  const criticalHotspots = hotspots.filter((hotspot) => getHotspotSeverity(hotspot, year) === "Red");
  const recent = hotspots.slice(0, 4);

  return (
    <motion.main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:py-16" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="flex flex-col justify-between gap-6 border-b border-[#1E293B] pb-9 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#14B8A6]">National briefing · {year}</p>
          <h1 className="mt-3 text-3xl font-medium tracking-[-0.055em] text-[#E2E8F0] sm:text-4xl">Forest rights at a glance</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#94A3B8]">A nationwide view of claim pressure, evidence activity, and investigation priorities.</p>
        </div>
        <button type="button" onClick={onInvestigate} className="border border-[#14B8A6]/50 px-4 py-2.5 text-xs font-medium text-[#14B8A6] transition-colors hover:bg-[#14B8A6]/10">Open investigation map</button>
      </div>

      <section className="grid border-b border-[#1E293B] sm:grid-cols-4">
        <BriefingMetric label="Claims monitored" value="184,260" />
        <BriefingMetric label="Active anomalies" value={String(criticalHotspots.length)} tone="text-[#EF4444]" />
        <BriefingMetric label="Forest area under review" value="4,860 ha" />
        <BriefingMetric label="Recent investigations" value="18" />
      </section>

      <section className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">Investigation activity</p>
          <ol className="mt-5 border-l border-[#1E293B] pl-5">
            {recent.map((hotspot, index) => (
              <li key={hotspot.id} className="relative pb-7 last:pb-0">
                <span className="absolute -left-[25px] top-1.5 size-2 rounded-full bg-[#14B8A6]" />
                <p className="text-sm font-medium text-[#E2E8F0]">{hotspot.districtName}, {stateProfiles[hotspot.stateId].name}</p>
                <p className="mt-1 text-xs leading-5 text-[#94A3B8]">{hotspot.issueType} · {getHotspotSeverity(hotspot, year)} priority</p>
                {index === 0 && <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#14B8A6]">Latest signal</p>}
              </li>
            ))}
          </ol>
        </div>
        <div className="border-t border-[#1E293B] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">Priority focus</p>
          <p className="mt-4 text-2xl font-medium tracking-[-0.04em] text-[#E2E8F0]">Evidence-first review</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#94A3B8]">Critical signals are connected to claim records and verification notes before escalation. Open the map to progress a case through the full investigation workflow.</p>
        </div>
      </section>
    </motion.main>
  );
}

function BriefingMetric({ label, value, tone = "text-[#E2E8F0]" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="border-[#1E293B] px-0 py-6 sm:px-6 sm:[&:not(:first-child)]:border-l">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#94A3B8]">{label}</p>
      <p className={"mt-2 text-2xl font-medium tracking-[-0.04em] " + tone}>{value}</p>
    </div>
  );
}
