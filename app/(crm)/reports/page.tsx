"use client";
import { useState } from "react";

type ReportTab = "funnel" | "sources" | "courses" | "performance" | "forecast";

const SOURCES = [
  { name: "Course Page Enquiry", contacts: "—", mqls: "—", sqls: 124, won: 76, conv: "61%", convColor: "var(--green)", score: 84, scoreClass: "sc-hot" },
  { name: "Inbound Call", contacts: "—", mqls: "—", sqls: 48, won: 28, conv: "58%", convColor: "var(--green)", score: 79, scoreClass: "sc-hot" },
  { name: "Brochure Download", contacts: "—", mqls: 67, sqls: 31, won: 14, conv: "46%", convColor: "var(--accent)", score: 62, scoreClass: "sc-blue" },
  { name: "Paid Ad (Google/LinkedIn)", contacts: "—", mqls: "—", sqls: 38, won: 19, conv: "50%", convColor: "var(--accent)", score: 71, scoreClass: "sc-blue" },
  { name: "Generic Webinar", contacts: "—", mqls: 42, sqls: 18, won: 7, conv: "39%", convColor: "var(--amber)", score: 54, scoreClass: "sc-warm" },
  { name: "Blog / Social", contacts: 284, mqls: 18, sqls: 6, won: 2, conv: "33%", convColor: "var(--red)", score: 41, scoreClass: "sc-warm" },
  { name: "Referral", contacts: "—", mqls: "—", sqls: 22, won: 16, conv: "73%", convColor: "var(--green)", score: 91, scoreClass: "sc-hot" },
];

const COURSES = [
  { name: "ITIL® 4 Foundation", mqls: 28, sqls: 48, opps: 22, won: 14, revenue: "£33,600", trend: "↑ Hot", trendColor: "var(--green)" },
  { name: "PMP® Certification", mqls: 22, sqls: 40, opps: 18, won: 11, revenue: "£41,800", trend: "↑ Hot", trendColor: "var(--green)" },
  { name: "PRINCE2® Foundation", mqls: 19, sqls: 34, opps: 14, won: 8, revenue: "£17,600", trend: "↑ Rising", trendColor: "var(--teal)" },
  { name: "AgilePM® Foundation", mqls: 14, sqls: 28, opps: 11, won: 6, revenue: "£11,400", trend: "↑ Rising", trendColor: "var(--teal)" },
  { name: "PRINCE2 Agile®", mqls: 10, sqls: 21, opps: 8, won: 4, revenue: "£10,400", trend: "→ Steady", trendColor: "var(--text-3)" },
  { name: "CAPM®", mqls: 8, sqls: 16, opps: 6, won: 3, revenue: "£5,400", trend: "→ Steady", trendColor: "var(--text-3)" },
];

const REPS = [
  { initials: "SJ", name: "Sarah Jones", grad: "linear-gradient(135deg,#E8772E,#C9A84C)", sqls: 18, contacted: 17, opps: 12, won: 7, revenue: "£42k", winRate: "58%", winColor: "var(--green)", response: "1.2h" },
  { initials: "MK", name: "Michael Khan", grad: "linear-gradient(135deg,#1B3A6B,#2E6EAF)", sqls: 14, contacted: 13, opps: 9, won: 5, revenue: "£31k", winRate: "56%", winColor: "var(--accent)", response: "1.8h" },
  { initials: "AP", name: "Aisha Patel", grad: "linear-gradient(135deg,#1A9E8F,#27AE60)", sqls: 12, contacted: 11, opps: 7, won: 4, revenue: "£28k", winRate: "57%", winColor: "var(--accent)", response: "2.1h" },
  { initials: "RL", name: "Ryan Lee", grad: "linear-gradient(135deg,#7B4FA6,#9B6ED4)", sqls: 10, contacted: 8, opps: 6, won: 3, revenue: "£19k", winRate: "50%", winColor: "var(--amber)", response: "3.4h" },
];

