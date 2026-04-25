"use client";
import { useState, useEffect } from "react";

type Mql = { id?: string; name: string; email: string; content: string; course: string; score: number; criteria: string; owner: string; };

const INIT_MQLS: Mql[] = [
  { name: "Emma Johnson", email: "e.johnson@email.com", content: "PRINCE2 Agile® Brochure", course: "PRINCE2 Agile®", score: 91, criteria: "✓ All met", owner: "M. Khan" },
  { name: "Liam O'Brien", email: "l.obrien@email.com", content: "PMP® Course Brochure", course: "PMP®", score: 68, criteria: "✓ All met", owner: "S. Jones" },
  { name: "Fatima Al-Hassan", email: "f.alhassan@email.com", content: "ITIL® Webinar", course: "ITIL® Foundation", score: 62, criteria: "✓ All met", owner: "A. Patel" },
  { name: "Chen Wei", email: "c.wei@email.com", content: "AgilePM® Brochure", course: "AgilePM®", score: 54, criteria: "⚠ Score low", owner: "M. Khan" },
  { name: "Sophie Martin", email: "s.martin@email.com", content: "PRINCE2® Brochure", course: "PRINCE2®", score: 71, criteria: "✓ All met", owner: "R. Lee" },
  { name: "Alex Thompson", email: "a.thompson@email.com", content: "CAPM® Webinar", course: "CAPM®", score: 48, criteria: "⚠ Score low", owner: "S. Jones" },
  { name: "Mei Lin", email: "m.lin@email.com", content: "ITIL® Foundation Brochure", course: "ITIL® Foundation", score: 65, criteria: "✓ All met", owner: "M. Khan" },
];

function scoreClass(s: number) { return s >= 80 ? "sc-hot" : s >= 60 ? "sc-blue" : s >= 40 ? "sc-warm" : "sc-cold"; }

export default function MQLsPage() {
  const [mqls, setMqls] = useState<Mql[]>(INIT_MQLS);
  const [search, setSearch] = useState("");
  const [promoteModal, setPromoteModal] = useState<Mql | null>(null);
  const [toast, setToast] = useState("");
  const [promoting, setPromoting] = useState(false);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  useEffect(() => {
    fetch("/api/contacts?stage=mql")
      .then((r) => r.json())
      .then((rows: Array<{ id: string; firstName: string; lastName?: string; email?: string; courseInterest?: string; contentDownloaded?: string; score?: number; owner?: string }>) => {
        if (!Array.isArray(rows) || rows.length === 0) return;
        const mapped: Mql[] = rows.map((r) => ({
          id: r.id,
          name: `${r.firstName}${r.lastName ? " " + r.lastName : ""}`,
          email: r.email ?? "",
          content: r.contentDownloaded ?? "Brochure Download",
          course: r.courseInterest ?? "",
          score: r.score ?? 0,
          criteria: (r.score ?? 0) >= 50 ? "✓ All met" : "⚠ Score low",
          owner: r.owner ?? "",
        }));
        setMqls(mapped);
      })
      .catch(() => {});
  }, []);

  async function confirmPromotion(mql: Mql) {
    setPromoting(true);
    setMqls((prev) =>
      prev.filter((m) => (mql.id ? m.id !== mql.id : m.name !== mql.name || m.email !== mql.email))
    );
    setPromoteModal(null);
    showToast("✅ Promoted to SQL! SDR notified.");
    if (mql.id) {
      fetch(`/api/contacts/${mql.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: "sql" }),
      }).catch(() => {});
    }
    setPromoting(false);
  }

  const filtered = mqls.filter((m) => !search || `${m.name} ${m.email} ${m.course}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="content-pad">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <div className="stat-card"><div className="stat-label">Total MQLs</div><div className="stat-value">67</div><div className="stat-sub">↑ 24% vs last month</div></div>
        <div className="stat-card"><div className="stat-label">Avg AI Score</div><div className="stat-value">58</div><div className="stat-sub">Min 50 for SQL promotion</div></div>
        <div className="stat-card"><div className="stat-label">Ready to Promote</div><div className="stat-value" style={{ color: "var(--accent)" }}>19</div><div className="stat-sub">Score ≥ 60 + course specific</div></div>
        <div className="stat-card"><div className="stat-label">MQL → SQL Rate</div><div className="stat-value" style={{ color: "var(--green)" }}>46%</div><div className="stat-sub">Industry avg: 30%</div></div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="filter-bar" style={{ flex: 1 }}>
          <input className="filter-input" placeholder="🔍 Search MQLs..." style={{ width: 220 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="filter-input"><option>All Courses</option><option>ITIL® Foundation</option><option>PMP®</option><option>PRINCE2®</option><option>AgilePM®</option></select>
          <select className="filter-input"><option>All Scores</option><option>60–100 (Promote Ready)</option><option>50–59 (Review)</option><option>Below 50 (Nurture)</option></select>
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Content Downloaded</th><th>Course</th><th>AI Score</th><th>Criteria Met</th><th>Owner</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id ?? i}>
                <td className="td-name">{m.name}</td>
                <td>{m.email}</td>
                <td style={{ color: "var(--text-3)" }}>{m.content}</td>
                <td>{m.course}</td>
                <td><span className={`score-badge ${scoreClass(m.score)}`}>{m.score}</span></td>
                <td style={{ fontSize: 12, color: m.criteria.includes("⚠") ? "var(--amber)" : "var(--green)" }}>{m.criteria}</td>
                <td style={{ color: "var(--text-3)" }}>{m.owner}</td>
                <td><button className="btn btn-success btn-sm" onClick={() => setPromoteModal(m)}>→ SQL</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {promoteModal && (
        <div className="modal-overlay show" onClick={() => setPromoteModal(null)}>
          <div className="modal" style={{ width: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Promote to SQL</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>Confirm MQL qualification criteria</div>
              </div>
              <button className="modal-close" onClick={() => setPromoteModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: 14, marginBottom: 16 }}>
                <strong>{promoteModal.name}</strong> · {promoteModal.course} · Score: {promoteModal.score}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 10 }}>Confirm qualification criteria:</div>
              {[
                { t: "AI Score ≥ 50", d: "Minimum threshold for SQL promotion" },
                { t: "Course-Specific Interaction", d: "Downloaded course brochure or visited course page" },
                { t: "Valid Email Provided", d: "Contactable via email" },
              ].map((r) => (
                <div key={r.t} className="toggle-row">
                  <div className="toggle-info"><div className="toggle-title">{r.t}</div><div className="toggle-desc">{r.d}</div></div>
                  <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: "var(--green)" }} />
                </div>
              ))}
              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label">Assign SQL to (SDR)</label>
                <select className="form-input"><option>Sarah Jones</option><option>Michael Khan</option><option>Aisha Patel</option><option>Ryan Lee</option></select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setPromoteModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={() => confirmPromotion(promoteModal)} disabled={promoting}>
                {promoting ? "Promoting..." : "Confirm Promotion →"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
