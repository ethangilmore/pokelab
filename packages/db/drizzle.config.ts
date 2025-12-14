// import 'dotenv/config'
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './packages/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://user:password@localhost:5432/db"
,
  }
});
