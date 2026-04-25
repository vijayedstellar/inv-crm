"use client";
import { useState } from "react";

const EMAILS = [
  { from: "Raj Patel", subj: "Re: PRINCE2® Foundation", preview: "Thanks for the info, I am interested in the upcoming May cohort...", time: "2h", unread: true, tag: "SQL", body: "Thanks for the info, I am interested in the upcoming May cohort. Could you confirm the exam voucher inclusion and the exact start date? Also, is there an option for weekend classes?\n\nLooking forward to your reply.\n\nBest regards,\nRaj Patel" },
  { from: "TechFlow Ltd", subj: "Re: Corporate Training Proposal", preview: "We have reviewed the proposal and would like to proceed...", time: "4h", unread: true, tag: "B2B", body: "We have reviewed the proposal and would like to proceed. Can you send the contract for our legal team to review? We are targeting May 15 start. Volume discount has been approved by our finance team.\n\nKind regards,\nLaura Kim\nL&D Director, TechFlow Ltd" },
  { from: "Sarah Mitchell", subj: "ITIL® Course Query", preview: "Hi, I saw your ad and wanted to ask about...", time: "6h", unread: false, tag: "SQL", body: "Hi, I saw your ad and wanted to ask about the self-paced vs instructor-led options for ITIL® Foundation. I work full-time so flexibility is important. What are the typical study hours required?\n\nThanks,\nSarah Mitchell" },
  { from: "David Chen", subj: "Call Follow-Up Notes", preview: "Great talking earlier, attaching my questions...", time: "1d", unread: false, tag: "SQL", body: "Great talking earlier today. I am attaching my questions about the PMP® course prerequisites and exam scheduling flexibility. The cost looks right — I just need to confirm with my manager.\n\nBest,\nDavid" },
  { from: "Horizon Consulting", subj: "Contract Signed Confirmation", preview: "Please find attached the signed contract...", time: "1d", unread: false, tag: "Won", body: "Please find attached the signed AgilePM® contract for 4 seats. All learners have been nominated and we will send their details by end of week. Looking forward to starting the programme.\n\nCheers,\nClaire Davies\nHorizon Consulting" },
  { from: "Emma Johnson", subj: "Enrollment Confirmation — PRINCE2 Agile®", preview: "Hi, I have completed my payment and...", time: "2d", unread: false, tag: "Won", body: "Hi, I have completed my payment and registered for the PRINCE2 Agile® course. Could you send my login credentials for the LMS? Also, can I access pre-reading materials before the start date?\n\nThank you,\nEmma" },
];

export default function EmailsPage() {
  const [selected, setSelected] = useState<typeof EMAILS[0] | null>(null);
  const [tab, setTab] = useState<"inbox" | "sent">("inbox");
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  return (
    <div className="content-pad">
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, borderRadius: "var(--radius)", border: "1.5px solid var(--border)", overflow: "hidden", background: "var(--white)", minHeight: 500 }}>
        {/* Left: Email List */}
        <div style={{ borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <div className="pipeline-toggle" style={{ flex: 1 }}>
              <button className={`toggle-btn${tab === "inbox" ? " active" : ""}`} style={{ flex: 1 }} onClick={() => setTab("inbox")}>Inbox</button>
              <button className={`toggle-btn${tab === "sent" ? " active" : ""}`} style={{ flex: 1 }} onClick={() => setTab("sent")}>Sent</button>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => showToast("✉ Opening compose...")}>+ Compose</button>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {EMAILS.map((e) => (
              <div
                key={e.subj}
                className={`email-row${e.unread ? " email-row-unread" : ""}`}
                style={{ background: selected?.subj === e.subj ? "var(--surface)" : undefined }}
                onClick={() => setSelected(e)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <div style={{ fontSize: 12.5, fontWeight: e.unread ? 700 : 500, color: "var(--navy)" }}>{e.from}</div>
                  <div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "'DM Mono',monospace" }}>{e.time}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: e.unread ? 600 : 400, color: "var(--text-1)", marginBottom: 3 }}>{e.subj}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{e.preview}</div>
                <span className="badge" style={{ marginTop: 5, background: e.tag === "B2B" ? "var(--purple-soft)" : e.tag === "Won" ? "var(--green-soft)" : "var(--blue-soft)", color: e.tag === "B2B" ? "var(--purple)" : e.tag === "Won" ? "var(--green)" : "var(--blue)" }}>{e.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Email Detail */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {selected ? (
            <div style={{ padding: 24, flex: 1, overflow: "auto" }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "var(--navy)", marginBottom: 6 }}>{selected.subj}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>From: <strong style={{ color: "var(--text-2)" }}>{selected.from}</strong> · {selected.time} ago</div>
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.8, color: "var(--text-2)", whiteSpace: "pre-line", borderTop: "1px solid var(--border)", paddingTop: 16 }}>{selected.body}</div>

              {/* AI Reply Suggestion */}
              <div style={{ marginTop: 24, background: "rgba(46,110,175,0.04)", border: "1.5px solid rgba(46,110,175,0.2)", borderRadius: "var(--radius-sm)", padding: 14, position: "relative" }}>
                <div style={{ position: "absolute", top: -8, left: 12, fontSize: 9, fontWeight: 700, color: "var(--blue)", background: "var(--white)", padding: "0 6px", fontFamily: "'DM Mono',monospace" }}>AI SUGGESTED REPLY</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--text-2)" }}>
                  Hi {selected.from.split(" ")[0]},<br /><br />
                  Thank you for your email. I wanted to follow up on your enquiry and make sure we have everything covered for you.<br /><br />
                  I would be happy to discuss next steps — shall we schedule a quick 15-minute call this week?<br /><br />
                  Best regards,<br />Michael Khan<br />Invensis Learning
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={() => showToast("✉ Reply sent!")}>Accept & Send</button>
                <button className="btn btn-ghost btn-sm" onClick={() => showToast("🔄 Regenerating draft...")}>↻ Regenerate</button>
                <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => showToast("+ Task created")}>+ Task</button>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ margin: "auto" }}>
              <div className="es-icon">✉</div>
              <h3>Select an email</h3>
              <p>Choose an email from the list to read it</p>
            </div>
          )}
        </div>
      </div>
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
