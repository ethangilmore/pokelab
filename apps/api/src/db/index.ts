import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"

export default drizzle(process.env.DATABASE_URL);

export { sets } from "./schema/sets"
export { teams } from "./schema/teams"
