import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { renewals, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const STATUS_STYLE: Record<string, string> = {
  upcoming: "bg-amber-50 text-amber-700",
  in_negotiation: "bg-blue-50 text-blue-700",
  renewed: "bg-green-50 text-green-700",
  churned: "bg-red-50 text-red-700",
};

export default async function Page() {
  let rows: { renewal: typeof renewals.$inferSelect; account: typeof accounts.$inferSelect | null }[] = [];
  try {
    const result = await db
      .select({ renewal: renewals, account: accounts })
      .from(renewals)
      .leftJoin(accounts, eq(renewals.accountId, accounts.id));
    rows = result;
  } catch {}

  return (
    <PageShell title="Renewals" subtitle={`${rows.length} renewal(s) tracked`}>
      <table className="w-full text-sm">
        <thead className="text-left text-ink-3 text-xs uppercase border-b border-line">
          <tr>
            <th className="pb-2">Account</th>
            <th>Status</th>
            <th>Due Date</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ renewal: r, account: a }) => (
            <tr key={r.id} className="border-b border-line hover:bg-surface">
              <td className="py-2 font-medium">{a?.name ?? "—"}</td>
              <td>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded font-mono uppercase ${STATUS_STYLE[r.status] ?? ""}`}>
                  {r.status.replace("_", " ")}
                </span>
              </td>
              <td className="text-ink-2">
                {r.dueDate ? new Date(r.dueDate).toLocaleDateString("en-GB") : "—"}
              </td>
              <td className="text-right font-medium">
                {r.amount ? `£${Number(r.amount).toLocaleString()}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
