import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { leads, contacts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const STAGE_COLORS: Record<string, string> = {
  lead: "bg-surface-2 text-ink-2",
  mql: "bg-blue-50 text-blue-700",
  sql: "bg-purple-50 text-purple-700",
  opportunity: "bg-amber-50 text-amber-700",
  won: "bg-green-50 text-green-700",
  lost: "bg-red-50 text-red-700",
};

export default async function Page() {
  let rows: { lead: typeof leads.$inferSelect; contact: typeof contacts.$inferSelect | null }[] = [];
  try {
    const result = await db
      .select({ lead: leads, contact: contacts })
      .from(leads)
      .leftJoin(contacts, eq(leads.contactId, contacts.id))
      .limit(100);
    rows = result;
  } catch {}

  return (
    <PageShell title="Leads" subtitle={`${rows.length} lead(s)`}>
      <table className="w-full text-sm">
        <thead className="text-left text-ink-3 text-xs uppercase border-b border-line">
          <tr>
            <th className="pb-2">Contact</th>
            <th>Source</th>
            <th>Stage</th>
            <th>Score</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ lead: l, contact: c }) => (
            <tr key={l.id} className="border-b border-line hover:bg-surface">
              <td className="py-2 font-medium">{c ? `${c.firstName} ${c.lastName}` : "—"}</td>
              <td className="text-ink-2">{l.source ?? "—"}</td>
              <td>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded font-mono uppercase ${STAGE_COLORS[l.stage] ?? ""}`}>
                  {l.stage}
                </span>
              </td>
              <td className="text-ink-2">{l.score}</td>
              <td className="text-ink-2 max-w-xs truncate">{l.notes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
