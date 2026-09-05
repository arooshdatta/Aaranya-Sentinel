"use client";

export function Header() {
  return (
    <header className="relative z-30 flex-shrink-0 border-b border-white/[0.06] bg-[#060E1A]/96 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-5 sm:px-8">
        {/* Product identity — the strongest element in the header */}
        <div className="flex items-center gap-3">
          <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-[#5F8F7B]/30 bg-[#5F8F7B]/8">
            <span className="size-1.5 rounded-full bg-[#7EA38F] shadow-[0_0_6px_rgba(126,163,143,0.7)]" />
            {/* Living pulse */}
            <span className="absolute inset-0 animate-ping rounded-full border border-[#7EA38F]/15" />
          </span>
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.03em] text-[#DDE8E2] sm:text-base">
              Aaranya Sentinel
            </p>
            <p className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-[#2E4A5A] sm:block">
              Forest Rights Intelligence
            </p>
          </div>
        </div>

        {/* Admin Portal — clearly separated from the exploration experience */}
        <a
          href="/admin"
          onClick={e => e.preventDefault()}
          className="group flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#243A4A] transition-colors hover:text-[#4A7A6A]"
          title="Administration portal — separate from exploration"
        >
          <span>Admin Portal</span>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true" className="opacity-40 group-hover:opacity-70">
            <path d="M1 7L7 1M7 1H3M7 1V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  );
}
