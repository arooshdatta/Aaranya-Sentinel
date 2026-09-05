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
        <motion.main
          key="atlas"
          className="flex h-screen flex-col bg-[#07111D]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Header />
          {/* Map fills all remaining height — India dominates */}
          <div className="relative flex-1 overflow-hidden">
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
              onCloseDistrict={() => setSelectedHotspotId(null)}
            />
            {/* Timeline — left edge, vertically centered */}
            <motion.div
              className="absolute left-4 top-1/2 z-30 -translate-y-1/2 sm:left-6"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <TimelineSlider year={year} onSelectYear={setYear} />
            </motion.div>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
