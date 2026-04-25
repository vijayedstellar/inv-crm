"use client";
import { useState, useEffect } from "react";

type Contact = {
  id: string; firstName: string; lastName: string | null;
  email: string | null; source: string | null; courseInterest: string | null;
  score: number | null; stage: string | null; owner: string | null;
  lastActivityAt: string | null; accountName: string | null;
};

function scoreClass(s: number) {
  return s >= 80 ? "sc-hot" : s >= 60 ? "sc-blue" : s >= 40 ? "sc-warm" : "sc-cold";
}
function pillClass(stage: string) {
  const m: Record<string, string> = { contact: "pill-contact", lead: "pill-lead", mql: "pill-mql", sql: "pill-sql", opportunity: "pill-opp", won: "pill-won", lost: "pill-lost" };
  return m[stage] || "pill-contact";
}
function timeAgo(dateStr: string | null) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ContactsPage() {
  const [rows, setRows] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/contacts?limit=100")
      .then((r) => r.json())
      .then((d) => setRows(d.data || d))
      .catch(() => {});
  }, []);

  const filtered = rows.filter((c) => {
    const q = search.toLowerCase();
    return !q || `${c.firstName} ${c.lastName} ${c.email} ${c.courseInterest} ${c.source}`.toLowerCase().includes(q);
  });

  const STATIC: Contact[] = [
    { id: "1", firstName: "Sarah", lastName: "Mitchell", email: "s.mitchell@email.com", source: "Blog", courseInterest: "ITIL® Foundation", score: 41, stage: "contact", owner: "M. Khan", lastActivityAt: new Date(Date.now() - 3 * 86400000).toISOString(), accountName: null },
    { id: "2", firstName: "Tom", lastName: "Bradley", email: "t.bradley@email.com", source: "Social", courseInterest: "PMP®", score: 38, stage: "contact", owner: "S. Jones", lastActivityAt: new Date(Date.now() - 7 * 86400000).toISOString(), accountName: null },
    { id: "3", firstName: "Priya", lastName: "Nair", email: "p.nair@email.com", source: "Blog", courseInterest: "AgilePM®", score: 44, stage: "contact", owner: "A. Patel", lastActivityAt: new Date(Date.now() - 2 * 86400000).toISOString(), accountName: null },
    { id: "4", firstName: "Raj", lastName: "Patel", email: "raj.patel@example.com", source: "Course Page", courseInterest: "PRINCE2®", score: 88, stage: "sql", owner: "S. Jones", lastActivityAt: new Date(Date.now() - 4 * 3600000).toISOString(), accountName: null },
    { id: "5", firstName: "David", lastName: "Chen", email: "david.chen@example.com", source: "Inbound Call", courseInterest: "PMP®", score: 74, stage: "sql", owner: "A. Patel", lastActivityAt: new Date(Date.now() - 24 * 3600000).toISOString(), accountName: null },
    { id: "6", firstName: "Emma", lastName: "Johnson", email: "e.johnson@email.com", source: "Brochure Download", courseInterest: "PRINCE2 Agile®", score: 91, stage: "mql", owner: "M. Khan", lastActivityAt: new Date(Date.now() - 1 * 86400000).toISOString(), accountName: null },
    { id: "7", firstName: "Maria", lastName: "Santos", email: "m.santos@globaltech.com", source: "Referral", courseInterest: "ITIL® Foundation", score: 86, stage: "opportunity", owner: "A. Patel", lastActivityAt: new Date(Date.now() - 5 * 3600000).toISOString(), accountName: "GlobalTech" },
    { id: "8", firstName: "James", lastName: "Torres", email: "j.torres@example.com", source: "Referral", courseInterest: "AgilePM®", score: 95, stage: "sql", owner: "S. Jones", lastActivityAt: new Date(Date.now() - 30 * 60000).toISOString(), accountName: null },
  ];

  const display = filtered.length > 0 ? filtered : STATIC.filter((c) => {
    const q = search.toLowerCase();
    return !q || `${c.firstName} ${c.lastName} ${c.email} ${c.courseInterest} ${c.source}`.toLowerCase().includes(q);
  });

  return (
    <div className="content-pad">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="filter-bar" style={{ flex: 1 }}>
          <input className="filter-input" placeholder="🔍 Search contacts..." style={{ width: 220 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="filter-input"><option>All Sources</option><option>Website Form</option><option>Inbound Call</option><option>Social</option><option>Blog</option><option>Referral</option></select>
          <select className="filter-input"><option>All Courses</option><option>ITIL® Foundation</option><option>PMP®</option><option>PRINCE2®</option><option>AgilePM®</option></select>
        </div>
        <button className="btn btn-primary btn-sm">+ Add Contact</button>
        <button className="btn btn-ghost btn-sm">↓ Export</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Source</th><th>Course Interest</th>
              <th>Stage</th><th>AI Score</th><th>Owner</th><th>Last Activity</th><th></th>
            </tr>
          </thead>
          <tbody>
            {display.map((c) => (
              <tr key={c.id}>
                <td className="td-name">{c.firstName} {c.lastName}</td>
                <td>{c.email}</td>
                <td style={{ color: "var(--text-3)" }}>{c.source ?? "—"}</td>
                <td>{c.courseInterest ?? "—"}</td>
                <td><span className={`pill ${pillClass(c.stage ?? "contact")}`}>{(c.stage ?? "contact").toUpperCase()}</span></td>
                <td><span className={`score-badge ${scoreClass(c.score ?? 0)}`}>{c.score ?? 0}</span></td>
                <td style={{ color: "var(--text-3)" }}>{c.owner ?? "—"}</td>
                <td style={{ color: "var(--text-3)", fontFamily: "'DM Mono',monospace", fontSize: 11 }}>{timeAgo(c.lastActivityAt)}</td>
                <td><button className="btn btn-ghost btn-sm">+ Task</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
