import { PageShell } from "@/components/page-shell";
export default function Page() {
  return (
    <PageShell title="Migration" subtitle="Import data from CSV/Excel or other CRMs.">
      <div className="border-2 border-dashed border-line rounded-lg p-10 text-center text-ink-3">
        Drop a CSV/Excel here, or wire up <code>POST /api/migration</code>.
      </div>
    </PageShell>
  );
}
