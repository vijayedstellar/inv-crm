import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { revenueEntries, accounts } from "@/lib/db/schema";
import { eq, sum } from "drizzle-orm";

export default async function Page() {
  let rows: { entry: typeof revenueEntries.$inferSelect; account: typeof accounts.$inferSelect | null }[] = [];
  let total = 0;
  try {
    const result = await db
      .select({ entry: revenueEntries, account: accounts })
      .from(revenueEntries)
      .leftJoin(accounts, eq(revenueEntries.accountId, accounts.id))
      .limit(100);
    rows = result;
    const [t] = await db.select({ total: sum(revenueEntries.amount) }).from(revenueEntries);
    total = Number(t.total ?? 0);
  } catch {}

  return (
    <PageShell title="Revenue" subtitle={`Total recognized: £${total.toLocaleString()}`}>
      <table className="w-full text-sm">
        <thead className="text-left text-ink-3 text-xs uppercase border-b border-line">
          <tr>
            <th className="pb-2">Account</th>
            <th>Source</th>
            <th>Date</th>
            <th>Currency</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ entry: r, account: a }) => (
            <tr key={r.id} className="border-b border-line hover:bg-surface">
              <td className="py-2 font-medium">{a?.name ?? "—"}</td>
              <td className="text-ink-2">{r.source ?? "—"}</td>
              <td className="text-ink-2">{new Date(r.recognizedOn).toLocaleDateString("en-GB")}</td>
              <td className="text-ink-2">{r.currency}</td>
              <td className="text-right font-medium">£{Number(r.amount).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
