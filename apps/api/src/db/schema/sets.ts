import { integer, pgTable } from "drizzle-orm/pg-core";

export const sets = pgTable("sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
});
