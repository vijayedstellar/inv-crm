import { PageShell } from "@/components/page-shell";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";

const STATUS_STYLE: Record<string, string> = {
  open: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  done: "bg-green-50 text-green-700",
  blocked: "bg-red-50 text-red-700",
};

export default async function Page() {
  let rows: typeof tasks.$inferSelect[] = [];
  try { rows = await db.select().from(tasks).limit(100); } catch {}

  return (
    <PageShell title="Tasks" subtitle={`${rows.length} task(s)`}>
      <table className="w-full text-sm">
        <thead className="text-left text-ink-3 text-xs uppercase border-b border-line">
          <tr>
            <th className="pb-2">Title</th>
            <th>Status</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} className="border-b border-line hover:bg-surface">
              <td className="py-2 font-medium">{t.title}</td>
              <td>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded font-mono uppercase ${STATUS_STYLE[t.status] ?? ""}`}>
                  {t.status.replace("_", " ")}
                </span>
              </td>
              <td className="text-ink-2">
                {t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-GB") : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageShell>
  );
}
