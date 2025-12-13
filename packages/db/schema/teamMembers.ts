import { pgTable, integer, serial, smallint } from "drizzle-orm/pg-core"
import { teams } from "./teams";
import { sets } from "./sets";

export const teamMembers = pgTable("team_members", {
  id: serial().primaryKey(),
  team: integer().notNull().references(() => teams.id, { onDelete: "cascade" }),
  set: integer().notNull().references(() => sets.id, { onDelete: "restrict" }),
  slot: smallint().notNull()
});
