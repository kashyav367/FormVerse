import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const formsFields = pgTable(
  "form_fields",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    formId: uuid("form_id")
      .notNull(),

    label: text("label")
      .notNull(),

    labelKey: text("label_key")
      .notNull(),

    type: text("type")
      .notNull(),

    options: text(
      "options"
    ),

    index: integer("index")
      .notNull(),

    placeholder: text(
      "placeholder"
    ),

    isRequired: boolean(
      "is_required"
    )
      .default(false)
      .notNull(),
  }
);