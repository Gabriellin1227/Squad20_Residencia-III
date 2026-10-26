import { pool } from "../src/db";
import { hashPassword } from "../src/auth/password";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const nome = process.env.ADMIN_NAME?.trim() || "Administrador TI";
  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !password ||
    password.length < 12 ||
    password.length > 256
  ) {
    throw new Error(
      "Defina ADMIN_EMAIL e ADMIN_PASSWORD (12 a 256 caracteres) no ambiente do terminal",
    );
  }
  const hash = await hashPassword(password);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(2034, 1)");
    const existing = await client.query(
      "SELECT 1 FROM usuarios_perfis up JOIN perfis p ON p.id=up.perfil_id JOIN usuarios u ON u.id=up.usuario_id WHERE p.codigo='administrador' AND u.password_hash IS NOT NULL AND u.ativo AND u.deletado_em IS NULL LIMIT 1",
    );
    if (existing.rows.length)
      throw new Error(
        "Já existe administrador com senha; use a administração de usuários",
      );
    const profile = await client.query(
      "SELECT id FROM perfis WHERE codigo='administrador'",
    );
    if (!profile.rows[0])
      throw new Error("Execute as migrações antes de criar o administrador");
    const { rows } = await client.query(
      "INSERT INTO usuarios (nome,email,password_hash) VALUES ($1,$2,$3) ON CONFLICT (LOWER(email)) DO UPDATE SET password_hash=EXCLUDED.password_hash WHERE usuarios.password_hash IS NULL AND usuarios.ativo AND usuarios.deletado_em IS NULL RETURNING id",
      [nome, email, hash],
    );
    if (!rows[0]) throw new Error("Conta existente não pode ser inicializada");
    await client.query(
      "INSERT INTO usuarios_perfis (usuario_id,perfil_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [rows[0].id, profile.rows[0].id],
    );
    await client.query("COMMIT");
    console.log("Administrador inicial criado.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
