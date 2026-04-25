"use client";
import { useState } from "react";

type Panel = "profile" | "users" | "pipeline-cfg" | "routing" | "ai-cfg" | "notifications" | "integrations" | "audit" | "gdpr";

const NAV: { key: Panel; label: string }[] = [
  { key: "profile", label: "👤 Profile" },
  { key: "users", label: "👥 User Management" },
  { key: "pipeline-cfg", label: "◈ Pipeline Config" },
  { key: "routing", label: "🔀 Stage Routing Rules" },
  { key: "ai-cfg", label: "🤖 AI Configuration" },
  { key: "notifications", label: "🔔 Notifications" },
  { key: "integrations", label: "🔗 Integrations" },
  { key: "audit", label: "📋 Audit Log" },
  { key: "gdpr", label: "🔒 GDPR Tools" },
];

function Toggle({ on: initial }: { on?: boolean }) {
  const [on, setOn] = useState(initial ?? true);
  return <div className={`toggle-switch${on ? " on" : ""}`} onClick={() => setOn(!on)} />;
}

const STAGES = ["Discovery", "Proposal Sent", "Negotiation", "Verbal Commitment", "Won", "Lost"];
const STAGE_PROBS = ["10%", "25%", "50%", "75%", "100%", "0%"];

const USERS = [
  { initials: "SJ", name: "Sarah Jones", email: "s.jones@invensis.com", grad: "linear-gradient(135deg,#E8772E,#C9A84C)", role: "Sales Rep", status: "Active", statusColor: "var(--green)", lastLogin: "Today" },
  { initials: "MK", name: "Michael Khan", email: "m.khan@invensis.com", grad: "linear-gradient(135deg,#1B3A6B,#2E6EAF)", role: "Sales Rep", status: "Active", statusColor: "var(--green)", lastLogin: "Today" },
  { initials: "AP", name: "Aisha Patel", email: "a.patel@invensis.com", grad: "linear-gradient(135deg,#1A9E8F,#27AE60)", role: "Sales Rep", status: "Active", statusColor: "var(--green)", lastLogin: "Yesterday" },
  { initials: "RL", name: "Ryan Lee", email: "r.lee@invensis.com", grad: "linear-gradient(135deg,#7B4FA6,#9B6ED4)", role: "Sales Rep", status: "Away", statusColor: "var(--amber)", lastLogin: "2 days ago" },
];

const ROUTING_RULES = [
  { source: "Course Page Enquiry Form", stage: "sql", label: "SQL", minScore: "Any" },
  { source: "Inbound Call — Specific Course", stage: "sql", label: "SQL", minScore: "Any" },
  { source: "Referral", stage: "sql", label: "SQL", minScore: "Any" },
  { source: "Paid Ad Form (Course Landing Page)", stage: "sql", label: "SQL", minScore: "Any" },
  { source: "Course-Specific Brochure Download", stage: "mql", label: "MQL", minScore: "50" },
  { source: "Course-Specific Webinar", stage: "mql", label: "MQL", minScore: "50" },
  { source: "Generic Webinar Registration", stage: "lead", label: "Lead", minScore: "Any" },
  { source: "Generic Resource / Guide Download", stage: "lead", label: "Lead", minScore: "Any" },
  { source: "Blog Read / Social Click", stage: "contact", label: "Contact", minScore: "Any" },
];

const INTEGRATIONS = [
  { name: "CMS (Invensis Website)", desc: "Enquiry form webhooks → CRM lead capture", connected: true },
  { name: "LMS (Learning Platform)", desc: "Enrollment sync on deal Won → auto-creates LMS account", connected: true },
  { name: "Omni-channel (Call & Chat)", desc: "Inbound call/chat → lead creation + transcript logging", connected: true },
  { name: "Marketing Automation", desc: "Campaign leads → CRM + CRM segments → campaigns", connected: true },
  { name: "Invoicing Platform", desc: "Deal Won → auto-triggers invoice creation", connected: true },
  { name: "SendGrid (Email)", desc: "Outbound email delivery and tracking", connected: true },
  { name: "LinkedIn Ads", desc: "Ad form submissions → SQL auto-capture", connected: false },
];

