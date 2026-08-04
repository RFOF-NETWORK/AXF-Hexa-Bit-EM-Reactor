import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const reposTable = pgTable("repos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  status: text("status").notNull().default("ok"), // ok | warning | critical
  alertCount: integer("alert_count").notNull().default(0),
  lastChecked: timestamp("last_checked", { withTimezone: true }).notNull().defaultNow(),
});

export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  repoName: text("repo_name").notNull(),
  severity: text("severity").notNull(), // critical | high | medium | low
  title: text("title").notNull(),
  description: text("description").notNull(),
  cve: text("cve"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Repo = typeof reposTable.$inferSelect;
export type Alert = typeof alertsTable.$inferSelect;
