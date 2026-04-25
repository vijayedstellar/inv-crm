"use client";
import { useState, useEffect } from "react";

type Contact = {
  id: string; firstName: string; lastName: string | null;
  email: string | null; source: string | null; courseInterest: string | null;
  score: number | null; stage: string | null; owner: string | null;
  lastActivityAt: string | null; accountName: string | null;
};

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

function scoreClass(s: number) { return s >= 80 ? "sc-hot" : s >= 60 ? "sc-blue" : s >= 40 ? "sc-warm" : "sc-cold"; }
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

const SOURCE_STAGE: Record<string, string> = {
  "Course Page Enquiry": "sql", "Inbound Call": "sql", "Referral": "sql", "Paid Ad": "sql",
  "Brochure Download": "mql", "Course Webinar": "mql",
  "Generic Webinar": "lead", "Resource Download": "lead",
  "Blog": "contact", "Social": "contact",
};

const BLANK = { firstName: "", lastName: "", email: "", phone: "", source: "Course Page Enquiry", courseInterest: "ITIL® Foundation", type: "B2C", owner: "Sarah Jones" };

export default function ContactsPage() {
  const [rows, setRows] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

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
  const display = filtered.length > 0 ? filtered : STATIC.filter((c) => {
    const q = search.toLowerCase();
    return !q || `${c.firstName} ${c.lastName} ${c.email} ${c.courseInterest} ${c.source}`.toLowerCase().includes(q);
  });

  const routedStage = SOURCE_STAGE[form.source] || "contact";

  async function handleSubmit() {
    if (!form.firstName.trim()) { showToast("⚠ First name is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName || undefined,
          email: form.email || undefined,
          phone: form.phone || undefined,
          source: form.source,
          courseInterest: form.courseInterest,
          type: form.type,
          owner: form.owner,
          stage: routedStage,
          score: 0,
          lastActivityAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("API error");
      const created = await res.json();
      const newContact: Contact = {
        id: created.id,
        firstName: created.firstName,
        lastName: created.lastName,
        email: created.email,
        source: created.source,
        courseInterest: created.courseInterest,
        score: created.score,
        stage: created.stage,
        owner: created.owner,
        lastActivityAt: created.lastActivityAt ?? new Date().toISOString(),
        accountName: null,
      };
      setRows((prev) => [newContact, ...prev]);
      setShowAdd(false);
      setForm(BLANK);
      showToast(`✅ ${form.firstName} added as ${routedStage.toUpperCase()}`);
    } catch {
      showToast("❌ Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="content-pad">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="filter-bar" style={{ flex: 1 }}>
          <input className="filter-input" placeholder="🔍 Search contacts..." style={{ width: 220 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="filter-input"><option>All Sources</option><option>Website Form</option><option>Inbound Call</option><option>Social</option><option>Blog</option><option>Referral</option></select>
          <select className="filter-input"><option>All Courses</option><option>ITIL® Foundation</option><option>PMP®</option><option>PRINCE2®</option><option>AgilePM®</option></select>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Contact</button>
        <button className="btn btn-ghost btn-sm" onClick={() => showToast("📊 Exporting...")}>↓ Export</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Source</th><th>Course Interest</th><th>Stage</th><th>AI Score</th><th>Owner</th><th>Last Activity</th><th></th></tr>
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
                <td><button className="btn btn-ghost btn-sm" onClick={() => showToast("+ Task created")}>+ Task</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      {showAdd && (
        <div className="modal-overlay" style={{ display: "flex" }} onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><div className="modal-title">Add Contact</div><div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>AI will score and route automatically</div></div>
              <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">First Name *</label><input className="form-input" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Last Name</label><input className="form-input" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+44 7700 000000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="form-group">
                <label className="form-label">Lead Source</label>
                <select className="form-input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                  <option>Course Page Enquiry</option><option>Inbound Call</option><option>Referral</option><option>Paid Ad</option>
                  <option>Brochure Download</option><option>Course Webinar</option>
                  <option>Generic Webinar</option><option>Resource Download</option>
                  <option>Blog</option><option>Social</option>
                </select>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1.5px solid var(--border)", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>🤖 AI will route to:</span>
                <span className={`pill pill-${routedStage}`}>{routedStage.toUpperCase()}</span>
                <span style={{ fontSize: 11, color: "var(--text-3)" }}>{routedStage === "sql" ? "High intent — direct enquiry" : routedStage === "mql" ? "Marketing qualified — nurture first" : routedStage === "lead" ? "Low intent — needs scoring" : "Awareness only"}</span>
              </div>
              <div className="form-group"><label className="form-label">Course Interest</label>
                <select className="form-input" value={form.courseInterest} onChange={(e) => setForm({ ...form, courseInterest: e.target.value })}>
                  <option>ITIL® Foundation</option><option>PMP® Certification</option><option>PRINCE2® Foundation</option><option>AgilePM® Foundation</option><option>PRINCE2 Agile®</option><option>CAPM® Certification</option><option>DevOps Foundation</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Type</label>
                  <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>B2C</option><option>B2B</option></select>
                </div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Assign To</label>
                  <select className="form-input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
                    <option>Sarah Jones</option><option>Michael Khan</option><option>Aisha Patel</option><option>Ryan Lee</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : "Create Contact"}</button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
