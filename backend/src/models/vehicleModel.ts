import { pool } from "../db";
import { type VehicleInput } from "../middleware/validations/schemas/vehicleSchema";

export type Vehicle = Omit<VehicleInput, "teto_gasto_mensal" | "deletado_em" | "criado_em" | "atualizado_em"> & {
  id: string;
  teto_gasto_mensal: number | null;
  status: string;
  ativo: boolean;
  deletado_em: Date | null;
  criado_em: Date;
  atualizado_em: Date;
};

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
  ultimo_km_alertado,
`;

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT ${columns} FROM veiculos ORDER BY modelo, id`);
  return result.rows;
};

const getVehicleById = async (id: string) => {
  const result = await pool.query(`SELECT ${columns} FROM veiculos WHERE id = $1`, [id]);
  return result.rows[0];
};

const createVehicle = async (vehicle: Vehicle) => {
  const result = await pool.query(
    `INSERT INTO veiculos (modelo, placa, tipo_combustivel, capacidade_maxima, teto_gasto_mensal) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING ${columns}`,
    [
      vehicle.modelo, 
      vehicle.placa, 
      vehicle.tipo_combustivel, 
      vehicle.capacidade_maxima, 
      vehicle.teto_gasto_mensal ?? null
    ]
  );
  
  return result.rows[0];
};

const updateVehicle = async (id: string, vehicle: VehicleInput): Promise<Vehicle | undefined> => {
  const result = await pool.query(
    `UPDATE veiculos 
    SET modelo = $1, placa = $2, tipo_combustivel = $3, capacidade_maxima = $4, teto_gasto_mensal = $5 
    WHERE id = $6 
    RETURNING ${columns}`,
    [
      vehicle.modelo,
      vehicle.placa,
      vehicle.tipo_combustivel,
      vehicle.capacidade_maxima,
      vehicle.teto_gasto_mensal ?? null,
      id
    ]
  );

  return result.rows[0];
};

const deleteVehicle = async (id: string) => {
  const result = await pool.query(`DELETE FROM veiculos WHERE id = $1`, [id]);
  return result.rowCount === 1;
};

export default { 
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};