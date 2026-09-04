"use client";

import { useState } from "react";
import { hotspots } from "../../data/forest-rights";
import type { StateId, Year } from "../../types/forest-rights";
import { IntelligencePanel } from "../intelligence/IntelligencePanel";
import { MapViewport } from "../map/MapViewport";
import { TimelineSlider } from "../timeline/TimelineSlider";

export function ForestRightsExperience() {
  const [year, setYear] = useState<Year>(2024);
  const [selectedStateId, setSelectedStateId] = useState<StateId | null>(null);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const selectedHotspot = hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? null;

  function selectState(stateId: StateId) {
    setSelectedStateId(stateId);
    setSelectedHotspotId(null);
  }

  function selectHotspot(hotspotId: string) {
    const hotspot = hotspots.find((item) => item.id === hotspotId);
    if (!hotspot) return;

    setSelectedStateId(hotspot.stateId);
    setSelectedHotspotId(hotspotId);
  }

  function clearSelection() {
    setSelectedStateId(null);
    setSelectedHotspotId(null);
  }

  return (
    <main className="relative">
      <section aria-label="India forest rights monitoring map" className="relative min-h-screen">
        <MapViewport
          year={year}
          selectedStateId={selectedStateId}
          selectedHotspotId={selectedHotspotId}
          onSelectState={selectState}
          onSelectHotspot={selectHotspot}
          onClearSelection={clearSelection}
        />
        <div className="absolute right-5 top-52 z-20 w-[min(22rem,calc(100%-2.5rem))] sm:right-8 sm:top-32 lg:right-12">
          <IntelligencePanel
            year={year}
            selectedStateId={selectedStateId}
            selectedHotspot={selectedHotspot}
            onClose={clearSelection}
          />
        </div>
        <div className="absolute inset-x-5 bottom-7 z-20 sm:inset-x-8 sm:bottom-9 lg:inset-x-12">
          <TimelineSlider year={year} onSelectYear={setYear} />
        </div>
      </section>
    </main>
  );
}
