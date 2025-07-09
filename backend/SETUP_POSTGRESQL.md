# 🐘 Guia de Migração para PostgreSQL
## Sistema Universidade Lusíada

---

## ✅ **Já Preparado:**
- ✅ Schema Prisma atualizado para PostgreSQL
- ✅ Cliente Prisma gerado com tipos corretos
- ✅ Campos monetários com Decimal (precisão de centavos)
- ✅ Arrays suportados (preRequisitos, equipamentos)
- ✅ Tipos JSON para metadados flexíveis

---

## 🎯 **Opções de PostgreSQL** (escolha uma):

### **OPÇÃO 1: Supabase (RECOMENDADO - GRÁTIS)**
**PostgreSQL na nuvem, fácil de configurar**

1. **Criar conta:** https://supabase.com
2. **Criar projeto:** "Universidade Lusíada"
3. **Copiar URL:** Settings → Database → Connection string
4. **Atualizar .env:**
```bash
DATABASE_URL="postgresql://postgres.XXXXXXX:suasenha@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

---

### **OPÇÃO 2: PostgreSQL Local**
**Instalar PostgreSQL na sua máquina**

1. **Baixar:** https://www.postgresql.org/download/windows/
2. **Instalar** com senha: `postgres`
3. **Criar base de dados:**
```sql
CREATE DATABASE universidade_lusiada;
```
4. **Usar .env atual:** (já configurado para localhost)

---

### **OPÇÃO 3: Railway (PostgreSQL Nuvem)**
**Alternativa ao Supabase**

1. **Criar conta:** https://railway.app
2. **Criar projeto PostgreSQL**
3. **Copiar URL de conexão**
4. **Atualizar .env**

---

### **OPÇÃO 4: Docker (se tiver instalado)**
```bash
# No terminal (se tiver Docker):
docker-compose up -d database

# URL já configurada no .env:
# DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/universidade_lusiada?schema=public"
```

---

## 🚀 **Após Configurar PostgreSQL:**

### **1. Aplicar Migração:**
```bash
cd backend
npx prisma migrate dev --name migrate-to-postgresql
```

### **2. Popular Base de Dados (Opcional):**
```bash
npx prisma db seed
```

### **3. Visualizar Base de Dados:**
```bash
npx prisma studio
```
📊 Abre interface visual em: http://localhost:5555

### **4. Executar Backend:**
```bash
npm run dev
```
🌐 API disponível em: http://localhost:3001

---

## 📋 **Verificar Conexão:**

### **Testar conexão:**
```bash
npx prisma db pull
```
✅ **Sucesso:** Schema sincronizado  
❌ **Erro:** Verificar DATABASE_URL

---

## 🏗️ **Estrutura da Base de Dados:**

### **16 Tabelas Criadas:**
- **Utilizadores:** 👥 usuarios, tipo_usuario
- **Académico:** 🎓 departamentos, cursos, disciplinas, turmas
- **Matrículas:** 📝 matriculas, inscricoes
- **Avaliação:** 📊 notas, presencas
- **Financeiro:** 💰 propinas, pagamentos
- **Comunicação:** 📢 notificacoes, documentos
- **Horários:** ⏰ horarios, salas, calendario_academico, conflitos_horario

### **Sistemas 100% Funcionais:**
- ✅ **Sistema de Inscrições** (13 endpoints)
- ✅ **Sistema de Notas** (14 endpoints)  
- ✅ **Sistema de Horários** (20+ endpoints)
- ✅ **Sistema de Utilizadores** (autenticação JWT)

---

## 🔧 **Troubleshooting:**

### **Erro de conexão:**
```bash
# Verificar se PostgreSQL está rodando:
# Windows: Services → PostgreSQL

# Testar conexão manual:
psql -h localhost -U postgres -d universidade_lusiada
```

### **Erro na migração:**
```bash
# Reset da base de dados:
npx prisma migrate reset

# Aplicar novamente:
npx prisma migrate dev
```

### **Mudar para outra opção:**
1. Atualizar `DATABASE_URL` no `.env`
2. Aplicar migração: `npx prisma migrate dev`

---

## 🎯 **Próximos Passos:**
1. ✅ Escolher e configurar PostgreSQL
2. ✅ Aplicar migração
3. ✅ Testar APIs no Postman/Insomnia
4. ✅ Implementar frontend
5. ✅ Deploy em produção

---

**📞 Suporte:** Para dúvidas sobre configuração PostgreSQL 