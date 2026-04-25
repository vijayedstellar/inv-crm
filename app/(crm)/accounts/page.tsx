import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";

export default async function Page() {
  let rows: typeof accounts.$inferSelect[] = [];
  try { rows = await db.select().from(accounts).limit(100); } catch {}

  return (
    <PageShell title="Accounts" subtitle={`${rows.length} account(s)`}>
      <table className="w-full text-sm">
        <thead className="text-left text-ink-3 text-xs uppercase border-b border-line">
          <tr>
            <th className="pb-2">Name</th>
            <th>Domain</th>
            <th>Industry</th>
            <th>Size</th>
            <th className="text-right">ARR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className="border-b border-line hover:bg-surface">
              <td className="py-2 font-medium">{a.name}</td>
              <td className="text-ink-2">{a.domain ?? "—"}</td>
              <td className="text-ink-2">{a.industry ?? "—"}</td>
              <td className="text-ink-2">{a.size ?? "—"}</td>
              <td className="text-right text-ink-2">
                {a.arr ? `£${Number(a.arr).toLocaleString()}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
