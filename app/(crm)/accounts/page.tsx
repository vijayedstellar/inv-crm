"use client";
import { useState } from "react";

const ACCOUNTS = [
  {
    id: "1", name: "GlobalTech", domain: "globaltech.com", industry: "Technology", size: "500-1000", type: "B2B",
    ltv: "£120k", health: 88, openDeals: 1, openValue: "£38,400", contacts: 12, certProg: "ITIL® → PRINCE2®",
    upsell: ["PRINCE2® for 6 IT managers", "CAPM® add-on for junior staff", "DevOps Foundation — 4 seats"],
    bg: "linear-gradient(135deg,#1B3A6B,#2E6EAF)"
  },
  {
    id: "2", name: "Nexus Corp", domain: "nexuscorp.com", industry: "Consulting", size: "100-500", type: "B2B",
    ltv: "£72k", health: 74, openDeals: 2, openValue: "£28,000", contacts: 6, certProg: "PMP® → AgilePM®",
    upsell: ["AgilePM® for project leads", "PRINCE2 Agile® upgrade", "CAPM® for associates"],
    bg: "linear-gradient(135deg,#7B4FA6,#9B6ED4)"
  },
  {
    id: "3", name: "TechFlow Ltd", domain: "techflow.io", industry: "Software", size: "50-100", type: "B2B",
    ltv: "£48k", health: 81, openDeals: 1, openValue: "£17,600", contacts: 4, certProg: "PRINCE2® → Agile",
    upsell: ["AgilePM® for dev leads", "ITIL® for ops team"],
    bg: "linear-gradient(135deg,#1A9E8F,#27AE60)"
  },
  {
    id: "4", name: "Apex Solutions", domain: "apexsolutions.co.uk", industry: "Finance", size: "1000+", type: "B2B",
    ltv: "£95k", health: 65, openDeals: 0, openValue: "—", contacts: 8, certProg: "PMP® batch renewal",
    upsell: ["PMP® renewal for 6 PMs", "Agile transformation — 12 seats"],
    bg: "linear-gradient(135deg,#E8772E,#C9A84C)"
  },
  {
    id: "5", name: "Horizon Consulting", domain: "horizonconsulting.com", industry: "Management", size: "100-500", type: "B2B",
    ltv: "£58k", health: 92, openDeals: 0, openValue: "—", contacts: 3, certProg: "AgilePM® → PRINCE2 Agile®",
    upsell: ["PRINCE2 Agile® for senior PMs", "PMP® for client-facing staff"],
    bg: "linear-gradient(135deg,#2E6EAF,#1A9E8F)"
  },
];

function healthColor(h: number) { return h >= 80 ? "var(--green)" : h >= 60 ? "var(--amber)" : "var(--red)"; }
function healthLabel(h: number) { return h >= 80 ? "Healthy" : h >= 60 ? "At Risk" : "Critical"; }

