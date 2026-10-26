-- Up Migration

ALTER TABLE veiculos
  ADD COLUMN IF NOT EXISTS quilometragem integer NOT NULL DEFAULT 0,
  ADD COLUMN ultimo_km_alertado integer NOT NULL DEFAULT 0;

UPDATE veiculos SET ultimo_km_alertado = (quilometragem / 10) * 10;

CREATE OR REPLACE FUNCTION set_atualizado_em() RETURNS trigger AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE manutencoes
  ALTER COLUMN veiculo_id SET NOT NULL,
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN data_inicio SET NOT NULL,
  ALTER COLUMN criado_em SET NOT NULL,
  ALTER COLUMN atualizado_em SET NOT NULL;

ALTER TABLE manutencoes
  ADD COLUMN km_realizado integer,
  ADD COLUMN km_proxima integer;

ALTER TABLE manutencoes
  ADD CONSTRAINT manutencoes_custo_check CHECK (custo >= 0),
  ADD CONSTRAINT manutencoes_datas_check CHECK (data_fim IS NULL OR data_fim >= data_inicio),
  ADD CONSTRAINT manutencoes_status_check CHECK (status IN ('Em Andamento', 'Concluída', 'Cancelada')),
  ADD CONSTRAINT manutencoes_km_check CHECK (km_proxima IS NULL OR km_realizado IS NULL OR km_proxima > km_realizado);

CREATE INDEX idx_manutencoes_veiculo ON manutencoes(veiculo_id);
CREATE INDEX idx_manutencoes_status ON manutencoes(status);

CREATE TRIGGER trg_manutencoes_atualizado_em
  BEFORE UPDATE ON manutencoes
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

ALTER TABLE notificacoes
  ADD COLUMN veiculo_id uuid REFERENCES veiculos(id),
  ADD COLUMN lida_em timestamptz;

ALTER TABLE notificacoes
  ALTER COLUMN lida SET NOT NULL,
  ALTER COLUMN criado_em SET NOT NULL;

ALTER TABLE notificacoes
  ADD CONSTRAINT notificacoes_tipo_check
  CHECK (tipo_alerta IN ('manutencao_km', 'manutencao_vencida'));

CREATE INDEX idx_notificacoes_usuario_lida ON notificacoes(usuario_id, lida);
CREATE INDEX idx_notificacoes_veiculo ON notificacoes(veiculo_id);

-- Down Migration

DROP INDEX IF EXISTS idx_notificacoes_veiculo;
DROP INDEX IF EXISTS idx_notificacoes_usuario_lida;

ALTER TABLE notificacoes DROP CONSTRAINT IF EXISTS notificacoes_tipo_check;
ALTER TABLE notificacoes
  ALTER COLUMN lida DROP NOT NULL,
  ALTER COLUMN criado_em DROP NOT NULL;
ALTER TABLE notificacoes
  DROP COLUMN IF EXISTS lida_em,
  DROP COLUMN IF EXISTS veiculo_id;

DROP TRIGGER IF EXISTS trg_manutencoes_atualizado_em ON manutencoes;
DROP INDEX IF EXISTS idx_manutencoes_status;
DROP INDEX IF EXISTS idx_manutencoes_veiculo;

ALTER TABLE manutencoes
  DROP CONSTRAINT IF EXISTS manutencoes_km_check,
  DROP CONSTRAINT IF EXISTS manutencoes_status_check,
  DROP CONSTRAINT IF EXISTS manutencoes_datas_check,
  DROP CONSTRAINT IF EXISTS manutencoes_custo_check;

ALTER TABLE manutencoes
  DROP COLUMN IF EXISTS km_proxima,
  DROP COLUMN IF EXISTS km_realizado;

ALTER TABLE manutencoes
  ALTER COLUMN veiculo_id DROP NOT NULL,
  ALTER COLUMN status DROP NOT NULL,
  ALTER COLUMN data_inicio DROP NOT NULL,
  ALTER COLUMN criado_em DROP NOT NULL,
  ALTER COLUMN atualizado_em DROP NOT NULL;

DROP FUNCTION IF EXISTS set_atualizado_em();

ALTER TABLE veiculos DROP COLUMN IF EXISTS ultimo_km_alertado;
ALTER TABLE veiculos DROP COLUMN IF EXISTS quilometragem;
