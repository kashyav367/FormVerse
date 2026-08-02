import {
  pgTable,
  uuid,
  text,
  doublePrecision,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { formSubmissions } from "./form-submission";
import { formsFields } from "./form-field";

export const responseAnswersTable = pgTable("response_answers", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  submissionId: uuid("submission_id")
    .references(() => formSubmissions.id, { onDelete: "cascade" })
    .notNull(),

  fieldId: uuid("field_id")
    .references(() => formsFields.id, { onDelete: "cascade" })
    .notNull(),

  fieldKey: text("field_key")
    .notNull(),

  valueText: text("value_text"),

  valueNumber: doublePrecision("value_number"),

  valueJson: jsonb("value_json"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export type SelectResponseAnswer = typeof responseAnswersTable.$inferSelect;
export type InsertResponseAnswer = typeof responseAnswersTable.$inferInsert;