const AUDIT_LOG = [
  { time: "Today 14:32", user: "Sarah Jones", action: "Deal Won", actionBg: "var(--green-soft)", actionColor: "var(--green)", record: "James Torres", detail: "AgilePM® · £3,200 · LMS triggered" },
  { time: "Today 14:18", user: "Michael Khan", action: "Stage Change", actionBg: "var(--blue-soft)", actionColor: "var(--blue)", record: "Emma Johnson", detail: "MQL → SQL · Score: 91" },
  { time: "Today 13:55", user: "AI System", action: "Score Update", actionBg: "var(--amber-soft)", actionColor: "var(--amber)", record: "Sarah Mitchell", detail: "Score: 74 → 61 (decay applied)" },
  { time: "Today 13:40", user: "Ravi Sharma", action: "Export", actionBg: "var(--surface)", actionColor: "var(--text-2)", record: "Contacts Table", detail: "CSV export · 284 records" },
  { time: "Today 13:12", user: "CMS Integration", action: "Lead Created", actionBg: "var(--green-soft)", actionColor: "var(--green)", record: "New SQL", detail: "ITIL® course page · Source: website_form" },
  { time: "Today 11:04", user: "Aisha Patel", action: "Note Added", actionBg: "var(--blue-soft)", actionColor: "var(--blue)", record: "David Chen", detail: "Call note: Proposal requested" },
];

