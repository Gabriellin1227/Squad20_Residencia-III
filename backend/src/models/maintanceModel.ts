import { pool } from "../db";
import type { MaintenaceInput } from "../middleware/validations/schemas/maintanceSchema";

export interface Maintance extends MaintenaceInput {
  id: string;
  criado_em: Date;
  atualizado_em: Date;
}
const columns =
  "id, veiculo_id, tipo_manutencao, data_inicio, data_fim, custo, descricao, status, km_realizado, km_proxima, criado_em, atualizado_em";
const values = (input: MaintenaceInput) => [
  input.veiculo_id,
  input.tipo_manutencao,
  input.data_inicio ?? null,
  input.data_fim ?? null,
  input.custo,
  input.descricao ?? null,
  input.status,
  input.km_realizado ?? null,
  input.km_proxima ?? null,
];
const getAllMaintance = async (): Promise<Maintance[]> =>
  (
    await pool.query(
      `SELECT ${columns} FROM manutencoes ORDER BY data_inicio DESC, id`,
    )
  ).rows;
const getMaintancById = async (id: string): Promise<Maintance | undefined> =>
  (await pool.query(`SELECT ${columns} FROM manutencoes WHERE id=$1`, [id]))
    .rows[0];
const createMaintance = async (input: MaintenaceInput): Promise<Maintance> =>
  (
    await pool.query(
      `INSERT INTO manutencoes (veiculo_id,tipo_manutencao,data_inicio,data_fim,custo,descricao,status,km_realizado,km_proxima) VALUES ($1,$2,COALESCE($3,NOW()),$4,$5,$6,$7,$8,$9) RETURNING ${columns}`,
      values(input),
    )
  ).rows[0];
const updateMaintance = async (
  id: string,
  input: MaintenaceInput,
): Promise<Maintance | undefined> =>
  (
    await pool.query(
      `UPDATE manutencoes SET veiculo_id=$1,tipo_manutencao=$2,data_inicio=COALESCE($3,data_inicio),data_fim=$4,custo=$5,descricao=$6,status=$7,km_realizado=$8,km_proxima=$9 WHERE id=$10 RETURNING ${columns}`,
      [...values(input), id],
    )
  ).rows[0];
const deleteMaintance = async (id: string): Promise<boolean> =>
  (await pool.query("DELETE FROM manutencoes WHERE id=$1", [id])).rowCount ===
  1;
export default {
  getAllMaintance,
  getMaintancById,
  createMaintance,
  updateMaintance,
  deleteMaintance,
};
