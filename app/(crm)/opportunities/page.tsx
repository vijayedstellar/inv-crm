import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { opportunities, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
  let rows: { opp: typeof opportunities.$inferSelect; account: typeof accounts.$inferSelect | null }[] = [];
  try {
    const result = await db
      .select({ opp: opportunities, account: accounts })
      .from(opportunities)
      .leftJoin(accounts, eq(opportunities.accountId, accounts.id));
    rows = result;
  } catch {}

  return (
    <PageShell title="Opportunities" subtitle={`${rows.length} deal(s) in flight`}>
      <table className="w-full text-sm">
        <thead className="text-left text-ink-3 text-xs uppercase border-b border-line">
          <tr>
            <th className="pb-2">Deal</th>
            <th>Account</th>
            <th>Stage</th>
            <th>Probability</th>
            <th>Close Date</th>
            <th className="text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ opp: o, account: a }) => (
            <tr key={o.id} className="border-b border-line hover:bg-surface">
              <td className="py-2 font-medium">{o.name}</td>
              <td className="text-ink-2">{a?.name ?? "—"}</td>
              <td className="text-ink-2 capitalize">{o.stage}</td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-surface-2 rounded-full h-1.5">
                    <div className="bg-accent h-1.5 rounded-full" style={{ width: `${o.probability}%` }} />
                  </div>
                  <span className="text-ink-3 text-xs">{o.probability}%</span>
                </div>
              </td>
              <td className="text-ink-2">
                {o.closeDate ? new Date(o.closeDate).toLocaleDateString("en-GB") : "—"}
              </td>
              <td className="text-right font-medium">
                {o.amount ? `£${Number(o.amount).toLocaleString()}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
