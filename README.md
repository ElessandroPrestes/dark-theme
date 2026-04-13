# Dark Theme

Aplicacao Angular com tela de login responsiva, suporte a tema escuro/claro e transicao visual entre noite e dia. O projeto foi construido com Angular Material e prioriza UX/UI, acessibilidade e consistencia entre desktop e mobile.

## O que foi desenvolvido

- Tela unica de login com foco total na autenticacao
- Seletor de tema com icones e feedback visual claro
- Transicao `dark -> light` como amanhecer e `light -> dark` como anoitecer
- Arte lateral em CSS no desktop, reagindo ao tema com lua no modo escuro e sol no modo claro
- Layout mobile simplificado, exibindo apenas o formulario
- Persistencia de tema em `localStorage`
- Deteccao automatica da preferencia do sistema com `prefers-color-scheme`
- Estados de foco, mensagens de validacao e feedback de sucesso para o formulario
- Respeito a `prefers-reduced-motion`
- Auditoria automatica de acessibilidade com `axe-core` em ambiente de desenvolvimento

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

## Fluxo da interface

### Desktop

- Shell central com duas colunas
- Formulario de login a esquerda
- Painel artistico a direita, desenhado em CSS e sincronizado com o tema
- Transicao de fundo e atmosfera visual durante a troca de tema

### Mobile

- Layout em coluna unica
- Apenas o formulario permanece visivel
- Painel visual e elementos secundarios sao ocultados para reduzir ruido
- Espacamento e componentes ajustados para toque

## Tema e usabilidade

- O tema pode ser alternado manualmente pelo seletor no topo da tela
- A troca entre os modos aplica transicao visual suave entre amanhecer e anoitecer
- O estado selecionado e comunicado ao usuario por texto e alteracoes visuais no seletor
- O sistema evita animacoes excessivas quando `prefers-reduced-motion` estiver ativo
- O tema escolhido e mantido entre sessoes

## Estrutura do projeto

```
src/app/
  core/services/       # ThemeService (signals, persistencia, transicao de tema)
  pages/home/          # Tela de login standalone
src/styles/
  _home-login.scss     # Layout, arte visual e transicoes da tela de login
  _tokens.scss         # Tokens de espaco, tipografia, cores e transicoes
  _themes.scss         # Integracao dos temas com Angular Material
docker/
  dev/                 # Dockerfile para desenvolvimento
  prod/                # Dockerfile multi-stage (Node + Nginx)
.github/workflows/
  ci.yml               # Lint, testes, build Angular, build Docker
  deploy-preview.yml   # Deploy preview para PRs
```

## Validacao

Comandos usados para validar o fluxo atual:

```bash
npm run build
./node_modules/.bin/jest --runInBand --coverage=false src/app/pages/home/home.component.spec.ts src/app/core/services/theme.service.spec.ts
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

**Elessandro Prestes Macedo** — [LinkedIn](https://www.linkedin.com/in/elessandro-prestes-macedo/)

## Licenca

Distribuido sob a licenca MIT. Veja [LICENSE](LICENSE) para mais informacoes.