const FORECAST_OPPS = [
  { deal: "GlobalTech — ITIL® 12 seats", stage: "Negotiation", value: "£38,400", prob: "86%", probColor: "var(--green)", weighted: "£33,024", close: "May 15" },
  { deal: "Nexus Corp — PMP® 5 seats", stage: "Proposal", value: "£28,000", prob: "74%", probColor: "var(--amber)", weighted: "£20,720", close: "May 28" },
  { deal: "TechFlow — PRINCE2® 8 seats", stage: "Proposal", value: "£17,600", prob: "81%", probColor: "var(--green)", weighted: "£14,256", close: "Jun 2" },
  { deal: "Raj Patel — PRINCE2® Foundation", stage: "Negotiation", value: "£2,200", prob: "88%", probColor: "var(--green)", weighted: "£1,936", close: "Apr 30" },
  { deal: "David Chen — PMP®", stage: "Negotiation", value: "£3,800", prob: "79%", probColor: "var(--green)", weighted: "£3,002", close: "May 5" },
];

const FUNNEL_B2C = [
  { label: "Contacts", count: 284, conv: "", h: 120, color: "var(--navy)" },
  { label: "Leads", count: 142, conv: "50%", h: 100, color: "var(--blue)" },
  { label: "MQLs", count: 67, conv: "47%", h: 80, color: "var(--accent)" },
  { label: "SQLs", count: 31, conv: "46%", h: 60, color: "var(--teal)" },
  { label: "Opportunities", count: 18, conv: "58%", h: 44, color: "var(--gold)" },
  { label: "Won", count: 11, conv: "61%", h: 30, color: "var(--green)" },
];

const FUNNEL_B2B = [
  { label: "Accounts", count: 42, conv: "", h: 120, color: "var(--navy)" },
  { label: "Leads", count: 28, conv: "67%", h: 95, color: "var(--blue)" },
  { label: "Proposals", count: 18, conv: "64%", h: 70, color: "var(--accent)" },
  { label: "Negotiations", count: 9, conv: "50%", h: 50, color: "var(--teal)" },
  { label: "Won", count: 5, conv: "56%", h: 30, color: "var(--green)" },
];

const TIME_IN_STAGE = [
  { stage: "Contact → Lead", days: 2.1, w: 15 },
  { stage: "Lead → MQL", days: 5.4, w: 38 },
  { stage: "MQL → SQL", days: 3.8, w: 27 },
  { stage: "SQL → Opportunity", days: 7.2, w: 52 },
  { stage: "Opportunity → Won", days: 14.0, w: 100 },
];

