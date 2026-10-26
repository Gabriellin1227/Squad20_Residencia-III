-- Somente desenvolvimento/demonstração. Não representa veículos reais.
INSERT INTO veiculos (placa, modelo, tipo_combustivel, capacidade_maxima,
  quilometragem, ultimo_km_alertado, frota, exclusivo_svo)
VALUES
  ('SVO0A01', 'SVO demonstração 01', 'Diesel', 60, 0, 0, 'SVO', true),
  ('SVO0A02', 'SVO demonstração 02', 'Diesel', 60, 0, 0, 'SVO', true),
  ('SVO0A03', 'SVO demonstração 03', 'Diesel', 60, 0, 0, 'SVO', true)
ON CONFLICT (placa) DO NOTHING;
