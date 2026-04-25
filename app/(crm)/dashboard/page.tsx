import { PageShell } from "@/components/page-shell";

export default function Page() {
  const kpis = [
    { label: "Pipeline Value", value: "£2.4M", delta: "+12%" },
    { label: "Open Opportunities", value: "18", delta: "+3" },
    { label: "Renewals Due (30d)", value: "7", delta: "£480k" },
    { label: "Win Rate", value: "32%", delta: "+4pp" },
  ];
  return (
    <PageShell title="Dashboard" subtitle="Real-time view of your sales motion.">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="border border-line rounded-lg p-4">
            <div className="text-[11px] uppercase tracking-wide text-ink-3 font-mono">{k.label}</div>
            <div className="font-display text-2xl text-navy mt-1">{k.value}</div>
            <div className="text-xs text-teal mt-1">{k.delta}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
