# Frontend

React 19 + TypeScript + Vite, com SCSS, testes unitários (Vitest) e e2e (Playwright).

## Primeiros passos

```bash
npm install
cp .env.example .env
npx playwright install chromium   # só na primeira vez, para os testes e2e
npm run dev            # sobe os dois apps (portas 5173 e 5174)
```

## Dois apps, um repositório

| App                           | Porta | Comando                 | Build            |
| ----------------------------- | ----- | ----------------------- | ---------------- |
| Gestor (desktop): dashboard…  | 5173  | `npm run dev:gestor`    | `dist/gestor`    |
| Motorista (mobile-first, PWA) | 5174  | `npm run dev:motorista` | `dist/motorista` |

Cada app tem seu `index.html` e `public/` em `apps/<nome>/`, e compartilha `src/` (componentes, estilos, hooks).
Publique cada `dist/` em um domínio próprio (ex.: `gestor.…` e `app.…`).

O app do motorista é um PWA **online-first**: instalável (manifest + service worker), mas sem cache de dados.
Sem internet ele mostra um aviso/`offline.html`. O service worker só é registrado no build de produção
(`npm run build:motorista && npm run preview:motorista`). Instalação e geolocalização exigem HTTPS (ou `localhost`).

## Scripts

| Comando                 | O que faz                                         |
| ----------------------- | ------------------------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento com HMR               |
| `npm run build`         | Checa tipos e gera o build de produção            |
| `npm run preview`       | Serve o build localmente                          |
| `npm run lint`          | Lint com oxlint (`lint:fix` corrige)              |
| `npm run format`        | Formata com Prettier (`format:check` só checa)    |
| `npm run typecheck`     | Checagem de tipos                                 |
| `npm test`              | Testes unitários (uma execução)                   |
| `npm run test:watch`    | Testes unitários em modo watch                    |
| `npm run test:coverage` | Testes com relatório de cobertura                 |
| `npm run test:e2e`      | Testes e2e no Chromium e em viewport mobile       |
| `npm run check`         | Lint + tipos + testes + build (rodar antes do PR) |

## Estrutura

```
src/
  entries/      # pontos de entrada: gestor.tsx e motorista.tsx
  apps/motorista/  # app do motorista (layout, páginas, PWA)
  components/   # componentes reutilizáveis
  pages/        # telas (cada uma com seu .module.scss e .test.tsx)
  styles/       # estilos globais
  test/         # setup do Vitest
e2e/            # testes Playwright
```

- Alias `@/` aponta para `src/`.
- Testes unitários ficam ao lado do código: `*.test.tsx`.
- Testes e2e ficam em `e2e/*.spec.ts`.

## Como adicionar sua tela

1. Crie a pasta em `src/pages/NomeDaTela/` com `index.tsx`, `NomeDaTela.module.scss` e `NomeDaTela.test.tsx`.
2. Renderize a tela a partir do `src/App.tsx`.
3. Rode `npm run check` antes de abrir o PR.

## CI

O workflow `.github/workflows/frontend-ci.yml` roda em todo PR e push na `main` que mexa em `frontend/`:

- **quality:** lint, formatação, tipos, testes unitários com cobertura e build.
- **e2e:** testes Playwright em Chromium, com o relatório salvo se falhar.
