"use client";
import { useState, useEffect } from "react";

type Lead = { id?: string; name: string; email: string; source: string; course: string; score: number; days: number; owner: string; };

const INIT_LEADS: Lead[] = [
  { name: "James Park", email: "j.park@email.com", source: "Generic Webinar", course: "Project Mgmt (General)", score: 52, days: 3, owner: "S. Jones" },
  { name: "Anna Fischer", email: "a.fischer@email.com", source: "Guide Download", course: "ITSM (General)", score: 48, days: 5, owner: "M. Khan" },
  { name: "David Wright", email: "d.wright@email.com", source: "Generic Webinar", course: "Agile (General)", score: 55, days: 2, owner: "A. Patel" },
  { name: "Yuki Tanaka", email: "y.tanaka@email.com", source: "Resource Download", course: "IT Governance", score: 43, days: 7, owner: "R. Lee" },
  { name: "Marco Rossi", email: "m.rossi@email.com", source: "Generic Webinar", course: "Quality Mgmt", score: 50, days: 4, owner: "S. Jones" },
  { name: "Tom Bradley", email: "t.bradley@email.com", source: "Social", course: "PMP®", score: 38, days: 9, owner: "S. Jones" },
  { name: "Anna Chen", email: "a.chen@email.com", source: "Blog Download", course: "DevOps Foundation", score: 45, days: 6, owner: "M. Khan" },
];

const SOURCE_OPTS = [
  { label: "Course Page Enquiry → SQL", stage: "sql", note: "High intent — direct enquiry" },
  { label: "Inbound Call (specific course) → SQL", stage: "sql", note: "High intent — direct call" },
  { label: "Referral → SQL", stage: "sql", note: "High trust — referred contact" },
  { label: "Paid Ad Form → SQL", stage: "sql", note: "High intent — course landing page" },
  { label: "Course Brochure Download → MQL", stage: "mql", note: "Content intent — nurture first" },
  { label: "Course-Specific Webinar → MQL", stage: "mql", note: "Engaged — needs qualification" },
  { label: "Generic Webinar Registration → Lead", stage: "lead", note: "Low intent — scoring required" },
  { label: "Guide / Resource Download → Lead", stage: "lead", note: "Awareness stage — nurture" },
  { label: "Blog / Social → Contact", stage: "contact", note: "Awareness only" },
];

function scoreClass(s: number) { return s >= 80 ? "sc-hot" : s >= 60 ? "sc-blue" : s >= 40 ? "sc-warm" : "sc-cold"; }

const BLANK = { firstName: "", lastName: "", email: "", phone: "", sourceIdx: 6, courseInterest: "ITIL® Foundation", notes: "", owner: "Sarah Jones" };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INIT_LEADS);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  useEffect(() => {
    fetch("/api/contacts?stage=lead")
      .then((r) => r.json())
      .then((rows: Array<{ id: string; firstName: string; lastName?: string; email?: string; source?: string; courseInterest?: string; score?: number; owner?: string }>) => {
        if (!Array.isArray(rows) || rows.length === 0) return;
        const mapped: Lead[] = rows.map((r) => ({
          id: r.id,
          name: `${r.firstName}${r.lastName ? " " + r.lastName : ""}`,
          email: r.email ?? "",
          source: r.source ?? "",
          course: r.courseInterest ?? "",
          score: r.score ?? 0,
          days: 0,
          owner: r.owner ?? "",
        }));
        setLeads(mapped);
      })
      .catch(() => {});
  }, []);

  function removeLead(lead: Lead) {
    setLeads((prev) =>
      prev.filter((l) => (lead.id ? l.id !== lead.id : l.name !== lead.name || l.email !== lead.email))
    );
  }

  async function promoteToMQL(lead: Lead) {
    removeLead(lead);
    showToast(`✅ ${lead.name} promoted to MQL!`);
    if (lead.id) {
      fetch(`/api/contacts/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: "mql" }),
      }).catch(() => {});
    }
  }

  const filtered = leads.filter((l) => !search || `${l.name} ${l.email} ${l.course} ${l.source}`.toLowerCase().includes(search.toLowerCase()));
  const selectedSource = SOURCE_OPTS[form.sourceIdx];

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
          source: selectedSource.label.split(" → ")[0],
          courseInterest: form.courseInterest,
          stage: selectedSource.stage,
          owner: form.owner,
          score: 0,
        }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      const newLead: Lead = {
        id: created.id,
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        source: selectedSource.label.split(" → ")[0],
        course: form.courseInterest,
        score: 0,
        days: 0,
        owner: form.owner.split(" ")[0][0] + ". " + form.owner.split(" ").slice(-1)[0],
      };
      if (selectedSource.stage === "lead") {
        setLeads((prev) => [newLead, ...prev]);
      }
      setShowAdd(false);
      setForm(BLANK);
      showToast(`✅ ${form.firstName} created as ${selectedSource.stage.toUpperCase()}`);
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
          <input className="filter-input" placeholder="🔍 Search leads..." style={{ width: 220 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="filter-input"><option>All Sources</option><option>Generic Webinar</option><option>Guide Download</option><option>Resource Download</option></select>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Lead</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Source</th><th>Course Interest</th><th>AI Score</th><th>Days in Stage</th><th>Owner</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr key={l.id ?? i}>
                <td className="td-name">{l.name}</td>
                <td>{l.email}</td>
                <td style={{ color: "var(--text-3)" }}>{l.source}</td>
                <td>{l.course}</td>
                <td><span className={`score-badge ${scoreClass(l.score)}`}>{l.score}</span></td>
                <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{l.days}d</td>
                <td style={{ color: "var(--text-3)" }}>{l.owner}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => promoteToMQL(l)}>→ MQL</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      {showAdd && (
        <div className="modal-overlay" style={{ display: "flex" }} onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><div className="modal-title">Add Lead</div><div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>AI will score and route automatically</div></div>
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
                <select className="form-input" value={form.sourceIdx} onChange={(e) => setForm({ ...form, sourceIdx: Number(e.target.value) })}>
                  {SOURCE_OPTS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
                </select>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--surface)", border: "1.5px solid var(--border)", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>🤖 AI will route to:</span>
                <span className={`pill pill-${selectedSource.stage}`}>{selectedSource.stage.toUpperCase()}</span>
                <span style={{ fontSize: 11, color: "var(--text-3)" }}>{selectedSource.note}</span>
              </div>
              <div className="form-group"><label className="form-label">Course Interest</label>
                <select className="form-input" value={form.courseInterest} onChange={(e) => setForm({ ...form, courseInterest: e.target.value })}>
                  <option>ITIL® Foundation</option><option>PMP® Certification</option><option>PRINCE2® Foundation</option><option>AgilePM® Foundation</option><option>PRINCE2 Agile®</option><option>CAPM® Certification</option><option>DevOps Foundation</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Assign To</label>
                  <select className="form-input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
                    <option>Sarah Jones</option><option>Michael Khan</option><option>Aisha Patel</option><option>Ryan Lee</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="Initial notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ height: 70 }} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : "Create Lead"}</button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
