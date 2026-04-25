"use client";
import { useState } from "react";

const RENEWALS = [
  { account: "GlobalTech", lastCourse: "ITIL® 4 Foundation", value: "£38,400", expiry: "Jun 15", daysLeft: 51, status: "On Track" },
  { account: "Apex Solutions", lastCourse: "PMP® Certification", value: "£42,000", expiry: "Jun 22", daysLeft: 58, status: "At Risk" },
  { account: "Nexus Corp", lastCourse: "PMP® 5 seats", value: "£28,000", expiry: "Jul 5", daysLeft: 71, status: "On Track" },
  { account: "TechFlow Ltd", lastCourse: "PRINCE2® 8 seats", value: "£17,600", expiry: "May 30", daysLeft: 35, status: "At Risk" },
  { account: "Horizon Consulting", lastCourse: "AgilePM® 4 seats", value: "£32,800", expiry: "Aug 1", daysLeft: 98, status: "Renewed" },
  { account: "DataStream Co", lastCourse: "ITIL® Foundation", value: "£14,400", expiry: "Sep 10", daysLeft: 138, status: "On Track" },
  { account: "Vertex Partners", lastCourse: "PRINCE2 Agile®", value: "£12,800", expiry: "Oct 2", daysLeft: 160, status: "On Track" },
];

const UPSELL = [
  { name: "Emma Johnson", course: "PRINCE2® → PRINCE2 Agile®", score: 91, tag: "🔥 Hot" },
  { name: "Raj Patel", course: "PRINCE2® → PMP®", score: 88, tag: "🔥 Hot" },
  { name: "GlobalTech", course: "ITIL® Fdn → ITIL® Practitioner", score: 84, tag: "↑ Upsell" },
  { name: "James Torres", course: "AgilePM® → PRINCE2 Agile®", score: 80, tag: "↑ Upsell" },
  { name: "Sarah Mitchell", course: "ITIL® → PMP® Bundle", score: 71, tag: "→ Warm" },
];

const CERT_PATHS = [
  { title: "PRINCE2® Path", steps: ["PRINCE2® Fdn", "PRINCE2® Prac", "PRINCE2 Agile®", "MSP®"], active: 1 },
  { title: "ITIL® Path", steps: ["ITIL® Fdn", "ITIL® CDS", "ITIL® DSV", "ITIL® MP"], active: 0 },
  { title: "Agile Path", steps: ["AgilePM® Fdn", "AgilePM® Prac", "AgilePgM®", "DSDM®"], active: 2 },
  { title: "PM Path", steps: ["CAPM®", "PMP®", "PgMP®", "PfMP®"], active: 1 },
];

function statusStyle(s: string) {
  if (s === "At Risk") return { background: "var(--red-soft)", color: "var(--red)" };
  if (s === "Renewed") return { background: "var(--green-soft)", color: "var(--green)" };
  return { background: "var(--blue-soft)", color: "var(--blue)" };
}

export default function RenewalsPage() {
  const [filter, setFilter] = useState("");
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const rows = filter ? RENEWALS.filter((r) => r.status === filter) : RENEWALS;

  return (
    <div className="content-pad">
      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <div className="stat-card"><div className="stat-label">Renewals Due (90d)</div><div className="stat-value" style={{ color: "var(--amber)" }}>7</div><div className="stat-sub">£186k at stake</div></div>
        <div className="stat-card"><div className="stat-label">Upsell Opportunities</div><div className="stat-value" style={{ color: "var(--teal)" }}>14</div><div className="stat-sub">Past students eligible</div></div>
        <div className="stat-card"><div className="stat-label">Renewal Rate (LTM)</div><div className="stat-value" style={{ color: "var(--green)" }}>74%</div><div className="stat-sub">↑ 6pts vs prior year</div></div>
        <div className="stat-card"><div className="stat-label">Upsell Revenue (QTD)</div><div className="stat-value" style={{ color: "var(--blue)" }}>£28,400</div><div className="stat-sub">3 deals closed</div></div>
      </div>

      {/* Two-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Renewal Pipeline */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Renewal Pipeline</h3>
            <select className="filter-input" style={{ width: 130, fontSize: 12 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All</option>
              <option value="At Risk">At Risk</option>
              <option value="On Track">On Track</option>
              <option value="Renewed">Renewed</option>
            </select>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead><tr><th>Account</th><th>Last Course</th><th>Value</th><th>Expiry</th><th>Days Left</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.account}>
                    <td className="td-name">{r.account}</td>
                    <td style={{ color: "var(--text-2)" }}>{r.lastCourse}</td>
                    <td style={{ fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{r.value}</td>
                    <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{r.expiry}</td>
                    <td><span style={{ fontFamily: "'DM Mono',monospace", color: r.daysLeft < 60 ? "var(--amber)" : "var(--text-2)", fontWeight: 600 }}>{r.daysLeft}d</span></td>
                    <td><span className="badge" style={statusStyle(r.status)}>{r.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button className="btn btn-ghost btn-sm" style={{ borderColor: "var(--blue)", color: "var(--blue)" }} onClick={() => showToast("✉ Opening renewal email...")}>Email</button>
                        <button className="btn btn-ghost btn-sm" style={{ borderColor: "var(--accent)", color: "var(--accent)" }} onClick={() => showToast("📄 Opening quote builder...")}>Quote</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upsell Candidates */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">Upsell Candidates</h3><span style={{ fontSize: 11, color: "var(--text-3)" }}>AI-ranked</span></div>
          <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {UPSELL.map((u) => (
              <div key={u.name} className="upsell-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{u.name}</div>
                  <span className="score-badge sc-hot">{u.score}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-2)", marginBottom: 6 }}>{u.course}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{u.tag}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => showToast("📤 Outreach email drafted!")}>Outreach</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certification Progression Map */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Certification Progression Map</h3>
          <span style={{ fontSize: 11, color: "var(--text-3)" }}>Past students eligible for next-level cert</span>
        </div>
        <div style={{ padding: "20px", overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 24, minWidth: 600 }}>
            {CERT_PATHS.map((path) => (
              <div key={path.title} style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--navy)", marginBottom: 12, fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>{path.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {path.steps.map((step, i) => (
                    <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === path.active ? "var(--accent)" : i < path.active ? "var(--green)" : "var(--border)", flexShrink: 0 }} />
                      <div style={{ fontSize: 12, color: i === path.active ? "var(--accent)" : i < path.active ? "var(--green)" : "var(--text-3)", fontWeight: i === path.active ? 700 : 400 }}>{step}</div>
                      {i === path.active && <span style={{ fontSize: 9, fontWeight: 700, color: "var(--accent)", background: "var(--amber-soft)", padding: "1px 5px", borderRadius: 3, fontFamily: "'DM Mono',monospace" }}>NEXT</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
