import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { formTable } from "./form";

export const analyticsEventsTable = pgTable("analytics_events", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  formId: uuid("form_id")
    .references(() => formTable.id, { onDelete: "cascade" })
    .notNull(),

  eventType: text("event_type", {
    enum: ["VIEW", "START", "SUBMIT"]
  }).notNull(),

  ipHash: text("ip_hash"),

  userAgent: text("user_agent"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export type SelectAnalyticsEvent = typeof analyticsEventsTable.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEventsTable.$inferInsert;
