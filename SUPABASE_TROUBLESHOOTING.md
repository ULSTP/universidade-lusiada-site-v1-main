# 🔧 Resolução de Problemas - Supabase

## ❌ **Problema Identificado**

Tentámos conectar ao Supabase mas houve erro de conectividade:
```
Error: P1001: Can't reach database server at `db.fagycmqthnsboniogoon.supabase.co:5432`
```

## 🔍 **Possíveis Causas**

1. **Projeto Supabase pausado** - Projetos gratuitos pausam após inatividade
2. **Região incorreta** - O servidor pode estar numa região diferente
3. **Firewall/Rede** - Bloqueio de conexões externas
4. **Credenciais incorretas** - Senha ou URL podem estar erradas

## ✅ **Solução Temporária Aplicada**

Configurámos SQLite local para manter o sistema funcional:

```env
# Base de dados local (SQLite) - temporário
DATABASE_URL="file:./dev.db"

# Supabase Configuration (para uso futuro)
# DATABASE_URL="postgresql://postgres:PM2ys5YCa271dWZN@db.fagycmqthnsboniogoon.supabase.co:5432/postgres"
```

## 🚀 **Como Resolver o Supabase**

### **1. Verificar Estado do Projeto**
1. Acesse [Dashboard Supabase](https://supabase.com/dashboard)
2. Vá ao projeto `fagycmqthnsboniogoon`
3. Verifique se está **ACTIVE** (não pausado)
4. Se pausado, clique em "Resume Project"

### **2. Verificar Configurações de Rede**
1. **Settings** → **Database**
2. Verificar se **"Enable database webhooks"** está ativo
3. Verificar **Connection pooling** está configurado

### **3. Testar Conexão Direta**
Execute este comando para testar:
```bash
# Windows
telnet db.fagycmqthnsboniogoon.supabase.co 5432

# Linux/Mac
nc -zv db.fagycmqthnsboniogoon.supabase.co 5432
```

### **4. Verificar Credenciais**
No Dashboard Supabase:
1. **Settings** → **Database**
2. Verificar **Connection String**
3. Redefinir senha se necessário

### **5. Configuração de Firewall**
Se estiver atrás de firewall corporativo:
- Liberar porta **5432** para saída
- Whitelist do domínio `*.supabase.co`

## 🔄 **Migrar para Supabase (quando resolver)**

Quando o Supabase estiver funcionando:

### **1. Alterar .env**
```env
# Supabase Configuration
DATABASE_URL="postgresql://postgres:PM2ys5YCa271dWZN@db.fagycmqthnsboniogoon.supabase.co:5432/postgres"
```

### **2. Alterar Schema**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### **3. Aplicar Migração**
```bash
npx prisma generate
npx prisma db push
```

### **4. Migrar Dados (se necessário)**
```bash
# Exportar dados SQLite
npx prisma db seed

# Ou criar script de migração personalizado
```

## 📊 **Estado Atual do Sistema**

- ✅ **Sistema funcionando** com SQLite local
- ✅ **Autenticação ativa** (NextAuth)
- ✅ **Portal do aluno acessível**
- ✅ **Registo e login funcionais**
- ⏳ **Supabase configurado** (aguarda resolução de conectividade)

## 🎯 **Próximos Passos**

1. **Verificar estado do projeto Supabase**
2. **Testar conectividade de rede**
3. **Migrar para Supabase quando resolver**
4. **Manter SQLite como backup local**

O sistema está **100% funcional** com SQLite. O Supabase é uma melhoria para produção, mas não bloqueia o desenvolvimento atual. 