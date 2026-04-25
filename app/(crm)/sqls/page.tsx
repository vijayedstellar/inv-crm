"use client";
import { useState } from "react";

const SQLS = [
  { name: "Sarah Mitchell", source: "Course Page", course: "ITIL® Foundation", score: 61, last: "28 hrs ago", assigned: "M. Khan", status: "cooling" },
  { name: "Raj Patel", source: "Course Page", course: "PRINCE2®", score: 88, last: "4 hrs ago", assigned: "S. Jones", status: "hot" },
  { name: "David Chen", source: "Inbound Call", course: "PMP®", score: 74, last: "1 day ago", assigned: "A. Patel", status: "active" },
  { name: "Marcus Webb", source: "Paid Ad", course: "CAPM®", score: 54, last: "2 days ago", assigned: "R. Lee", status: "cooling" },
  { name: "Priya Nair", source: "Course Page", course: "AgilePM®", score: 82, last: "2 hrs ago", assigned: "S. Jones", status: "hot" },
  { name: "James Torres", source: "Referral", course: "AgilePM®", score: 95, last: "30 min ago", assigned: "S. Jones", status: "hot" },
];

function scoreClass(s: number) { return s >= 80 ? "sc-hot" : s >= 60 ? "sc-blue" : s >= 40 ? "sc-warm" : "sc-cold"; }
const STATUS_MAP: Record<string, string> = {
  hot: '<span style="color:var(--green);font-weight:600">🟢 Hot</span>',
  active: '<span style="color:var(--blue);font-weight:600">🔵 Active</span>',
  cooling: '<span style="color:var(--red);font-weight:600">🔴 Cooling</span>',
};

export default function SQLsPage() {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };
  const filtered = SQLS.filter((s) => !search || `${s.name} ${s.course} ${s.source}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="content-pad">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <div className="stat-card"><div className="stat-label">Total SQLs</div><div className="stat-value">31</div><div className="stat-sub">↓ 3% vs last month</div></div>
        <div className="stat-card"><div className="stat-label">Contacted Today</div><div className="stat-value" style={{ color: "var(--green)" }}>14</div><div className="stat-sub">45% same-day contact rate</div></div>
        <div className="stat-card"><div className="stat-label">Cooling (24h+)</div><div className="stat-value" style={{ color: "var(--red)" }}>5</div><div className="stat-sub">Needs urgent attention</div></div>
        <div className="stat-card"><div className="stat-label">Avg Response Time</div><div className="stat-value">1.8h</div><div className="stat-sub">Target: under 2 hours</div></div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="filter-bar" style={{ flex: 1 }}>
          <input className="filter-input" placeholder="🔍 Search SQLs..." style={{ width: 220 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="filter-input"><option>All</option><option>🔥 Very Hot (80+)</option><option>🔵 Hot (60–79)</option><option>🟡 Warm (40–59)</option><option>🔴 Cooling</option></select>
          <select className="filter-input"><option>All Reps</option><option>Sarah Jones</option><option>Michael Khan</option><option>Aisha Patel</option><option>Ryan Lee</option></select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Source</th><th>Course</th><th>AI Score</th><th>Last Activity</th><th>Assigned To</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.name}>
                <td className="td-name">{s.name}</td>
                <td style={{ color: "var(--text-3)" }}>{s.source}</td>
                <td>{s.course}</td>
                <td><span className={`score-badge ${scoreClass(s.score)}`}>{s.score}</span></td>
                <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: s.last.includes("day") || s.last.includes("28") ? "var(--amber)" : "var(--text-3)" }}>{s.last}</td>
                <td style={{ color: "var(--text-3)" }}>{s.assigned}</td>
                <td dangerouslySetInnerHTML={{ __html: STATUS_MAP[s.status] ?? "" }} />
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => showToast(`📞 Calling ${s.name}...`)}>Call</button>
                    <button className="btn btn-primary btn-sm" onClick={() => showToast(`✅ ${s.name} promoted to Opportunity!`)}>→ Opp</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
