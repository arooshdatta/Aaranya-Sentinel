export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="flex items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-12 lg:py-7">
        <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
          <div
            aria-hidden="true"
            className="relative grid size-8 shrink-0 place-items-center sm:size-9"
          >
            <span className="absolute inset-0 rounded-full border border-[#14B8A6]/45 bg-[#14B8A6]/5 shadow-[0_0_26px_rgba(20,184,166,0.24)]" />
            <span className="relative size-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_15px_3px_rgba(20,184,166,0.6)]" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-[-0.035em] text-[#E2E8F0] sm:text-lg">
              Aaranya Sentinel
            </p>
            <p className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-[0.16em] text-[#94A3B8] sm:text-[10px]">
              Monitoring Forest Rights Across India
            </p>
          </div>
        </div>
        <nav aria-label="Map context" className="hidden items-center gap-2.5 text-[10px] font-medium tracking-[0.18em] text-[#94A3B8] sm:flex">
          <span className="size-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_12px_#14B8A6]" />
          INDIA · FOREST WATCH
        </nav>
      </div>
    </header>
  );
}
