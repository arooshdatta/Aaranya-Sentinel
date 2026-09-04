"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { hotspots } from "../../data/forest-rights";
import type { StateId, Year } from "../../types/forest-rights";
import { Header } from "../layout/Header";
import { MapViewport } from "../map/MapViewport";
import { TimelineSlider } from "../timeline/TimelineSlider";
import { OpeningExperience } from "./OpeningExperience";

export function ForestRightsExperience() {
  const [entered, setEntered] = useState(false);
  const [year, setYear] = useState<Year>(2024);
  const [selectedStateId, setSelectedStateId] = useState<StateId | null>(null);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  return (
    <AnimatePresence mode="wait">
      {!entered ? (
        <OpeningExperience key="opening" onEnter={() => setEntered(true)} />
      ) : (
        <motion.main key="atlas" className="min-h-screen bg-[#080f18]" initial={{ opacity: 0, y: 22, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}>
          <Header />
          <section aria-label="India forest-rights exploration" className="flex min-h-[calc(100svh-4.25rem)] flex-col">
            <div className="relative min-h-[calc(100svh-14.5rem)] flex-1">
              <MapViewport
                year={year}
                selectedStateId={selectedStateId}
                selectedHotspotId={selectedHotspotId}
                onSelectState={(stateId) => {
                  setSelectedStateId(stateId);
                  setSelectedHotspotId(null);
                }}
                onSelectHotspot={(hotspotId) => {
                  const hotspot = hotspots.find((item) => item.id === hotspotId);
                  if (!hotspot) return;
                  setSelectedStateId(hotspot.stateId);
                  setSelectedHotspotId(hotspotId);
                }}
                onClearSelection={() => {
                  setSelectedStateId(null);
                  setSelectedHotspotId(null);
                }}
              />
            </div>
            <div className="border-t border-white/[0.08] bg-[#0a121d] px-4 py-4 sm:px-7 lg:px-10">
              <TimelineSlider year={year} onSelectYear={setYear} />
            </div>
          </section>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
