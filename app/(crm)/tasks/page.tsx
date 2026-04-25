"use client";
import { useState } from "react";

const TASKS = {
  overdue: [
    { t: "Follow-up call — David Chen", sub: "ITIL® 4 Foundation · SQL", due: "2d ago", p: "p-urgent", ai: false },
    { t: "Send PRINCE2 proposal — TechFlow Ltd", sub: "B2B · 8 seats", due: "1d ago", p: "p-high", ai: true },
    { t: "Check in — Lena Fischer", sub: "AgilePM® opportunity stalling", due: "3d ago", p: "p-medium", ai: false },
  ],
  today: [
    { t: "Discovery call — Priya Nair", sub: "AgilePM® Foundation", due: "2:00 PM", p: "p-high", ai: true },
    { t: "Email brochure — Marcus Webb", sub: "CAPM® Certification", due: "4:30 PM", p: "p-medium", ai: false },
    { t: "Proposal review — Nexus Corp", sub: "B2B · PMP® 5 seats", due: "EOD", p: "p-urgent", ai: false },
    { t: "Score review — new SQLs", sub: "AI flagged 3 records", due: "11:00 AM", p: "p-low", ai: true },
  ],
  week: [
    { t: "Demo call — Horizon Consulting", sub: "B2B · PMP® · 12 seats", due: "Thu 11am", p: "p-medium", ai: false },
    { t: "Check-in — Emma Johnson", sub: "Post-enrollment follow-up", due: "Fri", p: "p-low", ai: false },
    { t: "Contract follow-up — Apex Solutions", sub: "B2B renewal approaching", due: "Thu", p: "p-high", ai: true },
    { t: "Pipeline review meeting", sub: "Team weekly review", due: "Fri 9am", p: "p-medium", ai: false },
    { t: "Send ITIL® batch info — GlobalTech", sub: "12 seats confirmed", due: "Wed", p: "p-high", ai: false },
    { t: "AI score audit — MQL queue", sub: "Review 19 promote-ready MQLs", due: "Thu", p: "p-low", ai: true },
    { t: "Follow-up — Sophie Martin", sub: "PRINCE2® Brochure download", due: "Wed", p: "p-medium", ai: false },
    { t: "Call — Marco Rossi", sub: "Generic lead nurture", due: "Fri", p: "p-low", ai: false },
  ],
};

function TaskGroup({ items, type, toast, onToast }: { items: typeof TASKS.today; type: string; toast: string; onToast: (m: string) => void }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  return (
    <>
      {items.map((t) => (
        <div key={t.t} className="task-item" style={{ opacity: done[t.t] ? 0.35 : 1 }}>
          <div className={`prio-dot ${t.p}`} />
          <div
            className={`task-check${done[t.t] ? " done" : ""}`}
            onClick={() => { setDone((p) => ({ ...p, [t.t]: true })); onToast("✅ Task completed!"); }}
          >
            {done[t.t] && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
          </div>
          <div className="task-content">
            <div className="task-subject">{t.t} {t.ai && <span className="ai-badge">AI</span>}</div>
            <div className="task-sub">{t.sub}</div>
          </div>
          <div className={`task-due ${type}`}>{t.due}</div>
        </div>
      ))}
    </>
  );
}

const TASK_BLANK = { type: "📞 Call", subject: "", dueDate: "", dueTime: "09:00", priority: "medium", assignee: "Sarah Jones", link: "", description: "" };

export default function TasksPage() {
  const [toast, setToast] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(TASK_BLANK);
  const [saving, setSaving] = useState(false);
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  async function handleSubmit() {
    if (!form.subject.trim()) { showToast("⚠ Subject is required"); return; }
    setSaving(true);
    try {
      const dueDateTime = form.dueDate ? `${form.dueDate}T${form.dueTime}:00` : undefined;
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${form.type} — ${form.subject}`,
          description: form.description || undefined,
          taskType: form.type,
          priority: form.priority,
          dueDate: dueDateTime,
          assigneeName: form.assignee,
        }),
      });
      if (!res.ok) throw new Error();
      setShowAdd(false);
      setForm(TASK_BLANK);
      showToast("✅ Task created!");
    } catch {
      showToast("❌ Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="content-pad">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="pipeline-toggle">
          <button className="toggle-btn active">All Tasks</button>
          <button className="toggle-btn">Mine</button>
          <button className="toggle-btn">Team</button>
        </div>
        <select className="filter-input"><option>All Types</option><option>📞 Call</option><option>✉ Email</option><option>📋 Proposal</option><option>🔄 Follow-Up</option></select>
        <select className="filter-input"><option>All Priorities</option><option>🔴 Urgent</option><option>🟠 High</option><option>🟡 Medium</option><option>🟢 Low</option></select>
        <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={() => setShowAdd(true)}>+ New Task</button>
      </div>
      <div className="grid-3">
        <div className="card">
          <div className="card-header" style={{ background: "var(--red-soft)" }}>
            <h3 className="card-title" style={{ color: "var(--red)" }}>Overdue <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>({TASKS.overdue.length})</span></h3>
          </div>
          <div style={{ padding: "8px 16px" }}>
            <TaskGroup items={TASKS.overdue} type="overdue" toast={toast} onToast={showToast} />
          </div>
        </div>
        <div className="card">
          <div className="card-header" style={{ background: "var(--amber-soft)" }}>
            <h3 className="card-title" style={{ color: "var(--amber)" }}>Today <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13 }}>({TASKS.today.length})</span></h3>
          </div>
          <div style={{ padding: "8px 16px" }}>
            <TaskGroup items={TASKS.today} type="today" toast={toast} onToast={showToast} />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">This Week <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: "var(--text-3)" }}>({TASKS.week.length})</span></h3>
          </div>
          <div style={{ padding: "8px 16px" }}>
            <TaskGroup items={TASKS.week} type="soon" toast={toast} onToast={showToast} />
          </div>
        </div>
      </div>
      {/* New Task Modal */}
      {showAdd && (
        <div className="modal-overlay" style={{ display: "flex" }} onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create Task</div>
              <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Task Type</label>
                <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option>📞 Call</option><option>✉ Email</option><option>📋 Send Proposal</option><option>🔄 Follow-Up</option><option>👋 Check-In</option><option>🎯 Demo</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Subject *</label><input className="form-input" placeholder="Task subject..." value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Due Date</label><input className="form-input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Time</label><input className="form-input" type="time" value={form.dueTime} onChange={(e) => setForm({ ...form, dueTime: e.target.value })} /></div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Priority</label>
                  <select className="form-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="urgent">🔴 Urgent</option><option value="high">🟠 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}><label className="form-label">Assign To</label>
                  <select className="form-input" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })}>
                    <option>Sarah Jones</option><option>Michael Khan</option><option>Aisha Patel</option><option>Ryan Lee</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Link To</label>
                <select className="form-input" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}>
                  <option value="">— Select contact or deal —</option>
                  <option>Raj Patel (PRINCE2® Opportunity)</option><option>Sarah Mitchell (SQL)</option><option>David Chen (SQL)</option><option>Nexus Corp (B2B Opportunity)</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Task notes..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ height: 70 }} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : "Create Task"}</button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
