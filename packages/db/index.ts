import dotenv from "dotenv"
import path from "path"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg";
import * as schema from "./schema"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default drizzle(pool, {schema});

