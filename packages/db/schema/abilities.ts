import { pgTable, serial, text } from "drizzle-orm/pg-core"

export const abilities = pgTable("abilities", {
  id: serial().primaryKey(),
  key: text().notNull().unique(),
  name: text().notNull(),
});
