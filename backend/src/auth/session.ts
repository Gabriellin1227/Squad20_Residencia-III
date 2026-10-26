import { createHash, randomBytes } from "node:crypto";
import type { Request, RequestHandler } from "express";
import { pool } from "../db";

export type AuthenticatedRequest = Request & {
  user?: { id: string };
  sessionHash?: string;
};
export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  await pool.query("DELETE FROM auth_sessions WHERE expires_at <= NOW()");
  await pool.query(
    "INSERT INTO auth_sessions (token_hash, usuario_id, expires_at) VALUES ($1, $2, $3)",
    [tokenHash(token), userId, expiresAt],
  );
  return { token, expiresAt };
}

export const authenticate: RequestHandler = async (req, res, next) => {
  const header = req.headers.authorization ?? "";
  const match = /^Bearer ([a-f0-9]{64})$/.exec(header);
  if (!match) {
    res.status(401).json({ message: "Autenticação necessária" });
    return;
  }
  try {
    const hash = tokenHash(match[1]);
    const { rows } = await pool.query(
      `SELECT u.id FROM auth_sessions s JOIN usuarios u ON u.id = s.usuario_id WHERE s.token_hash = $1 AND s.expires_at > NOW() AND u.ativo = TRUE AND u.deletado_em IS NULL`,
      [hash],
    );
    if (!rows[0]) {
      res.status(401).json({ message: "Sessão inválida ou expirada" });
      return;
    }
    (req as AuthenticatedRequest).user = { id: rows[0].id };
    (req as AuthenticatedRequest).sessionHash = hash;
    next();
  } catch {
    res.status(500).json({ message: "Não foi possível validar a sessão" });
  }
};
