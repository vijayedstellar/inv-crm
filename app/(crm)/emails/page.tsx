import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { emails, contacts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
  let rows: { email: typeof emails.$inferSelect; contact: typeof contacts.$inferSelect | null }[] = [];
  try {
    const result = await db
      .select({ email: emails, contact: contacts })
      .from(emails)
      .leftJoin(contacts, eq(emails.contactId, contacts.id))
      .limit(100);
    rows = result;
  } catch {}

  return (
    <PageShell title="Emails" subtitle={`${rows.length} email(s)`}>
      <div className="space-y-3">
        {rows.map(({ email: e, contact: c }) => (
          <div key={e.id} className="border border-line rounded-lg p-4 hover:bg-surface">
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium text-navy">{e.subject}</div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded font-mono ${e.direction === "inbound" ? "bg-blue-50 text-blue-700" : "bg-surface-2 text-ink-2"}`}>
                {e.direction}
              </span>
            </div>
            <div className="text-xs text-ink-3 mb-2">
              {c ? `${c.firstName} ${c.lastName}` : "Unknown"} · {new Date(e.sentAt).toLocaleDateString("en-GB")}
            </div>
            <div className="text-sm text-ink-2 line-clamp-2">{e.body}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
