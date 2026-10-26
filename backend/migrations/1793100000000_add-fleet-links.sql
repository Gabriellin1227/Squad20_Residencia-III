-- Up Migration
ALTER TABLE motoristas ADD COLUMN frota text
  CHECK (frota IN ('Administrativa', 'Assistencial', 'Operacional', 'SVO'));
ALTER TABLE veiculos ADD COLUMN frota text
  CHECK (frota IN ('Administrativa', 'Assistencial', 'Operacional', 'SVO'));
ALTER TABLE veiculos ADD COLUMN exclusivo_svo boolean NOT NULL DEFAULT false;
ALTER TABLE veiculos ADD CONSTRAINT veiculos_exclusivo_svo_frota
  CHECK (NOT exclusivo_svo OR (frota IS NOT NULL AND frota = 'SVO'));
CREATE TABLE motoristas_veiculos (
  motorista_id uuid NOT NULL REFERENCES motoristas(id) ON DELETE CASCADE,
  veiculo_id uuid NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  PRIMARY KEY (motorista_id, veiculo_id)
);
CREATE INDEX motoristas_veiculos_veiculo_idx ON motoristas_veiculos(veiculo_id);
CREATE INDEX veiculos_frota_idx ON veiculos(frota);
CREATE INDEX motoristas_frota_idx ON motoristas(frota);

-- Serializa apenas alterações dos cadastros envolvidos, inclusive SQL direto.
-- O lock é obtido antes dos locks de linha, evitando corridas entre mudança
-- de frota/coringa e a criação de um vínculo.
CREATE FUNCTION lock_fleet_links() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(203734441, 20);
  RETURN NULL;
END;
$$;
CREATE FUNCTION validate_fleet_links() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM motoristas_veiculos mv
    JOIN motoristas m ON m.id = mv.motorista_id
    JOIN veiculos v ON v.id = mv.veiculo_id
    WHERE NOT m.motorista_coringa
      AND (m.frota IS NULL OR v.frota IS NULL OR m.frota <> v.frota)
  ) THEN
    RAISE EXCEPTION 'Veículo incompatível com a frota do motorista. Remova os vínculos incompatíveis ou use motorista coringa.'
      USING ERRCODE = '23514', CONSTRAINT = 'motoristas_veiculos_frota';
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER lock_motoristas_fleet BEFORE INSERT OR UPDATE OR DELETE ON motoristas
  FOR EACH STATEMENT EXECUTE FUNCTION lock_fleet_links();
CREATE TRIGGER lock_veiculos_fleet BEFORE INSERT OR UPDATE OR DELETE ON veiculos
  FOR EACH STATEMENT EXECUTE FUNCTION lock_fleet_links();
CREATE TRIGGER lock_motoristas_veiculos_fleet BEFORE INSERT OR UPDATE OR DELETE ON motoristas_veiculos
  FOR EACH STATEMENT EXECUTE FUNCTION lock_fleet_links();
-- Constraints diferidas permitem trocar frota e vínculos na mesma transação.
CREATE CONSTRAINT TRIGGER check_motoristas_fleet AFTER INSERT OR UPDATE ON motoristas
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION validate_fleet_links();
CREATE CONSTRAINT TRIGGER check_veiculos_fleet AFTER INSERT OR UPDATE ON veiculos
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION validate_fleet_links();
CREATE CONSTRAINT TRIGGER check_motoristas_veiculos_fleet AFTER INSERT OR UPDATE ON motoristas_veiculos
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION validate_fleet_links();

-- Down Migration
DROP TRIGGER check_motoristas_veiculos_fleet ON motoristas_veiculos;
DROP TRIGGER check_veiculos_fleet ON veiculos;
DROP TRIGGER check_motoristas_fleet ON motoristas;
DROP TRIGGER lock_motoristas_veiculos_fleet ON motoristas_veiculos;
DROP TRIGGER lock_veiculos_fleet ON veiculos;
DROP TRIGGER lock_motoristas_fleet ON motoristas;
DROP FUNCTION validate_fleet_links();
DROP FUNCTION lock_fleet_links();
DROP TABLE motoristas_veiculos;
DROP INDEX motoristas_frota_idx;
ALTER TABLE motoristas DROP COLUMN frota;
DROP INDEX veiculos_frota_idx;
ALTER TABLE veiculos DROP CONSTRAINT veiculos_exclusivo_svo_frota;
ALTER TABLE veiculos DROP COLUMN exclusivo_svo, DROP COLUMN frota;
