import { UUID } from "node:crypto";
import { pool } from "../db";

export interface Vehicle {
  id: UUID;
  placa: string;
  modelo: string;
  tipo_combustivel: string;
  capacidade_maxima: number;
  teto_gasto_mensal: number;
  status: string;
  ativo: boolean;
  deletado_em: Date;
  criado_em: Date;
  atualizado_em: Date;
}

const getAllVehicles = async () => {
  const result = await pool.query("SELECT * FROM veiculos");
  return result.rows;
};

const getVehicleById = async (id: string) => {
  const result = await pool.query("SELECT * FROM veiculos WHERE id = $1", [id]);
  return result.rows[0];
};

const createVehicle = async (vehicle: Vehicle) => {
  const { rows } = await pool.query(
    `INSERT INTO veiculos (modelo, placa, tipo_combustivel, capacidade_maxima, teto_gasto_mensal) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id AS insertUUID`,
    [
      vehicle.modelo, 
      vehicle.placa, 
      vehicle.tipo_combustivel, 
      vehicle.capacidade_maxima, 
      vehicle.teto_gasto_mensal ?? null
    ]
  );
  
  return rows[0]?.insertUUID;
};
//INSERT INTO "veiculos"("modelo","placa","tipo_combustivel","capacidade_maxima") VALUES('BMW','A1A1A1','GASOLINA',3);

export default { 
  getAllVehicles,
  getVehicleById,
  createVehicle
};