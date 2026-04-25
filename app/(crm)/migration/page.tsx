"use client";
import { useState } from "react";

type Step = 1 | 2 | 3 | 4;

const FIELD_MAPPINGS = [
  { oldCol: "full_name", sample: "Raj Patel", mapsTo: "First Name + Last Name", status: "mapped" },
  { oldCol: "email_address", sample: "raj.patel@email.com", mapsTo: "Email", status: "mapped" },
  { oldCol: "phone", sample: "+44 7700 900123", mapsTo: "Phone", status: "mapped" },
  { oldCol: "lead_source", sample: "Website Form", mapsTo: "Lead Source", status: "mapped" },
  { oldCol: "course_interest", sample: "PRINCE2®", mapsTo: "Course Interest", status: "mapped" },
  { oldCol: "assigned_rep", sample: "Sarah J.", mapsTo: "Owner", status: "mapped" },
  { oldCol: "date_created", sample: "2024-03-15", mapsTo: "Created At", status: "mapped" },
  { oldCol: "custom_field_1", sample: "LinkedIn Profile", mapsTo: "— Unmapped —", status: "unmapped" },
  { oldCol: "legacy_score", sample: "72", mapsTo: "AI Score (override)", status: "mapped" },
  { oldCol: "old_status", sample: "Hot Lead", mapsTo: "— Review Required —", status: "review" },
  { oldCol: "utm_campaign", sample: "spring_promo", mapsTo: "Ignored", status: "ignored" },
];

const ROUTING_RULES = [
  { source: "Website Form (Course Enquiry)", stage: "SQL", logic: "B2C/B2B auto-detect", notes: "High intent" },
  { source: "Inbound Call", stage: "SQL", logic: "B2C/B2B auto-detect", notes: "Direct enquiry" },
  { source: "Brochure Download", stage: "MQL", logic: "Score ≥ 50 → SQL", notes: "Content intent" },
  { source: "Webinar Registration", stage: "Lead", logic: "Score + nurture", notes: "Generic intent" },
  { source: "Blog / Social", stage: "Contact", logic: "Warm only", notes: "Low intent" },
  { source: "Import (unknown source)", stage: "Lead", logic: "Manual review", notes: "Default fallback" },
];

const PREVIEW_RECORDS = [
  { name: "Priya Mehta", email: "priya.m@company.com", type: "B2C", source: "Website Form", stage: "SQL", owner: "Sarah Jones", score: 78, status: "new", flags: "" },
  { name: "Marcus Webb", email: "mwebb@techco.com", type: "B2B", source: "Inbound Call", stage: "SQL", owner: "Michael Khan", score: 54, status: "merge", flags: "Duplicate email found" },
  { name: "Sophie Martin", email: "sophie.m@email.com", type: "B2C", source: "Brochure Download", stage: "MQL", owner: "Aisha Patel", score: 71, status: "new", flags: "" },
  { name: "Alex Thompson", email: "alex.t@startup.io", type: "B2C", source: "Webinar", stage: "Lead", owner: "Ryan Lee", score: 48, status: "review", flags: "old_status unmapped" },
  { name: "Chen Wei", email: "chen.wei@globalcorp.com", type: "B2B", source: "Website Form", stage: "SQL", owner: "Sarah Jones", score: 62, status: "new", flags: "" },
  { name: "Fatima Al-Hassan", email: "f.alhassan@corp.ae", type: "B2C", source: "Brochure Download", stage: "MQL", owner: "Michael Khan", score: 68, status: "new", flags: "" },
  { name: "Liam O'Brien", email: "lob@consulting.ie", type: "B2C", source: "Referral", stage: "SQL", owner: "Aisha Patel", score: 85, status: "new", flags: "" },
  { name: "Anna Fischer", email: "a.fischer@firm.de", type: "B2B", source: "Blog / Social", stage: "Contact", owner: "Ryan Lee", score: 32, status: "review", flags: "Score below threshold" },
];

function statusColor(s: string) {
  if (s === "new") return { bg: "var(--green-soft)", color: "var(--green)" };
  if (s === "merge") return { bg: "var(--amber-soft)", color: "var(--amber)" };
  return { bg: "var(--blue-soft)", color: "var(--blue)" };
}

function fieldStatusStyle(s: string) {
  if (s === "mapped") return { bg: "var(--green-soft)", color: "var(--green)" };
  if (s === "unmapped") return { bg: "var(--amber-soft)", color: "var(--amber)" };
  if (s === "review") return { bg: "var(--blue-soft)", color: "var(--blue)" };
  return { bg: "var(--surface)", color: "var(--text-3)" };
}

