import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { pool } from "../src/db";

async function main() {
  const sql = await readFile(join(__dirname, "seed-svo-demo.sql"), "utf8");
  await pool.query(sql);
  const result = await pool.query(
    "SELECT placa, modelo, frota, exclusivo_svo FROM veiculos WHERE placa = ANY($1::text[]) ORDER BY placa",
    [["SVO0A01", "SVO0A02", "SVO0A03"]],
  );
  console.table(result.rows);
}
main()
  .catch(() => {
    console.error(
      "Não foi possível inserir os veículos de demonstração. Confira a conexão e a migração.",
    );
    process.exitCode = 1;
  })
  .finally(() => pool.end());
