-- Up Migration
-- Usuários existentes permanecem sem acesso até receberem uma senha por um administrador.
ALTER TABLE usuarios ADD COLUMN password_hash text;
CREATE UNIQUE INDEX usuarios_email_lower_key ON usuarios (LOWER(email));
CREATE TABLE auth_sessions (
  token_hash char(64) PRIMARY KEY,
  usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT NOW()
);
CREATE INDEX auth_sessions_user_idx ON auth_sessions (usuario_id);
CREATE INDEX auth_sessions_expiry_idx ON auth_sessions (expires_at);

-- Down Migration
DROP TABLE auth_sessions;
DROP INDEX usuarios_email_lower_key;
ALTER TABLE usuarios DROP COLUMN password_hash;