export default function MigrationPage() {
  const [step, setStep] = useState<Step>(1);
  const [fileLoaded, setFileLoaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [previewFilter, setPreviewFilter] = useState("all");
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const previewRows = previewFilter === "all" ? PREVIEW_RECORDS : PREVIEW_RECORDS.filter((r) => r.status === (previewFilter === "merge" ? "merge" : previewFilter === "review" ? "review" : "new"));

  const handleFileChange = (f: File | null) => {
    if (!f) return;
    setFileName(f.name);
    setFileLoaded(true);
  };

  return (
    <div className="content-pad" style={{ gap: 24 }}>
      {/* Header banner */}
      <div style={{ background: "linear-gradient(135deg,var(--navy) 0%,#1e3d7a 100%)", borderRadius: "var(--radius)", padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: "100%", background: "radial-gradient(ellipse at right,rgba(232,119,46,0.18),transparent)", pointerEvents: "none" }} />
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(232,119,46,0.2)", border: "1.5px solid rgba(232,119,46,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>⇄</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>CRM Data Migration</div>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)" }}>Upload a CSV or Excel export from your old CRM. Fields are mapped automatically — unmapped fields go to manual review. Duplicates are matched by email and merged.</div>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        {([
          { n: 1, label: "Upload File", sub: "CSV or Excel from old CRM" },
          { n: 2, label: "Review Mapping", sub: "Auto-mapped + unmapped fields" },
          { n: 3, label: "Preview Records", sub: "Check before import" },
          { n: 4, label: "Import", sub: "Merge duplicates, flag review items" },
        ] as { n: Step; label: string; sub: string }[]).map((s) => (
          <div key={s.n} className={`mig-step${step === s.n ? " active" : step > s.n ? " done" : ""}`}>
            <div className="mig-step-num">{step > s.n ? "✓" : s.n}</div>
            <div className="mig-step-label">{s.label}</div>
            <div className="mig-step-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Step 1 — Upload Your Old CRM Export</h3>
            <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>Accepts .csv or .xlsx</span>
          </div>
          <div className="card-body">
            {!fileLoaded ? (
              <div
                style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius)", padding: "48px 24px", textAlign: "center", cursor: "pointer", background: "var(--surface)" }}
                onClick={() => document.getElementById("migFileInput")?.click()}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>Drop your file here or click to browse</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>Supported: .csv, .xlsx — Max 10MB</div>
                <input type="file" id="migFileInput" accept=".csv,.xlsx" style={{ display: "none" }} onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} />
              </div>
            ) : (
              <div style={{ padding: "14px 16px", background: "var(--green-soft)", border: "1.5px solid var(--green)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 20 }}>✅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{fileName}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-2)", marginTop: 2 }}>248 rows detected · 11 columns · Est. 8 contacts already exist</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => { setFileLoaded(false); setFileName(""); }}>✕ Clear</button>
              </div>
            )}

            {fileLoaded && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
                    <label className="form-label">Source CRM System</label>
                    <select className="form-input">
                      <option>Invensis Learning (Old CRM)</option>
                      <option>HubSpot</option>
                      <option>Salesforce</option>
                      <option>Zoho CRM</option>
                      <option>Pipedrive</option>
                      <option>Generic / Other</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
                    <label className="form-label">Default Assigned Rep (if blank)</label>
                    <select className="form-input">
                      <option>Sarah Jones</option>
                      <option>Michael Khan</option>
                      <option>Aisha Patel</option>
                      <option>Ryan Lee</option>
                    </select>
                  </div>
                  <button className="btn btn-primary" onClick={() => setStep(2)}>Analyse & Map Fields →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Mapping */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Lead Source → Pipeline Stage Routing</h3>
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>Editable — adjust before import</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead><tr><th>Old CRM Lead Source</th><th>Mapped Pipeline Stage</th><th>Type Logic</th><th>Notes</th></tr></thead>
                <tbody>
                  {ROUTING_RULES.map((r) => (
                    <tr key={r.source}>
                      <td>{r.source}</td>
                      <td><span className={`pill pill-${r.stage.toLowerCase()}`}>{r.stage}</span></td>
                      <td style={{ color: "var(--text-2)", fontSize: 12 }}>{r.logic}</td>
                      <td style={{ color: "var(--text-3)", fontSize: 11 }}>{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Field Mapping</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", fontFamily: "'DM Mono',monospace" }}>9 mapped</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", fontFamily: "'DM Mono',monospace" }}>1 unmapped</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>1 ignored</span>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead><tr><th>Old CRM Column</th><th>Sample Value</th><th>Maps To</th><th>Status</th></tr></thead>
                <tbody>
                  {FIELD_MAPPINGS.map((f) => (
                    <tr key={f.oldCol}>
                      <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{f.oldCol}</td>
                      <td style={{ color: "var(--text-2)", fontSize: 12 }}>{f.sample}</td>
                      <td style={{ fontSize: 12 }}>{f.mapsTo}</td>
                      <td><span className="badge" style={{ background: fieldStatusStyle(f.status).bg, color: fieldStatusStyle(f.status).color }}>{f.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Start Over</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Preview Records →</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Record Preview</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", fontFamily: "'DM Mono',monospace" }}>6 new</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", fontFamily: "'DM Mono',monospace" }}>1 merge (duplicate)</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)", fontFamily: "'DM Mono',monospace" }}>2 manual review</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", padding: "0 20px" }}>
              {["all", "new", "merge", "review"].map((f) => (
                <div key={f} className={`tab${previewFilter === f ? " active" : ""}`} onClick={() => setPreviewFilter(f)}>
                  {f === "all" ? "All" : f === "merge" ? "Merge (Duplicate)" : f === "review" ? "Manual Review" : "New"}
                </div>
              ))}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Source</th><th>→ Stage</th><th>→ Owner</th><th>AI Score</th><th>Status</th><th>Review Flags</th></tr></thead>
                <tbody>
                  {previewRows.map((r) => (
                    <tr key={r.email}>
                      <td className="td-name">{r.name}</td>
                      <td style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>{r.email}</td>
                      <td><span className="badge" style={{ background: r.type === "B2B" ? "var(--purple-soft)" : "var(--blue-soft)", color: r.type === "B2B" ? "var(--purple)" : "var(--blue)" }}>{r.type}</span></td>
                      <td style={{ fontSize: 11, color: "var(--text-2)" }}>{r.source}</td>
                      <td><span className={`pill pill-${r.stage.toLowerCase()}`}>{r.stage}</span></td>
                      <td style={{ color: "var(--text-2)", fontSize: 12 }}>{r.owner}</td>
                      <td><span className={`score-badge ${r.score >= 80 ? "sc-hot" : r.score >= 60 ? "sc-blue" : r.score >= 40 ? "sc-warm" : "sc-cold"}`}>{r.score}</span></td>
                      <td><span className="badge" style={{ background: statusColor(r.status).bg, color: statusColor(r.status).color }}>{r.status}</span></td>
                      <td style={{ fontSize: 11, color: "var(--amber)" }}>{r.flags || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>← Edit Mapping</button>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => showToast("↓ Exporting review items...")}>↓ Export Review Items</button>
                <button className="btn btn-primary" onClick={() => setStep(4)}>Run Import →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <div className="card">
          <div className="card-header"><h3 className="card-title">Import Complete</h3></div>
          <div className="card-body">
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--navy)", marginBottom: 8 }}>248 records imported successfully</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 24 }}>6 new contacts · 1 merged · 2 in manual review queue</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, maxWidth: 600, margin: "0 auto 24px" }}>
                <div className="stat-card"><div className="stat-label">New Contacts</div><div className="stat-value" style={{ color: "var(--green)" }}>6</div></div>
                <div className="stat-card"><div className="stat-label">SQLs Created</div><div className="stat-value" style={{ color: "var(--blue)" }}>4</div></div>
                <div className="stat-card"><div className="stat-label">MQLs Created</div><div className="stat-value" style={{ color: "var(--accent)" }}>2</div></div>
                <div className="stat-card"><div className="stat-label">Review Queue</div><div className="stat-value" style={{ color: "var(--amber)" }}>2</div></div>
              </div>
              <div style={{ padding: "14px 16px", background: "var(--amber-soft)", border: "1.5px solid var(--amber)", borderRadius: "var(--radius-sm)", fontSize: 12.5, color: "#7D5A00", marginBottom: 24, textAlign: "left" }}>
                ⚠ 2 records require manual review. Open the review queue to resolve unmapped fields and confirm routing.
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn btn-ghost" onClick={() => { setStep(1); setFileLoaded(false); setFileName(""); }}>Import Another File</button>
                <button className="btn btn-ghost btn-sm" onClick={() => showToast("📋 Opening review queue...")}>Open Review Queue</button>
                <button className="btn btn-primary" onClick={() => showToast("✅ Navigating to Contacts...")}>View All Contacts</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
