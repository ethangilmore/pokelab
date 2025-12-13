import express, { Request, Response } from "express"
import { Team } from "../../../packages/types/set"
// import { db } from "../../../packages/db/index"
import db from "../../../packages/db/index"

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
      species: set.species.name,
      ability: set.ability.name,
      item: set.item?.name,
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
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
