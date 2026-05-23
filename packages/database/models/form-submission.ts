import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const formSubmissions = pgTable(
  "form_submissions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    formId: uuid("form_id")
      .notNull(),

    responseData: text("response_data")
      .notNull(),

    submittedAt: timestamp("submitted_at")
      .defaultNow()
      .notNull(),
  }
);