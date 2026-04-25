"use client";
import { useState } from "react";

const FUNNEL_B2C = [
  { label: "Contact", count: 284, color: "#DDE1EE", h: 90 },
  { label: "Lead", count: 142, color: "#C4CCE2", h: 78 },
  { label: "MQL", count: 67, color: "#2E6EAF", h: 64 },
  { label: "SQL", count: 31, color: "#E8772E", h: 50 },
  { label: "Opportunity", count: 18, color: "#1A9E8F", h: 38 },
  { label: "Won", count: 11, color: "#2E9E6B", h: 28 },
];
const FUNNEL_B2B = [
  { label: "Contact", count: 124, color: "#DDE1EE", h: 90 },
  { label: "Lead", count: 68, color: "#C4CCE2", h: 76 },
  { label: "MQL", count: 34, color: "#2E6EAF", h: 60 },
  { label: "SQL", count: 18, color: "#E8772E", h: 44 },
  { label: "Opportunity", count: 12, color: "#1A9E8F", h: 34 },
  { label: "Won", count: 7, color: "#2E9E6B", h: 22 },
];

const KANBAN_B2C = [
  { stage: "Discovery", deals: [{ n: "Sarah Mitchell", c: "ITIL® Foundation", v: "£2,400", s: 61, sc: "sc-blue", d: 2, st: false }, { n: "Marcus Webb", c: "CAPM®", v: "£1,800", s: 54, sc: "sc-warm", d: 5, st: false }] },
  { stage: "Proposal", deals: [{ n: "Raj Patel", c: "PRINCE2®", v: "£2,200", s: 88, sc: "sc-hot", d: 3, st: false }, { n: "Lena Fischer", c: "AgilePM®", v: "£1,900", s: 72, sc: "sc-blue", d: 8, st: true }] },
  { stage: "Negotiation", deals: [{ n: "David Chen", c: "PMP®", v: "£3,800", s: 79, sc: "sc-blue", d: 6, st: false }] },
  { stage: "Verbal", deals: [{ n: "James Torres", c: "AgilePM®", v: "£3,200", s: 95, sc: "sc-hot", d: 1, st: false }] },
  { stage: "Won", deals: [{ n: "Emma Johnson", c: "PRINCE2 Agile®", v: "£2,600", s: 91, sc: "sc-hot", d: 0, st: false }] },
];
const KANBAN_B2B = [
  { stage: "Discovery", deals: [{ n: "Apex Solutions", c: "PMP® · 6 seats", v: "£14,400", s: 68, sc: "sc-blue", d: 4, st: false }] },
  { stage: "Proposal", deals: [{ n: "Nexus Corp", c: "PMP® · 5 seats", v: "£28,000", s: 74, sc: "sc-blue", d: 14, st: true }, { n: "TechFlow Ltd", c: "PRINCE2® · 8 seats", v: "£17,600", s: 81, sc: "sc-hot", d: 3, st: false }] },
  { stage: "Negotiation", deals: [{ n: "GlobalTech", c: "ITIL® · 12 seats", v: "£38,400", s: 86, sc: "sc-hot", d: 5, st: false }] },
  { stage: "Verbal", deals: [] },
  { stage: "Won", deals: [{ n: "Horizon Consulting", c: "AgilePM® · 4 seats", v: "£7,600", s: 93, sc: "sc-hot", d: 0, st: false }] },
];

const TASKS_DATA = {
  overdue: [
    { t: "Follow-up call — David Chen", sub: "ITIL® 4 Foundation · SQL", due: "2d ago", p: "p-urgent", ai: false },
    { t: "Send PRINCE2 proposal — TechFlow Ltd", sub: "B2B · 8 seats", due: "1d ago", p: "p-high", ai: true },
    { t: "Check in — Lena Fischer", sub: "AgilePM® opportunity stalling", due: "3d ago", p: "p-medium", ai: false },
  ],
  today: [
    { t: "Discovery call — Priya Nair", sub: "AgilePM® Foundation", due: "2:00 PM", p: "p-high", ai: true },
    { t: "Email brochure — Marcus Webb", sub: "CAPM® Certification", due: "4:30 PM", p: "p-medium", ai: false },
    { t: "Proposal review — Nexus Corp", sub: "B2B · PMP® 5 seats", due: "EOD", p: "p-urgent", ai: false },
  ],
};

