import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const fieldEnum = pgEnum("fieldEnum", ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

export const formsFields = pgTable(
  "formsFields",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    label: varchar("label", { length: 100 }).notNull(),
    labelKey: varchar("label_key", { length: 100 }).notNull(),

    placeholder: text("placeholder"),

    isRequired: boolean("is_required").default(false),

    index: numeric("index", { scale: 2 }).notNull().unique(),

    type: fieldEnum("type").notNull(),

    formId: uuid("form_id").references(() => formsTable.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      uniqueFormIdAndIndex: unique().on(table.formId, table.index),
    };
  },
);
