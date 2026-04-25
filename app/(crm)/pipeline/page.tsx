"use client";
import { KanbanWidget } from "@/components/dashboard-client";

export default function PipelinePage() {
  return (
    <div style={{ padding: "20px 24px 0", display: "flex", flexDirection: "column", gap: 0, flex: 1, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <div className="filter-bar">
          <input className="filter-input" placeholder="🔍 Search deals..." style={{ width: 200 }} />
          <select className="filter-input"><option>All Reps</option><option>Sarah Jones</option><option>Michael Khan</option><option>Aisha Patel</option><option>Ryan Lee</option></select>
          <select className="filter-input"><option>All Courses</option><option>ITIL® Foundation</option><option>PMP®</option><option>PRINCE2®</option><option>AgilePM®</option></select>
          <select className="filter-input"><option>This Month</option><option>Last Month</option><option>This Quarter</option></select>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}>+ Add Deal</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}>
        <KanbanWidget full />
      </div>
    </div>
  );
}
