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

## Executar em desenvolvimento

```bash
# Terminal 1 - frontend
npm run dev

# Terminal 2 - backend
cd backend
npm run dev
```

## Geração do Prisma

Após alterar o `schema.prisma` execute:

```bash
npx prisma generate
```

Para mais detalhes consulte a pasta [`docs`](docs/README.md).

