"use client";
import { useState } from "react";

const LEADS = [
  { name: "James Park", email: "j.park@email.com", source: "Generic Webinar", course: "Project Mgmt (General)", score: 52, days: 3, owner: "S. Jones" },
  { name: "Anna Fischer", email: "a.fischer@email.com", source: "Guide Download", course: "ITSM (General)", score: 48, days: 5, owner: "M. Khan" },
  { name: "David Wright", email: "d.wright@email.com", source: "Generic Webinar", course: "Agile (General)", score: 55, days: 2, owner: "A. Patel" },
  { name: "Yuki Tanaka", email: "y.tanaka@email.com", source: "Resource Download", course: "IT Governance", score: 43, days: 7, owner: "R. Lee" },
  { name: "Marco Rossi", email: "m.rossi@email.com", source: "Generic Webinar", course: "Quality Mgmt", score: 50, days: 4, owner: "S. Jones" },
  { name: "Tom Bradley", email: "t.bradley@email.com", source: "Social", course: "PMP®", score: 38, days: 9, owner: "S. Jones" },
  { name: "Anna Chen", email: "a.chen@email.com", source: "Blog Download", course: "DevOps Foundation", score: 45, days: 6, owner: "M. Khan" },
];

function scoreClass(s: number) { return s >= 80 ? "sc-hot" : s >= 60 ? "sc-blue" : s >= 40 ? "sc-warm" : "sc-cold"; }

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const filtered = LEADS.filter((l) => !search || `${l.name} ${l.email} ${l.course} ${l.source}`.toLowerCase().includes(search.toLowerCase()));

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  return (
    <div className="content-pad">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="filter-bar" style={{ flex: 1 }}>
          <input className="filter-input" placeholder="🔍 Search leads..." style={{ width: 220 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="filter-input"><option>All Sources</option><option>Generic Webinar</option><option>Guide Download</option><option>Resource Download</option></select>
        </div>
        <button className="btn btn-primary btn-sm">+ Add Lead</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Source</th><th>Course Interest</th><th>AI Score</th><th>Days in Stage</th><th>Owner</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.name}>
                <td className="td-name">{l.name}</td>
                <td>{l.email}</td>
                <td style={{ color: "var(--text-3)" }}>{l.source}</td>
                <td>{l.course}</td>
                <td><span className={`score-badge ${scoreClass(l.score)}`}>{l.score}</span></td>
                <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{l.days}d</td>
                <td style={{ color: "var(--text-3)" }}>{l.owner}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => showToast(`↑ Promoting ${l.name} to MQL...`)}>→ MQL</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
