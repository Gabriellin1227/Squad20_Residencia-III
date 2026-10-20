# Rotas

O TanStack Router usa roteamento baseado em arquivos. Cada arquivo `.tsx` nesta pasta declara uma rota da aplicação.

## Convenções

- `index.tsx` representa a rota inicial (`/`).
- Arquivos como `motoristas.index.tsx` representam rotas de listagem.
- Arquivos com `$id` representam parâmetros dinâmicos.
- `__root.tsx` define a estrutura principal compartilhada e deve preservar o `<Outlet />`.
- `routeTree.gen.ts` é gerado automaticamente; não o edite manualmente.

A interface de cada tela fica em `src/pages/`; os arquivos de rota devem continuar pequenos e conectar a URL à página correspondente.
