import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { formTable } from "./form";

export interface FieldValidationRules {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  customErrorMessage?: string;
}

export interface ConditionalRule {
  targetFieldId: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: string;
}

export const formsFields = pgTable(
  "form_fields",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    formId: uuid("form_id")
      .references(() => formTable.id, { onDelete: "cascade" })
      .notNull(),

    label: text("label")
      .notNull(),

    labelKey: text("label_key")
      .notNull(),

    type: text("type")
      .notNull(),

    options: jsonb("options").$type<string[]>(),

    index: integer("index")
      .notNull(),

    placeholder: text("placeholder"),

    description: text("description"),

    isRequired: boolean("is_required")
      .default(false)
      .notNull(),

    validationRules: jsonb("validation_rules").$type<FieldValidationRules>(),

    conditionalLogic: jsonb("conditional_logic").$type<ConditionalRule>(),
  }
);

export type SelectFormField = typeof formsFields.$inferSelect;
export type InsertFormField = typeof formsFields.$inferInsert;