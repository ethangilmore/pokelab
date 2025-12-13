import { text, integer, pgTable, smallint } from "drizzle-orm/pg-core";
import { species } from "./species";
import { items } from "./items";
import { abilities } from "./abilities";

export const sets = pgTable("sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  species: integer().notNull().references(() => species.id),
  ability: integer().notNull().references(() => abilities.id),
  item: integer().references(() => items.id),
  nature: text(),
  tera: text(),
  hp: smallint(),
  atk: smallint(),
  spa: smallint(),
  def: smallint(),
  spd: smallint(),
  spe: smallint(),
});
