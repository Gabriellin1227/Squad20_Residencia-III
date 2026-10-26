-- Up Migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

CREATE TABLE public.abastecimentos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    veiculo_id uuid,
    motorista_id uuid,
    data_abastecimento timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    litros numeric(8,2) NOT NULL,
    valor_total numeric(10,2) NOT NULL,
    km_momento_abastecimento integer NOT NULL,
    alerta_teto_excedido boolean DEFAULT false,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.cartoes_abastecimento (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero_cartao character varying(50) NOT NULL,
    veiculo_id uuid NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.documentos_veiculo (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    veiculo_id uuid,
    tipo_documento character varying(100) NOT NULL,
    numero_documento character varying(100),
    data_vencimento date NOT NULL,
    status character varying(50) DEFAULT 'Regular'::character varying,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.historico_status_solicitacao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    solicitacao_id uuid NOT NULL,
    status_anterior character varying(50),
    status_novo character varying(50) NOT NULL,
    usuario_id uuid,
    data_hora timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.historico_status_viagem (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    viagem_id uuid NOT NULL,
    status_anterior character varying(50),
    status_novo character varying(50) NOT NULL,
    usuario_id uuid,
    data_hora timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.logs_auditoria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    acao character varying(255) NOT NULL,
    tabela_afetada character varying(50),
    detalhes jsonb,
    data_hora timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.manutencoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    veiculo_id uuid,
    tipo_manutencao character varying(50) NOT NULL,
    data_inicio timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    data_fim timestamp with time zone,
    custo numeric(10,2) NOT NULL,
    descricao text,
    status character varying(50) DEFAULT 'Em Andamento'::character varying,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.motoristas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(150) NOT NULL,
    cpf character varying(11) NOT NULL,
    cnh character varying(20) NOT NULL,
    categoria character varying(50) NOT NULL,
    validade_cnh date NOT NULL,
    motorista_coringa boolean DEFAULT false NOT NULL,
    status character varying(50) DEFAULT 'Disponível'::character varying,
    ativo boolean DEFAULT true,
    deletado_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT motoristas_cpf_check CHECK (((cpf)::text ~ '^[0-9]{11}$'::text))
);

CREATE TABLE public.notificacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    tipo_alerta character varying(50) NOT NULL,
    mensagem text NOT NULL,
    lida boolean DEFAULT false,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.obitos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    viagem_id uuid,
    identificacao character varying(255),
    local_recolhimento character varying(255) NOT NULL,
    data_hora_recolhimento timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.outbox_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    aggregate_type character varying(100) NOT NULL,
    aggregate_id uuid NOT NULL,
    event_type character varying(100) NOT NULL,
    payload jsonb NOT NULL,
    processado boolean DEFAULT false,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.perfis (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(50) NOT NULL,
    descricao character varying(255)
);

CREATE TABLE public.setores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(100) NOT NULL,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.solicitacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    solicitante_id uuid,
    categoria character varying(50) NOT NULL,
    flag_urgencia boolean DEFAULT false,
    data_necessidade timestamp with time zone NOT NULL,
    status character varying(50) DEFAULT 'Pendente'::character varying,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.usuarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    setor_id uuid,
    ativo boolean DEFAULT true,
    deletado_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.usuarios_perfis (
    usuario_id uuid NOT NULL,
    perfil_id uuid NOT NULL
);

CREATE TABLE public.veiculos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    placa character varying(10) NOT NULL,
    modelo character varying(100) NOT NULL,
    tipo_combustivel character varying(50) NOT NULL,
    capacidade_maxima integer NOT NULL,
    teto_gasto_mensal numeric(10,2),
    status character varying(50) DEFAULT 'Disponível'::character varying,
    ativo boolean DEFAULT true,
    deletado_em timestamp with time zone,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.viagens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    solicitacao_id uuid,
    veiculo_id uuid,
    motorista_id uuid,
    qtd_passageiros_obitos integer DEFAULT 0 NOT NULL,
    km_inicial integer,
    km_final integer,
    data_inicio timestamp with time zone,
    data_fim timestamp with time zone,
    status character varying(50) DEFAULT 'Agendada'::character varying,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Primary keys e unique

ALTER TABLE ONLY public.abastecimentos ADD CONSTRAINT abastecimentos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cartoes_abastecimento ADD CONSTRAINT cartoes_abastecimento_numero_cartao_key UNIQUE (numero_cartao);
ALTER TABLE ONLY public.cartoes_abastecimento ADD CONSTRAINT cartoes_abastecimento_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.documentos_veiculo ADD CONSTRAINT documentos_veiculo_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.historico_status_solicitacao ADD CONSTRAINT historico_status_solicitacao_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.historico_status_viagem ADD CONSTRAINT historico_status_viagem_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.logs_auditoria ADD CONSTRAINT logs_auditoria_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.manutencoes ADD CONSTRAINT manutencoes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.motoristas ADD CONSTRAINT motoristas_cnh_key UNIQUE (cnh);
ALTER TABLE ONLY public.motoristas ADD CONSTRAINT motoristas_cpf_key UNIQUE (cpf);
ALTER TABLE ONLY public.motoristas ADD CONSTRAINT motoristas_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notificacoes ADD CONSTRAINT notificacoes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.obitos ADD CONSTRAINT obitos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.outbox_events ADD CONSTRAINT outbox_events_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.perfis ADD CONSTRAINT perfis_nome_key UNIQUE (nome);
ALTER TABLE ONLY public.perfis ADD CONSTRAINT perfis_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.setores ADD CONSTRAINT setores_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.solicitacoes ADD CONSTRAINT solicitacoes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_email_key UNIQUE (email);
ALTER TABLE ONLY public.usuarios_perfis ADD CONSTRAINT usuarios_perfis_pkey PRIMARY KEY (usuario_id, perfil_id);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.veiculos ADD CONSTRAINT veiculos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.veiculos ADD CONSTRAINT veiculos_placa_key UNIQUE (placa);
ALTER TABLE ONLY public.viagens ADD CONSTRAINT viagens_pkey PRIMARY KEY (id);

-- Índices

CREATE INDEX idx_historico_viagem ON public.historico_status_viagem USING btree (viagem_id);
CREATE INDEX idx_logs_auditoria_usuario ON public.logs_auditoria USING btree (usuario_id);
CREATE INDEX idx_motoristas_cnh ON public.motoristas USING btree (cnh);
CREATE INDEX idx_outbox_unprocessed ON public.outbox_events USING btree (criado_em) WHERE (processado = false);
CREATE INDEX idx_solicitacoes_status ON public.solicitacoes USING btree (status);
CREATE INDEX idx_veiculos_placa ON public.veiculos USING btree (placa);
CREATE INDEX idx_viagens_status ON public.viagens USING btree (status);

-- Foreign keys

ALTER TABLE ONLY public.abastecimentos ADD CONSTRAINT abastecimentos_motorista_id_fkey FOREIGN KEY (motorista_id) REFERENCES public.motoristas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.abastecimentos ADD CONSTRAINT abastecimentos_veiculo_id_fkey FOREIGN KEY (veiculo_id) REFERENCES public.veiculos(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.cartoes_abastecimento ADD CONSTRAINT cartoes_abastecimento_veiculo_id_fkey FOREIGN KEY (veiculo_id) REFERENCES public.veiculos(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.documentos_veiculo ADD CONSTRAINT documentos_veiculo_veiculo_id_fkey FOREIGN KEY (veiculo_id) REFERENCES public.veiculos(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.historico_status_solicitacao ADD CONSTRAINT historico_status_solicitacao_solicitacao_id_fkey FOREIGN KEY (solicitacao_id) REFERENCES public.solicitacoes(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.historico_status_solicitacao ADD CONSTRAINT historico_status_solicitacao_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.historico_status_viagem ADD CONSTRAINT historico_status_viagem_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.historico_status_viagem ADD CONSTRAINT historico_status_viagem_viagem_id_fkey FOREIGN KEY (viagem_id) REFERENCES public.viagens(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.logs_auditoria ADD CONSTRAINT logs_auditoria_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.manutencoes ADD CONSTRAINT manutencoes_veiculo_id_fkey FOREIGN KEY (veiculo_id) REFERENCES public.veiculos(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.notificacoes ADD CONSTRAINT notificacoes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.obitos ADD CONSTRAINT obitos_viagem_id_fkey FOREIGN KEY (viagem_id) REFERENCES public.viagens(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.solicitacoes ADD CONSTRAINT solicitacoes_solicitante_id_fkey FOREIGN KEY (solicitante_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.usuarios_perfis ADD CONSTRAINT usuarios_perfis_perfil_id_fkey FOREIGN KEY (perfil_id) REFERENCES public.perfis(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.usuarios_perfis ADD CONSTRAINT usuarios_perfis_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_setor_id_fkey FOREIGN KEY (setor_id) REFERENCES public.setores(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.viagens ADD CONSTRAINT viagens_motorista_id_fkey FOREIGN KEY (motorista_id) REFERENCES public.motoristas(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.viagens ADD CONSTRAINT viagens_solicitacao_id_fkey FOREIGN KEY (solicitacao_id) REFERENCES public.solicitacoes(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.viagens ADD CONSTRAINT viagens_veiculo_id_fkey FOREIGN KEY (veiculo_id) REFERENCES public.veiculos(id) ON DELETE SET NULL;

-- Down Migration

-- Baseline não é revertido.