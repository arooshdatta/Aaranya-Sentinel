"use client";

export const commandSections = ["National", "Claims", "Anomalies", "Evidence"] as const;
export type CommandSection = (typeof commandSections)[number];

interface HeaderProps {
  activeSection: CommandSection;
  onSectionChange: (section: CommandSection) => void;
}

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  return (
    <header className="relative z-30 border-b border-[#1E293B] bg-[#070B14]">
      <div className="flex min-h-[4.5rem] items-center gap-6 px-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-3.5">
          <span aria-hidden="true" className="relative grid size-8 shrink-0 place-items-center rounded-full border border-[#14B8A6]/40 bg-[#14B8A6]/5">
            <span className="size-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_14px_3px_rgba(20,184,166,0.55)]" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-[-0.035em] text-[#E2E8F0]">Aaranya Sentinel</p>
            <p className="mt-0.5 hidden truncate text-[9px] font-medium uppercase tracking-[0.16em] text-[#94A3B8] sm:block">Forest rights investigation platform</p>
          </div>
        </div>
        <nav aria-label="Primary workspace" className="ml-auto flex h-full items-center gap-1 overflow-x-auto">
          {commandSections.map((section) => {
            const active = section === activeSection;

            return (
              <button
                key={section}
                type="button"
                onClick={() => onSectionChange(section)}
                className={"relative h-full px-3 text-xs font-medium transition-colors sm:px-4 " + (active ? "text-[#E2E8F0]" : "text-[#94A3B8] hover:text-[#E2E8F0]")}
              >
                {section}
                {active && <span className="absolute inset-x-3 bottom-0 h-px bg-[#14B8A6] shadow-[0_0_10px_#14B8A6] sm:inset-x-4" />}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
