"use client";
import { useState } from "react";
import { KanbanWidget } from "@/components/dashboard-client";

const BLANK = { dealName: "", client: "", type: "B2C", dealStage: "Discovery", course: "ITIL® Foundation", amount: "", closeDate: "", prob: 50, owner: "Sarah Jones" };

export default function PipelinePage() {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  async function handleSubmit() {
    if (!form.dealName.trim()) { showToast("⚠ Deal name is required"); return; }
    setSaving(true);
    try {
      const name = form.client ? `${form.client} — ${form.dealName}` : form.dealName;
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type: form.type,
          dealStage: form.dealStage,
          course: form.course,
          amount: form.amount ? Number(form.amount) : undefined,
          closeDate: form.closeDate || undefined,
          probability: form.prob,
          ownerId: form.owner,
        }),
      });
      if (!res.ok) throw new Error();
      setShowAdd(false);
      setForm(BLANK);
      showToast(`✅ Deal "${name}" added to ${form.dealStage}!`);
    } catch {
      showToast("❌ Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: "20px 24px 0", display: "flex", flexDirection: "column", gap: 0, flex: 1, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <div className="filter-bar">
          <input className="filter-input" placeholder="🔍 Search deals..." style={{ width: 200 }} />
          <select className="filter-input"><option>All Reps</option><option>Sarah Jones</option><option>Michael Khan</option><option>Aisha Patel</option><option>Ryan Lee</option></select>
          <select className="filter-input"><option>All Courses</option><option>ITIL® Foundation</option><option>PMP®</option><option>PRINCE2®</option><option>AgilePM®</option></select>
          <select className="filter-input"><option>This Month</option><option>Last Month</option><option>This Quarter</option></select>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => setShowAdd(true)}>+ Add Deal</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}>
        <KanbanWidget full />
      </div>

      {/* Add Deal Modal */}
      {showAdd && (
        <div className="modal-overlay" style={{ display: "flex" }} onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><div className="modal-title">Add Deal</div><div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>New opportunity in the pipeline</div></div>
              <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Deal Name *</label><input className="form-input" placeholder="e.g. PRINCE2® Foundation" value={form.dealName} onChange={(e) => setForm({ ...form, dealName: e.target.value })} /></div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Client / Contact</label><input className="form-input" placeholder="e.g. Raj Patel or TechCorp Ltd" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Type</label>
                  <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>B2C</option><option>B2B</option></select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Pipeline Stage</label>
                  <select className="form-input" value={form.dealStage} onChange={(e) => setForm({ ...form, dealStage: e.target.value })}>
                    <option>Discovery</option><option>Proposal Sent</option><option>Negotiation</option><option>Verbal</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Course</label>
                  <select className="form-input" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
                    <option>ITIL® Foundation</option><option>PMP® Certification</option><option>PRINCE2® Foundation</option><option>AgilePM® Foundation</option><option>PRINCE2 Agile®</option><option>CAPM® Certification</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Value (£)</label><input className="form-input" type="number" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Expected Close</label><input className="form-input" type="date" value={form.closeDate} onChange={(e) => setForm({ ...form, closeDate: e.target.value })} /></div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Probability: {form.prob}%</label>
                  <input type="range" min={0} max={100} value={form.prob} onChange={(e) => setForm({ ...form, prob: Number(e.target.value) })} style={{ width: "100%", accentColor: "var(--accent)" }} />
                </div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Owner</label>
                  <select className="form-input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
                    <option>Sarah Jones</option><option>Michael Khan</option><option>Aisha Patel</option><option>Ryan Lee</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : "Create Deal"}</button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
