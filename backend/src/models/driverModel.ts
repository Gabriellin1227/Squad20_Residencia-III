import { pool } from "../db";
import { type DriverInput } from "../middleware/validations/schemas/driverSchema";

export interface Driver extends DriverInput {
  id: string;
  motorista_coringa: boolean;
  status: string;
  ativo: boolean;
  deletado_em: Date | null;
  criado_em: Date;
  atualizado_em: Date;
}

export interface DriverLicenseRow {
  id: string;
  nome: string;
  validade_cnh: string;
  dias_restantes: number;
}

// Keep PostgreSQL DATE as a calendar date, independent of the host timezone.
const columns = `id, nome, cpf, cnh, categoria,
  to_char(validade_cnh, 'YYYY-MM-DD') AS validade_cnh,
  motorista_coringa, status, ativo, deletado_em, criado_em, atualizado_em`;

const getAllDrivers = async (): Promise<Driver[]> => {
  const result = await pool.query(
    `SELECT ${columns} FROM motoristas ORDER BY nome, id`,
  );
  return result.rows;
};

const getDriverById = async (id: string): Promise<Driver | undefined> => {
  const result = await pool.query(
    `SELECT ${columns} FROM motoristas WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

const getDriverWLicenseExp = async (
  dayAhead: number,
): Promise<DriverLicenseRow[]> => {
  const result = await pool.query(
    `SELECT id, nome, validade_cnh::text as validade_cnh,
    (validade_cnh - CURRENT_DATE) as dias_restantes
    FROM motoristas
    WHERE ativo and deletado_em IS NULL
    AND validade_cnh <= CURRENT_DATE + $1::int
    ORDER BY validade_cnh`,
    [dayAhead],
  );
  return result.rows;
};

const createDriver = async (driver: DriverInput): Promise<Driver> => {
  const result = await pool.query(
    `INSERT INTO motoristas
    (nome, cpf, cnh, categoria, validade_cnh, motorista_coringa)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${columns}`,
    [
      driver.nome,
      driver.cpf,
      driver.cnh,
      driver.categoria,
      driver.validade_cnh,
      driver.motorista_coringa ?? false,
    ],
  );
  return result.rows[0];
};

const updateDriver = async (
  id: string,
  driver: DriverInput,
): Promise<Driver | undefined> => {
  const result = await pool.query(
    `UPDATE motoristas SET
    nome = $2, cpf = $3, cnh = $4, categoria = $5, validade_cnh = $6,
    motorista_coringa = COALESCE($7, motorista_coringa), atualizado_em = CURRENT_TIMESTAMP
    WHERE id = $1 RETURNING ${columns}`,
    [
      id,
      driver.nome,
      driver.cpf,
      driver.cnh,
      driver.categoria,
      driver.validade_cnh,
      driver.motorista_coringa ?? null,
    ],
  );
  return result.rows[0];
};

const deleteDriver = async (id: string): Promise<boolean> => {
  const result = await pool.query("DELETE FROM motoristas WHERE id = $1", [id]);
  return result.rowCount === 1;
};

export default {
  getAllDrivers,
  getDriverById,
  getDriverWLicenseExp,
  createDriver,
  updateDriver,
  deleteDriver,
};
