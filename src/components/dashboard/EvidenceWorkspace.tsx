"use client";

import { motion } from "framer-motion";
import { getEvidenceItems, getHotspotSeverity, getSeverityColor, stateProfiles } from "../../data/forest-rights";
import type { Hotspot, Year } from "../../types/forest-rights";

export function EvidenceWorkspace({ hotspot, year, onInvestigate }: { hotspot: Hotspot; year: Year; onInvestigate: () => void }) {
  const evidence = getEvidenceItems(hotspot, year);
  const severity = getHotspotSeverity(hotspot, year);

  return (
    <motion.main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:py-16" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="flex flex-col justify-between gap-6 border-b border-[#1E293B] pb-9 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#14B8A6]">Evidence file · {year}</p>
          <h1 className="mt-3 text-3xl font-medium tracking-[-0.055em] text-[#E2E8F0] sm:text-4xl">{hotspot.districtName}, {stateProfiles[hotspot.stateId].name}</h1>
          <p className="mt-3 text-sm text-[#94A3B8]">{hotspot.issueType} · <span style={{ color: getSeverityColor(severity) }}>{severity} priority</span></p>
        </div>
        <button type="button" onClick={onInvestigate} className="border border-[#14B8A6]/50 px-4 py-2.5 text-xs font-medium text-[#14B8A6] transition-colors hover:bg-[#14B8A6]/10">Continue investigation</button>
      </div>

      <section className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-72 overflow-hidden border border-[#1E293B] bg-[#0B1320]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_40%,rgba(20,184,166,0.2),transparent_20%),linear-gradient(140deg,#1a2738,#0b1220_55%,#152130)]" />
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.4)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute bottom-5 left-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#14B8A6]">Satellite observation</p>
            <p className="mt-2 text-sm text-[#E2E8F0]">Vegetation edge comparison · {year}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">Chronology</p>
          <ol className="mt-5 border-l border-[#1E293B] pl-5">
            {evidence.map((item, index) => (
              <li key={item.label} className="relative pb-7 last:pb-0">
                <span className="absolute -left-[25px] top-1.5 size-2 rounded-full bg-[#14B8A6]" />
                <p className="text-sm font-medium text-[#E2E8F0]">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-[#94A3B8]">{item.detail}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#64748B]">{index === 0 ? year : year - index}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-12 border-t border-[#1E293B] pt-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">Verification materials</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {["Claim register extract", "Boundary change overlay", "Field verification note"].map((item) => (
            <article key={item} className="border border-[#1E293B] bg-[#0F172A]/45 p-4">
              <p className="text-sm font-medium text-[#E2E8F0]">{item}</p>
              <p className="mt-2 text-xs leading-5 text-[#94A3B8]">Prepared for review in the active investigation.</p>
            </article>
          ))}
        </div>
      </section>
    </motion.main>
  );
}
