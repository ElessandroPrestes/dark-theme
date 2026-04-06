# Dark Theme

Aplicacao Angular com suporte a tema escuro/claro, construida com Angular Material. Oferece alternancia dinamica de tema com persistencia em `localStorage` e deteccao automatica da preferencia do sistema operacional (`prefers-color-scheme`).

## Stack

| Camada        | Tecnologia                                  |
|---------------|---------------------------------------------|
| Framework     | Angular 18 (standalone components, signals) |
| UI            | Angular Material 18                         |
| Estilos       | SCSS                                        |
| Testes        | Jest + Testing Library                      |
| Lint/Format   | ESLint 9 + Prettier                         |
| CI/CD         | GitHub Actions                              |
| Container     | Docker (dev com hot-reload, prod com Nginx) |
| Acessibilidade| axe-core (auditoria automatica em dev)      |

## Pre-requisitos

- Node.js 20+
- npm 9+
- Docker e Docker Compose (opcional)

## Instalacao

```bash
git clone git@github.com:ElessandroPrestes/dark-theme.git
cd dark-theme
npm install
```

## Desenvolvimento

```bash
# Servidor local
npm start
# http://localhost:4200

# Via Docker (com hot-reload)
npm run docker:dev
```

## Scripts disponiveis

| Comando              | Descricao                        |
|----------------------|----------------------------------|
| `npm start`          | Servidor de desenvolvimento      |
| `npm run build`      | Build de producao                |
| `npm test`           | Executar testes                  |
| `npm run test:watch` | Testes em modo watch             |
| `npm run test:coverage` | Testes com relatorio de cobertura |
| `npm run lint`       | Verificar lint                   |
| `npm run lint:fix`   | Corrigir lint automaticamente    |
| `npm run format`     | Formatar codigo                  |
| `npm run format:check` | Verificar formatacao           |
| `npm run docker:dev` | Subir ambiente de desenvolvimento|
| `npm run docker:prod`| Build e execucao de producao     |
| `npm run docker:clean` | Remover containers e volumes   |

## Estrutura do projeto

```
src/app/
  core/services/       # ThemeService (signals, localStorage, prefers-color-scheme)
  shared/components/   # Sidebar, Topbar, Card
  pages/               # Home, Dashboard, Settings (lazy-loaded)
docker/
  dev/                 # Dockerfile para desenvolvimento
  prod/                # Dockerfile multi-stage (Node + Nginx)
.github/workflows/
  ci.yml               # Lint, testes, build Angular, build Docker
  deploy-preview.yml   # Deploy preview para PRs
```

## Docker

**Desenvolvimento** — hot-reload com polling:

```bash
npm run docker:dev
```

**Producao** — build multi-stage com Nginx e healthcheck:

```bash
npm run docker:prod
```

## CI/CD

O pipeline do GitHub Actions executa em push/PR para as branches `develop`, `dev` e `main`:

1. **Qualidade** — lint, formatacao e testes com cobertura
2. **Build Angular** — build de producao com upload de artefato
3. **Build Docker** — construcao da imagem e teste de healthcheck

## Qualidade de codigo

- **Husky** — hooks de `pre-commit` (lint-staged) e `commit-msg` (commitlint)
- **lint-staged** — ESLint e Prettier executados apenas nos arquivos alterados
- **Conventional Commits** — mensagens de commit padronizadas via commitlint

## Autor

**Elessandro Prestes Macedo** — [LinkedIn](https://www.linkedin.com/in/elessandro-prestes-macedo-278189126/)

## Licenca

Distribuido sob a licenca MIT. Veja [LICENSE](LICENSE) para mais informacoes.