const COURSES = [
  { n: "ITIL® 4 Foundation", v: 48, pct: 100, tag: "tag-hot", emoji: "🔥" },
  { n: "PMP® Certification", v: 40, pct: 83, tag: "tag-hot", emoji: "🔥" },
  { n: "PRINCE2® Foundation", v: 34, pct: 71, tag: "tag-rising", emoji: "↑" },
  { n: "AgilePM® Foundation", v: 28, pct: 58, tag: "tag-rising", emoji: "↑" },
  { n: "PRINCE2 Agile®", v: 21, pct: 44, tag: "tag-steady", emoji: "→" },
  { n: "CAPM® Certification", v: 16, pct: 33, tag: "tag-steady", emoji: "→" },
  { n: "DevOps Foundation", v: 12, pct: 25, tag: "tag-steady", emoji: "→" },
];

const REPS = [
  { init: "SJ", n: "Sarah Jones", meta: "12 SQLs · 7 Won", rev: "£42k", rank: "gold", bg: "linear-gradient(135deg,#E8772E,#C9A84C)" },
  { init: "MK", n: "Michael Khan", meta: "10 SQLs · 5 Won", rev: "£31k", rank: "silver", bg: "linear-gradient(135deg,#1B3A6B,#2E6EAF)" },
  { init: "AP", n: "Aisha Patel", meta: "9 SQLs · 4 Won", rev: "£28k", rank: "bronze", bg: "linear-gradient(135deg,#1A9E8F,#27AE60)" },
  { init: "RL", n: "Ryan Lee", meta: "7 SQLs · 3 Won", rev: "£19k", rank: "", bg: "linear-gradient(135deg,#7B4FA6,#9B6ED4)" },
];

