"use client";

import { useState } from "react";
import { hotspots } from "../../data/forest-rights";
import type { StateId, Year } from "../../types/forest-rights";
import { InvestigationDrawer } from "../intelligence/InvestigationDrawer";
import { Header, type CommandSection } from "../layout/Header";
import { MapViewport } from "../map/MapViewport";
import { TimelineSlider } from "../timeline/TimelineSlider";

export function ForestRightsExperience() {
  const [year, setYear] = useState<Year>(2024);
  const [activeSection, setActiveSection] = useState<CommandSection>("National");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedStateId, setSelectedStateId] = useState<StateId | null>(null);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const selectedHotspot = hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? null;

  function selectState(stateId: StateId) {
    setSelectedStateId(stateId);
    setSelectedHotspotId(null);
    setDrawerOpen(true);
  }

  function selectHotspot(hotspotId: string) {
    const hotspot = hotspots.find((item) => item.id === hotspotId);
    if (!hotspot) return;

    setSelectedStateId(hotspot.stateId);
    setSelectedHotspotId(hotspotId);
    setDrawerOpen(true);
  }

  function clearSelection() {
    setSelectedStateId(null);
    setSelectedHotspotId(null);
  }

  return (
    <>
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex min-h-[calc(100svh-4.5rem)]">
        <section aria-label="Forest rights map workspace" className="relative min-w-0 flex-1">
          <MapViewport
            year={year}
            selectedStateId={selectedStateId}
            selectedHotspotId={selectedHotspotId}
            onSelectState={selectState}
            onSelectHotspot={selectHotspot}
            onClearSelection={clearSelection}
          />
          <div className="absolute inset-x-5 bottom-6 z-20 sm:inset-x-8 lg:inset-x-10">
            <TimelineSlider year={year} onSelectYear={setYear} />
          </div>
        </section>
        <InvestigationDrawer
          open={drawerOpen}
          year={year}
          selectedStateId={selectedStateId}
          selectedHotspot={selectedHotspot}
          onToggle={() => setDrawerOpen((open) => !open)}
          onClearSelection={clearSelection}
        />
      </main>
    </>
  );
}
