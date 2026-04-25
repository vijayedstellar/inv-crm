import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { contacts, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
  let rows: { contact: typeof contacts.$inferSelect; account: typeof accounts.$inferSelect | null }[] = [];
  try {
    const result = await db
      .select({ contact: contacts, account: accounts })
      .from(contacts)
      .leftJoin(accounts, eq(contacts.accountId, accounts.id))
      .limit(100);
    rows = result;
  } catch {}

  return (
    <PageShell title="Contacts" subtitle={`${rows.length} contact(s)`}>
      <table className="w-full text-sm">
        <thead className="text-left text-ink-3 text-xs uppercase border-b border-line">
          <tr>
            <th className="pb-2">Name</th>
            <th>Title</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ contact: c, account: a }) => (
            <tr key={c.id} className="border-b border-line hover:bg-surface">
              <td className="py-2 font-medium">{c.firstName} {c.lastName}</td>
              <td className="text-ink-2">{c.title ?? "—"}</td>
              <td className="text-ink-2">{c.email ?? "—"}</td>
              <td className="text-ink-2">{c.phone ?? "—"}</td>
              <td className="text-ink-2">{a?.name ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
