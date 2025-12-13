import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text(),
  format: text(),
});
