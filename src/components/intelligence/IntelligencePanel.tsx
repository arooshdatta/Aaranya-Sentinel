"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { getMockAnalystSummary, getSeverityColor, getStateMetrics, stateProfiles } from "../../data/forest-rights";
import type { Hotspot, StateId, Year } from "../../types/forest-rights";

interface IntelligencePanelProps {
  year: Year;
  selectedStateId: StateId | null;
  selectedHotspot: Hotspot | null;
  onClose: () => void;
}

export function IntelligencePanel({ year, selectedStateId, selectedHotspot, onClose }: IntelligencePanelProps) {
  const selectedState = selectedStateId ? stateProfiles[selectedStateId] : null;
  const metrics = selectedStateId ? getStateMetrics(selectedStateId, year) : null;

  return (
    <aside aria-live="polite" className="border border-[#94A3B8]/15 bg-[#0F172A]/62 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-5">
      <AnimatePresence mode="wait">
        {selectedHotspot ? (
          <motion.div key={`${selectedHotspot.id}-${year}`} initial="hidden" animate="visible" exit="hidden" variants={panelMotion}>
            <PanelHeader eyebrow="District hotspot" title={selectedHotspot.districtName} onClose={onClose} />
            <div className="mt-5 space-y-3 border-t border-[#94A3B8]/10 pt-4">
              <ContextLine label="Issue" value={selectedHotspot.issueType} />
              <ContextLine label="Severity" value={selectedHotspot.severityByYear[year]} color={getSeverityColor(selectedHotspot.severityByYear[year])} />
              <ContextLine label="Estimated impact" value={selectedHotspot.impactByYear[year]} />
            </div>
            <p className="mt-5 border-t border-[#94A3B8]/10 pt-4 text-xs leading-5 text-[#94A3B8]">
              <span className="font-medium text-[#E2E8F0]">Recommended action: </span>
              {selectedHotspot.recommendedAction}
            </p>
          </motion.div>
        ) : selectedState && metrics ? (
          <motion.div key={`${selectedState.id}-${year}`} initial="hidden" animate="visible" exit="hidden" variants={panelMotion}>
            <PanelHeader eyebrow="State intelligence" title={selectedState.name} onClose={onClose} />
            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[#94A3B8]/10 pt-4">
              <Signal label="Forest health" value={`${metrics.forestHealthScore}/100`} tone={metrics.forestHealthScore >= 72 ? "#14B8A6" : metrics.forestHealthScore >= 65 ? "#F59E0B" : "#EF4444"} />
              <Signal label="Anomaly score" value={`${metrics.anomalyScore}/100`} tone={metrics.anomalyScore >= 60 ? "#EF4444" : metrics.anomalyScore >= 40 ? "#F59E0B" : "#14B8A6"} />
              <Signal label="Approved claims" value={metrics.approvedClaims.toLocaleString("en-IN")} />
              <Signal label="Pending claims" value={metrics.pendingClaims.toLocaleString("en-IN")} />
            </div>
            <div className="mt-5 border-t border-[#94A3B8]/10 pt-4">
              <ContextLine label="Trend" value={metrics.trend} color={trendColor(metrics.trend)} />
              <p className="mt-4 text-xs leading-5 text-[#94A3B8]">
                <span className="font-medium uppercase tracking-[0.14em] text-[#14B8A6]">AI analyst</span>
                <span className="mt-2 block">{getMockAnalystSummary(selectedState.id, year)}</span>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="idle" initial="hidden" animate="visible" exit="hidden" variants={panelMotion}>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_12px_2px_rgba(20,184,166,0.55)]" />
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">Forest context</p>
            </div>
            <h2 className="mt-3 text-base font-medium tracking-[-0.025em] text-[#E2E8F0]">Explore India&apos;s forest rights</h2>
            <p className="mt-4 border-t border-[#94A3B8]/10 pt-4 text-xs leading-5 text-[#94A3B8]">
              Select a state for intelligence signals or a hotspot for district context.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

function PanelHeader({ eyebrow, title, onClose }: { eyebrow: string; title: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#14B8A6]">{eyebrow}</p>
        <h2 className="mt-2 text-lg font-medium tracking-[-0.035em] text-[#E2E8F0]">{title}</h2>
      </div>
      <button type="button" onClick={onClose} className="grid size-7 place-items-center border border-[#94A3B8]/15 text-[#94A3B8] transition-colors hover:border-[#14B8A6]/50 hover:text-[#E2E8F0]" aria-label="Close context panel">
        ×
      </button>
    </div>
  );
}

function Signal({ label, value, tone = "#E2E8F0" }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-[#94A3B8]">{label}</p>
      <p className="mt-1.5 text-base font-medium tracking-[-0.025em]" style={{ color: tone }}>{value}</p>
    </div>
  );
}

function ContextLine({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="text-[#94A3B8]">{label}</span>
      <span className="text-right font-medium text-[#E2E8F0]" style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}

function trendColor(trend: "Improving" | "Stable" | "Critical") {
  return { Improving: "#14B8A6", Stable: "#F59E0B", Critical: "#EF4444" }[trend];
}

const panelMotion: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } },
};