export default function SettingsPage() {
  const [panel, setPanel] = useState<Panel>("profile");
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  return (
    <div style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
      {/* Left nav */}
      <div style={{ width: 200, borderRight: "1px solid var(--border)", background: "var(--white)", flexShrink: 0, position: "sticky", top: 0 }}>
        <div style={{ padding: "16px 16px 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>Settings</div>
        <div className="settings-nav">
          {NAV.map((n) => (
            <div key={n.key} className={`settings-nav-item${panel === n.key ? " active" : ""}`} onClick={() => setPanel(n.key)}>{n.label}</div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, minWidth: 0 }}>

        {/* PROFILE */}
        {panel === "profile" && (
          <>
            <div className="settings-section">
              <div className="settings-section-title">Your Profile</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: 16, background: "var(--surface)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff" }}>RS</div>
                <div><div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)" }}>Ravi Sharma</div><div style={{ fontSize: 13, color: "var(--text-3)" }}>Sales Manager · ravi.sharma@invensislearning.com</div></div>
                <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => showToast("📷 Opening photo upload...")}>Change Photo</button>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">First Name</label><input className="form-input" defaultValue="Ravi" /></div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Last Name</label><input className="form-input" defaultValue="Sharma" /></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue="ravi.sharma@invensislearning.com" /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+44 7700 123456" /></div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Default Dashboard</label><select className="form-input"><option>Kanban View</option><option>List View</option></select></div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Default Pipeline</label><select className="form-input"><option>B2C</option><option>B2B</option></select></div>
              </div>
              <button className="btn btn-primary" onClick={() => showToast("✅ Profile saved!")}>Save Changes</button>
            </div>
            <div className="settings-section">
              <div className="settings-section-title">Change Password</div>
              <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Confirm Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
              </div>
              <button className="btn btn-ghost" onClick={() => showToast("🔒 Password updated!")}>Update Password</button>
            </div>
          </>
        )}

        {/* USERS */}
        {panel === "users" && (
          <div className="settings-section">
            <div className="settings-section-title" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>User Management</span>
              <button className="btn btn-primary btn-sm" onClick={() => showToast("👤 Invite user form opening...")}>+ Invite User</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th></th></tr></thead>
              <tbody>
                {USERS.map((u) => (
                  <tr key={u.name}>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="rep-av" style={{ width: 28, height: 28, background: u.grad, fontSize: 10 }}>{u.initials}</div><strong>{u.name}</strong></div></td>
                    <td style={{ color: "var(--text-2)", fontSize: 12 }}>{u.email}</td>
                    <td><span className="badge" style={{ background: "var(--blue-soft)", color: "var(--blue)" }}>{u.role}</span></td>
                    <td><span style={{ color: u.statusColor, fontWeight: 600 }}>{u.status === "Active" ? "● Active" : "◐ Away"}</span></td>
                    <td style={{ color: "var(--text-3)", fontSize: 12 }}>{u.lastLogin}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => showToast(`✏ Editing ${u.name}...`)}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PIPELINE CONFIG */}
        {panel === "pipeline-cfg" && (
          <div className="settings-section">
            <div className="settings-section-title">Pipeline Stage Configuration</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div className="pipeline-toggle">
                <button className="toggle-btn active">B2C Stages</button>
                <button className="toggle-btn" onClick={() => showToast("Switching to B2B...")}>B2B Stages</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STAGES.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)" }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)", width: 20 }}>{i + 1}</span>
                  <input className="form-input" defaultValue={s} style={{ flex: 1 }} />
                  <select className="form-input" style={{ width: 120 }} defaultValue={STAGE_PROBS[i]}>{["0%", "10%", "25%", "50%", "75%", "100%"].map((p) => <option key={p}>{p}</option>)}</select>
                  <button className="btn btn-ghost btn-sm" onClick={() => showToast("🗑 Stage removed")}>✕</button>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => showToast("+ New stage added!")}>+ Add Stage</button>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => showToast("✅ Pipeline configuration saved!")}>Save Configuration</button>
          </div>
        )}

        {/* ROUTING */}
        {panel === "routing" && (
          <div className="settings-section">
            <div className="settings-section-title">Intent-Based Stage Routing Rules</div>
            <div style={{ background: "var(--blue-soft)", borderRadius: "var(--radius-sm)", padding: 14, marginBottom: 16, fontSize: 12.5, color: "var(--blue)" }}>
              🤖 These rules determine which stage a new lead enters based on source and behaviour signals. AI score acts as a secondary confirmation signal.
            </div>
            <table className="data-table">
              <thead><tr><th>Source / Behaviour</th><th>Entry Stage</th><th>Min AI Score</th><th>Active</th></tr></thead>
              <tbody>
                {ROUTING_RULES.map((r) => (
                  <tr key={r.source}>
                    <td>{r.source}</td>
                    <td><span className={`pill pill-${r.stage}`}>{r.label}</span></td>
                    <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-2)" }}>{r.minScore}</td>
                    <td><Toggle on /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => showToast("+ New rule added!")}>+ Add Rule</button>
              <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={() => showToast("✅ Routing rules saved!")}>Save Rules</button>
            </div>
          </div>
        )}

        {/* AI CONFIG */}
        {panel === "ai-cfg" && (
          <>
            <div className="settings-section">
              <div className="settings-section-title">AI Configuration</div>
              {[
                { title: "AI Lead Scoring", desc: "Auto-score all leads 0–100 on creation and activity" },
                { title: "Next-Best-Action Recommendations", desc: "Surface AI action suggestions on lead/SQL detail views" },
                { title: "Conversation Summaries", desc: "Auto-summarise calls and chats after completion" },
                { title: "Email Draft Assistant", desc: "Enable AI email drafting for sales reps at SQL and Opportunity stages" },
                { title: "Predictive Pipeline Forecasting", desc: "AI-powered revenue forecast on management dashboard" },
              ].map((t) => (
                <div key={t.title} className="toggle-row">
                  <div className="toggle-info"><div className="toggle-title">{t.title}</div><div className="toggle-desc">{t.desc}</div></div>
                  <Toggle on />
                </div>
              ))}
            </div>
            <div className="settings-section">
              <div className="settings-section-title">Scoring Thresholds</div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Min Score for MQL Auto-Route</label><input className="form-input" defaultValue="50" type="number" min={0} max={100} /></div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Score Decay After (hours)</label><input className="form-input" defaultValue="48" type="number" /></div>
              </div>
              <div className="form-group"><label className="form-label">AI Model</label><select className="form-input"><option>Claude (Anthropic) — Recommended</option><option>GPT-4o (OpenAI)</option></select></div>
              <button className="btn btn-primary" onClick={() => showToast("✅ AI configuration saved!")}>Save AI Settings</button>
            </div>
          </>
        )}

        {/* NOTIFICATIONS */}
        {panel === "notifications" && (
          <div className="settings-section">
            <div className="settings-section-title">Email Notification Preferences</div>
            {[
              { title: "New lead assigned", desc: "Immediate email when a lead is assigned to you" },
              { title: "Daily task digest", desc: "Overdue and today's tasks sent at 8:00 AM" },
              { title: "SQL cooling alerts", desc: "Notify when an SQL has no activity for 24+ hours" },
              { title: "Deal won / lost notifications", desc: "Team-wide notifications on deal outcomes" },
              { title: "Weekly performance summary", desc: "Monday 9:00 AM summary of team performance" },
              { title: "Account renewal alerts (60 days)", desc: "Notify account owner and CS manager before renewal" },
            ].map((n) => (
              <div key={n.title} className="toggle-row">
                <div className="toggle-info"><div className="toggle-title">{n.title}</div><div className="toggle-desc">{n.desc}</div></div>
                <Toggle on />
              </div>
            ))}
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => showToast("✅ Notification preferences saved!")}>Save Preferences</button>
          </div>
        )}

        {/* INTEGRATIONS */}
        {panel === "integrations" && (
          <div className="settings-section">
            <div className="settings-section-title">Platform Integrations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {INTEGRATIONS.map((intg) => (
                <div key={intg.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)", background: "var(--surface)" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{intg.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{intg.desc}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: intg.connected ? "var(--green)" : "var(--amber)", fontFamily: "'DM Mono',monospace" }}>{intg.connected ? "● Connected" : "◐ Pending"}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => showToast(`⚙ Opening ${intg.name} settings...`)}>{intg.connected ? "Configure" : "Connect"}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIT LOG */}
        {panel === "audit" && (
          <div className="settings-section">
            <div className="settings-section-title">Audit Log</div>
            <div className="filter-bar" style={{ marginBottom: 14 }}>
              <input className="filter-input" placeholder="🔍 Search audit log..." style={{ width: 240 }} />
              <select className="filter-input"><option>All Actions</option><option>Record Created</option><option>Stage Changed</option><option>Data Exported</option><option>User Login</option></select>
              <select className="filter-input"><option>All Users</option><option>Ravi Sharma</option><option>Sarah Jones</option></select>
            </div>
            <table className="data-table">
              <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Record</th><th>Details</th></tr></thead>
              <tbody>
                {AUDIT_LOG.map((a, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)", fontSize: 11 }}>{a.time}</td>
                    <td style={{ fontSize: 12 }}>{a.user}</td>
                    <td><span className="badge" style={{ background: a.actionBg, color: a.actionColor }}>{a.action}</span></td>
                    <td style={{ fontWeight: 600 }}>{a.record}</td>
                    <td style={{ fontSize: 12, color: "var(--text-2)" }}>{a.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GDPR */}
        {panel === "gdpr" && (
          <>
            <div className="settings-section">
              <div className="settings-section-title">GDPR Tools</div>
              <div style={{ background: "var(--amber-soft)", border: "1.5px solid var(--amber)", borderRadius: "var(--radius-sm)", padding: 14, marginBottom: 16, fontSize: 12.5, color: "#7D5A00" }}>
                ⚠ All GDPR operations are logged in the audit trail and are irreversible. Proceed with care.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="card">
                  <div className="card-header"><h3 className="card-title" style={{ fontSize: 14 }}>Right to Erasure</h3></div>
                  <div className="card-body">
                    <p style={{ fontSize: 12.5, color: "var(--text-2)", marginBottom: 12 }}>Permanently delete all personal data for a contact. This cannot be undone.</p>
                    <div className="form-group"><label className="form-label">Contact Email</label><input className="form-input" placeholder="contact@email.com" /></div>
                    <button className="btn btn-danger btn-sm" onClick={() => showToast("⚠ Erasure request submitted and logged")}>Submit Erasure Request</button>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header"><h3 className="card-title" style={{ fontSize: 14 }}>Data Export (Portability)</h3></div>
                  <div className="card-body">
                    <p style={{ fontSize: 12.5, color: "var(--text-2)", marginBottom: 12 }}>Export all personal data for a contact as a JSON or CSV file.</p>
                    <div className="form-group"><label className="form-label">Contact Email</label><input className="form-input" placeholder="contact@email.com" /></div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast("📊 Exporting as CSV...")}>Export CSV</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast("📄 Exporting as JSON...")}>Export JSON</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="settings-section" style={{ marginTop: 20 }}>
              <div className="settings-section-title">Consent Management</div>
              <div className="toggle-row">
                <div className="toggle-info"><div className="toggle-title">Require GDPR consent at capture</div><div className="toggle-desc">Block lead creation without confirmed consent checkbox</div></div>
                <Toggle on />
              </div>
              <div className="toggle-row">
                <div className="toggle-info"><div className="toggle-title">Auto-delete contacts after 2 years inactivity</div><div className="toggle-desc">GDPR Article 5 data minimisation compliance</div></div>
                <Toggle on={false} />
              </div>
              <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => showToast("✅ GDPR settings saved!")}>Save Settings</button>
            </div>
          </>
        )}
      </div>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
