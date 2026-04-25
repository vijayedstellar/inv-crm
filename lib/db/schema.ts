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
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  fileUrl: text("file_url"),
  signed: boolean("signed").default(false),
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
  createdAt: createdAt(),
});

export const tasks = pgTable("tasks", {
  id: id(),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("open").notNull(),
  dueDate: timestamp("due_date"),
  assigneeId: text("assignee_id"),
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
