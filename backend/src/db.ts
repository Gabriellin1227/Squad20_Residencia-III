import { Pool } from "pg";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD ?? ""),
  port: Number(process.env.DB_PORT ?? 5432),
  max: 20,
  connectionTimeoutMillis: 2000,
});

export default pool;