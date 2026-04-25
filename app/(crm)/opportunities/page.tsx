"use client";
import { useState } from "react";

const OPPS = [
  { name: "Raj Patel — PRINCE2® Foundation", type: "B2C", stage: "Negotiation", course: "PRINCE2®", value: "£2,200", close: "Apr 30", prob: 88, owner: "S. Jones" },
  { name: "David Chen — PMP®", type: "B2C", stage: "Negotiation", course: "PMP®", value: "£3,800", close: "May 5", prob: 79, owner: "A. Patel" },
  { name: "James Torres — AgilePM®", type: "B2C", stage: "Verbal", course: "AgilePM®", value: "£3,200", close: "Apr 28", prob: 95, owner: "S. Jones" },
  { name: "Nexus Corp — PMP® 5 seats", type: "B2B", stage: "Proposal Sent", course: "PMP®", value: "£28,000", close: "May 28", prob: 74, owner: "M. Khan" },
  { name: "TechFlow Ltd — PRINCE2® 8 seats", type: "B2B", stage: "Proposal Sent", course: "PRINCE2®", value: "£17,600", close: "Jun 2", prob: 81, owner: "M. Khan" },
  { name: "GlobalTech — ITIL® 12 seats", type: "B2B", stage: "Negotiation", course: "ITIL®", value: "£38,400", close: "May 15", prob: 86, owner: "A. Patel" },
];

function probColor(p: number) { return p >= 80 ? "var(--green)" : p >= 70 ? "var(--accent)" : "var(--amber)"; }

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };
  const filtered = OPPS.filter((o) => !search || `${o.name} ${o.course} ${o.stage}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="content-pad">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <div className="stat-card"><div className="stat-label">Open Value</div><div className="stat-value">£312k</div><div className="stat-sub">18 active opportunities</div></div>
        <div className="stat-card"><div className="stat-label">Won This Month</div><div className="stat-value" style={{ color: "var(--green)" }}>£124k</div><div className="stat-sub">11 deals closed</div></div>
        <div className="stat-card"><div className="stat-label">Avg Deal Size</div><div className="stat-value">£17.3k</div><div className="stat-sub">↑ 8% vs last month</div></div>
        <div className="stat-card"><div className="stat-label">Win Rate</div><div className="stat-value" style={{ color: "var(--accent)" }}>61%</div><div className="stat-sub">Industry avg: 47%</div></div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="filter-bar" style={{ flex: 1 }}>
          <input className="filter-input" placeholder="🔍 Search opportunities..." style={{ width: 220 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="filter-input"><option>All Stages</option><option>Discovery</option><option>Proposal Sent</option><option>Negotiation</option><option>Verbal</option></select>
          <select className="filter-input"><option>All Types</option><option>B2C</option><option>B2B</option></select>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => showToast("📊 Exporting opportunities...")}>↓ Export</button>
      </div>
      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th>Deal Name</th><th>Type</th><th>Stage</th><th>Course</th><th>Value</th><th>Close Date</th><th>AI Prob.</th><th>Owner</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.name}>
                  <td className="td-name">{o.name}</td>
                  <td><span className="badge" style={{ background: o.type === "B2B" ? "var(--purple-soft)" : "var(--blue-soft)", color: o.type === "B2B" ? "var(--purple)" : "var(--blue)" }}>{o.type}</span></td>
                  <td><span className="pill pill-opp">{o.stage}</span></td>
                  <td>{o.course}</td>
                  <td style={{ fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{o.value}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{o.close}</td>
                  <td><span style={{ color: probColor(o.prob), fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{o.prob}%</span></td>
                  <td style={{ color: "var(--text-3)" }}>{o.owner}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" style={{ borderColor: "var(--accent)", color: "var(--accent)" }} onClick={() => showToast("📄 Opening Quote Builder...")}>📄 Quote</button>
                      <button className="btn btn-ghost btn-sm" style={{ borderColor: "var(--blue)", color: "var(--blue)" }} onClick={() => showToast("📋 Opening Contract Builder...")}>📋 Contract</button>
                      <button className="btn btn-success btn-sm" onClick={() => showToast("🎉 Deal marked Won! LMS + Invoice triggered.")}>Won ✓</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
