# syntax=docker/dockerfile:1
# =============================================================================
# Dockerfile — cleudocode-hub (Node.js)
# AIDEV-NOTE: Multi-stage build para imagem mínima em produção
# =============================================================================

# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar apenas manifests primeiro (cache de dependências)
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci --frozen-lockfile

# Copiar código-fonte
COPY . .

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:20-alpine AS production

# AIDEV-SECURITY: Não rodar como root em produção
RUN addgroup -g 1001 -S cleudo && \
    adduser -S -u 1001 -G cleudo cleudo

WORKDIR /app

# Copiar apenas arquivos necessários do builder
COPY --from=builder --chown=cleudo:cleudo /app/node_modules ./node_modules
COPY --from=builder --chown=cleudo:cleudo /app/bin ./bin
COPY --from=builder --chown=cleudo:cleudo /app/core ./core
COPY --from=builder --chown=cleudo:cleudo /app/agents ./agents
COPY --from=builder --chown=cleudo:cleudo /app/templates ./templates
COPY --from=builder --chown=cleudo:cleudo /app/package.json ./

# Criar diretórios de dados persistentes
RUN mkdir -p /app/docs/outputs /app/docs/workflows /app/docs/ucm && \
    chown -R cleudo:cleudo /app/docs

USER cleudo

# Porta da API bridge (RFC-003)
EXPOSE 19000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:19000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Variáveis de ambiente padrão (sobrescritas pelo .env ou docker-compose)
ENV NODE_ENV=production \
    PORT=19000 \
    DEFAULT_PROVIDER=ollama \
    OLLAMA_HOST=http://ollama:11434

CMD ["node", "bin/cleudocode.js"]
