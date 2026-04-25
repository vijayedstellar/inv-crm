"use client";
import { useState } from "react";

const DEFERRED_ROWS = [
  { deal: "GlobalTech — ITIL® 12 seats", course: "ITIL® 4 Foundation", currency: "GBP", dealValue: "£38,400", gbpEquiv: "£38,400", payDate: "Jan 12", startDate: "May 5", status: "Deferred", recognised: "£0", deferred: "£38,400" },
  { deal: "Nexus Corp — PMP® 5 seats", course: "PMP® Certification", currency: "GBP", dealValue: "£28,000", gbpEquiv: "£28,000", payDate: "Mar 18", startDate: "May 20", status: "Deferred", recognised: "£0", deferred: "£28,000" },
  { deal: "Raj Patel — PRINCE2®", course: "PRINCE2® Foundation", currency: "GBP", dealValue: "£2,200", gbpEquiv: "£2,200", payDate: "Apr 10", startDate: "Apr 22", status: "Recognised", recognised: "£2,200", deferred: "£0" },
  { deal: "TechFlow — PRINCE2® 8 seats", course: "PRINCE2® Foundation", currency: "GBP", dealValue: "£17,600", gbpEquiv: "£17,600", payDate: "Mar 28", startDate: "Jun 2", status: "Deferred", recognised: "£0", deferred: "£17,600" },
  { deal: "DataStream — USD Deal", course: "PMP® Certification", currency: "USD", dealValue: "$12,000", gbpEquiv: "£9,441", payDate: "Feb 14", startDate: "May 1", status: "Deferred", recognised: "£0", deferred: "£9,441" },
  { deal: "Horizon Consulting", course: "AgilePM® 4 seats", currency: "GBP", dealValue: "£32,800", gbpEquiv: "£32,800", payDate: "Jan 8", startDate: "Apr 15", status: "Recognised", recognised: "£32,800", deferred: "£0" },
  { deal: "TechCorp Asia — SGD", course: "ITIL® Foundation", currency: "SGD", dealValue: "SGD 28,000", gbpEquiv: "£16,467", payDate: "Mar 3", startDate: "Jun 10", status: "Deferred", recognised: "£0", deferred: "£16,467" },
];

const FX_DEALS = [
  { deal: "DataStream — PMP®", client: "DataStream Co", currency: "USD", native: "$12,000", gbp: "£9,441", rateLocked: "1.2740", invoiceRate: "1.2600", fxPL: "+£99", pos: true },
  { deal: "TechCorp Asia — ITIL®", client: "TechCorp Asia", currency: "SGD", native: "SGD 28,000", gbp: "£16,467", rateLocked: "0.5881", invoiceRate: "0.5810", fxPL: "+£117", pos: true },
  { deal: "EuroConsult — AgilePM®", client: "EuroConsult GmbH", currency: "EUR", native: "€14,400", gbp: "£12,321", rateLocked: "1.1682", invoiceRate: "1.1750", fxPL: "−£71", pos: false },
  { deal: "Mumbai Corp — PRINCE2®", client: "Mumbai Corp Ltd", currency: "INR", native: "₹3,200,000", gbp: "£30,112", rateLocked: "0.00941", invoiceRate: "0.00938", fxPL: "+£90", pos: true },
];

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const CHART_DATA = [
  { rec: 60, def: 28 },
  { rec: 65, def: 32 },
  { rec: 55, def: 40 },
  { rec: 70, def: 36 },
  { rec: 75, def: 44 },
  { rec: 87, def: 54 },
];

function statusStyle(s: string) {
  return s === "Recognised"
    ? { background: "var(--green-soft)", color: "var(--green)" }
    : { background: "var(--amber-soft)", color: "var(--amber)" };
}

