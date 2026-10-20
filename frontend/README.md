# Sistema de Gestão de Frota com Módulo de Verificação de Óbito (SVO)

Aplicação web para apoiar a gestão de frota, com funcionalidades de cadastro e consulta de motoristas e estrutura para os módulos operacionais do sistema.

> O módulo de Verificação de Óbito (SVO) deve ser implementado e validado conforme os requisitos funcionais definidos pela equipe. A descrição deste README não afirma que esse módulo já esteja concluído.

## Tecnologias

- React
- TypeScript
- TanStack Start e TanStack Router
- Vite
- Tailwind CSS
- Vitest e Testing Library

## Requisitos

- Node.js compatível com as versões utilizadas pelo projeto
- Bun

## Instalação

Na raiz do projeto, instale as dependências:

```bash
bun install
```

## Desenvolvimento

```bash
bun run dev
```

## Testes

```bash
bun run test
```

## Verificação de código e build

```bash
bun run lint
bun run build
```

## Estrutura do projeto

```text
src/
├── components/                 # Componentes reutilizáveis
│   └── ui/                     # Componentes de interface compartilhados
├── hooks/                      # Hooks compartilhados
├── lib/                        # Bibliotecas e utilitários internos
├── pages/                      # Telas da aplicação
│   ├── CadastroMotorista/
│   │   └── components/         # Componentes específicos do cadastro
│   ├── Motoristas/
│   │   └── components/         # Componentes específicos da listagem
│   └── ...
├── routes/                     # Rotas baseadas em arquivos
├── styles/                     # Estilos globais
├── types/                      # Tipos TypeScript
└── utils/                      # Funções utilitárias
```

## Organização do código

- Use `src/components/` para componentes reutilizáveis em mais de uma tela.
- Use `src/pages/NomeDaTela/components/` para componentes exclusivos de uma tela.
- Use `src/pages/NomeDaTela/hooks/` para hooks específicos de uma tela.
- Use `src/styles/` para estilos globais.
- Preserve os arquivos de `src/routes/`, pois eles definem a navegação da aplicação.

## Observações

Os dados de motoristas atualmente são armazenados no navegador (`localStorage`). Isso é adequado para prototipação, mas não substitui um backend compartilhado para uso multiusuário em produção.
