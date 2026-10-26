CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- tabela setores
CREATE TABLE setores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    setor_id UUID REFERENCES setores(id) ON DELETE SET NULL,
    ativo BOOLEAN DEFAULT TRUE,
    deletado_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela perfis
CREATE TABLE perfis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(50) UNIQUE NOT NULL,
    descricao VARCHAR(255)
);

-- tabela usuarios_perfis
CREATE TABLE usuarios_perfis (
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    perfil_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, perfil_id)
);

-- tabela motoristas
CREATE TABLE motoristas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL CHECK (cpf ~ '^[0-9]{11}$'),
    cnh VARCHAR(20) UNIQUE NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    validade_cnh DATE NOT NULL,
    motorista_coringa BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Disponível',
    ativo BOOLEAN DEFAULT TRUE,
    deletado_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela veiculos
CREATE TABLE veiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    tipo_combustivel VARCHAR(50) NOT NULL,
    capacidade_maxima INT NOT NULL,
    teto_gasto_mensal DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Disponível',
    ativo BOOLEAN DEFAULT TRUE,
    deletado_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela cartoes_abastecimento
CREATE TABLE cartoes_abastecimento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_cartao VARCHAR(50) UNIQUE NOT NULL,
    veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela solicitacoes
CREATE TABLE solicitacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitante_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    categoria VARCHAR(50) NOT NULL,
    flag_urgencia BOOLEAN DEFAULT FALSE,
    data_necessidade TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pendente',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela viagens
CREATE TABLE viagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID REFERENCES solicitacoes(id) ON DELETE SET NULL,
    veiculo_id UUID REFERENCES veiculos(id) ON DELETE SET NULL,
    motorista_id UUID REFERENCES motoristas(id) ON DELETE SET NULL,
    qtd_passageiros_obitos INT NOT NULL DEFAULT 0,
    km_inicial INT,
    km_final INT,
    data_inicio TIMESTAMP WITH TIME ZONE,
    data_fim TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'Agendada',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela obitos
CREATE TABLE obitos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viagem_id UUID REFERENCES viagens(id) ON DELETE CASCADE,
    identificacao VARCHAR(255),
    local_recolhimento VARCHAR(255) NOT NULL,
    data_hora_recolhimento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela abastecimentos
CREATE TABLE abastecimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id UUID REFERENCES veiculos(id) ON DELETE SET NULL,
    motorista_id UUID REFERENCES motoristas(id) ON DELETE SET NULL,
    data_abastecimento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    litros DECIMAL(8,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    km_momento_abastecimento INT NOT NULL,
    alerta_teto_excedido BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela manutencoes
CREATE TABLE manutencoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id UUID REFERENCES veiculos(id) ON DELETE SET NULL,
    tipo_manutencao VARCHAR(50) NOT NULL,
    data_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_fim TIMESTAMP WITH TIME ZONE,
    custo DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'Em Andamento',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela documentos_veiculo
CREATE TABLE documentos_veiculo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id UUID REFERENCES veiculos(id) ON DELETE CASCADE,
    tipo_documento VARCHAR(100) NOT NULL,
    numero_documento VARCHAR(100),
    data_vencimento DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Regular',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela historico_status_solicitacao
CREATE TABLE historico_status_solicitacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES solicitacoes(id) ON DELETE CASCADE,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50) NOT NULL,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela historico_status_viagem
CREATE TABLE historico_status_viagem (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viagem_id UUID NOT NULL REFERENCES viagens(id) ON DELETE CASCADE,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50) NOT NULL,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela notificacoes
CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_alerta VARCHAR(50) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela logs_auditoria
CREATE TABLE logs_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    acao VARCHAR(255) NOT NULL,
    tabela_afetada VARCHAR(50),
    detalhes JSONB,
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabela outbox_events
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processado BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- indices
CREATE INDEX idx_outbox_unprocessed ON outbox_events(criado_em) WHERE processado = FALSE;
CREATE INDEX idx_solicitacoes_status ON solicitacoes(status);
CREATE INDEX idx_viagens_status ON viagens(status);
CREATE INDEX idx_veiculos_placa ON veiculos(placa);
CREATE INDEX idx_motoristas_cnh ON motoristas(cnh);
CREATE INDEX idx_historico_viagem ON historico_status_viagem(viagem_id);
CREATE INDEX idx_logs_auditoria_usuario ON logs_auditoria(usuario_id);


