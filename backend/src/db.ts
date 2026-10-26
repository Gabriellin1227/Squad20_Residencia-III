import { Pool } from "pg";
import "./config/env";
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // string do Neon
});

export default pool;
