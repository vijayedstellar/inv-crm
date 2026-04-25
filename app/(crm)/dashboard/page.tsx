import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { opportunities, renewals, leads } from "@/lib/db/schema";
import { count, sql } from "drizzle-orm";

async function getKPIs() {
  try {
    const [oppCount] = await db.select({ count: count() }).from(opportunities);
    const [renewalCount] = await db.select({ count: count() }).from(renewals);
    const [leadCount] = await db.select({ count: count() }).from(leads);
    const [pipelineVal] = await db
      .select({ total: sql<string>`coalesce(sum(amount),0)` })
      .from(opportunities);
    return {
      pipeline: Number(pipelineVal.total ?? 0),
      opportunities: oppCount.count,
      renewals: renewalCount.count,
      leads: leadCount.count,
    };
  } catch {
    return { pipeline: 0, opportunities: 0, renewals: 0, leads: 0 };
  }
}

export default async function Page() {
  const kpis = await getKPIs();

  const cards = [
    {
      label: "Pipeline Value",
      value: kpis.pipeline > 0 ? `£${(kpis.pipeline / 1000).toFixed(0)}k` : "—",
      sub: "from open opportunities",
    },
    {
      label: "Open Opportunities",
      value: kpis.opportunities.toString() || "0",
      sub: "active deals",
    },
    {
      label: "Renewals Tracked",
      value: kpis.renewals.toString() || "0",
      sub: "in the system",
    },
    {
      label: "Total Leads",
      value: kpis.leads.toString() || "0",
      sub: "across all stages",
    },
  ];

  return (
    <PageShell title="Dashboard" subtitle="Real-time view of your sales motion.">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((k) => (
          <div key={k.label} className="border border-line rounded-lg p-4">
            <div className="text-[11px] uppercase tracking-wide text-ink-3 font-mono">
              {k.label}
            </div>
            <div className="font-display text-2xl text-navy mt-1">{k.value}</div>
            <div className="text-xs text-ink-3 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>
      {kpis.opportunities === 0 && kpis.leads === 0 && (
        <p className="text-ink-3 text-sm mt-4">
          No data yet. Add contacts, leads, and opportunities via the API or the module pages.
        </p>
      )}
    </PageShell>
  );
}
