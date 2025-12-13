import { integer, smallint, serial, pgTable } from "drizzle-orm/pg-core"
import { sets } from "./sets"
import { moves } from "./moves"

export const setMoves = pgTable("set_moves", {
  id: serial().primaryKey(),
  set: integer().notNull().references(() => sets.id, { onDelete: "cascade" }),
  move: integer().notNull().references(() => moves.id, { onDelete: "restrict" }),
  slot: smallint().notNull(),
})
