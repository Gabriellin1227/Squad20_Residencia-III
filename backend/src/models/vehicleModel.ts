import { UUID } from "node:crypto";
import conn from "../db";

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
  const [rows]: any = await conn.pool.query("SELECT * FROM veiculos");
  return rows;
}

export default { getAllVehicles };