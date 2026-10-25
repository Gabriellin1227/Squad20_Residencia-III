import { Pool } from "pg";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
const result = dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
console.log("dotenv erro:", result.error?.message);
console.log("DATABASE_URL carregada?", !!process.env.DATABASE_URL);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // string do Neon
});

export default pool;
