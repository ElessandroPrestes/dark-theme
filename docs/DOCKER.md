# Docker — Guia de Uso

## Visão Geral

O projeto possui dois ambientes Docker:

- **Desenvolvimento**: hot reload com polling, código sincronizado via bind mount
- **Produção**: build otimizado servido pelo Nginx 1.25 Alpine (imagem ~30MB)

---

## Pré-requisitos

- Docker Engine 24+
- Docker Compose V2 (`docker compose` — sem hífen)

---

## Desenvolvimento

### Subir o ambiente

```bash
npm run docker:dev
# ou diretamente:
docker compose up
```

O app fica disponível em `http://localhost:4200`.  
Hot reload está ativo — alterações nos arquivos de `src/` são refletidas automaticamente.

### Ver logs em tempo real

```bash
npm run docker:logs
# ou:
docker compose logs -f
```

### Abrir shell no container

```bash
npm run docker:shell
# ou:
docker compose exec app sh
```

### Parar e remover volumes

```bash
npm run docker:clean
# ou:
docker compose down -v --remove-orphans
```

---

## Produção

### Fazer build e subir

```bash
npm run docker:prod
# ou:
docker compose -f docker-compose.prod.yml up --build
```

O app fica disponível em `http://localhost:80`.

---

## Executando comandos Angular dentro do container

### Gerar componente

```bash
docker compose exec app npx ng generate component features/meu-componente
```

### Gerar serviço

```bash
docker compose exec app npx ng generate service core/services/meu-servico
```

### Executar testes

```bash
docker compose exec app npm test
```

### Executar lint

```bash
docker compose exec app npx eslint . --max-warnings 0
```

---

## Variáveis de Ambiente

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `CHOKIDAR_USEPOLLING` | `true` | Ativa polling para hot reload em bind mounts (Linux/Mac/WSL) |

---

## Decisões Técnicas

### Por que polling (`CHOKIDAR_USEPOLLING=true`)?

O mecanismo padrão de detecção de mudanças (`inotify`) não funciona corretamente em bind mounts Docker em todos os sistemas operacionais. O polling garante hot reload consistente no Linux, macOS e WSL2 ao custo de uma verificação periódica a cada 500ms.

### Por que volumes anônimos para `node_modules` e `.angular`?

Sem os volumes anônimos `/app/node_modules` e `/app/.angular`, o bind mount do diretório raiz sobrescreveria as pastas compiladas dentro do container com as versões do host (ou as apagaria caso não existam no host). Os volumes anônimos garantem que essas pastas sejam gerenciadas exclusivamente pelo container.

### Por que multi-stage no Dockerfile de produção?

O primeiro estágio (`builder`) usa `node:20-alpine` (~180MB) para compilar o Angular. O segundo estágio (`runtime`) usa `nginx:1.25-alpine` (~10MB) e copia apenas os artefatos estáticos do primeiro estágio. Resultado: imagem final de ~30MB em vez de ~800MB.

---

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Hot reload não funciona | Polling desativado | Confirmar `CHOKIDAR_USEPOLLING=true` no `docker-compose.yml` |
| `ng: not found` no container | Contexto errado | Usar `docker compose exec app npx ng ...` |
| Nginx retorna 404 em rotas | Fallback SPA ausente | Verificar `try_files $uri $uri/ /index.html` no `nginx.conf` |
| Build falha no container | node_modules desatualizados | Reconstruir: `docker compose up --build` |
