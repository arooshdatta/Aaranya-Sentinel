"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  getClaimStatus,
  getEvidenceItems,
  getHotspotAnalystSummary,
  getSeverityColor,
  getStateMetrics,
  stateProfiles,
} from "../../data/forest-rights";
import type { Hotspot, StateId, Year } from "../../types/forest-rights";

interface InvestigationDrawerProps {
  open: boolean;
  year: Year;
  selectedStateId: StateId | null;
  selectedHotspot: Hotspot | null;
  onToggle: () => void;
  onClearSelection: () => void;
}

const journey = ["National", "State", "District", "Anomaly", "Evidence", "AI analysis"];

export function InvestigationDrawer({
  open,
  year,
  selectedStateId,
  selectedHotspot,
  onToggle,
  onClearSelection,
}: InvestigationDrawerProps) {
  const [showReportPreview, setShowReportPreview] = useState(false);
  const stateId = selectedHotspot?.stateId ?? selectedStateId;
  const selectedState = stateId ? stateProfiles[stateId] : null;
  const metrics = stateId ? getStateMetrics(stateId, year) : null;
  const progress = selectedHotspot ? 5 : selectedState ? 1 : 0;

  return (
    <motion.aside
      aria-label="Investigation drawer"
      className="relative z-20 shrink-0 overflow-hidden border-l border-[#1E293B] bg-[#0B1220]"
      animate={{ width: open ? 368 : 48 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="absolute left-0 top-0 z-10 grid size-12 place-items-center border-b border-r border-[#1E293B] text-lg text-[#94A3B8] transition-colors hover:bg-[#0F172A] hover:text-[#E2E8F0]"
        aria-label={open ? "Collapse investigation drawer" : "Open investigation drawer"}
      >
        {open ? "›" : "‹"}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="h-[calc(100svh-4.5rem)] w-[368px] overflow-y-auto px-5 pb-8 pt-5"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18 }}
          >
            <div className="ml-10 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">Investigation</p>
                <h2 className="mt-1 text-lg font-medium tracking-[-0.03em] text-[#E2E8F0]">Case workspace</h2>
              </div>
              {(selectedState || selectedHotspot) && (
                <button type="button" onClick={onClearSelection} className="text-xs text-[#94A3B8] transition-colors hover:text-[#E2E8F0]">
                  Clear
                </button>
              )}
            </div>

            <Journey progress={progress} />

            <AnimatePresence mode="wait">
              {selectedHotspot && metrics ? (
                <motion.div key={selectedHotspot.id + year} variants={contentMotion} initial="hidden" animate="visible" exit="hidden">
                  <DistrictInvestigation hotspot={selectedHotspot} year={year} stateName={selectedState?.name ?? ""} />
                  <EvidenceTimeline hotspot={selectedHotspot} year={year} />
                  <AiAnalysis hotspot={selectedHotspot} year={year} />
                  <ReportPreview hotspot={selectedHotspot} year={year} open={showReportPreview} onToggle={() => setShowReportPreview((value) => !value)} />
                </motion.div>
              ) : selectedState && metrics ? (
                <motion.div key={selectedState.id + year} variants={contentMotion} initial="hidden" animate="visible" exit="hidden">
                  <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">State view</p>
                  <h3 className="mt-2 text-xl font-medium tracking-[-0.04em] text-[#E2E8F0]">{selectedState.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#94A3B8]">Select a hotspot to advance this investigation to district evidence.</p>
                  <div className="mt-6 space-y-4 border-y border-[#1E293B] py-5">
                    <InvestigationMetric label="Forest health" value={metrics.forestHealthScore + " / 100"} />
                    <InvestigationMetric label="Claim status" value={metrics.trend === "Critical" ? "Requires review" : "Monitoring"} />
                    <InvestigationMetric label="Anomaly score" value={metrics.anomalyScore + " / 100"} />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="national" variants={contentMotion} initial="hidden" animate="visible" exit="hidden">
                  <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">National view · {year}</p>
                  <h3 className="mt-2 text-xl font-medium tracking-[-0.04em] text-[#E2E8F0]">Begin an investigation</h3>
                  <p className="mt-3 text-sm leading-6 text-[#94A3B8]">Start with a state, then follow a district hotspot through anomaly, evidence, and analysis.</p>
                  <ol className="mt-6 space-y-3 border-l border-[#1E293B] pl-4 text-xs leading-5 text-[#94A3B8]">
                    <li>Select a state on the map.</li>
                    <li>Open a district hotspot.</li>
                    <li>Review evidence before generating a report preview.</li>
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}

function Journey({ progress }: { progress: number }) {
  return (
    <ol className="mt-8 grid grid-cols-3 gap-y-3 border-y border-[#1E293B] py-4 text-[9px] font-medium uppercase tracking-[0.12em]">
      {journey.map((step, index) => (
        <li key={step} className={index <= progress ? "text-[#14B8A6]" : "text-[#475569]"}>
          <span className="mr-1 inline-block size-1.5 rounded-full bg-current" />
          {step}
        </li>
      ))}
    </ol>
  );
}

function DistrictInvestigation({ hotspot, year, stateName }: { hotspot: Hotspot; year: Year; stateName: string }) {
  const severity = hotspot.severityByYear[year];

  return (
    <section className="mt-7">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">District view</p>
      <h3 className="mt-2 text-xl font-medium tracking-[-0.04em] text-[#E2E8F0]">{hotspot.districtName}</h3>
      <p className="mt-1 text-xs text-[#94A3B8]">{stateName} · {year}</p>
      <div className="mt-5 space-y-4 border-y border-[#1E293B] py-5">
        <InvestigationMetric label="Claim status" value={getClaimStatus(severity)} />
        <InvestigationMetric label="Anomaly severity" value={severity} color={getSeverityColor(severity)} />
        <InvestigationMetric label="Affected forest area" value={hotspot.impactByYear[year]} />
      </div>
    </section>
  );
}

function EvidenceTimeline({ hotspot, year }: { hotspot: Hotspot; year: Year }) {
  const items = getEvidenceItems(hotspot, year);

  return (
    <section className="mt-7">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">Evidence view</p>
      <h3 className="mt-2 text-base font-medium text-[#E2E8F0]">Evidence timeline</h3>
      <ol className="mt-4 space-y-4 border-l border-[#1E293B] pl-4">
        {items.map((item, index) => (
          <li key={item.label} className="relative">
            <span className="absolute -left-[21px] top-1.5 size-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_8px_rgba(20,184,166,0.7)]" />
            <p className="text-xs font-medium text-[#E2E8F0]">{item.label}</p>
            <p className="mt-1 text-xs leading-5 text-[#94A3B8]">{item.detail}</p>
            {index === 0 && <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#14B8A6]">{year}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

function AiAnalysis({ hotspot, year }: { hotspot: Hotspot; year: Year }) {
  return (
    <section className="mt-7 border-y border-[#1E293B] py-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">AI analysis view</p>
      <p className="mt-3 text-sm leading-6 text-[#CBD5E1]">{getHotspotAnalystSummary(hotspot, year)}</p>
    </section>
  );
}

function ReportPreview({ hotspot, year, open, onToggle }: { hotspot: Hotspot; year: Year; open: boolean; onToggle: () => void }) {
  return (
    <section className="mt-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">Report generation</p>
          <h3 className="mt-1 text-base font-medium text-[#E2E8F0]">Investigation report</h3>
        </div>
        <button type="button" onClick={onToggle} className="border border-[#14B8A6]/35 px-3 py-2 text-xs font-medium text-[#14B8A6] transition-colors hover:bg-[#14B8A6]/10">
          {open ? "Hide preview" : "Preview"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="mt-4 border border-[#1E293B] bg-[#0F172A]/60 p-4 text-xs leading-5 text-[#94A3B8]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <p className="font-medium text-[#E2E8F0]">{hotspot.districtName} · {year}</p>
            <p className="mt-2">Draft includes the active anomaly, evidence timeline, and recommended action for review.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function InvestigationMetric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="text-[#94A3B8]">{label}</span>
      <span className="text-right font-medium text-[#E2E8F0]" style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}

const contentMotion = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};
