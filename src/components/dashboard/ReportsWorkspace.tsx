"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { getHotspotAnalystSummary, getHotspotSeverity, getSeverityColor, stateProfiles } from "../../data/forest-rights";
import type { Hotspot, Year } from "../../types/forest-rights";

export function ReportsWorkspace({ hotspot, year, onInvestigate }: { hotspot: Hotspot; year: Year; onInvestigate: () => void }) {
  const [previewOpen, setPreviewOpen] = useState(true);
  const severity = getHotspotSeverity(hotspot, year);

  return (
    <motion.main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:py-16" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="flex flex-col justify-between gap-6 border-b border-[#1E293B] pb-9 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#14B8A6]">Reports · {year}</p>
          <h1 className="mt-3 text-3xl font-medium tracking-[-0.055em] text-[#E2E8F0] sm:text-4xl">Decision-ready investigation output</h1>
          <p className="mt-3 text-sm text-[#94A3B8]">A concise report package connected to the active evidence chain.</p>
        </div>
        <button type="button" onClick={onInvestigate} className="border border-[#14B8A6]/50 px-4 py-2.5 text-xs font-medium text-[#14B8A6] transition-colors hover:bg-[#14B8A6]/10">Return to investigation</button>
      </div>

      <section className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="border border-[#1E293B] bg-[#0F172A]/45 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5 border-b border-[#1E293B] pb-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">Investigation report</p>
              <h2 className="mt-2 text-xl font-medium tracking-[-0.04em] text-[#E2E8F0]">{hotspot.districtName}, {stateProfiles[hotspot.stateId].name}</h2>
            </div>
            <span className="border border-[#1E293B] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#94A3B8]">Draft</span>
          </div>
          <p className="mt-6 text-sm leading-7 text-[#CBD5E1]">{getHotspotAnalystSummary(hotspot, year)}</p>
          <div className="mt-7 border-t border-[#1E293B] pt-5 text-sm">
            <p className="text-[#94A3B8]">Recommended action</p>
            <p className="mt-2 font-medium text-[#E2E8F0]">{hotspot.recommendedAction}</p>
          </div>
        </article>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">Investigation status</p>
          <div className="mt-5 space-y-4 border-y border-[#1E293B] py-5 text-sm">
            <StatusLine label="Anomaly severity" value={severity} color={getSeverityColor(severity)} />
            <StatusLine label="Evidence chain" value="3 items linked" />
            <StatusLine label="Report state" value="Export-ready draft" />
          </div>
          <button type="button" onClick={() => setPreviewOpen((open) => !open)} className="mt-6 border border-[#14B8A6] bg-[#14B8A6] px-4 py-2.5 text-xs font-semibold text-[#06251f] transition-colors hover:bg-[#5eead4]">
            {previewOpen ? "Hide export preview" : "Show export preview"}
          </button>
          <AnimatePresence>
            {previewOpen && (
              <motion.div className="mt-5 border border-[#1E293B] p-4 text-xs leading-5 text-[#94A3B8]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                PDF-ready preview will include case scope, chronological evidence, analyst analysis, and the recommended action.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </motion.main>
  );
}

function StatusLine({ label, value, color }: { label: string; value: string; color?: string }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-[#94A3B8]">{label}</span><span className="font-medium text-[#E2E8F0]" style={color ? { color } : undefined}>{value}</span></div>;
}
