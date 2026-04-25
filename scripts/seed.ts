import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding database...");

  // Accounts
  const [acme, techcorp, globalEd, skillUp, brightLearn] = await db
    .insert(schema.accounts)
    .values([
      { name: "Acme Corp", domain: "acme.com", industry: "Manufacturing", size: "500-1000", arr: "48000" },
      { name: "TechCorp Ltd", domain: "techcorp.io", industry: "Technology", size: "100-500", arr: "72000" },
      { name: "Global Education", domain: "globaled.org", industry: "Education", size: "1000+", arr: "120000" },
      { name: "SkillUp Inc", domain: "skillup.com", industry: "HR & Training", size: "50-100", arr: "24000" },
      { name: "BrightLearn", domain: "brightlearn.co", industry: "E-Learning", size: "10-50", arr: "18000" },
    ])
    .returning();

  console.log("✓ Accounts");

  // Contacts
  const [c1, c2, c3, c4, c5, c6] = await db
    .insert(schema.contacts)
    .values([
      { firstName: "Sarah", lastName: "Mitchell", email: "sarah@acme.com", phone: "+44 7700 900001", title: "L&D Manager", accountId: acme.id },
      { firstName: "James", lastName: "Patel", email: "james@techcorp.io", phone: "+44 7700 900002", title: "HR Director", accountId: techcorp.id },
      { firstName: "Priya", lastName: "Sharma", email: "priya@globaled.org", phone: "+44 7700 900003", title: "Training Head", accountId: globalEd.id },
      { firstName: "David", lastName: "Chen", email: "david@skillup.com", phone: "+44 7700 900004", title: "CEO", accountId: skillUp.id },
      { firstName: "Emma", lastName: "Williams", email: "emma@brightlearn.co", phone: "+44 7700 900005", title: "Procurement Lead", accountId: brightLearn.id },
      { firstName: "Raj", lastName: "Kumar", email: "raj@acme.com", phone: "+44 7700 900006", title: "Operations Manager", accountId: acme.id },
    ])
    .returning();

  console.log("✓ Contacts");

  // Leads
  const [l1, l2, l3, l4, l5] = await db
    .insert(schema.leads)
    .values([
      { contactId: c1.id, source: "LinkedIn", stage: "mql", score: 72, notes: "Downloaded PMP course brochure" },
      { contactId: c2.id, source: "Webinar", stage: "sql", score: 85, notes: "Attended live webinar, requested demo" },
      { contactId: c3.id, source: "Referral", stage: "opportunity", score: 91, notes: "Referred by Global Skills Network" },
      { contactId: c4.id, source: "Cold Outreach", stage: "lead", score: 40, notes: "Initial connect via email" },
      { contactId: c5.id, source: "Website", stage: "mql", score: 65, notes: "Filled contact form for bulk training" },
    ])
    .returning();

  console.log("✓ Leads");

  // Opportunities
  const [o1, o2, o3] = await db
    .insert(schema.opportunities)
    .values([
      { accountId: globalEd.id, name: "PMP Certification — 50 seats", amount: "45000", stage: "opportunity", probability: 70, closeDate: new Date("2025-06-30") },
      { accountId: techcorp.id, name: "Agile & Scrum Training Bundle", amount: "28000", stage: "sql", probability: 55, closeDate: new Date("2025-07-15") },
      { accountId: acme.id, name: "Leadership Development Programme", amount: "62000", stage: "opportunity", probability: 80, closeDate: new Date("2025-05-31") },
    ])
    .returning();

  console.log("✓ Opportunities");

  // Contracts
  const [con1, con2] = await db
    .insert(schema.contracts)
    .values([
      { accountId: globalEd.id, opportunityId: o1.id, title: "PMP Training MSA 2025", value: "45000", startDate: new Date("2025-04-01"), endDate: new Date("2026-03-31"), signed: true },
      { accountId: acme.id, opportunityId: o3.id, title: "Leadership Dev Contract", value: "62000", startDate: new Date("2025-05-01"), endDate: new Date("2026-04-30"), signed: false },
    ])
    .returning();

  console.log("✓ Contracts");

  // Renewals
  await db.insert(schema.renewals).values([
    { accountId: globalEd.id, contractId: con1.id, status: "upcoming", dueDate: new Date("2026-03-01"), amount: "48000" },
    { accountId: skillUp.id, status: "in_negotiation", dueDate: new Date("2025-06-15"), amount: "26000" },
    { accountId: brightLearn.id, status: "upcoming", dueDate: new Date("2025-08-01"), amount: "20000" },
  ]);

  console.log("✓ Renewals");

  // Revenue
  await db.insert(schema.revenueEntries).values([
    { accountId: globalEd.id, amount: "45000", currency: "GBP", recognizedOn: new Date("2025-04-01"), source: "New Contract" },
    { accountId: acme.id, amount: "32000", currency: "GBP", recognizedOn: new Date("2025-03-01"), source: "Renewal" },
    { accountId: techcorp.id, amount: "18000", currency: "GBP", recognizedOn: new Date("2025-02-01"), source: "Upsell" },
  ]);

  console.log("✓ Revenue");

  // Tasks
  await db.insert(schema.tasks).values([
    { title: "Follow up with Priya re: PMP proposal", status: "open", dueDate: new Date("2025-05-05"), relatedAccountId: globalEd.id, relatedContactId: c3.id },
    { title: "Send Agile course brochure to James", status: "open", dueDate: new Date("2025-05-03"), relatedAccountId: techcorp.id, relatedContactId: c2.id },
    { title: "Schedule demo call with David", status: "in_progress", dueDate: new Date("2025-05-06"), relatedAccountId: skillUp.id, relatedContactId: c4.id },
    { title: "Prepare renewal quote for SkillUp", status: "open", dueDate: new Date("2025-06-01"), relatedAccountId: skillUp.id },
    { title: "Review signed contract — Global Education", status: "done", relatedAccountId: globalEd.id },
  ]);

  console.log("✓ Tasks");

  // Emails
  await db.insert(schema.emails).values([
    { contactId: c1.id, subject: "PMP Certification — Custom Training Proposal", body: "Hi Sarah, following up on your interest in PMP certification for your team...", direction: "outbound", threadId: "thread_001" },
    { contactId: c2.id, subject: "Re: Agile Training Demo", body: "Hi James, great speaking with you on the webinar. Here are the details...", direction: "outbound", threadId: "thread_002" },
    { contactId: c3.id, subject: "Training Proposal Attached", body: "Hi Priya, as discussed, please find the proposal for 50-seat PMP training...", direction: "outbound", threadId: "thread_003" },
    { contactId: c2.id, subject: "Re: Agile Training Demo", body: "Thanks for sending this over. Can we schedule a call Thursday?", direction: "inbound", threadId: "thread_002" },
  ]);

  console.log("✓ Emails");

  console.log("\nSeed complete.");
  await client.end();
}

seed().catch((e) => { console.error(e); process.exit(1); });
