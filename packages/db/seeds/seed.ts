import speciesData from "../../data/species.json"
import moveData from "../../data/moves.json"
import abilityData from "../../data/abilities.json"

import db, { species, abilities, moves, sets, setMoves, teamMembers, teams } from "../index"

async function main() {
  await db
    .insert(species)
    .values(speciesData)
    .onConflictDoNothing()

  await db
    .insert(abilities)
    .values(abilityData)
    .onConflictDoNothing()

  await db
    .insert(moves)
    .values(moveData)
    .onConflictDoNothing()

  const { id: moveId } = await db.query.moves.findFirst({ columns: { id: true }});
  const { id: abilityId } = await db.query.abilities.findFirst({ columns: { id: true }});
  const { id: speciesId } = await db.query.species.findFirst({ columns: { id: true }});

  const [{ id: setId }] = await db
    .insert(sets)
    .values([{
      ability: abilityId,
      species: speciesId
    }]).returning()


  await db
    .insert(setMoves)
    .values([{
      set: setId,
      move: moveId,
      slot: 0,
    }])

  const [{ id: teamId }] = await db
    .insert(teams)
    .values([{
      name: "Ethan's team"
    }])
    .returning()

  await db
    .insert(teamMembers)
    .values([{
      team: teamId,
      set: setId,
      slot: 0,
    }])
}

main()
.catch((err) => {
  console.error(err);
  process.exit(1);
})
.then(() => {
  console.log("success");
  process.exit(0);
})
