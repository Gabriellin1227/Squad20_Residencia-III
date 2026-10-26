-- Up Migration

ALTER TABLE notificacoes
  ADD COLUMN ativo boolean NOT NULL DEFAULT true;

-- Backfill explícito (linhas existentes já recebem true pelo DEFAULT, isto só deixa a intenção clara)
UPDATE notificacoes SET ativo = true WHERE ativo IS NULL;

-- Índice parcial: o caso mais comum é "notificações ativas e não lidas do usuário"
CREATE INDEX idx_notificacoes_usuario_ativas
  ON notificacoes (usuario_id, lida)
  WHERE ativo = true;

-- Down Migration

DROP INDEX IF EXISTS idx_notificacoes_usuario_ativas;
ALTER TABLE notificacoes DROP COLUMN IF EXISTS ativo;