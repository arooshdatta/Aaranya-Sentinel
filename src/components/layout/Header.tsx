"use client";

export function Header() {
  return (
    <header className="relative z-30 border-b border-white/[0.08] bg-[#090f19]/92 backdrop-blur-xl">
      <div className="flex min-h-[4.25rem] items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-3.5">
          <span aria-hidden="true" className="relative grid size-8 shrink-0 place-items-center rounded-full border border-[#5F8F7B]/40 bg-[#5F8F7B]/10">
            <span className="size-1.5 rounded-full bg-[#7EA38F]" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-[-0.035em] text-[#E2E8F0]">Aaranya Sentinel</p>
            <p className="mt-0.5 hidden truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-[#64748B] sm:block">India forest rights archive</p>
          </div>
        </div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">Spatial exploration</p>
      </div>
    </header>
  );
}
