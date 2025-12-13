import { pgTable, serial, text } from "drizzle-orm/pg-core"

export const species = pgTable("species", {
  id: serial().primaryKey(),
  key: text().notNull().unique(),
  name: text().notNull(),
});
