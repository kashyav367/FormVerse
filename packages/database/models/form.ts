import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formTable = pgTable("forms", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  title: text("title")
    .notNull(),

  description: text("description"),

  createdBy: uuid("created_by")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),

  isPublished: boolean("is_published")
    .default(false)
    .notNull(),

  visibility: text("visibility", {
    enum: [
      "PUBLIC",
      "UNLISTED"
    ]
  })
    .default("UNLISTED")
    .notNull(),

  theme: text("theme")
    .default("Aurora")
    .notNull(),

  template: text("template")
    .default("BLANK")
    .notNull(),

  category: text("category")
    .default("Feedback")
    .notNull(),

  icon: text("icon")
    .default("📝")
    .notNull(),

  maxSubmissions: integer("max_submissions"),

  expiresAt: timestamp("expires_at"),

  closedMessage: text("closed_message")
    .default("This form is no longer accepting responses.")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export type SelectForm = typeof formTable.$inferSelect;
export type InsertForm = typeof formTable.$inferInsert;