export default function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>("funnel");
  const [funnelMode, setFunnelMode] = useState<"b2c" | "b2b">("b2c");
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const funnelData = funnelMode === "b2c" ? FUNNEL_B2C : FUNNEL_B2B;

  return (
    <div className="content-pad">
      {/* Tab Row */}
      <div className="tab-row" style={{ padding: 0, marginBottom: 0 }}>
        {(["funnel", "sources", "courses", "performance", "forecast"] as ReportTab[]).map((t) => (
          <div key={t} className={`tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
            {t === "funnel" ? "Funnel" : t === "sources" ? "Lead Sources" : t === "courses" ? "Course Demand" : t === "performance" ? "Team Performance" : "AI Forecast"}
          </div>
        ))}
      </div>

      {/* Funnel Tab */}
      {tab === "funnel" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            <div className="stat-card"><div className="stat-label">Total Contacts</div><div className="stat-value">284</div><div className="stat-sub">This month</div></div>
            <div className="stat-card"><div className="stat-label">MQL → SQL</div><div className="stat-value" style={{ color: "var(--accent)" }}>46%</div><div className="stat-sub">↑ 5pts month-on-month</div></div>
            <div className="stat-card"><div className="stat-label">SQL → Opportunity</div><div className="stat-value" style={{ color: "var(--teal)" }}>58%</div><div className="stat-sub">Target: 60%</div></div>
            <div className="stat-card"><div className="stat-label">Opportunity → Won</div><div className="stat-value" style={{ color: "var(--green)" }}>61%</div><div className="stat-sub">Industry avg: 47%</div></div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Full Funnel — Contact to Won</h3>
              <div className="pipeline-toggle">
                <button className={`toggle-btn${funnelMode === "b2c" ? " active" : ""}`} onClick={() => setFunnelMode("b2c")}>B2C</button>
                <button className={`toggle-btn${funnelMode === "b2b" ? " active" : ""}`} onClick={() => setFunnelMode("b2b")}>B2B</button>
              </div>
            </div>
            <div style={{ padding: "24px" }}>
              <div className="funnel-stages" style={{ alignItems: "flex-end", gap: 4 }}>
                {funnelData.map((s, i) => (
                  <div key={s.label} className="funnel-stage">
                    <div className="funnel-bar-wrap">
                      <div className="funnel-count">{s.count}</div>
                      <div className="funnel-bar" style={{ height: s.h, background: s.color }} />
                      <div className="funnel-label">{s.label}</div>
                      {s.conv && <div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "'DM Mono',monospace", marginTop: 2 }}>{s.conv}</div>}
                    </div>
                    {i < funnelData.length - 1 && (
                      <div style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "var(--text-3)", zIndex: 1 }}>›</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">Average Time in Stage (days)</h3></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {TIME_IN_STAGE.map((s) => (
                <div key={s.stage} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 180, fontSize: 12, color: "var(--text-2)", flexShrink: 0 }}>{s.stage}</div>
                  <div style={{ flex: 1, height: 8, background: "var(--surface)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.w}%`, background: "var(--blue)", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--navy)", fontWeight: 700, width: 40, textAlign: "right" }}>{s.days}d</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Lead Sources Tab */}
      {tab === "sources" && (
        <>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Source Performance Detail</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => showToast("📊 Exporting...")}>↓ Export</button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead><tr><th>Source</th><th>Contacts</th><th>MQLs</th><th>SQLs</th><th>Won</th><th>Conv. Rate</th><th>Avg Score</th></tr></thead>
                <tbody>
                  {SOURCES.map((s) => (
                    <tr key={s.name}>
                      <td className="td-name">{s.name}</td>
                      <td style={{ fontFamily: "'DM Mono',monospace" }}>{s.contacts}</td>
                      <td style={{ fontFamily: "'DM Mono',monospace" }}>{s.mqls}</td>
                      <td style={{ fontFamily: "'DM Mono',monospace" }}>{s.sqls}</td>
                      <td style={{ fontFamily: "'DM Mono',monospace" }}>{s.won}</td>
                      <td><span style={{ color: s.convColor, fontWeight: 600 }}>{s.conv}</span></td>
                      <td><span className={`score-badge ${s.scoreClass}`}>{s.score}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">Lead Volume by Source Channel</h3></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SOURCES.map((s) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 200, fontSize: 12, color: "var(--text-2)", flexShrink: 0 }}>{s.name}</div>
                  <div style={{ flex: 1, height: 8, background: "var(--surface)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (Number(s.sqls) / 130) * 100)}%`, background: "var(--blue)", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--text-3)", width: 40, textAlign: "right" }}>{s.sqls}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Course Demand Tab */}
      {tab === "courses" && (
        <>
          <div className="card">
            <div className="card-header"><h3 className="card-title">Course Demand — SQL Volume This Month</h3></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {COURSES.map((c) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 200, fontSize: 12, color: "var(--text-2)", flexShrink: 0 }}>{c.name}</div>
                  <div style={{ flex: 1, height: 10, background: "var(--surface)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(c.sqls / 50) * 100}%`, background: "var(--accent)", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--navy)", fontWeight: 700, width: 30, textAlign: "right" }}>{c.sqls}</div>
                  <span style={{ fontSize: 11, color: c.trendColor, fontWeight: 600, width: 60, flexShrink: 0 }}>{c.trend}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">Course Conversion Funnel</h3></div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead><tr><th>Course</th><th>MQLs</th><th>SQLs</th><th>Opportunities</th><th>Won</th><th>Revenue</th><th>Trend</th></tr></thead>
                <tbody>
                  {COURSES.map((c) => (
                    <tr key={c.name}>
                      <td className="td-name">{c.name}</td>
                      <td>{c.mqls}</td>
                      <td>{c.sqls}</td>
                      <td>{c.opps}</td>
                      <td>{c.won}</td>
                      <td><strong>{c.revenue}</strong></td>
                      <td><span style={{ color: c.trendColor, fontWeight: 600 }}>{c.trend}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Team Performance Tab */}
      {tab === "performance" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            <div className="stat-card"><div className="stat-label">Total Revenue</div><div className="stat-value">£124k</div><div className="stat-sub">11 deals won</div></div>
            <div className="stat-card"><div className="stat-label">Avg Deal Cycle</div><div className="stat-value">12.4d</div><div className="stat-sub">SQL to Won</div></div>
            <div className="stat-card"><div className="stat-label">Calls Made</div><div className="stat-value">284</div><div className="stat-sub">Team total this month</div></div>
            <div className="stat-card"><div className="stat-label">Emails Sent</div><div className="stat-value">612</div><div className="stat-sub">38% open rate</div></div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">Rep Performance Breakdown</h3></div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead><tr><th>Rep</th><th>SQLs Assigned</th><th>Contacted</th><th>Opps Created</th><th>Won</th><th>Revenue</th><th>Win Rate</th><th>Avg Response</th></tr></thead>
                <tbody>
                  {REPS.map((r) => (
                    <tr key={r.name}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="rep-av" style={{ background: r.grad }}>{r.initials}</div>
                          <strong>{r.name}</strong>
                        </div>
                      </td>
                      <td>{r.sqls}</td>
                      <td>{r.contacted}</td>
                      <td>{r.opps}</td>
                      <td>{r.won}</td>
                      <td><strong>{r.revenue}</strong></td>
                      <td><span style={{ color: r.winColor, fontWeight: 600 }}>{r.winRate}</span></td>
                      <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{r.response}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* AI Forecast Tab */}
      {tab === "forecast" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <div className="stat-card"><div className="stat-label">30-Day Likely</div><div className="stat-value" style={{ color: "var(--blue)" }}>£112k</div><div className="stat-sub">Best: £148k · Worst: £68k</div></div>
            <div className="stat-card"><div className="stat-label">60-Day Likely</div><div className="stat-value" style={{ color: "var(--accent)" }}>£218k</div><div className="stat-sub">Best: £284k · Worst: £142k</div></div>
            <div className="stat-card"><div className="stat-label">90-Day Likely</div><div className="stat-value" style={{ color: "var(--green)" }}>£312k</div><div className="stat-sub">Confidence: 82% · 18 open deals</div></div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">AI Revenue Forecast — 90 Day View</h3>
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>Updated midnight · 18 open opportunities</span>
            </div>
            <div className="card-body">
              <div className="forecast-bars" style={{ height: 140 }}>
                {[
                  { label: "30 days", worst: 60, likely: 94, best: 78, likelyColor: "var(--blue)", bestColor: "rgba(46,110,175,0.35)" },
                  { label: "60 days", worst: 84, likely: 120, best: 105, likelyColor: "var(--accent)", bestColor: "rgba(232,119,46,0.35)" },
                  { label: "90 days", worst: 95, likely: 140, best: 126, likelyColor: "var(--green)", bestColor: "rgba(46,158,107,0.35)" },
                ].map((b) => (
                  <div key={b.label} style={{ flex: 1 }}>
                    <div className="forecast-group" style={{ height: 140 }}>
                      <div className="fbar" style={{ height: b.worst, background: "#EEF4FB" }} />
                      <div className="fbar" style={{ height: b.likely, background: b.likelyColor }} />
                      <div className="fbar" style={{ height: b.best, background: b.bestColor }} />
                    </div>
                    <div className="forecast-label" style={{ marginTop: 8 }}>{b.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 14 }}>
                {[{ color: "#DDE1EE", label: "Worst Case" }, { color: "var(--blue)", label: "Likely Case" }, { color: "rgba(46,110,175,0.4)", label: "Best Case" }].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>
                    <div style={{ width: 12, height: 8, borderRadius: 2, background: l.color }} />{l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">Opportunities Contributing to Forecast</h3></div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead><tr><th>Deal</th><th>Stage</th><th>Value</th><th>AI Probability</th><th>Weighted Value</th><th>Close Date</th></tr></thead>
                <tbody>
                  {FORECAST_OPPS.map((o) => (
                    <tr key={o.deal}>
                      <td className="td-name">{o.deal}</td>
                      <td><span className="pill pill-opp">{o.stage}</span></td>
                      <td style={{ fontFamily: "'DM Mono',monospace" }}>{o.value}</td>
                      <td><span style={{ color: o.probColor, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{o.prob}</span></td>
                      <td style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>{o.weighted}</td>
                      <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{o.close}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
