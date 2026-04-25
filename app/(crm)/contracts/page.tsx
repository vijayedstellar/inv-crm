import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { contracts, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
  let rows: { contract: typeof contracts.$inferSelect; account: typeof accounts.$inferSelect | null }[] = [];
  try {
    const result = await db
      .select({ contract: contracts, account: accounts })
      .from(contracts)
      .leftJoin(accounts, eq(contracts.accountId, accounts.id));
    rows = result;
  } catch {}

  return (
    <PageShell title="Contracts" subtitle={`${rows.length} contract(s)`}>
      <table className="w-full text-sm">
        <thead className="text-left text-ink-3 text-xs uppercase border-b border-line">
          <tr>
            <th className="pb-2">Title</th>
            <th>Account</th>
            <th>Start</th>
            <th>End</th>
            <th>Signed</th>
            <th className="text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ contract: c, account: a }) => (
            <tr key={c.id} className="border-b border-line hover:bg-surface">
              <td className="py-2 font-medium">{c.title}</td>
              <td className="text-ink-2">{a?.name ?? "—"}</td>
              <td className="text-ink-2">{c.startDate ? new Date(c.startDate).toLocaleDateString("en-GB") : "—"}</td>
              <td className="text-ink-2">{c.endDate ? new Date(c.endDate).toLocaleDateString("en-GB") : "—"}</td>
              <td>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded font-mono ${c.signed ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                  {c.signed ? "Signed" : "Pending"}
                </span>
              </td>
              <td className="text-right font-medium">
                {c.value ? `£${Number(c.value).toLocaleString()}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
