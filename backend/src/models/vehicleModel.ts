import { pool } from "../db";
import { type VehicleInput } from "../middleware/validations/schemas/vehicleSchema";

export type Vehicle = Omit<
  VehicleInput,
  "teto_gasto_mensal" | "deletado_em" | "criado_em" | "atualizado_em"
> & {
  id: string;
  teto_gasto_mensal: number | null;
  status: string;
  ativo: boolean;
  deletado_em: Date | null;
  criado_em: Date;
  atualizado_em: Date;
  quilometragem: number;
  ultimo_km_alertado: number;
};

export interface VehicleMaintenanceRow {
  id: string;
  placa: string;
  quilometragem: number;
  ultimo_km_alertado: number;
  km_restantes: number;
}

const columns = `
    id,
    placa,
    modelo,
    tipo_combustivel,
    capacidade_maxima,
    teto_gasto_mensal,
    status,
    ativo,
    deletado_em,
    criado_em,
    atualizado_em,
    quilometragem,
    ultimo_km_alertado, frota, exclusivo_svo
  `;

const getAllVehicles = async () => {
  const result = await pool.query(
    `SELECT ${columns} FROM veiculos ORDER BY modelo, id`,
  );
  return result.rows;
};

const getVehicleById = async (id: string) => {
  const result = await pool.query(
    `SELECT ${columns} FROM veiculos WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

const getNearMaintance = async (
  intervalKM: number,
  warnKM: number,
): Promise<VehicleMaintenanceRow[]> => {
  const result = await pool.query(
    `SELECT id, placa, quilometragem, ultimo_km_alertado,
      (ultimo_km_alertado + $1) - quilometragem AS km_restantes
      FROM veiculos
      WHERE quilometragem >= ultimo_km_alertado + $1 - $2`,
    [intervalKM, warnKM],
  );
  return result.rows;
};

const createVehicle = async (vehicle: Vehicle) => {
  const result = await pool.query(
    `INSERT INTO veiculos (modelo, placa, tipo_combustivel, capacidade_maxima, teto_gasto_mensal, quilometragem, ultimo_km_alertado, frota, exclusivo_svo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING ${columns}`,
    [
      vehicle.modelo,
      vehicle.placa,
      vehicle.tipo_combustivel,
      vehicle.capacidade_maxima,
      vehicle.teto_gasto_mensal ?? null,
      vehicle.quilometragem,
      vehicle.ultimo_km_alertado,
      vehicle.frota ?? null,
      vehicle.exclusivo_svo ?? false,
    ],
  );

  return result.rows[0];
};

const updateVehicle = async (
  id: string,
  vehicle: VehicleInput,
): Promise<Vehicle | undefined> => {
  const result = await pool.query(
    `UPDATE veiculos
      SET modelo = $1, placa = $2, tipo_combustivel = $3, capacidade_maxima = $4, teto_gasto_mensal = $5, quilometragem = $6, ultimo_km_alertado = $7, atualizado_em = NOW(), frota = CASE WHEN $11 THEN $9 ELSE frota END, exclusivo_svo = COALESCE($10, exclusivo_svo)
      WHERE id = $8
      RETURNING ${columns}`,
    [
      vehicle.modelo,
      vehicle.placa,
      vehicle.tipo_combustivel,
      vehicle.capacidade_maxima,
      vehicle.teto_gasto_mensal ?? null,
      vehicle.quilometragem,
      vehicle.ultimo_km_alertado,
      id,
      vehicle.frota ?? null,
      vehicle.exclusivo_svo ?? null,
      vehicle.frota !== undefined,
    ],
  );

  return result.rows[0];
};

const deleteVehicle = async (id: string) => {
  const result = await pool.query(`DELETE FROM veiculos WHERE id = $1`, [id]);
  return result.rowCount === 1;
};

const getVehicleTrips = async (id: string) => {
  const result = await pool.query(
    `SELECT id, status, data_inicio, data_fim, km_inicial, km_final
    FROM viagens WHERE veiculo_id=$1 ORDER BY data_inicio DESC NULLS LAST, criado_em DESC, id`,
    [id],
  );
  return result.rows;
};

export default {
  getVehicleTrips,
  getAllVehicles,
  getVehicleById,
  getNearMaintance,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
