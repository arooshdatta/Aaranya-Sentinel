export function MetricsBar() {
  return (
    <section
      aria-label="Claim metrics"
      className="border-y border-[#1E293B]/80 bg-[#0F172A]/35 backdrop-blur-sm"
    >
      <dl className="grid grid-cols-2 sm:grid-cols-4">
        <Metric label="Total Claims" value="—" />
        <Metric label="Approved" value="—" tone="text-[#14B8A6]" />
        <Metric label="Pending" value="—" tone="text-[#F59E0B]" />
        <Metric label="Anomalies" value="—" tone="text-[#EF4444]" />
      </dl>
    </section>
  );
}

function Metric({
  label,
  value,
  tone = "text-[#E2E8F0]",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="border-[#1E293B]/70 px-5 py-4 odd:border-r even:border-b sm:px-7 sm:py-5 sm:even:border-b-0 sm:[&:not(:last-child)]:border-r">
      <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#94A3B8]">
        {label}
      </dt>
      <dd className={`mt-1.5 text-xl font-medium tracking-[-0.03em] sm:text-2xl ${tone}`}>
        {value}
      </dd>
    </div>
  );
}