export default function RevenuePage() {
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  return (
    <div className="content-pad">
      {/* KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
        <div className="stat-card"><div className="stat-label">Recognised (MTD)</div><div className="stat-value" style={{ color: "var(--green)" }}>£87,400</div><div className="stat-sub">↑ 23% vs last month</div></div>
        <div className="stat-card"><div className="stat-label">Deferred Revenue</div><div className="stat-value" style={{ color: "var(--amber)" }}>£54,200</div><div className="stat-sub">Courses not yet started</div></div>
        <div className="stat-card"><div className="stat-label">Recognising This Month</div><div className="stat-value" style={{ color: "var(--blue)" }}>£31,600</div><div className="stat-sub">6 courses starting</div></div>
        <div className="stat-card"><div className="stat-label">Multi-Currency Exposure</div><div className="stat-value" style={{ color: "var(--purple)" }}>$24,000</div><div className="stat-sub">2 USD deals · Rate: 1.27</div></div>
        <div className="stat-card"><div className="stat-label">FX Gain / (Loss)</div><div className="stat-value" style={{ color: "var(--teal)" }}>+£420</div><div className="stat-sub">vs invoice rate</div></div>
      </div>

      {/* Two-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Stacked bar chart */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">Revenue Recognition — 6 Month View</h3></div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
              {CHART_DATA.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 1, height: 120, justifyContent: "flex-end" }}>
                    <div style={{ background: "var(--amber)", borderRadius: "3px 3px 0 0", height: `${d.def}px`, opacity: 0.7 }} title={`Deferred`} />
                    <div style={{ background: "var(--green)", borderRadius: "3px 3px 0 0", height: `${d.rec}px` }} title={`Recognised`} />
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>{MONTHS[i]}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-2)" }}><div style={{ width: 10, height: 10, background: "var(--green)", borderRadius: 2 }} />Recognised</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-2)" }}><div style={{ width: 10, height: 10, background: "var(--amber)", opacity: 0.7, borderRadius: 2 }} />Deferred</div>
            </div>
          </div>
        </div>

        {/* FX Rates */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Live FX Rates</h3>
            <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>Base: GBP £</span>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { flag: "🇺🇸", code: "USD", name: "US Dollar", rate: "1.2741", change: "↑ +0.12% today", pos: true },
              { flag: "🇪🇺", code: "EUR", name: "Euro", rate: "1.1682", change: "↓ -0.04% today", pos: false },
              { flag: "🇸🇬", code: "SGD", name: "Singapore Dollar", rate: "0.5881", change: "↑ +0.07% today", pos: true },
              { flag: "🇮🇳", code: "INR", name: "Indian Rupee", rate: "0.00941", change: "→ Flat today", pos: null },
            ].map((fx) => (
              <div key={fx.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{fx.flag}</span>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>{fx.code}</div><div style={{ fontSize: 10, color: "var(--text-3)" }}>{fx.name}</div></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: "var(--navy)" }}>{fx.rate}</div>
                  <div style={{ fontSize: 10, color: fx.pos === true ? "var(--green)" : fx.pos === false ? "var(--red)" : "var(--text-3)" }}>{fx.change}</div>
                </div>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 4 }} onClick={() => showToast("🔄 FX rates refreshed")}>↻ Refresh Rates</button>
          </div>
        </div>
      </div>

      {/* Deferred Revenue Schedule */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Deferred Revenue Schedule</h3>
          <span style={{ fontSize: 11, color: "var(--text-3)" }}>Payment received · Revenue recognised on course start date</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th>Deal / Client</th><th>Course</th><th>Currency</th><th>Deal Value</th><th>GBP Equiv.</th><th>Payment Date</th><th>Course Start</th><th>Status</th><th>Recognised</th><th>Deferred</th></tr></thead>
            <tbody>
              {DEFERRED_ROWS.map((r) => (
                <tr key={r.deal}>
                  <td className="td-name">{r.deal}</td>
                  <td style={{ color: "var(--text-2)" }}>{r.course}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{r.currency}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace" }}>{r.dealValue}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{r.gbpEquiv}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)", fontSize: 11 }}>{r.payDate}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)", fontSize: 11 }}>{r.startDate}</td>
                  <td><span className="badge" style={statusStyle(r.status)}>{r.status}</span></td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--green)", fontWeight: r.recognised !== "£0" ? 700 : 400 }}>{r.recognised}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--amber)", fontWeight: r.deferred !== "£0" ? 700 : 400 }}>{r.deferred}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-currency deals */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Open Deals by Currency</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th>Deal</th><th>Client</th><th>Currency</th><th>Native Value</th><th>GBP Equiv.</th><th>Rate Locked</th><th>Invoice Rate</th><th>FX P&amp;L</th></tr></thead>
            <tbody>
              {FX_DEALS.map((d) => (
                <tr key={d.deal}>
                  <td className="td-name">{d.deal}</td>
                  <td style={{ color: "var(--text-2)" }}>{d.client}</td>
                  <td><span className="badge" style={{ background: "var(--purple-soft)", color: "var(--purple)" }}>{d.currency}</span></td>
                  <td style={{ fontFamily: "'DM Mono',monospace" }}>{d.native}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>{d.gbp}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{d.rateLocked}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", color: "var(--text-3)" }}>{d.invoiceRate}</td>
                  <td style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, color: d.pos ? "var(--green)" : "var(--red)" }}>{d.fxPL}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