const ACC_BLANK = { name: "", domain: "", industry: "Technology", size: "100-500", type: "B2B" };

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [selected, setSelected] = useState<typeof ACCOUNTS[0] | null>(null);
  const [tab, setTab] = useState("contacts-tab");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(ACC_BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  async function handleAddAccount() {
    if (!form.name.trim()) { showToast("⚠ Account name is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, domain: form.domain || undefined, industry: form.industry, size: form.size, type: form.type, healthScore: 75 }),
      });
      if (!res.ok) throw new Error();
      const newAcc = {
        id: String(Date.now()), name: form.name, domain: form.domain, industry: form.industry,
        size: form.size, type: form.type, ltv: "£0", health: 75, openDeals: 0,
        openValue: "—", contacts: 0, certProg: "—", upsell: [],
        bg: "linear-gradient(135deg,#1B3A6B,#2E6EAF)",
      };
      setAccounts((prev) => [...prev, newAcc]);
      setShowAdd(false);
      setForm(ACC_BLANK);
      showToast(`✅ ${form.name} added!`);
    } catch {
      showToast("❌ Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="content-pad">
      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
        <div className="stat-card"><div className="stat-label">Total Accounts</div><div className="stat-value">12</div><div className="stat-sub">8 B2B · 4 B2C Enterprise</div></div>
        <div className="stat-card"><div className="stat-label">Active Deals</div><div className="stat-value" style={{ color: "var(--teal)" }}>6</div><div className="stat-sub">Across 5 accounts</div></div>
        <div className="stat-card"><div className="stat-label">Total Account Value</div><div className="stat-value" style={{ color: "var(--green)" }}>£284k</div><div className="stat-sub">Lifetime contracted</div></div>
        <div className="stat-card"><div className="stat-label">Contacts Mapped</div><div className="stat-value" style={{ color: "var(--blue)" }}>34</div><div className="stat-sub">Across all accounts</div></div>
        <div className="stat-card"><div className="stat-label">Renewal Risk</div><div className="stat-value" style={{ color: "var(--red)" }}>2</div><div className="stat-sub">Contracts expiring 90d</div></div>
      </div>

      {/* Account Cards header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Account</button>
      </div>

      {/* Account Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {accounts.map((a) => (
          <div key={a.id} className="account-card" onClick={() => setSelected(a)}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 700, fontFamily: "'Playfair Display',serif", flexShrink: 0 }}>
                {a.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>{a.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{a.industry} · {a.size} employees</div>
              </div>
              <span className="badge" style={{ background: "var(--blue-soft)", color: "var(--blue)" }}>{a.type}</span>
            </div>

            {/* Health Score */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>HEALTH</div>
              <div className="prog-bg" style={{ flex: 1, margin: 0 }}><div className="prog-fill" style={{ width: `${a.health}%`, background: healthColor(a.health) }} /></div>
              <span style={{ fontSize: 11, fontWeight: 700, color: healthColor(a.health), fontFamily: "'DM Mono',monospace" }}>{a.health}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "8px 10px" }}>
                <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono',monospace" }}>LTV</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)", fontFamily: "'Playfair Display',serif" }}>{a.ltv}</div>
              </div>
              <div style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "8px 10px" }}>
                <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono',monospace" }}>Pipeline</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--teal)", fontFamily: "'DM Mono',monospace" }}>{a.openValue}</div>
              </div>
              <div style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "8px 10px" }}>
                <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Mono',monospace" }}>Contacts</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>{a.contacts}</div>
              </div>
            </div>

            <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 8 }}>
              <div style={{ fontSize: 10, color: "var(--teal)", fontFamily: "'DM Mono',monospace", fontWeight: 700, marginBottom: 4 }}>🤖 AI UPSELL</div>
              <div style={{ fontSize: 11, color: "var(--text-2)" }}>{a.upsell[0]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Detail Modal */}
      {selected && (
        <div className="modal-overlay show" onClick={() => setSelected(null)}>
          <div className="modal modal-wide" style={{ maxWidth: 900, width: "96vw" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ background: "var(--navy)", borderRadius: "var(--radius) var(--radius) 0 0" }}>
              <div>
                <div className="modal-title" style={{ color: "#fff", fontFamily: "'Playfair Display',serif" }}>{selected.name}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", marginTop: 2, fontFamily: "'DM Mono',monospace" }}>{selected.type} · {selected.industry} · {selected.contacts} contacts</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button className="btn btn-primary btn-sm" onClick={() => showToast("📄 Opening Quote Builder...")}>📄 New Quote</button>
                <button className="btn btn-ghost btn-sm" style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }} onClick={() => showToast("📋 Opening Contract Builder...")}>📋 New Contract</button>
                <button className="modal-close" style={{ color: "rgba(255,255,255,0.6)" }} onClick={() => setSelected(null)}>✕</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", minHeight: 500 }}>
              <div style={{ overflow: "auto", maxHeight: "65vh", borderRight: "1.5px solid var(--border)" }}>
                <div className="tab-row" style={{ padding: "0 20px", position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
                  {["contacts-tab", "deals-tab", "timeline-tab", "certs-tab", "vendor-tab"].map((t) => (
                    <div key={t} className={`tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                      {t === "contacts-tab" ? "Contacts" : t === "deals-tab" ? "Deals" : t === "timeline-tab" ? "Timeline" : t === "certs-tab" ? "Certifications" : "🏛 Vendor"}
                    </div>
                  ))}
                </div>
                <div style={{ padding: 20 }}>
                  {tab === "contacts-tab" && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>Contact Hierarchy</div>
                      {[
                        { name: "Maria Santos", role: "Head of L&D", email: "m.santos@" + selected.domain, level: "Decision Maker" },
                        { name: "Tom Bright", role: "L&D Coordinator", email: "t.bright@" + selected.domain, level: "Influencer" },
                        { name: "Sam Rivers", role: "Training Admin", email: "s.rivers@" + selected.domain, level: "User" },
                      ].map((c) => (
                        <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--surface2)" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,var(--navy-light),var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.name.split(" ").map(n => n[0]).join("")}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text-3)" }}>{c.role} · {c.email}</div>
                          </div>
                          <span className="badge" style={{ background: c.level === "Decision Maker" ? "var(--green-soft)" : "var(--surface2)", color: c.level === "Decision Maker" ? "var(--green)" : "var(--text-3)" }}>{c.level}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {tab === "deals-tab" && (
                    <div>
                      {selected.openDeals > 0 ? (
                        <div style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: 14 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 4 }}>{selected.name} — {selected.industry} Training</div>
                          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                            <div><div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>VALUE</div><div style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)" }}>{selected.openValue}</div></div>
                            <div><div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>STAGE</div><span className="pill pill-opp">Negotiation</span></div>
                            <div><div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>PROBABILITY</div><div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)" }}>86%</div></div>
                          </div>
                        </div>
                      ) : <p style={{ color: "var(--text-3)", fontSize: 13 }}>No open deals for this account.</p>}
                    </div>
                  )}
                  {tab === "timeline-tab" && (
                    <div className="timeline">
                      {[
                        { icon: "✅", bg: "var(--green-soft)", t: "Contract Signed", d: "MSA 2025 executed — 12 ITIL® seats", time: "Apr 24, 2025" },
                        { icon: "📄", bg: "var(--blue-soft)", t: "Proposal Accepted", d: "£38,400 proposal accepted by Maria Santos", time: "Apr 20, 2025" },
                        { icon: "📞", bg: "var(--teal-soft)", t: "Discovery Call", d: "Identified 12-seat ITIL® requirement", time: "Apr 10, 2025" },
                        { icon: "✉", bg: "var(--amber-soft)", t: "First Contact", d: "Initial outreach via LinkedIn", time: "Mar 28, 2025" },
                      ].map((tl) => (
                        <div key={tl.t} className="tl-item">
                          <div className="tl-dot" style={{ background: tl.bg }}>{tl.icon}</div>
                          <div className="tl-body">
                            <div className="tl-title">{tl.t}</div>
                            <div className="tl-desc">{tl.d}</div>
                            <div className="tl-time">{tl.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {tab === "certs-tab" && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", fontFamily: "'DM Mono',monospace", marginBottom: 12 }}>Certification Progression</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        {selected.certProg.split(" → ").map((cert, i, arr) => (
                          <>
                            <div key={cert} style={{ background: i === 0 ? "var(--green-soft)" : "var(--surface2)", border: `1.5px solid ${i === 0 ? "var(--green)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", padding: "10px 14px", textAlign: "center" }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? "var(--green)" : "var(--text-2)" }}>{cert}</div>
                              <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{i === 0 ? "Completed" : "Recommended Next"}</div>
                            </div>
                            {i < arr.length - 1 && <div style={{ fontSize: 18, color: "var(--text-3)" }}>→</div>}
                          </>
                        ))}
                      </div>
                    </div>
                  )}
                  {tab === "vendor-tab" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ background: "var(--green-soft)", border: "1.5px solid var(--green)", borderRadius: 10, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#fff", flexShrink: 0 }}>✓</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", fontFamily: "'DM Mono',monospace", textTransform: "uppercase" }}>Registered Vendor</div>
                          <div style={{ fontSize: 11.5, color: "var(--text-2)", marginTop: 1 }}>Registration active · Last verified Mar 2025</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 8 }}>🔐 Portal Details</div>
                        <div style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)", padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
                          <div><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", marginBottom: 3 }}>Portal Name</div><div style={{ fontWeight: 600, color: "var(--navy)" }}>SAP Ariba Supplier Portal</div></div>
                          <div><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", marginBottom: 3 }}>Vendor ID</div><div style={{ fontWeight: 700, color: "var(--navy)", fontFamily: "'DM Mono',monospace" }}>INV-2024-GT-0041</div></div>
                          <div><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", marginBottom: 3 }}>Login</div><div style={{ color: "var(--blue)" }}>vendor@invensislearning.com</div></div>
                          <div><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", marginBottom: 3 }}>2FA Contact</div><div>+44 7700 900123</div></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Right Sidebar */}
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, overflow: "auto", maxHeight: "65vh" }}>
                <div style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)", padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>Account Info</div>
                  {[["Domain", selected.domain], ["Industry", selected.industry], ["Size", selected.size + " employees"], ["Type", selected.type], ["LTV", selected.ltv]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                      <span style={{ color: "var(--text-3)" }}>{k}</span>
                      <span style={{ fontWeight: 500, color: "var(--navy)" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)", padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", fontFamily: "'DM Mono',monospace", marginBottom: 10 }}>Account Health</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: healthColor(selected.health) }}>{selected.health}</div>
                  <div style={{ fontSize: 11, color: healthColor(selected.health), fontWeight: 600 }}>{healthLabel(selected.health)}</div>
                  <div className="prog-bg" style={{ marginTop: 8 }}>
                    <div className="prog-fill" style={{ width: `${selected.health}%`, background: healthColor(selected.health) }} />
                  </div>
                </div>
                <div style={{ background: "linear-gradient(135deg,rgba(26,158,143,0.08),rgba(46,110,175,0.06))", border: "1.5px solid var(--teal)", borderRadius: "var(--radius-sm)", padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--teal)", fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>🤖 AI Upsell Signals</div>
                  {selected.upsell.map((u) => (
                    <div key={u} style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 6, display: "flex", gap: 6 }}>
                      <span style={{ color: "var(--teal)", flexShrink: 0 }}>↑</span> {u}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Account Modal */}
      {showAdd && (
        <div className="modal-overlay" style={{ display: "flex" }} onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><div className="modal-title">Add Account</div><div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>New B2B company profile</div></div>
              <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Company Name *</label><input className="form-input" placeholder="e.g. Acme Corp Ltd" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Domain</label><input className="form-input" placeholder="e.g. acmecorp.com" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} /></div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Industry</label>
                  <select className="form-input" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                    <option>Technology</option><option>Finance</option><option>Healthcare</option><option>Consulting</option><option>Manufacturing</option><option>Retail</option><option>Government</option><option>Education</option><option>Software</option><option>Management</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Company Size</label>
                  <select className="form-input" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                    <option>1-50</option><option>50-100</option><option>100-500</option><option>500-1000</option><option>1000+</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Account Type</label>
                <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>B2B</option><option>B2C</option></select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddAccount} disabled={saving}>{saving ? "Saving..." : "Create Account"}</button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