export function FunnelWidget() {
  const [mode, setMode] = useState<"b2c" | "b2b">("b2c");
  const data = mode === "b2c" ? FUNNEL_B2C : FUNNEL_B2B;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Pipeline Funnel</h3>
        <div className="pipeline-toggle">
          <button className={`toggle-btn${mode === "b2c" ? " active" : ""}`} onClick={() => setMode("b2c")}>B2C</button>
          <button className={`toggle-btn${mode === "b2b" ? " active" : ""}`} onClick={() => setMode("b2b")}>B2B</button>
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        <div className="funnel-stages">
          {data.map((s, i) => (
            <>
              <div key={s.label} className="funnel-stage">
                <div className="funnel-bar-wrap">
                  <div className="funnel-count">{s.count}</div>
                  <div className="funnel-bar" style={{ height: s.h, background: s.color }} />
                  <div className="funnel-label">{s.label}</div>
                </div>
              </div>
              {i < data.length - 1 && (
                <div key={`arr-${i}`} className="funnel-arrow">
                  <div className="funnel-conv">{Math.round((data[i + 1].count / data[i].count) * 100)}%</div>
                  <div className="funnel-arrow-icon">›</div>
                </div>
              )}
            </>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--surface2)", display: "flex", gap: 24, justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--text-3)", textTransform: "uppercase" }}>Avg Time in Stage</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "var(--navy)", marginTop: 2 }}>4.2 days</div>
          </div>
          <div style={{ width: 1, background: "var(--border)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--text-3)", textTransform: "uppercase" }}>Overall Conv. Rate</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "var(--accent)", marginTop: 2 }}>6.3%</div>
          </div>
          <div style={{ width: 1, background: "var(--border)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--text-3)", textTransform: "uppercase" }}>Pipeline Value</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "var(--green)", marginTop: 2 }}>£312k</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function KanbanWidget({ full = false }: { full?: boolean }) {
  const [mode, setMode] = useState<"b2c" | "b2b">("b2c");
  const data = mode === "b2c" ? KANBAN_B2C : KANBAN_B2B;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Opportunity Pipeline</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="pipeline-toggle">
            <button className={`toggle-btn${mode === "b2c" ? " active" : ""}`} onClick={() => setMode("b2c")}>B2C</button>
            <button className={`toggle-btn${mode === "b2b" ? " active" : ""}`} onClick={() => setMode("b2b")}>B2B</button>
          </div>
          {!full && <a href="/pipeline" className="btn btn-ghost btn-sm">Full View →</a>}
        </div>
      </div>
      <div className="kanban-board">
        {data.map((col) => {
          const total = col.deals.reduce((s, d) => s + parseInt(d.v.replace(/[^0-9]/g, "")), 0);
          return (
            <div key={col.stage} className="kanban-col">
              <div className="kanban-col-header">
                <div className="kcol-name">{col.stage}</div>
                <div className="kcol-meta">
                  <span className="kcol-count">{col.deals.length} deals</span>
                  {total > 0 && <span className="kcol-val">£{(total / 1000).toFixed(0)}k</span>}
                </div>
              </div>
              <div className="kanban-cards">
                {col.deals.map((d) => (
                  <div key={d.n} className={`deal-card${d.st ? " stalled" : ""}`}>
                    {d.st && <div style={{ fontSize: 9, fontWeight: 700, color: "var(--amber)", fontFamily: "DM Mono,monospace", marginBottom: 4 }}>⚠ STALLED</div>}
                    <div className="deal-name">{d.n}</div>
                    <div className="deal-course">📚 {d.c}</div>
                    <div className="deal-meta">
                      <div className="deal-value">{d.v}</div>
                      <div className={`score-badge ${d.sc}`}>{d.s}</div>
                    </div>
                    {d.d > 0 ? (
                      <div className={`deal-days${d.st ? " warn" : ""}`}>📅 {d.d}d in stage</div>
                    ) : (
                      <div className="deal-days" style={{ color: "var(--green)" }}>Just moved ✓</div>
                    )}
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)", display: "flex", gap: 6 }}>
                      <button style={{ flex: 1, fontSize: 10, padding: "4px 0", borderRadius: 5, background: "rgba(232,119,46,0.08)", border: "1px solid rgba(232,119,46,0.25)", color: "var(--accent)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>📄 Quote</button>
                      <button style={{ flex: 1, fontSize: 10, padding: "4px 0", borderRadius: 5, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-2)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>✉ Email</button>
                    </div>
                  </div>
                ))}
                <div className="add-card-btn">+ Add deal</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TasksWidget() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">My Tasks</h3>
        <a href="/tasks" className="btn btn-ghost btn-sm">View All</a>
      </div>
      <div style={{ padding: "8px 16px" }}>
        {TASKS_DATA.today.map((t) => (
          <div key={t.t} className="task-item" style={{ opacity: done[t.t] ? 0.35 : 1 }}>
            <div className={`prio-dot ${t.p}`} />
            <div
              className={`task-check${done[t.t] ? " done" : ""}`}
              onClick={() => setDone((p) => ({ ...p, [t.t]: true }))}
            >
              {done[t.t] && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
            </div>
            <div className="task-content">
              <div className="task-subject">{t.t} {t.ai && <span className="ai-badge">AI</span>}</div>
              <div className="task-sub">{t.sub}</div>
            </div>
            <div className="task-due today">{t.due}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoursesWidget() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Course Demand</h3>
        <a href="/reports" className="btn btn-ghost btn-sm">Reports →</a>
      </div>
      <div style={{ padding: "8px 16px" }}>
        {COURSES.map((c) => (
          <div key={c.n} className="course-row">
            <div className="course-name">{c.n}</div>
            <div className="cbar-bg"><div className="cbar-fill" style={{ width: `${c.pct}%` }} /></div>
            <div className="c-count">{c.v}</div>
            <div className={`ctag ${c.tag}`}>{c.emoji}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RepsWidget() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Rep Performance</h3>
        <span style={{ fontSize: 11, color: "var(--text-3)" }}>This month</span>
      </div>
      <div style={{ padding: "8px 16px" }}>
        {REPS.map((r, i) => (
          <div key={r.n} className="rep-row">
            <div className={`rep-rank ${r.rank}`}>{i + 1}</div>
            <div className="rep-av" style={{ background: r.bg }}>{r.init}</div>
            <div className="rep-info">
              <div className="rep-name">{r.n}</div>
              <div className="rep-meta">{r.meta}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="rep-stat-val">{r.rev}</div>
              <div className="rep-stat-lbl">Revenue</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Toast() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  // expose globally
  if (typeof window !== "undefined") {
    (window as any).showToast = (m: string) => {
      setMsg(m); setShow(true);
      setTimeout(() => setShow(false), 2800);
    };
  }
  return <div className={`toast${show ? " show" : ""}`}>{msg}</div>;
}
