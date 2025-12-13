import { pgTable, serial, text } from "drizzle-orm/pg-core"

export const items = pgTable("items", {
  id: serial().primaryKey(),
  name: text().notNull(),
});
