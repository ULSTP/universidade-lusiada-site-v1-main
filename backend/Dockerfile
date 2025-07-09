# Dockerfile para Backend - Universidade Lusíada
# Baseado em Node.js 18 Alpine para tamanho menor

# Estágio de build
FROM node:18-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache openssl

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instalar dependências (incluindo dev dependencies para build)
RUN npm ci

# Copiar código fonte
COPY src ./src

# Gerar cliente Prisma
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Instalar dependências do sistema
RUN apk add --no-cache openssl

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de produção do estágio anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Criar diretórios necessários
RUN mkdir -p logs uploads
RUN chown -R nestjs:nodejs /app

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 3001

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"] 