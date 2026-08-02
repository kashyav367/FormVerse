import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const themesTable = pgTable("themes", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  name: text("name")
    .notNull(),

  primaryColor: text("primary_color")
    .notNull(),

  backgroundColor: text("background_color")
    .notNull(),

  textColor: text("text_color")
    .notNull(),

  cardStyle: text("card_style")
    .default("glass")
    .notNull(),

  fontFamily: text("font_family")
    .default("Inter")
    .notNull(),

  isPreset: boolean("is_preset")
    .default(true)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export type SelectTheme = typeof themesTable.$inferSelect;
export type InsertTheme = typeof themesTable.$inferInsert;
