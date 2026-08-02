import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { formTable } from "./form";

export const formSubmissions = pgTable(
  "form_submissions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    formId: uuid("form_id")
      .references(() => formTable.id, { onDelete: "cascade" })
      .notNull(),

    responseData: text("response_data")
      .notNull(),

    submitterIpHash: text("submitter_ip_hash"),

    completionTimeSeconds: integer("completion_time_seconds"),

    submittedAt: timestamp("submitted_at")
      .defaultNow()
      .notNull(),
  }
);

export type SelectFormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = typeof formSubmissions.$inferInsert;