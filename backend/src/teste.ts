import { pool } from "./db";

pool
  .query("SELECT current_database(), current_schema(), now()")
  .then((r) => console.log("conexão ok:", r.rows))
  .catch((e) => console.error("ERRO:", e.code, e.message))
  .finally(() => pool.end());
