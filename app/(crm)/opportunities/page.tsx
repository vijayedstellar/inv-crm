"use client";
import { useState } from "react";

type Opp = { id?: string; name: string; type: string; stage: string; course: string; value: string; close: string; prob: number; owner: string; };

const INIT_OPPS: Opp[] = [
  { name: "Raj Patel — PRINCE2® Foundation", type: "B2C", stage: "Negotiation", course: "PRINCE2®", value: "£2,200", close: "Apr 30", prob: 88, owner: "S. Jones" },
  { name: "David Chen — PMP®", type: "B2C", stage: "Negotiation", course: "PMP®", value: "£3,800", close: "May 5", prob: 79, owner: "A. Patel" },
  { name: "James Torres — AgilePM®", type: "B2C", stage: "Verbal", course: "AgilePM®", value: "£3,200", close: "Apr 28", prob: 95, owner: "S. Jones" },
  { name: "Nexus Corp — PMP® 5 seats", type: "B2B", stage: "Proposal Sent", course: "PMP®", value: "£28,000", close: "May 28", prob: 74, owner: "M. Khan" },
  { name: "TechFlow Ltd — PRINCE2® 8 seats", type: "B2B", stage: "Proposal Sent", course: "PRINCE2®", value: "£17,600", close: "Jun 2", prob: 81, owner: "M. Khan" },
  { name: "GlobalTech — ITIL® 12 seats", type: "B2B", stage: "Negotiation", course: "ITIL®", value: "£38,400", close: "May 15", prob: 86, owner: "A. Patel" },
];

function probColor(p: number) { return p >= 80 ? "var(--green)" : p >= 70 ? "var(--accent)" : "var(--amber)"; }

const BLANK = { dealName: "", client: "", type: "B2C", dealStage: "Discovery", course: "ITIL® Foundation", amount: "", closeDate: "", prob: 50, owner: "Sarah Jones" };

function AddDealModal({ onClose, onSave }: { onClose: () => void; onSave: (o: Opp) => void }) {
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit() {
    if (!form.dealName.trim()) { setErr("Deal name is required"); return; }
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
      const created = await res.json();
      const displayVal = form.amount ? `£${Number(form.amount).toLocaleString()}` : "—";
      const closeDisplay = form.closeDate ? new Date(form.closeDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "TBD";
      const ownerInitials = form.owner.split(" ").map((w) => w[0]).join(". ") + ".";
      onSave({ id: created.id, name, type: form.type, stage: form.dealStage, course: form.course, value: displayVal, close: closeDisplay, prob: form.prob, owner: ownerInitials });
    } catch {
      setErr("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" style={{ display: "flex" }} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div><div className="modal-title">Add Deal</div><div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>New opportunity in the pipeline</div></div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {err && <div style={{ color: "var(--red)", fontSize: 12, marginBottom: 10 }}>{err}</div>}
          <div className="form-group"><label className="form-label">Deal Name *</label><input className="form-input" placeholder="e.g. PRINCE2® Foundation" value={form.dealName} onChange={(e) => setForm({ ...form, dealName: e.target.value })} /></div>
          <div style={{ display: "flex", gap: 16 }}>
            <div className="form-group" style={{ flex: 1 }}><label className="form-label">Client / Contact</label><input className="form-input" placeholder="e.g. Raj Patel or TechCorp Ltd" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
            <div className="form-group" style={{ flex: 1 }}><label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>B2C</option><option>B2B</option></select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div className="form-group" style={{ flex: 1 }}><label className="form-label">Stage</label>
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
            <div className="form-group" style={{ flex: 1 }}><label className="form-label">Close Date</label><input className="form-input" type="date" value={form.closeDate} onChange={(e) => setForm({ ...form, closeDate: e.target.value })} /></div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">AI Probability: {form.prob}%</label>
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
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : "Create Deal"}</button>
        </div>
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [opps, setOpps] = useState<Opp[]>(INIT_OPPS);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  async function markWon(opp: Opp) {
    setOpps((prev) =>
      prev.filter((o) => (opp.id ? o.id !== opp.id : o.name !== opp.name))
    );
    showToast("🎉 Deal marked Won! LMS + Invoice triggered.");
    if (opp.id) {
      fetch(`/api/opportunities/${opp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: "won" }),
      }).catch(() => {});
    }
  }

  const filtered = opps.filter((o) => !search || `${o.name} ${o.course} ${o.stage}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="content-pad">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <div className="stat-card"><div className="stat-label">Open Value</div><div className="stat-value">£312k</div><div className="stat-sub">18 active opportunities</div></div>
        <div className="stat-card"><div className="stat-label">Won This Month</div><div className="stat-value" style={{ color: "var(--green)" }}>£124k</div><div className="stat-sub">11 deals closed</div></div>
        <div className="stat-card"><div className="stat-label">Avg Deal Size</div><div className="stat-value">£17.3k</div><div className="stat-sub">↑ 8% vs last month</div></div>
        <div className="stat-card"><div className="stat-label">Win Rate</div><div className="stat-value" style={{ color: "var(--accent)" }}>61%</div><div className="stat-sub">Industry avg: 47%</div></div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="filter-bar" style={{ flex: 1 }}>
          <input className="filter-input" placeholder="🔍 Search opportunities..." style={{ width: 220 }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="filter-input"><option>All Stages</option><option>Discovery</option><option>Proposal Sent</option><option>Negotiation</option><option>Verbal</option></select>
          <select className="filter-input"><option>All Types</option><option>B2C</option><option>B2B</option></select>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Deal</button>
        <button className="btn btn-ghost btn-sm" onClick={() => showToast("📊 Exporting opportunities...")}>↓ Export</button>
      </div>
      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th>Deal Name</th><th>Type</th><th>Stage</th><th>Course</th><th>Value</th><th>Close Date</th><th>AI Prob.</th><th>Owner</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={i}>
                  <td className="td-name">{o.name}</td>
                  <td><span className="badge" style={{ background: o.type === "B2B" ? "var(--purple-soft)" : "var(--blue-soft)", color: o.type === "B2B" ? "var(--purple)" : "var(--blue)" }}>{o.type}</span></td>
                  <td><span className="pill pill-opp">{o.stage}</span></td>
                  <td>{o.course}</td>
                  <td style={{ fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{o.value}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{o.close}</td>
                  <td><span style={{ color: probColor(o.prob), fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{o.prob}%</span></td>
                  <td style={{ color: "var(--text-3)" }}>{o.owner}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" style={{ borderColor: "var(--accent)", color: "var(--accent)" }} onClick={() => showToast("📄 Opening Quote Builder...")}>📄 Quote</button>
                      <button className="btn btn-ghost btn-sm" style={{ borderColor: "var(--blue)", color: "var(--blue)" }} onClick={() => showToast("📋 Opening Contract Builder...")}>📋 Contract</button>
                      <button className="btn btn-success btn-sm" onClick={() => markWon(o)}>Won ✓</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <AddDealModal
          onClose={() => setShowAdd(false)}
          onSave={(o) => { setOpps((prev) => [o, ...prev]); setShowAdd(false); showToast(`✅ Deal "${o.name}" created!`); }}
        />
      )}
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
