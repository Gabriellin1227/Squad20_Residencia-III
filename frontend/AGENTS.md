# Orientações de desenvolvimento

- O projeto é o Sistema de Gestão de Frota com Módulo de Verificação de Óbito (SVO).
- As páginas ficam em `src/pages/`; os arquivos em `src/routes/` definem as rotas do TanStack Router.
- Componentes compartilhados entre telas ficam em `src/components/`. Componentes exclusivos de uma tela ficam em `src/pages/NomeDaTela/components/`.
- Hooks exclusivos de uma tela ficam em `src/pages/NomeDaTela/hooks/`; hooks compartilhados ficam em `src/hooks/`.
- Estilos globais ficam em `src/styles/`; a folha global atual é `src/styles/global.css`.
- Não editar manualmente `src/routeTree.gen.ts`: ele é gerado pelo TanStack Router.
- Os dados de motoristas são armazenados localmente via `src/utils/storage.ts`; as regras de validação ficam em `src/utils/validation.ts`.
- Antes de enviar alterações, execute `bun run test`, `bun run lint` e `bun run build`.
