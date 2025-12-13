import { pgTable, serial, text } from "drizzle-orm/pg-core"

export const moves = pgTable("moves", {
  id: serial().primaryKey(),
  key: text().notNull().unique(),
  name: text().notNull(),
});
