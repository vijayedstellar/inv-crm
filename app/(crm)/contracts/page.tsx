"use client";
import { useState } from "react";

const CONTRACTS = [
  { num: "CNT-2024-001", client: "GlobalTech", deal: "ITIL® 12 seats", currency: "GBP", value: "£38,400", status: "Signed", signed: "Jan 12, 2025", expiry: "Jun 15, 2025" },
  { num: "CNT-2024-002", client: "Nexus Corp", deal: "PMP® 5 seats", currency: "GBP", value: "£28,000", status: "Sent", signed: "—", expiry: "May 28, 2025" },
  { num: "CNT-2024-003", client: "TechFlow Ltd", deal: "PRINCE2® 8 seats", currency: "GBP", value: "£17,600", status: "Draft", signed: "—", expiry: "Jun 2, 2025" },
  { num: "CNT-2024-004", client: "Apex Solutions", deal: "PMP® Renewal", currency: "GBP", value: "£42,000", status: "Signed", signed: "Feb 3, 2025", expiry: "Jun 22, 2025" },
];

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  Signed: { bg: "var(--green-soft)", color: "var(--green)" },
  Sent: { bg: "var(--amber-soft)", color: "var(--amber)" },
  Draft: { bg: "var(--surface)", color: "var(--text-2)" },
  Expired: { bg: "var(--red-soft)", color: "var(--red)" },
};

export default function ContractsPage() {
  const [filter, setFilter] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const rows = filter ? CONTRACTS.filter((c) => c.status === filter) : CONTRACTS;

  return (
    <div className="content-pad">
      {/* KPI Strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "wrap" }}>
          <div className="stat-card" style={{ flex: 1, minWidth: 140 }}><div className="stat-label">Active Contracts</div><div className="stat-value" style={{ color: "var(--navy)" }}>4</div><div className="stat-sub">2 B2B · 2 B2C</div></div>
          <div className="stat-card" style={{ flex: 1, minWidth: 140 }}><div className="stat-label">Pending Signature</div><div className="stat-value" style={{ color: "var(--amber)" }}>2</div><div className="stat-sub">Awaiting client</div></div>
          <div className="stat-card" style={{ flex: 1, minWidth: 140 }}><div className="stat-label">Total Contracted</div><div className="stat-value" style={{ color: "var(--green)" }}>£93,400</div><div className="stat-sub">This quarter</div></div>
          <div className="stat-card" style={{ flex: 1, minWidth: 140 }}><div className="stat-label">Renewing (90 days)</div><div className="stat-value" style={{ color: "var(--accent)" }}>1</div><div className="stat-sub">£42,000 at risk</div></div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowBuilder(true)}>+ New Contract</button>
      </div>

      {/* Contracts Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Contracts</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <select className="filter-input" style={{ width: 130, fontSize: 12 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Signed">Signed</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr><th>Contract #</th><th>Client</th><th>Linked Deal</th><th>Currency</th><th>Value</th><th>Status</th><th>Signed Date</th><th>Expiry</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.num}>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--blue)" }}>{c.num}</td>
                  <td className="td-name">{c.client}</td>
                  <td style={{ color: "var(--text-2)" }}>{c.deal}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{c.currency}</td>
                  <td style={{ fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{c.value}</td>
                  <td><span className="badge" style={{ background: STATUS_COLOR[c.status]?.bg, color: STATUS_COLOR[c.status]?.color }}>{c.status}</span></td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)", fontSize: 11 }}>{c.signed}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)", fontSize: 11 }}>{c.expiry}</td>
                  <td>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => showToast("📄 Opening contract...")}>View</button>
                      {c.status !== "Signed" && (
                        <button className="btn btn-ghost btn-sm" style={{ borderColor: "var(--green)", color: "var(--green)" }} onClick={() => showToast("✉ Sending for signature...")}>Send</button>
                      )}
                      {c.status === "Signed" && (
                        <button className="btn btn-ghost btn-sm" onClick={() => showToast("↓ Downloading PDF...")}>↓ PDF</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Builder Modal */}
      {showBuilder && (
        <div className="modal-overlay" style={{ display: "flex" }} onClick={() => setShowBuilder(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><div className="modal-title">Contract Builder</div><div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>Auto-filled from deal data</div></div>
              <button className="modal-close" onClick={() => setShowBuilder(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Client / Account</label>
                  <select className="form-input"><option>GlobalTech</option><option>Nexus Corp</option><option>TechFlow Ltd</option><option>Apex Solutions</option><option>Horizon Consulting</option></select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Linked Deal</label>
                  <select className="form-input"><option>GlobalTech — ITIL® 12 seats</option><option>Nexus Corp — PMP® 5 seats</option><option>TechFlow — PRINCE2® 8 seats</option></select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Currency</label>
                  <select className="form-input"><option>GBP £</option><option>USD $</option><option>EUR €</option><option>SGD $</option><option>INR ₹</option></select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Contract Value</label>
                  <input className="form-input" placeholder="£0.00" />
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Start Date</label>
                  <input className="form-input" type="date" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">End Date</label>
                  <input className="form-input" type="date" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Terms</label>
                <select className="form-input"><option>100% upfront</option><option>50% deposit · 50% on start</option><option>Monthly instalments</option><option>Invoice on completion</option></select>
              </div>
              <div className="form-group">
                <label className="form-label">Special Conditions</label>
                <textarea className="form-textarea" placeholder="Volume discount, cancellation terms, etc." style={{ height: 80 }} />
              </div>
              <div style={{ padding: "10px 14px", background: "var(--green-soft)", border: "1.5px solid var(--green)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--green)" }}>
                ✓ Contract template auto-selected based on course type and client tier
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowBuilder(false)}>Cancel</button>
              <button className="btn btn-ghost" onClick={() => showToast("↓ Draft saved!")}>Save Draft</button>
              <button className="btn btn-primary" onClick={() => { showToast("✉ Contract sent for signature!"); setShowBuilder(false); }}>Generate & Send</button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
