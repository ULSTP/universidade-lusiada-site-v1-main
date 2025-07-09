# 🚀 Setup Rápido - Backend Universidade Lusíada

## ⚡ **Instalação Rápida**

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 3. Configurar base de dados
npm run prisma:generate
npm run prisma:push

# 4. Popular com dados de teste
npm run seed

# 5. Iniciar servidor
npm run dev
```

## 📋 **Verificação**

- ✅ Servidor rodando: http://localhost:3001
- ✅ API Docs: http://localhost:3001/api-docs
- ✅ Health Check: http://localhost:3001/health

## 🔑 **Usuários de Teste**

| Tipo | Email | Senha | Descrição |
|------|-------|-------|-----------|
| Admin | admin@ulstp.ac.st | 123456 | Acesso total |
| Professor | maria.silva@ulstp.ac.st | 123456 | Gestão acadêmica |
| Estudante | ana.costa@estudante.ulstp.ac.st | 123456 | Portal do aluno |

## 🧪 **Teste Rápido**

```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ulstp.ac.st","senha":"123456"}'

# Usar o token retornado
curl -X GET http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🛠️ **Comandos Úteis**

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run prisma:studio # Interface da BD
npm run lint         # Verificar código
npm test             # Executar testes
```

## 🚨 **Problemas Comuns**

1. **Porta ocupada:** Mude PORT no .env
2. **BD não conecta:** Verifique DATABASE_URL
3. **Prisma error:** Execute `npm run prisma:generate`

---

🎓 **Universidade Lusíada - Sistema de Gestão Universitária** 