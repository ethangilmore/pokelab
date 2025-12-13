import { relations } from "drizzle-orm";
import { abilities } from "./abilities";
import { items } from "./items";
import { moves } from "./moves";
import { setMoves } from "./setMoves";
import { sets } from "./sets";
import { species } from "./species";
import { teamMembers } from "./teamMembers";
import { teams } from "./teams";

export const setRelations = relations(sets, ({ one, many }) => ({
  species: one(species, {
    fields: [sets.species],
    references: [species.id],
  }),
  item: one(items, {
    fields: [sets.item],
    references: [items.id],
  }),
  ability: one(abilities, {
    fields: [sets.ability],
    references: [abilities.id],
  }),
  moves: many(setMoves),
}));

export const setMoveRelations = relations(setMoves, ({ one }) => ({
  set: one(sets, {
    fields: [setMoves.set],
    references: [sets.id],
  }),
  move: one(moves, {
    fields: [setMoves.move],
    references: [moves.id],
  }),
}));

export const teamRelations = relations(teams, ({ many }) => ({
  members: many(teamMembers),
}));

export const teamMemberRelations = relations(teamMembers, ({ one }) => ({
  set: one(sets, {
    fields: [teamMembers.set],
    references: [sets.id],
  }),
  team: one(teams, {
    fields: [teamMembers.team],
    references: [teams.id],
  }),
}));

