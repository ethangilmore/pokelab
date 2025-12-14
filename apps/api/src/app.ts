import express, { Request, Response } from "express"
import type { Team } from "@pokelab/types"
import db, { setMoves, sets, teamMembers, teams } from "@pokelab/db"

const app = express()
app.use(express.json())

const port = 3000

app.get('/teams/:id', async (req: Request<{id: string}>, res: Response) => {
  const { id } = req.params;
  const teamId = parseInt(id);

  const team = await db.query.teams.findFirst({
    where: (team, { eq }) => eq(team.id, teamId),
    with: {
      members: {
        orderBy: (members, { asc }) => [asc(members.slot)],
        with: {
          set: {
            with: {
              species: true,
              item: true,
              ability: true,
              moves: {
                orderBy: (setMoves, { asc }) => [asc(setMoves.slot)],
                with: {
                  move: true
                }
              }
            }
          }
        }
      }
    }
  })

  if (!team) return res.status(404).json({ error: "Team not found" });

  res.send({
    name: team.name,
    format: team.format,
    members: team.members.map(({ set }) => ({
      species: set.species.key,
      ability: set.ability.key,
      item: set.item?.key,
      spread: {
        hp: set.hp,
        atk: set.atk,
        spa: set.spa,
        def: set.def,
        spd: set.spd,
        spe: set.spe,
      },
      moves: set.moves.map(({ move }) => move.name),
      nature: set.nature,
      tera: set.tera,
    }))
  })
})


app.post('/teams', async (req: Request<{}, {}, Team>, res: Response) => {
  const team = req.body

  await db.transaction(async (tx) => {
    const setRows = await tx
      .insert(sets)
      .values(
        team.members.map(set => ({
          species: 0,
          ability: 0,
          item: 0,
          nature: set.nature,
          tera: set.tera,
          hp: set.spread.hp,
          atk: set.spread.atk,
          spa: set.spread.spa,
          def: set.spread.def,
          spd: set.spread.spd,
          spe: set.spread.spe,
        }))
      )
      .returning({ id: sets.id })

    await tx
      .insert(setMoves)
      .values(
        team.members.flatMap((member, memberIdx) =>
         member.moves.map((moveKey, moveIdx) => ({
           set: setRows[memberIdx].id,
           move: 0,
           slot: moveIdx + 1,
         }))
        )
      )

    const [teamRow] = await tx
      .insert(teams)
      .values({
        name: team.name,
        format: team.format,
      })

    await tx
      .insert(teamMembers)
      .values(
        setRows.map((set, idx) => ({
          team: teamRow.id,
          set: set.id,
          slot: idx,
        }))
      )

  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
