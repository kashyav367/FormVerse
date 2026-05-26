import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const formTable = pgTable("forms", {

  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  title: text("title")
    .notNull(),

  description: text("description"),

  createdBy: uuid("created_by")
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

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),

});


