# Guia Completo: Configuração do Supabase

## 🎯 Objetivo
Este guia irá ajudá-lo a migrar da base de dados SQLite local para o Supabase PostgreSQL.

## 📋 Pré-requisitos
- Conta no Supabase (gratuita)
- Projeto Supabase ativo
- Credenciais corretas do Supabase

---

## 🔧 Passo 1: Verificar o Projeto Supabase

### 1.1 Aceder ao Dashboard
1. Vá a [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Verifique se o projeto `fagycmqthnsboniogoon` está **ativo**

### 1.2 Verificar Estado do Projeto
- ✅ Projeto deve estar **"Healthy"** ou **"Active"**
- ❌ Se estiver **"Paused"** ou **"Inactive"**, reative-o

---

## 🔗 Passo 2: Obter Credenciais Corretas

### 2.1 No Dashboard do Supabase
1. Clique no seu projeto
2. Vá a **Settings** → **Database**
3. Procure por **"Connection string"**

### 2.2 Tipos de Conexão Disponíveis

#### **Opção A: Conexão Direta (IPv6)**
```
postgresql://postgres:[PASSWORD]@db.fagycmqthnsboniogoon.supabase.co:5432/postgres
```

#### **Opção B: Pooler Session Mode (IPv4/IPv6)**
```
postgresql://postgres.fagycmqthnsboniogoon:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

#### **Opção C: Pooler Transaction Mode (Serverless)**
```
postgresql://postgres.fagycmqthnsboniogoon:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### 2.3 Identificar a Região
- Verifique na URL do seu projeto qual é a região
- Exemplos: `us-east-1`, `eu-west-1`, `ap-southeast-1`

---

## ⚙️ Passo 3: Configurar o Projeto

### 3.1 Atualizar `.env`
```env
# Base de dados local (SQLite) - desativado
# DATABASE_URL="file:./dev.db"

# Supabase Configuration (ATIVO)
DATABASE_URL="postgresql://postgres.fagycmqthnsboniogoon:[SUA_PASSWORD]@aws-0-[SUA_REGIAO].pooler.supabase.com:5432/postgres"
SUPABASE_URL=https://fagycmqthnsboniogoon.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ3ljbXF0aG5zYm9uaW9nb29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDcwNjMsImV4cCI6MjA2NjUyMzA2M30.q6OqlVcU6lbSZU3h-jGlMkc3Be21rBBbMHOu858Oysk

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-in-production
```

### 3.2 Atualizar `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3.3 Restaurar Anotações PostgreSQL
```prisma
model Account {
  // ... outros campos ...
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  id_token          String? @db.Text
  // ... resto do modelo ...
}

model Subject {
  // ... outros campos ...
  description String? @db.Text
  // ... resto do modelo ...
}
```

---

## 🚀 Passo 4: Migração

### 4.1 Gerar Cliente Prisma
```bash
npx prisma generate
```

### 4.2 Enviar Schema para Supabase
```bash
npx prisma db push
```

### 4.3 Verificar Conexão
```bash
npx prisma studio
```

---

## 🧪 Passo 5: Testar a Aplicação

### 5.1 Iniciar Servidor
```bash
npm run dev
```

### 5.2 Verificar Funcionalidades
- ✅ Login/Registo
- ✅ Portal do aluno
- ✅ Página de cursos
- ✅ API routes

---

## ❗ Resolução de Problemas

### Erro: "Can't reach database server"
**Causa:** Projeto Supabase inativo ou credenciais incorretas
**Solução:**
1. Verificar se o projeto está ativo no dashboard
2. Confirmar credenciais no `.env`
3. Tentar conexão pooler em vez de direta

### Erro: "Tenant or user not found"
**Causa:** String de conexão incorreta
**Solução:**
1. Copiar string de conexão diretamente do dashboard
2. Verificar se a região está correta
3. Confirmar password

### Erro: "FATAL: Password authentication failed"
**Causa:** Password incorreta
**Solução:**
1. Resetar password no dashboard Supabase
2. Atualizar `.env` com nova password

### Erro: "Native type Text is not supported"
**Causa:** Schema configurado para SQLite mas usando PostgreSQL
**Solução:**
1. Confirmar `provider = "postgresql"` no schema
2. Adicionar anotações `@db.Text` onde necessário

---

## 📊 Vantagens do Supabase vs SQLite

| Funcionalidade | SQLite | Supabase |
|----------------|--------|----------|
| **Desenvolvimento** | ✅ Rápido | ✅ Rápido |
| **Produção** | ❌ Limitado | ✅ Escalável |
| **Colaboração** | ❌ Difícil | ✅ Fácil |
| **Backup** | ❌ Manual | ✅ Automático |
| **Segurança** | ❌ Básica | ✅ Avançada |
| **APIs** | ❌ Nenhuma | ✅ REST/GraphQL |
| **Real-time** | ❌ Não | ✅ Sim |

---

## 🔄 Migração de Dados (Opcional)

Se tiver dados importantes no SQLite:

### 1. Exportar Dados SQLite
```bash
npx prisma db seed # se tiver seed
```

### 2. Usar Prisma Studio
1. Abrir SQLite: `npx prisma studio`
2. Exportar dados manualmente
3. Importar no Supabase

---

## 📞 Suporte

Se encontrar problemas:

1. **Verificar logs:** Console do browser e terminal
2. **Dashboard Supabase:** Verificar métricas e logs
3. **Documentação:** [supabase.com/docs](https://supabase.com/docs)
4. **Comunidade:** [Discord Supabase](https://discord.supabase.com)

---

## ✅ Checklist Final

- [ ] Projeto Supabase ativo
- [ ] Credenciais corretas no `.env`
- [ ] Schema configurado para PostgreSQL
- [ ] `npx prisma generate` executado
- [ ] `npx prisma db push` executado
- [ ] Aplicação funcionando
- [ ] Todas as funcionalidades testadas

---

**🎉 Parabéns!** Agora tem uma base de dados PostgreSQL escalável e profissional com o Supabase! 