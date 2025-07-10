# Universidade Lusíada - Plataforma Web

Este repositório contém o frontend (Next.js) e backend (Express) do sistema de gestão acadêmica da Universidade Lusíada de São Tomé e Príncipe.

## Requisitos

- Node.js 18+
- SQLite (para desenvolvimento) ou PostgreSQL

## Instalação

```bash
npm install
cd backend && npm install
```

### Configuração de Ambiente

1. Copie o arquivo `.env.example` para `.env` na raiz do projeto.
2. Ajuste as variáveis conforme sua base de dados e credenciais SMTP.

## Executar em desenvolvimento

```bash
# Terminal 1 - frontend
npm run dev

# Terminal 2 - backend
cd backend
npm run dev
```

## Geração do Prisma

Após configurar o `.env` e alterar o `schema.prisma` execute:

```bash
npx prisma generate
```

Para mais detalhes consulte a pasta [`docs`](docs/README.md).

## PWA e Otimizações de Performance

- A aplicação utiliza `next-pwa` para gerar o service worker durante o build.
- Arquivos de API utilizam cache em memória através do middleware `apicache`.
- Para testar o modo PWA execute `npm run build` e `npm start`.

