/*
CREATE TABLE manutencoes(
     id uuid NOT NULL DEFAULT gen_random_uuid(),
    veiculo_id uuid,
    tipo_manutencao varchar(50) NOT NULL,
    data_inicio timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    data_fim timestamp with time zone,
    custo numeric(10,2) NOT NULL,
    descricao text,
    status varchar(50) DEFAULT 'Em Andamento'::character varying,
    criado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp with time zone DEFAULT CURRENT_TIMESTAMP ,
    PRIMARY KEY(id) ,
    CONSTRAINT manutencoes_veiculo_id_fkey FOREIGN key(veiculo_id) REFERENCES veiculos(id) 
);
*/
