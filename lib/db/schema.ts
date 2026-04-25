import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

const id = () => uuid("id").primaryKey().defaultRandom();
const createdAt = () => timestamp("created_at").defaultNow().notNull();
const updatedAt = () => timestamp("updated_at").defaultNow().notNull();

export const stageEnum = pgEnum("stage", [
  "contact",
  "lead",
  "mql",
  "sql",
  "opportunity",
  "won",
  "lost",
]);
export const taskStatusEnum = pgEnum("task_status", [
  "open",
  "in_progress",
  "done",
  "blocked",
]);
export const renewalStatusEnum = pgEnum("renewal_status", [
  "upcoming",
  "in_negotiation",
  "renewed",
  "churned",
]);

export const accounts = pgTable("accounts", {
  id: id(),
  name: text("name").notNull(),
  domain: text("domain"),
  industry: text("industry"),
  size: text("size"),
  arr: numeric("arr", { precision: 14, scale: 2 }),
  type: text("type").default("B2B"),
  healthScore: integer("health_score").default(75),
  ownerId: text("owner_id"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const contacts = pgTable("contacts", {
  id: id(),
  accountId: uuid("account_id").references(() => accounts.id, { onDelete: "set null" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  title: text("title"),
  linkedin: text("linkedin"),
  source: text("source"),
  courseInterest: text("course_interest"),
  score: integer("score").default(0),
  stage: stageEnum("stage").default("contact"),
  lastActivityAt: timestamp("last_activity_at"),
  owner: text("owner"),
  type: text("type").default("B2C"),
  sqlStatus: text("sql_status"),
  contentDownloaded: text("content_downloaded"),
  ownerId: text("owner_id"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const leads = pgTable("leads", {
  id: id(),
  contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "cascade" }),
  source: text("source"),
  stage: stageEnum("stage").default("lead").notNull(),
  score: integer("score").default(0).notNull(),
  courseInterest: text("course_interest"),
  contentDownloaded: text("content_downloaded"),
  criteriaStatus: text("criteria_status"),
  sqlStatus: text("sql_status"),
  daysInStage: integer("days_in_stage").default(0),
  notes: text("notes"),
  ownerId: text("owner_id"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const opportunities = pgTable("opportunities", {
  id: id(),
  accountId: uuid("account_id").references(() => accounts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }),
  stage: stageEnum("stage").default("opportunity").notNull(),
  dealStage: text("deal_stage").default("Discovery"),
  type: text("type").default("B2C"),
  course: text("course"),
  closeDate: timestamp("close_date"),
  probability: integer("probability").default(50),
  ownerId: text("owner_id"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const contracts = pgTable("contracts", {
  id: id(),
  accountId: uuid("account_id").references(() => accounts.id, { onDelete: "cascade" }),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  value: numeric("value", { precision: 14, scale: 2 }),
  currency: text("currency").default("GBP"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  fileUrl: text("file_url"),
  signed: boolean("signed").default(false),
  status: text("status").default("Draft"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const renewals = pgTable("renewals", {
  id: id(),
  accountId: uuid("account_id").references(() => accounts.id, { onDelete: "cascade" }),
  contractId: uuid("contract_id").references(() => contracts.id, { onDelete: "set null" }),
  status: renewalStatusEnum("status").default("upcoming").notNull(),
  dueDate: timestamp("due_date"),
  amount: numeric("amount", { precision: 14, scale: 2 }),
  lastCourse: text("last_course"),
  daysLeft: integer("days_left"),
  ownerId: text("owner_id"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const revenueEntries = pgTable("revenue_entries", {
  id: id(),
  accountId: uuid("account_id").references(() => accounts.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  currency: text("currency").default("GBP").notNull(),
  recognizedOn: timestamp("recognized_on").notNull(),
  source: text("source"),
  deferred: boolean("deferred").default(false),
  createdAt: createdAt(),
});

export const tasks = pgTable("tasks", {
  id: id(),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("open").notNull(),
  priority: text("priority").default("medium"),
  dueDate: timestamp("due_date"),
  assigneeId: text("assignee_id"),
  assigneeName: text("assignee_name"),
  taskType: text("task_type"),
  relatedAccountId: uuid("related_account_id").references(() => accounts.id),
  relatedContactId: uuid("related_contact_id").references(() => contacts.id),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const emails = pgTable("emails", {
  id: id(),
  contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "cascade" }),
  subject: text("subject"),
  body: text("body"),
  direction: text("direction"),
  tag: text("tag"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  threadId: text("thread_id"),
});

export const migrations = pgTable("migrations", {
  id: id(),
  source: text("source").notNull(),
  status: text("status").default("pending").notNull(),
  totalRows: integer("total_rows").default(0),
  processedRows: integer("processed_rows").default(0),
  mapping: jsonb("mapping"),
  errors: jsonb("errors"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
