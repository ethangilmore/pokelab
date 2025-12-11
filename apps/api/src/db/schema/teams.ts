import { integer, pgTable } from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
});
