import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";

export default async function Page() {
  let rows: typeof contacts.$inferSelect[] = [];
  try {
    rows = await db.select().from(contacts).limit(50);
  } catch {
    // DATABASE_URL not configured yet
  }
  return (
    <PageShell title="Contacts" subtitle={`${rows.length} contact(s) loaded from Postgres.`}>
      {rows.length === 0 ? (
        <p className="text-ink-3 text-sm">
          No contacts yet. POST to <code>/api/contacts</code> or run <code>npm run db:push</code>.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-ink-3 text-xs uppercase">
            <tr>
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="py-2">
                  {c.firstName} {c.lastName}
                </td>
                <td>{c.email}</td>
                <td>{c.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageShell>
  );
}
