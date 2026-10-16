import { UUID } from "node:crypto";
import { pool } from "../db";

export interface Vehicle {
  id: UUID;
  placa: string;
  modelo: string;
  tipo_combustivel: string;
  capacidade_maxima: number;
  total_gasto_mensal: number;
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

export default { 
  getAllVehicles,
  getVehicleById
};