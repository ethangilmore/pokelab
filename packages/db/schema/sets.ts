import { text, integer, pgTable, smallint } from "drizzle-orm/pg-core";
import { species } from "./species";
import { items } from "./items";
import { abilities } from "./abilities";

export const sets = pgTable("sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  species: integer().notNull().references(() => species.id),
  ability: integer().notNull().references(() => abilities.id),
  item: integer().references(() => items.id),
  nature: text().default("hardy"),
  tera: text(),
  hp: smallint().default(0),
  atk: smallint().default(0),
  spa: smallint().default(0),
  def: smallint().default(0),
  spd: smallint().default(0),
  spe: smallint().default(0),
});
