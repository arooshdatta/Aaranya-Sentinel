"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export function OpeningExperience({ onEnter }: { onEnter: () => void }) {
  // Reveal progress from 0.0 (deep dense forest) to 1.0 (canopy parted, title discovered)
  const [progress, setProgress] = useState(0);
  const touchStartY = useRef<number | null>(null);

  // Wheel listener for smooth trackpad and mousewheel interaction
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const delta = e.deltaY * 0.0014;
    setProgress(p => Math.min(Math.max(p + delta, 0), 1));
  }, []);

  // Touch listener for mobile / touchpads
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = (touchStartY.current - currentY) * 0.0035;
    setProgress(p => Math.min(Math.max(p + diff, 0), 1));
    touchStartY.current = currentY;
  };

  // Keyboard arrow keys / space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        setProgress(p => Math.min(p + 0.18, 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        setProgress(p => Math.max(p - 0.18, 0));
      } else if (e.key === "Enter" && progress >= 0.7) {
        onEnter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [progress, onEnter]);

  // Once user reaches 0.98, smooth transition to enter
  useEffect(() => {
    if (progress >= 0.98) {
      const t = setTimeout(onEnter, 350);
      return () => clearTimeout(t);
    }
  }, [progress, onEnter]);

  // Derived animation values based on progress (0 -> 1)
  // Layer 1: Foreground foliage close to camera parts early (0 -> 0.55)
  const fgPart = Math.min(progress / 0.55, 1);
  // Layer 2: Midground branches & leaves part (0.15 -> 0.75)
  const mgPart = Math.min(Math.max((progress - 0.15) / 0.6, 0), 1);
  // Title clarity & discovery focus (0.15 -> 0.85)
  const titleClarity = Math.min(Math.max((progress - 0.15) / 0.7, 0), 1);
  // Open button emergence (0.75 -> 1.0)
  const openVisible = progress >= 0.75;

  return (
    <motion.main
      className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#061219] select-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── SKIP BUTTON (Always available top right) ── */}
      <button
        type="button"
        onClick={onEnter}
        className="absolute right-7 top-7 z-50 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#6B8B9B] transition-colors hover:text-[#A7F3D0]"
      >
        <span>SKIP</span>
        <span>→</span>
      </button>

      {/* ── LAYER 0: ENVIRONMENTAL DAWN ATMOSPHERE (National Geographic Forest Light) ── */}
      {/* Early morning ambient forest base */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_38%,rgba(16,48,56,0.85),#061219_84%)]" />

      {/* Dawn sunlight shafts filtering through canopy gaps */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(165,235,195,0.13)_0%,rgba(90,165,135,0.05)_40%,transparent_70%)]" />

      {/* Atmospheric forest clearing light — expands as the canopy is parted */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: 0.28 + mgPart * 0.42,
          transform: `scale(${0.92 + mgPart * 0.12})`,
          background: "radial-gradient(ellipse 60% 50% at 50% 44%, rgba(85,155,125,0.36), rgba(25,70,55,0.14) 60%, transparent 80%)",
        }}
      />

      {/* Soft drifting morning canopy mist */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-28 bg-[radial-gradient(circle_at_32%_42%,rgba(115,175,150,0.35),transparent_60%)]"
        animate={{ x: [-25, 25, -25], y: [-8, 12, -8] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-22 bg-[radial-gradient(circle_at_68%_52%,rgba(80,140,115,0.38),transparent_65%)]"
        animate={{ x: [20, -20, 20], y: [8, -12, 8] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── LAYER 3: BACKGROUND CANOPY SILHOUETTES ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[68vh] w-full"
        style={{
          transform: `translateY(${-mgPart * 4}%) scale(${1 + mgPart * 0.04})`,
          opacity: 0.52 + mgPart * 0.24,
        }}
      >
        <svg
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          className="h-full w-full opacity-80"
        >
          {/* Deep distant canopy ridgeline */}
          <path
            d="M0 0 L1440 0 L1440 310 Q1410 270 1370 290 Q1310 240 1240 275 Q1170 220 1090 260 Q1020 215 940 250 Q860 195 780 235 Q700 185 620 225 Q540 180 460 220 Q380 190 300 235 Q220 195 140 245 Q70 220 0 280 Z"
            fill="#061922"
          />
          {/* Mid-distance forest crowns with misty depth */}
          <path
            d="M0 0 L1440 0 L1440 240 Q1390 190 1320 215 Q1250 165 1170 195 Q1090 150 1010 180 Q930 135 850 170 Q770 125 690 160 Q610 125 530 165 Q450 135 370 175 Q290 140 210 180 Q130 150 0 210 Z"
            fill="#0B2834"
          />
          {/* Highest ridgeline rim */}
          <path
            d="M0 0 L1440 0 L1440 170 Q1380 130 1300 150 Q1210 110 1130 135 Q1040 95 960 125 Q870 90 790 120 Q700 85 620 115 Q530 90 450 125 Q360 100 280 130 Q190 105 0 155 Z"
            fill="#103542"
          />
        </svg>
      </motion.div>

      {/* ── THE DISCOVERED TITLE: AARANYA SENTINEL (Clear & Legible) ── */}
      <div
        className="relative z-20 flex max-w-4xl flex-col items-center px-6 text-center transition-all duration-700"
        style={{
          opacity: Math.max(0.42, titleClarity),
          filter: `blur(${(1 - titleClarity) * 7}px)`,
          transform: `scale(${0.95 + titleClarity * 0.05})`,
        }}
      >
        {/* Living sentinel beacon pulse */}
        <div className="relative mb-5 flex items-center justify-center">
          <motion.div
            className="absolute size-16 rounded-full border border-[#5F8F7B]/50"
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          />
          <div className="size-3 rounded-full bg-[#8FE3BD] shadow-[0_0_24px_rgba(143,227,189,0.95)]" />
        </div>

        {/* The Largest Visual Element: AARANYA SENTINEL */}
        <h1
          className="font-bold leading-[0.88] tracking-[-0.04em] text-[#F8FCFA] drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]"
          style={{ fontSize: "clamp(3.8rem, 13vw, 9.5rem)" }}
        >
          Aaranya
          <br />
          <span className="bg-gradient-to-r from-[#A7F3D0] via-[#8FE3BD] to-[#6EB396] bg-clip-text text-transparent">
            Sentinel
          </span>
        </h1>

        {/* India Forest Rights Intelligence */}
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.36em] text-[#9DE3BE] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          India Forest Rights Intelligence
        </p>

        <p className="mt-3 max-w-md text-xs leading-relaxed text-[#A3C0C8] sm:text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          A living spatial intelligence platform tracking a decade of forest rights, claims, and ecological threats across India.
        </p>

        {/* ── THE "OPEN" ACTION (Revealed clearly upon title discovery) ── */}
        <div className="mt-10 h-14 flex items-center justify-center">
          {openVisible && (
            <motion.button
              type="button"
              onClick={onEnter}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex items-center gap-3.5 overflow-hidden rounded-full border border-[#8FE3BD]/80 bg-[#0B2530]/95 px-10 py-4 text-[12px] font-semibold uppercase tracking-[0.28em] text-[#C7F3DE] shadow-[0_0_40px_rgba(95,143,123,0.45)] backdrop-blur-md transition-all duration-300 hover:border-[#A7F3D0] hover:bg-[#113845] hover:text-[#FFFFFF] hover:shadow-[0_0_55px_rgba(143,227,189,0.7)]"
            >
              <span>OPEN</span>
              <span className="text-base transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </motion.button>
          )}
        </div>
      </div>

      {/* ── LAYER 2: MIDGROUND BRANCHES & BROADLEAVES (Lush form & depth) ── */}
      {/* Left Overhanging Canopy Bough */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-30 h-[84vh] w-[60vw] origin-top-left"
        animate={{ rotate: [-0.4, 0.4, -0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        style={{
          transform: `translate3d(${-mgPart * 64}vw, ${-mgPart * 24}vh, 0) rotate(${-mgPart * 7}deg)`,
          opacity: 1 - mgPart * 0.75,
        }}
      >
        <svg
          viewBox="0 0 850 920"
          className="h-full w-full drop-shadow-[0_25px_45px_rgba(0,0,0,0.8)]"
        >
          {/* Main heavy timber bough */}
          <path
            d="M-50 -40 C180 60 340 180 480 320 C580 420 660 540 730 680 C650 630 520 520 420 420 C310 310 150 180 -50 150 Z"
            fill="#0A222C"
          />
          {/* Upper lit contour of timber */}
          <path
            d="M-50 -40 C180 60 340 180 480 320 C580 420 660 540 730 680"
            stroke="#163A48"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Lateral branching limb reaching toward center */}
          <path
            d="M340 220 C460 235 600 310 740 420 C810 480 840 550 850 610 C780 570 670 500 560 430 C450 360 370 300 320 250 Z"
            fill="#0F2C38"
          />
          {/* Third secondary branchlet */}
          <path
            d="M210 130 C300 170 410 270 480 390 C430 370 350 300 270 230 C220 185 190 160 170 140 Z"
            fill="#0D2732"
          />

          {/* Authentic botanical broadleaf clusters with visible form & veins */}
          {/* Cluster 1 - Terminal canopy cluster */}
          <path
            d="M680 410 C740 370 810 390 840 450 C820 510 750 530 690 500 C650 470 640 430 680 410 Z"
            fill="#15463C"
          />
          <path
            d="M690 415 Q760 445 830 460"
            stroke="#4AA890"
            strokeWidth="1.6"
            fill="none"
          />

          {/* Cluster 2 - Mid-limb ovate leaf pair */}
          <path
            d="M520 300 C580 260 670 280 710 340 C690 390 610 410 550 380 C500 350 490 315 520 300 Z"
            fill="#1C564A"
          />
          <path
            d="M530 305 Q610 335 695 350"
            stroke="#60C0A4"
            strokeWidth="1.6"
            fill="none"
          />

          {/* Cluster 3 - Lower drooping foliage */}
          <path
            d="M600 520 C670 480 760 510 790 580 C760 630 680 650 610 610 C560 575 560 530 600 520 Z"
            fill="#184C41"
          />
          <path
            d="M610 525 Q690 560 775 590"
            stroke="#4AA890"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Cluster 4 - Inward reaching leaf node */}
          <path
            d="M400 370 C470 335 550 360 590 420 C565 470 485 490 425 455 C380 425 375 390 400 370 Z"
            fill="#226859"
          />
          <path
            d="M410 375 Q490 405 575 430"
            stroke="#60C0A4"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Cluster 5 - Background foliage */}
          <path
            d="M280 420 C350 390 430 420 460 480 C435 530 355 550 295 515 C255 485 250 440 280 420 Z"
            fill="#133D35"
          />
        </svg>
      </motion.div>

      {/* Right Overhanging Canopy Bough */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-30 h-[84vh] w-[60vw] origin-top-right"
        animate={{ rotate: [0.4, -0.4, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          transform: `translate3d(${mgPart * 64}vw, ${-mgPart * 24}vh, 0) rotate(${mgPart * 7}deg)`,
          opacity: 1 - mgPart * 0.75,
        }}
      >
        <svg
          viewBox="0 0 850 920"
          className="h-full w-full drop-shadow-[0_25px_45px_rgba(0,0,0,0.8)]"
        >
          {/* Main heavy timber bough right */}
          <path
            d="M900 -40 C670 60 510 180 370 320 C270 420 190 540 120 680 C200 630 330 520 430 420 C540 310 700 180 900 150 Z"
            fill="#0A222C"
          />
          {/* Upper lit contour of timber right */}
          <path
            d="M900 -40 C670 60 510 180 370 320 C270 420 190 540 120 680"
            stroke="#163A48"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Lateral branching limb reaching inward */}
          <path
            d="M510 220 C390 235 250 310 110 420 C40 480 10 550 0 610 C70 570 180 500 290 430 C400 360 480 300 530 250 Z"
            fill="#0F2C38"
          />
          {/* Secondary branchlet right */}
          <path
            d="M640 130 C550 170 440 270 370 390 C420 370 500 300 580 230 C630 185 660 160 680 140 Z"
            fill="#0D2732"
          />

          {/* Botanical broadleaf clusters right */}
          {/* Cluster 1 - Terminal inward cluster */}
          <path
            d="M170 410 C110 370 40 390 10 450 C30 510 100 530 160 500 C200 470 210 430 170 410 Z"
            fill="#15463C"
          />
          <path
            d="M160 415 Q90 445 20 460"
            stroke="#4AA890"
            strokeWidth="1.6"
            fill="none"
          />

          {/* Cluster 2 - Mid-limb foliage pair */}
          <path
            d="M330 300 C270 260 180 280 140 340 C160 390 240 410 300 380 C350 350 360 315 330 300 Z"
            fill="#1C564A"
          />
          <path
            d="M320 305 Q240 335 155 350"
            stroke="#60C0A4"
            strokeWidth="1.6"
            fill="none"
          />

          {/* Cluster 3 - Lower foliage */}
          <path
            d="M250 520 C180 480 90 510 60 580 C90 630 170 650 240 610 C290 575 290 530 250 520 Z"
            fill="#184C41"
          />
          <path
            d="M240 525 Q160 560 75 590"
            stroke="#4AA890"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Cluster 4 - Upper mid cluster */}
          <path
            d="M450 370 C380 335 300 360 260 420 C285 470 365 490 425 455 C470 425 475 390 450 370 Z"
            fill="#226859"
          />
          <path
            d="M440 375 Q360 405 275 430"
            stroke="#60C0A4"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Cluster 5 - Background foliage */}
          <path
            d="M570 420 C500 390 420 420 390 480 C415 530 495 550 555 515 C595 485 600 440 570 420 Z"
            fill="#133D35"
          />
        </svg>
      </motion.div>

      {/* ── LAYER 1: FOREGROUND FOLIAGE CLOSE TO CAMERA (Crisp botanical depth) ── */}
      {/* Left Foreground Foliage */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-40 h-[56vh] w-[48vw] origin-bottom-left"
        animate={{ rotate: [-0.5, 0.5, -0.5] }}
        transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          transform: `translate3d(${-fgPart * 68}vw, ${fgPart * 20}vh, 0) scale(${1 + fgPart * 0.28})`,
          opacity: 1 - fgPart * 0.85,
          filter: `blur(${1.2 + fgPart * 12}px)`,
        }}
      >
        <svg
          viewBox="0 0 760 780"
          className="h-full w-full drop-shadow-[0_-25px_50px_rgba(0,0,0,0.85)]"
        >
          {/* Main arching fern rachis (stem) */}
          <path
            d="M-40 820 Q160 620 380 430 Q510 320 640 240 Q530 350 370 510 Q180 690 -40 820 Z"
            fill="#0A2924"
          />

          {/* Alternating pinnate leaflets along the arching frond */}
          {/* Leaflet pair 1 */}
          <path d="M120 660 Q210 590 280 570 Q220 640 135 680 Z" fill="#104035" />
          <path d="M150 630 Q100 560 60 520 Q110 590 170 645 Z" fill="#0C342B" />

          {/* Leaflet pair 2 */}
          <path d="M220 570 Q320 490 400 465 Q330 540 235 590 Z" fill="#165245" />
          <path d="M250 540 Q180 460 130 420 Q190 495 270 550 Z" fill="#114237" />

          {/* Leaflet pair 3 */}
          <path d="M320 470 Q430 390 510 360 Q440 435 340 490 Z" fill="#1E6555" />
          <path d="M350 440 Q270 360 210 320 Q280 395 370 450 Z" fill="#154E42" />

          {/* Leaflet pair 4 (Terminal frond crown) */}
          <path d="M430 370 Q540 290 630 250 Q560 330 450 390 Z" fill="#267A67" />
          <path d="M460 340 Q380 260 310 210 Q390 290 480 350 Z" fill="#19594B" />

          {/* Broad understory elephant-ear frond rising from ground */}
          <path
            d="M-50 820 Q120 610 260 510 Q390 420 520 410 Q410 520 290 620 Q120 730 -50 820 Z"
            fill="#12483C"
          />
          {/* Central midrib of broadleaf */}
          <path
            d="M-30 800 Q150 630 380 460 Q460 430 510 415"
            stroke="#4CB296"
            strokeWidth="2"
            fill="none"
          />
          {/* Secondary curved veins */}
          <path d="M110 680 Q180 630 240 640" stroke="#328872" strokeWidth="1.2" fill="none" />
          <path d="M190 600 Q280 540 340 560" stroke="#328872" strokeWidth="1.2" fill="none" />
          <path d="M280 520 Q370 460 430 480" stroke="#328872" strokeWidth="1.2" fill="none" />

          {/* Contact shadow undergrowth at ground level */}
          <path
            d="M-60 840 L380 840 Q250 680 90 650 Q-20 680 -60 840 Z"
            fill="#061A16"
          />
        </svg>
      </motion.div>

      {/* Right Foreground Foliage */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-40 h-[56vh] w-[48vw] origin-bottom-right"
        animate={{ rotate: [0.5, -0.5, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          transform: `translate3d(${fgPart * 68}vw, ${fgPart * 20}vh, 0) scale(${1 + fgPart * 0.28})`,
          opacity: 1 - fgPart * 0.85,
          filter: `blur(${1.2 + fgPart * 12}px)`,
        }}
      >
        <svg
          viewBox="0 0 760 780"
          className="h-full w-full drop-shadow-[0_-25px_50px_rgba(0,0,0,0.85)]"
        >
          {/* Main arching fern rachis right */}
          <path
            d="M800 820 Q600 620 380 430 Q250 320 120 240 Q230 350 390 510 Q580 690 800 820 Z"
            fill="#0A2924"
          />

          {/* Leaflets right */}
          {/* Leaflet pair 1 */}
          <path d="M640 660 Q550 590 480 570 Q540 640 625 680 Z" fill="#104035" />
          <path d="M610 630 Q660 560 700 520 Q650 590 590 645 Z" fill="#0C342B" />

          {/* Leaflet pair 2 */}
          <path d="M540 570 Q440 490 360 465 Q430 540 525 590 Z" fill="#165245" />
          <path d="M510 540 Q580 460 630 420 Q570 495 490 550 Z" fill="#114237" />

          {/* Leaflet pair 3 */}
          <path d="M440 470 Q330 390 250 360 Q320 435 420 490 Z" fill="#1E6555" />
          <path d="M410 440 Q490 360 550 320 Q480 395 390 450 Z" fill="#154E42" />

          {/* Leaflet pair 4 */}
          <path d="M330 370 Q220 290 130 250 Q200 330 310 390 Z" fill="#267A67" />
          <path d="M300 340 Q380 260 450 210 Q370 290 280 350 Z" fill="#19594B" />

          {/* Broad understory elephant-ear frond right */}
          <path
            d="M810 820 Q640 610 500 510 Q370 420 240 410 Q350 520 470 620 Q640 730 810 820 Z"
            fill="#12483C"
          />
          {/* Central midrib right */}
          <path
            d="M790 800 Q610 630 380 460 Q300 430 250 415"
            stroke="#4CB296"
            strokeWidth="2"
            fill="none"
          />
          {/* Secondary curved veins */}
          <path d="M650 680 Q580 630 520 640" stroke="#328872" strokeWidth="1.2" fill="none" />
          <path d="M570 600 Q480 540 420 560" stroke="#328872" strokeWidth="1.2" fill="none" />
          <path d="M480 520 Q390 460 330 480" stroke="#328872" strokeWidth="1.2" fill="none" />

          {/* Contact shadow undergrowth */}
          <path
            d="M820 840 L380 840 Q510 680 670 650 Q780 680 820 840 Z"
            fill="#061A16"
          />
        </svg>
      </motion.div>

      {/* ── SUBTLE AMBIENT LEAF DRIFT ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[22vw] top-[14vh] z-30 opacity-35"
        animate={{
          x: [0, 45, 80, 120],
          y: [0, 110, 240, 380],
          rotate: [0, 25, -15, 35],
        }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 40 40" className="size-6 text-[#8FE3BD]">
          <path
            d="M6 34 C12 24 22 14 34 6 C32 18 24 28 14 32 C10 34 8 34 6 34 Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          <path
            d="M6 34 Q20 20 34 6"
            stroke="#C7F3DE"
            strokeWidth="0.8"
            strokeOpacity="0.75"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* ── DISCOVERY GUIDANCE PROMPT (Disappears once user starts scrolling) ── */}
      {progress < 0.28 && (
        <motion.div
          className="pointer-events-none absolute bottom-8 z-50 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#8FE3BD]">
            SCROLL TO PART THE CANOPY
          </span>
          <svg className="size-4 text-[#8FE3BD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 10l5 5 5-5" />
          </svg>
        </motion.div>
      )}
    </motion.main>
  );
}
