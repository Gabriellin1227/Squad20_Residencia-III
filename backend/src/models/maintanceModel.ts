import { pool } from "../db";
import { type MaintenaceInput } from "../middleware/validations/schemas/maintanceSchema";

export interface Maintance extends MaintenaceInput {
  id: string;
  veiculo_id: string;
  tipo_manutencao: "preventiva" | "impeditiva";
  data_inicio: Date;
  data_fim: Date;
  custo: number;
  descricao: string;
  status: "ativo" | "inativo";
}

const columns = `
  id,
  veiculo_id,
  tipo_manuntencao,
  data_inicio,
  data_fim,
  custo,
  descricao,
  status,
  criado_em
  atualizado_em
`;

const getAllMaintance = async () => {
  const result = await pool.query(
    `SELECT ${columns} FROM manuntencao ORDER BY status, id`,
  );
  return result.rows;
};

const getMaintancById = async (id: string) => {
  const result = await pool.query(
    `SELECT ${columns} FROM manuntencao WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

const createMaintance = async (maintance: Maintance) => {
  const result = await pool.query(
    `INSERT INTO manuntencao (veiculo_id, tipo_manuntencao, data_inicio, data_fim, custo, descricao, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING ${columns}`,
    [
      maintance.veiculo_id,
      maintance.tipo_manutencao,
      maintance.data_inicio,
      maintance.data_fim,
      maintance.custo,
      maintance.descricao,
      maintance.status,
    ],
  );

  return result.rows[0];
};

const updateMaintance = async (
  id: string,
  maintance: MaintenaceInput,
): Promise<Maintance | undefined> => {
  const result = await pool.query(
    `UPDATE manuntencao
    SET tipo_manuntencao = $1, tipo_manuntencao = $2, data_inicio = $3, data_fim = $4, custo = $5, descricao = $6, status = $7
    WHERE id = $8
    RETURNING ${columns}`,
    [
      maintance.tipo_manutencao,
      maintance.data_inicio,
      maintance.data_fim,
      maintance.custo,
      maintance.descricao,
      maintance.status,
      id,
    ],
  );

  return result.rows[0];
};

const deleteMaintance = async (id: string) => {
  const result = await pool.query(`DELETE FROM manuntencao WHERE id = $1`, [
    id,
  ]);
  return result.rowCount === 1;
};

export default {
  getAllMaintance,
  getMaintancById,
  createMaintance,
  updateMaintance,
  deleteMaintance,
};
