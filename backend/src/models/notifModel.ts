import { pool } from "../db";
import { notifSchema, type NotifInput } from "../middleware/validations/schemas/notifSchema"

export interface Notification extends NotifInput {
  id: string;
  usuario_id: string;
  tipo_alerta: "sistema" | "email";
  mensagem: string;
  lida: boolean;
  ativo: boolean;
};

const columns = `
  id,
  usuario_id,
  tipo_alerta,
  mensagem,
  lida,
  criado_em,
  veiculo_id,
  lida_em,
  ativo
`;

const getAllNotif = async () => {
  const result = await pool.query(`SELECT ${columns} FROM notificacoes ORDER BY criado_em, id`)
  return result.rows[0];
}

const getNotifById = async (id: string) => {
  const result = await pool.query(`SELECT ${columns} FROM notificacoes WHERE = $1`, [id]);
  return result.rows[0];
}

const createNotif = async (notification: Notification) => {
  const result = await pool.query(
    `INSERT INTO notificacoes (usuario_id, tipo_alerta, mensagem, lida, veiculo_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING ${columns}`,
    [
      notification.usuario_id,
      notification.tipo_alerta,
      notification.mensagem,
      notification.lida,
      notification.veiculo_id
    ]
  );

  return result.rows[0];
};

const updateNotif = async (id: string, notification: NotifInput): Promise<Notification | undefined> => {
  const result = await pool.query(
    `UPDATE notificacoes
    SET tipo_alerta = $1, mensagem = $2, lida = $3
    WHERE id = $4
    RETURNING ${columns}`,
    [
      notification.tipo_alerta,
      notification.mensagem,
      notification.lida,
      id
    ]
  );

  return result.rows[0];
};

const deleteNotif = async (id: string) => {
  const result = await pool.query(`DELETE FROM notificacoes WHERE id = $1`, [id]);
  return result.rowCount === 1;
};

export default {
  getAllNotif,
  getNotifById,
  createNotif,
  updateNotif,
  deleteNotif
}