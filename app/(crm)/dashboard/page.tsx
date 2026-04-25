import { db } from "@/lib/db";
import { contacts, leads, opportunities, tasks } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { FunnelWidget, KanbanWidget, TasksWidget, CoursesWidget, RepsWidget } from "@/components/dashboard-client";
import Link from "next/link";

export default async function Page() {
  let kpi = { contacts: 284, leads: 142, mqls: 67, sqls: 31, opps: 18 };

  try {
    const [cCount] = await db.select({ v: count() }).from(contacts);
    const [lCount] = await db.select({ v: count() }).from(leads).where(eq(leads.stage, "lead"));
    const [mCount] = await db.select({ v: count() }).from(leads).where(eq(leads.stage, "mql"));
    const [sCount] = await db.select({ v: count() }).from(leads).where(eq(leads.stage, "sql"));
    const [oCount] = await db.select({ v: count() }).from(opportunities);
    kpi = {
      contacts: Number(cCount.v) || 284,
      leads: Number(lCount.v) || 142,
      mqls: Number(mCount.v) || 67,
      sqls: Number(sCount.v) || 31,
      opps: Number(oCount.v) || 18,
    };
  } catch {}

  return (
    <div className="content-pad">
      {/* AI Prompt Bar */}
      <div className="ai-prompt-bar">
        <div className="ai-pulse">🤖</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: "#fff", marginBottom: 2 }}>
            AI Assistant — 3 actions need your attention today
          </h4>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>5 SQLs cooling · 2 opportunities stalling · Forecast updated</p>
        </div>
        <div className="ai-chips">
          <Link href="/sqls" className="ai-chip">🧊 Cooling SQLs</Link>
          <span className="ai-chip">✉ Draft Email</span>
          <Link href="/reports" className="ai-chip">📊 Forecast</Link>
          <span className="ai-chip">🎯 Next Actions</span>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="kpi-strip">
        <Link href="/contacts" className="kpi-card" style={{ textDecoration: "none" }}>
          <div className="kpi-label">Contacts</div>
          <div className="kpi-value">{kpi.contacts}</div>
          <div className="kpi-delta up">↑ 12%</div>
          <svg width="100%" height="24" viewBox="0 0 80 24"><polyline points="0,18 13,14 26,16 40,10 53,12 66,6 80,8" fill="none" stroke="#2E9E6B" strokeWidth="2" strokeLinecap="round" /></svg>
        </Link>
        <Link href="/leads" className="kpi-card" style={{ textDecoration: "none" }}>
          <div className="kpi-label">Leads</div>
          <div className="kpi-value">{kpi.leads}</div>
          <div className="kpi-delta up">↑ 8%</div>
          <svg width="100%" height="24" viewBox="0 0 80 24"><polyline points="0,16 13,12 26,14 40,8 53,10 66,6 80,4" fill="none" stroke="#2E6EAF" strokeWidth="2" strokeLinecap="round" /></svg>
        </Link>
        <Link href="/mqls" className="kpi-card" style={{ textDecoration: "none" }}>
          <div className="kpi-label">MQLs</div>
          <div className="kpi-value">{kpi.mqls}</div>
          <div className="kpi-delta up">↑ 24%</div>
          <svg width="100%" height="24" viewBox="0 0 80 24"><polyline points="0,20 13,16 26,18 40,10 53,8 66,6 80,4" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" /></svg>
        </Link>
        <Link href="/sqls" className="kpi-card active" style={{ textDecoration: "none" }}>
          <div className="kpi-label">SQLs</div>
          <div className="kpi-value">{kpi.sqls}</div>
          <div className="kpi-delta dn">↓ 3%</div>
          <svg width="100%" height="24" viewBox="0 0 80 24"><polyline points="0,8 13,10 26,6 40,12 53,8 66,14 80,10" fill="none" stroke="#E8772E" strokeWidth="2" strokeLinecap="round" /></svg>
        </Link>
        <Link href="/opportunities" className="kpi-card" style={{ textDecoration: "none" }}>
          <div className="kpi-label">Opportunities</div>
          <div className="kpi-value">{kpi.opps}</div>
          <div className="kpi-delta up">↑ 6%</div>
          <svg width="100%" height="24" viewBox="0 0 80 24"><polyline points="0,18 13,14 26,12 40,10 53,8 66,6 80,4" fill="none" stroke="#1A9E8F" strokeWidth="2" strokeLinecap="round" /></svg>
        </Link>
        <div className="kpi-card">
          <div className="kpi-label">Won</div>
          <div className="kpi-value">£124k</div>
          <div className="kpi-delta up">↑ 31%</div>
          <svg width="100%" height="24" viewBox="0 0 80 24"><polyline points="0,20 13,18 26,14 40,10 53,8 66,4 80,2" fill="none" stroke="#2E9E6B" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">MQL→SQL</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>46%</div>
          <div className="kpi-delta up">↑ 5pts</div>
          <div className="prog-bg" style={{ marginTop: 8 }}>
            <div className="prog-fill" style={{ width: "46%", background: "linear-gradient(90deg,var(--navy-light),var(--accent))" }} />
          </div>
        </div>
      </div>

      {/* Funnel + AI Actions */}
      <div className="grid-2">
        <FunnelWidget />
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🤖 AI Next Actions</h3>
            <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>Live</span>
          </div>
          <div style={{ padding: "8px 16px" }}>
            {[
              { icon: "📞", cls: "ic-call", name: "Sarah Mitchell", action: "SQL cooling — no contact 28hrs. Score dropped to 61.", time: "ITIL® Foundation · Score: 61", btn: "Call" },
              { icon: "✉", cls: "ic-email", name: "Raj Patel", action: "Proposal viewed 3×. High intent. Send follow-up.", time: "PRINCE2® · Score: 88", btn: "Draft" },
              { icon: "⚠", cls: "ic-warn", name: "Nexus Corp (B2B)", action: "Opportunity stalled 14 days. Risk of losing £28k.", time: "PMP® · 5 seats · Score: 74", btn: "Review" },
              { icon: "🔥", cls: "ic-hot", name: "Emma Johnson", action: "Course page 4× this week. Score 91. Promote to SQL.", time: "PRINCE2 Agile® · Score: 91", btn: "Promote" },
            ].map((item) => (
              <div key={item.name} className="insight-item">
                <div className={`insight-icon ${item.cls}`}>{item.icon}</div>
                <div className="insight-text">
                  <div className="insight-name">{item.name}</div>
                  <div className="insight-action">{item.action}</div>
                  <div className="insight-time">{item.time}</div>
                </div>
                <button className="insight-btn">{item.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban */}
      <KanbanWidget />

      {/* Tasks + Courses + Reps + Forecast */}
      <div className="grid-3">
        <TasksWidget />
        <CoursesWidget />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <RepsWidget />
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">AI Forecast</h3>
              <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>90-day</span>
            </div>
            <div className="card-body">
              <div className="forecast-bars">
                {[
                  { label: "30d", h1: 40, h2: 60, h3: 50, c1: "#EEF4FB", c2: "var(--blue)", c3: "rgba(46,110,175,0.35)" },
                  { label: "60d", h1: 50, h2: 72, h3: 60, c1: "#EEF4FB", c2: "var(--accent)", c3: "rgba(232,119,46,0.35)" },
                  { label: "90d", h1: 60, h2: 78, h3: 70, c1: "#EEF4FB", c2: "var(--green)", c3: "rgba(46,158,107,0.35)" },
                ].map((f) => (
                  <div key={f.label} style={{ flex: 1 }}>
                    <div className="forecast-group">
                      <div className="fbar" style={{ height: f.h1, background: f.c1 }} />
                      <div className="fbar" style={{ height: f.h2, background: f.c2 }} />
                      <div className="fbar" style={{ height: f.h3, background: f.c3 }} />
                    </div>
                    <div className="forecast-label">{f.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--surface2)", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--text-3)", textTransform: "uppercase" }}>Likely 90-day</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>£312k</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--text-3)", textTransform: "uppercase" }}>Confidence</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)" }}>82%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
