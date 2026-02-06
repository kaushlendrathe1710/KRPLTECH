import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import "dotenv/config";

const { Pool } = pg;

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure SSL for Neon and other cloud databases
// const isNeonDb = databaseUrl.includes('neon.tech');
// const sslConfig = isNeonDb || databaseUrl.includes('sslmode=require')
//   ? { rejectUnauthorized: false }
//   : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined);

export const pool = new Pool({
  connectionString: databaseUrl,
  // ssl: sslConfig,
});
export const db = drizzle(pool, { schema });
