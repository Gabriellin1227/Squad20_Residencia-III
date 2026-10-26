-- Up Migration
INSERT INTO perfis (nome, descricao, codigo, permissoes) VALUES
('Auxiliar de Gestor', 'Acessos operacionais definidos pelo gestor', 'auxiliar_gestor', '{}'),
('Funcionário', 'Cria e acompanha suas próprias solicitações', 'funcionario', ARRAY['solicitacoes:criar','solicitacoes:ler-proprias']),
('Gestor SVO', 'Reservado para o futuro módulo SVO', 'gestor_svo', '{}'),
('Atendente SVO', 'Reservado para o futuro módulo SVO', 'atendente_svo', '{}')
ON CONFLICT (codigo) DO NOTHING;
-- Acrescenta permissões sem descartar permissões previamente configuradas.
UPDATE perfis SET permissoes = ARRAY(SELECT DISTINCT unnest(permissoes || ARRAY[
'usuarios:gerenciar','usuarios:delegar-permissoes',
'veiculos:ler','veiculos:gerenciar','motoristas:ler','motoristas:gerenciar',
'manutencoes:ler','manutencoes:gerenciar','notificacoes:ler','notificacoes:gerenciar',
'solicitacoes:criar','solicitacoes:ler-proprias','viagens:ler-proprias']))
WHERE codigo = 'administrador';
UPDATE perfis SET permissoes = ARRAY(SELECT DISTINCT unnest(permissoes || ARRAY[
'usuarios:delegar-permissoes','veiculos:ler','veiculos:gerenciar',
'motoristas:ler','motoristas:gerenciar','manutencoes:ler','manutencoes:gerenciar']))
WHERE codigo = 'gestor_frota';
UPDATE perfis SET permissoes = ARRAY(SELECT DISTINCT unnest(permissoes || ARRAY['solicitacoes:criar','solicitacoes:ler-proprias'])) WHERE codigo = 'solicitante';
UPDATE perfis SET permissoes = ARRAY(SELECT DISTINCT unnest(permissoes || ARRAY['viagens:ler-proprias'])) WHERE codigo IN ('motorista','motorista_coringa');
CREATE TABLE usuarios_permissoes (
  usuario_id uuid PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  permissoes text[] NOT NULL DEFAULT '{}'
);

-- Down Migration
-- Não remove perfis nem permissões: podem ter recebido alterações e vínculos após a migração.
DROP TABLE usuarios_permissoes;
