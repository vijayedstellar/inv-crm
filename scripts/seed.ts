import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(schema.emails);
  await db.delete(schema.tasks);
  await db.delete(schema.revenueEntries);
  await db.delete(schema.renewals);
  await db.delete(schema.contracts);
  await db.delete(schema.opportunities);
  await db.delete(schema.leads);
  await db.delete(schema.contacts);
  await db.delete(schema.accounts);
  console.log("✓ Cleared existing data");

  // Accounts
  const [globaltech, nexus, techflow, apex, horizon] = await db
    .insert(schema.accounts)
    .values([
      { name: "GlobalTech", domain: "globaltech.com", industry: "Technology", size: "500-1000", arr: "120000", type: "B2B", healthScore: 88 },
      { name: "Nexus Corp", domain: "nexuscorp.com", industry: "Consulting", size: "100-500", arr: "72000", type: "B2B", healthScore: 74 },
      { name: "TechFlow Ltd", domain: "techflow.io", industry: "Software", size: "50-100", arr: "48000", type: "B2B", healthScore: 81 },
      { name: "Apex Solutions", domain: "apexsolutions.co.uk", industry: "Finance", size: "1000+", arr: "95000", type: "B2B", healthScore: 65 },
      { name: "Horizon Consulting", domain: "horizonconsulting.com", industry: "Management Consulting", size: "100-500", arr: "58000", type: "B2B", healthScore: 92 },
    ])
    .returning();
  console.log("✓ Accounts");

  // Contacts (B2C individuals + B2B contacts)
  const [sarah, raj, david, marcus, priya, james, emma, liam, fatima, chen, sophie, alex, tom, anna, yuki] = await db
    .insert(schema.contacts)
    .values([
      // SQLs
      { firstName: "Sarah", lastName: "Mitchell", email: "s.mitchell@email.com", phone: "+44 7700 900001", source: "Course Page", courseInterest: "ITIL® Foundation", score: 61, stage: "sql", lastActivityAt: new Date(Date.now() - 28 * 60 * 60 * 1000), owner: "M. Khan", sqlStatus: "cooling", type: "B2C" },
      { firstName: "Raj", lastName: "Patel", email: "raj.patel@example.com", phone: "+44 7700 900002", source: "Course Page", courseInterest: "PRINCE2®", score: 88, stage: "sql", lastActivityAt: new Date(Date.now() - 4 * 60 * 60 * 1000), owner: "S. Jones", sqlStatus: "hot", type: "B2C" },
      { firstName: "David", lastName: "Chen", email: "david.chen@example.com", phone: "+44 7700 900003", source: "Inbound Call", courseInterest: "PMP®", score: 74, stage: "sql", lastActivityAt: new Date(Date.now() - 24 * 60 * 60 * 1000), owner: "A. Patel", sqlStatus: "active", type: "B2C" },
      { firstName: "Marcus", lastName: "Webb", email: "m.webb@example.com", phone: "+44 7700 900004", source: "Paid Ad", courseInterest: "CAPM®", score: 54, stage: "sql", lastActivityAt: new Date(Date.now() - 48 * 60 * 60 * 1000), owner: "R. Lee", sqlStatus: "cooling", type: "B2C" },
      { firstName: "Priya", lastName: "Nair", email: "p.nair@edtech.io", phone: "+44 7700 900005", source: "Course Page", courseInterest: "AgilePM®", score: 82, stage: "sql", lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000), owner: "S. Jones", sqlStatus: "hot", type: "B2C" },
      { firstName: "James", lastName: "Torres", email: "j.torres@example.com", phone: "+44 7700 900006", source: "Referral", courseInterest: "AgilePM®", score: 95, stage: "sql", lastActivityAt: new Date(Date.now() - 30 * 60 * 1000), owner: "S. Jones", sqlStatus: "hot", type: "B2C" },
      // MQLs
      { firstName: "Emma", lastName: "Johnson", email: "e.johnson@email.com", phone: "+44 7700 900007", source: "Brochure Download", courseInterest: "PRINCE2 Agile®", score: 91, stage: "mql", contentDownloaded: "PRINCE2 Agile® Brochure", owner: "M. Khan", type: "B2C" },
      { firstName: "Liam", lastName: "O'Brien", email: "l.obrien@email.com", phone: "+44 7700 900008", source: "Brochure Download", courseInterest: "PMP®", score: 68, stage: "mql", contentDownloaded: "PMP® Course Brochure", owner: "S. Jones", type: "B2C" },
      { firstName: "Fatima", lastName: "Al-Hassan", email: "f.alhassan@email.com", phone: "+44 7700 900009", source: "Course Webinar", courseInterest: "ITIL® Foundation", score: 62, stage: "mql", contentDownloaded: "ITIL® Webinar", owner: "A. Patel", type: "B2C" },
      { firstName: "Chen", lastName: "Wei", email: "c.wei@email.com", phone: "+44 7700 900010", source: "Brochure Download", courseInterest: "AgilePM®", score: 54, stage: "mql", contentDownloaded: "AgilePM® Brochure", owner: "M. Khan", type: "B2C" },
      { firstName: "Sophie", lastName: "Martin", email: "s.martin@email.com", phone: "+44 7700 900011", source: "Brochure Download", courseInterest: "PRINCE2®", score: 71, stage: "mql", contentDownloaded: "PRINCE2® Brochure", owner: "R. Lee", type: "B2C" },
      { firstName: "Alex", lastName: "Thompson", email: "a.thompson@email.com", phone: "+44 7700 900012", source: "Course Webinar", courseInterest: "CAPM®", score: 48, stage: "mql", contentDownloaded: "CAPM® Webinar", owner: "S. Jones", type: "B2C" },
      // Leads
      { firstName: "Tom", lastName: "Bradley", email: "t.bradley@email.com", phone: "+44 7700 900013", source: "Social", courseInterest: "PMP®", score: 38, stage: "lead", owner: "S. Jones", type: "B2C" },
      { firstName: "Anna", lastName: "Fischer", email: "a.fischer@email.com", phone: "+44 7700 900014", source: "Guide Download", courseInterest: "ITSM (General)", score: 48, stage: "lead", owner: "M. Khan", type: "B2C" },
      { firstName: "Yuki", lastName: "Tanaka", email: "y.tanaka@email.com", phone: "+44 7700 900015", source: "Resource Download", courseInterest: "IT Governance", score: 43, stage: "lead", owner: "R. Lee", type: "B2C" },
    ])
    .returning();
  console.log("✓ Contacts");

  // B2B account contacts
  const [maria, richard, techcontact, apexcontact, horizoncontact] = await db
    .insert(schema.contacts)
    .values([
      { firstName: "Maria", lastName: "Santos", email: "m.santos@globaltech.com", title: "Head of L&D", accountId: globaltech.id, source: "Referral", courseInterest: "ITIL® Foundation", score: 86, stage: "opportunity", owner: "A. Patel", type: "B2B" },
      { firstName: "Richard", lastName: "Hargrove", email: "r.hargrove@nexuscorp.com", title: "Training Manager", accountId: nexus.id, source: "Course Page", courseInterest: "PMP®", score: 74, stage: "opportunity", owner: "M. Khan", type: "B2B" },
      { firstName: "Laura", lastName: "Kim", email: "l.kim@techflow.io", title: "L&D Director", accountId: techflow.id, source: "Referral", courseInterest: "PRINCE2®", score: 81, stage: "opportunity", owner: "M. Khan", type: "B2B" },
      { firstName: "Steve", lastName: "Marks", email: "s.marks@apexsolutions.co.uk", title: "Head of HR", accountId: apex.id, source: "Referral", courseInterest: "PMP®", score: 68, stage: "sql", owner: "S. Jones", type: "B2B" },
      { firstName: "Claire", lastName: "Davies", email: "c.davies@horizonconsulting.com", title: "L&D Manager", accountId: horizon.id, source: "Inbound Call", courseInterest: "AgilePM®", score: 93, stage: "won", owner: "S. Jones", type: "B2B" },
    ])
    .returning();
  console.log("✓ B2B Contacts");

  // Leads
  await db.insert(schema.leads).values([
    { contactId: sarah.id, source: "Course Page", stage: "sql", score: 61, courseInterest: "ITIL® Foundation", sqlStatus: "cooling", ownerId: "mk" },
    { contactId: raj.id, source: "Course Page", stage: "sql", score: 88, courseInterest: "PRINCE2®", sqlStatus: "hot", ownerId: "sj" },
    { contactId: david.id, source: "Inbound Call", stage: "sql", score: 74, courseInterest: "PMP®", sqlStatus: "active", ownerId: "ap" },
    { contactId: marcus.id, source: "Paid Ad", stage: "sql", score: 54, courseInterest: "CAPM®", sqlStatus: "cooling", ownerId: "rl" },
    { contactId: priya.id, source: "Course Page", stage: "sql", score: 82, courseInterest: "AgilePM®", sqlStatus: "hot", ownerId: "sj" },
    { contactId: james.id, source: "Referral", stage: "sql", score: 95, courseInterest: "AgilePM®", sqlStatus: "hot", ownerId: "sj" },
    { contactId: emma.id, source: "Brochure Download", stage: "mql", score: 91, courseInterest: "PRINCE2 Agile®", contentDownloaded: "PRINCE2 Agile® Brochure", criteriaStatus: "✓ All met", ownerId: "mk" },
    { contactId: liam.id, source: "Brochure Download", stage: "mql", score: 68, courseInterest: "PMP®", contentDownloaded: "PMP® Course Brochure", criteriaStatus: "✓ All met", ownerId: "sj" },
    { contactId: fatima.id, source: "Course Webinar", stage: "mql", score: 62, courseInterest: "ITIL® Foundation", contentDownloaded: "ITIL® Webinar", criteriaStatus: "✓ All met", ownerId: "ap" },
    { contactId: chen.id, source: "Brochure Download", stage: "mql", score: 54, courseInterest: "AgilePM®", contentDownloaded: "AgilePM® Brochure", criteriaStatus: "⚠ Score low", ownerId: "mk" },
    { contactId: sophie.id, source: "Brochure Download", stage: "mql", score: 71, courseInterest: "PRINCE2®", contentDownloaded: "PRINCE2® Brochure", criteriaStatus: "✓ All met", ownerId: "rl" },
    { contactId: alex.id, source: "Course Webinar", stage: "mql", score: 48, courseInterest: "CAPM®", contentDownloaded: "CAPM® Webinar", criteriaStatus: "⚠ Score low", ownerId: "sj" },
    { contactId: tom.id, source: "Social", stage: "lead", score: 38, courseInterest: "PMP®", daysInStage: 7, ownerId: "sj" },
    { contactId: anna.id, source: "Guide Download", stage: "lead", score: 48, courseInterest: "ITSM (General)", daysInStage: 5, ownerId: "mk" },
    { contactId: yuki.id, source: "Resource Download", stage: "lead", score: 43, courseInterest: "IT Governance", daysInStage: 4, ownerId: "rl" },
  ]);
  console.log("✓ Leads");

  // Opportunities
  const [oppRaj, oppDavid, oppJames, oppNexus, oppTechflow, oppGlobaltech] = await db
    .insert(schema.opportunities)
    .values([
      { accountId: nexus.id, name: "Raj Patel — PRINCE2® Foundation", amount: "2200", stage: "opportunity", dealStage: "Negotiation", type: "B2C", course: "PRINCE2®", probability: 88, closeDate: new Date("2026-04-30"), ownerId: "sj" },
      { accountId: nexus.id, name: "David Chen — PMP®", amount: "3800", stage: "opportunity", dealStage: "Negotiation", type: "B2C", course: "PMP®", probability: 79, closeDate: new Date("2026-05-05"), ownerId: "ap" },
      { accountId: horizon.id, name: "James Torres — AgilePM®", amount: "3200", stage: "won", dealStage: "Won", type: "B2C", course: "AgilePM®", probability: 95, closeDate: new Date("2026-04-28"), ownerId: "sj" },
      { accountId: nexus.id, name: "Nexus Corp — PMP® 5 seats", amount: "28000", stage: "opportunity", dealStage: "Proposal Sent", type: "B2B", course: "PMP®", probability: 74, closeDate: new Date("2026-05-28"), ownerId: "mk" },
      { accountId: techflow.id, name: "TechFlow Ltd — PRINCE2® 8 seats", amount: "17600", stage: "opportunity", dealStage: "Proposal Sent", type: "B2B", course: "PRINCE2®", probability: 81, closeDate: new Date("2026-06-02"), ownerId: "mk" },
      { accountId: globaltech.id, name: "GlobalTech — ITIL® 12 seats", amount: "38400", stage: "opportunity", dealStage: "Negotiation", type: "B2B", course: "ITIL®", probability: 86, closeDate: new Date("2026-05-15"), ownerId: "ap" },
    ])
    .returning();
  console.log("✓ Opportunities");

  // Contracts
  const [con1, con2, con3, con4] = await db
    .insert(schema.contracts)
    .values([
      { accountId: globaltech.id, opportunityId: oppGlobaltech.id, title: "GlobalTech — ITIL® 12 seats MSA", value: "38400", currency: "GBP", startDate: new Date("2025-05-15"), endDate: new Date("2026-05-14"), signed: false, status: "Sent" },
      { accountId: nexus.id, opportunityId: oppNexus.id, title: "Nexus Corp — PMP® Training Contract", value: "28000", currency: "GBP", startDate: new Date("2025-06-01"), endDate: new Date("2026-05-31"), signed: false, status: "Draft" },
      { accountId: horizon.id, opportunityId: oppJames.id, title: "Horizon Consulting — AgilePM® MSA", value: "7600", currency: "GBP", startDate: new Date("2025-04-01"), endDate: new Date("2026-03-31"), signed: true, status: "Signed" },
      { accountId: apex.id, title: "Apex Solutions — PMP® Renewal", value: "14400", currency: "GBP", startDate: new Date("2025-03-01"), endDate: new Date("2026-02-28"), signed: true, status: "Signed" },
    ])
    .returning();
  console.log("✓ Contracts");

  // Renewals
  await db.insert(schema.renewals).values([
    { accountId: globaltech.id, contractId: con1.id, status: "upcoming", dueDate: new Date("2026-05-14"), amount: "42000", lastCourse: "ITIL® 4 Foundation", daysLeft: 58 },
    { accountId: nexus.id, status: "in_negotiation", dueDate: new Date("2026-05-31"), amount: "28000", lastCourse: "PMP® Certification", daysLeft: 75 },
    { accountId: horizon.id, contractId: con3.id, status: "renewed", dueDate: new Date("2026-03-31"), amount: "8200", lastCourse: "AgilePM® Foundation", daysLeft: 11 },
    { accountId: apex.id, contractId: con4.id, status: "upcoming", dueDate: new Date("2026-02-28"), amount: "16000", lastCourse: "PMP® Certification", daysLeft: 43 },
    { accountId: techflow.id, status: "upcoming", dueDate: new Date("2026-07-01"), amount: "18000", lastCourse: "PRINCE2® Foundation", daysLeft: 90 },
    { accountId: nexus.id, status: "churned", dueDate: new Date("2025-12-01"), amount: "9600", lastCourse: "AgilePM® Foundation", daysLeft: 0 },
    { accountId: globaltech.id, status: "upcoming", dueDate: new Date("2026-06-15"), amount: "44000", lastCourse: "PRINCE2® Agile", daysLeft: 87 },
  ]);
  console.log("✓ Renewals");

  // Revenue Entries
  await db.insert(schema.revenueEntries).values([
    { accountId: globaltech.id, amount: "87400", currency: "GBP", recognizedOn: new Date("2026-04-01"), source: "New Contract" },
    { accountId: horizon.id, amount: "7600", currency: "GBP", recognizedOn: new Date("2026-04-01"), source: "New Contract" },
    { accountId: apex.id, amount: "14400", currency: "GBP", recognizedOn: new Date("2026-03-01"), source: "Renewal" },
    { accountId: nexus.id, amount: "28000", currency: "GBP", recognizedOn: new Date("2026-05-01"), source: "New Contract", deferred: true },
    { accountId: techflow.id, amount: "17600", currency: "GBP", recognizedOn: new Date("2026-06-01"), source: "New Contract", deferred: true },
    { accountId: nexus.id, amount: "18000", currency: "USD", recognizedOn: new Date("2026-04-15"), source: "Upsell" },
    { accountId: globaltech.id, amount: "52000", currency: "GBP", recognizedOn: new Date("2025-11-01"), source: "Renewal" },
  ]);
  console.log("✓ Revenue");

  // Tasks
  await db.insert(schema.tasks).values([
    // Overdue
    { title: "Follow-up call — David Chen", description: "ITIL® 4 Foundation · SQL", status: "open", priority: "urgent", dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), assigneeName: "A. Patel", taskType: "Call", relatedContactId: david.id },
    { title: "Send PRINCE2 proposal — TechFlow Ltd", description: "B2B · 8 seats", status: "open", priority: "high", dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), assigneeName: "M. Khan", taskType: "Proposal", relatedAccountId: techflow.id },
    { title: "Check in — Lena Fischer", description: "AgilePM® opportunity stalling", status: "open", priority: "medium", dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), assigneeName: "S. Jones", taskType: "Email" },
    // Today
    { title: "Discovery call — Priya Nair", description: "AgilePM® Foundation", status: "in_progress", priority: "high", dueDate: new Date(), assigneeName: "S. Jones", taskType: "Call", relatedContactId: priya.id },
    { title: "Email brochure — Marcus Webb", description: "CAPM® Certification", status: "open", priority: "medium", dueDate: new Date(), assigneeName: "R. Lee", taskType: "Email", relatedContactId: marcus.id },
    { title: "Proposal review — Nexus Corp", description: "B2B · PMP® 5 seats", status: "open", priority: "urgent", dueDate: new Date(), assigneeName: "M. Khan", taskType: "Proposal", relatedAccountId: nexus.id },
    { title: "Score review — new SQLs", description: "AI flagged 3 records", status: "open", priority: "low", dueDate: new Date(), assigneeName: "A. Patel", taskType: "Review" },
    // This week
    { title: "Demo call — Horizon Consulting", description: "B2B · PMP® · 12 seats", status: "open", priority: "medium", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), assigneeName: "S. Jones", taskType: "Demo", relatedAccountId: horizon.id },
    { title: "Contract follow-up — Apex Solutions", description: "B2B renewal approaching", status: "open", priority: "high", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), assigneeName: "M. Khan", taskType: "Follow-Up", relatedAccountId: apex.id },
    { title: "Send ITIL® batch info — GlobalTech", description: "12 seats confirmed", status: "open", priority: "high", dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), assigneeName: "A. Patel", taskType: "Email", relatedAccountId: globaltech.id },
    { title: "AI score audit — MQL queue", description: "Review 19 promote-ready MQLs", status: "open", priority: "low", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), assigneeName: "S. Jones", taskType: "Review" },
    { title: "Follow-up — Sophie Martin", description: "PRINCE2® Brochure download", status: "open", priority: "medium", dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), assigneeName: "R. Lee", taskType: "Email", relatedContactId: sophie.id },
    { title: "Done — Review signed contract GlobalTech", description: "MSA 2025", status: "done", priority: "high", relatedAccountId: globaltech.id, assigneeName: "A. Patel" },
  ]);
  console.log("✓ Tasks");

  // Emails
  await db.insert(schema.emails).values([
    { contactId: raj.id, subject: "Re: PRINCE2® Foundation", body: "Thanks for the info, I am interested in the upcoming May cohort. Could you confirm the exam voucher inclusion and the exact start date?", direction: "inbound", tag: "SQL", threadId: "thread_001" },
    { contactId: maria.id, subject: "Re: Corporate Training Proposal — ITIL® 12 seats", body: "We have reviewed the proposal and would like to proceed. Can you send the contract for our legal team to review? We are targeting May 15 start.", direction: "inbound", tag: "B2B", threadId: "thread_002" },
    { contactId: sarah.id, subject: "ITIL® Course Query", body: "Hi, I saw your ad and wanted to ask about the self-paced vs instructor-led options for ITIL® Foundation.", direction: "inbound", tag: "SQL", threadId: "thread_003" },
    { contactId: david.id, subject: "Call Follow-Up Notes", body: "Great talking earlier, attaching my questions about the PMP® course prerequisites and exam scheduling flexibility.", direction: "inbound", tag: "SQL", threadId: "thread_004" },
    { contactId: horizoncontact.id, subject: "Contract Signed Confirmation", body: "Please find attached the signed AgilePM® contract. Looking forward to starting the programme next month.", direction: "inbound", tag: "Won", threadId: "thread_005" },
    { contactId: emma.id, subject: "Enrollment Confirmation — PRINCE2 Agile®", body: "Hi, I have completed my payment and registered for the PRINCE2 Agile® course. Could you send my login credentials?", direction: "inbound", tag: "Won", threadId: "thread_006" },
    { contactId: raj.id, subject: "Following up on your PRINCE2® Foundation enquiry, Raj", body: "Hi Raj, I noticed you have had a chance to review the PRINCE2® Foundation proposal. We have a cohort starting 12th May which would fit your timeline well.", direction: "outbound", tag: "SQL", threadId: "thread_001" },
    { contactId: richard.id, subject: "PMP® Training Proposal — 5 Seats", body: "Dear Richard, as discussed, please find attached the proposal for 5 PMP® certification seats for your team. Let me know if you would like to schedule a call.", direction: "outbound", tag: "B2B", threadId: "thread_007" },
  ]);
  console.log("✓ Emails");

  console.log("\n✅ Seed complete.");
  await client.end();
}

seed().catch((e) => { console.error(e); process.exit(1); });
