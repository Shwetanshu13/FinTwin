import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "../conf";

const pool = new Pool({
    connectionString: config.dbUrl,
});

const db = drizzle({ client: pool });

export * from './schema';
export { db };