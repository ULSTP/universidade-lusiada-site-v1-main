# 🎓 Backend - Sistema Universidade Lusíada

Backend RESTful API para o Sistema de Gestão Universitária da Universidade Lusíada de São Tomé e Príncipe.

## 🏗️ **Arquitetura**

- **Runtime:** Node.js 18+
- **Framework:** Express.js + TypeScript
- **Base de Dados:** PostgreSQL + Prisma ORM
- **Autenticação:** JWT (JSON Web Tokens)
- **Documentação:** Swagger/OpenAPI 3.0
- **Logs:** Winston
- **Validação:** Express Validator
- **Segurança:** Helmet, CORS, Rate Limiting

## 📁 **Estrutura do Projeto**

```
backend/
├── src/
│   ├── config/           # Configurações (ambiente, swagger, etc.)
│   ├── controllers/      # Controllers (rotas e handlers)
│   ├── services/         # Lógica de negócio
│   ├── repositories/     # Acesso aos dados
│   ├── middlewares/      # Middlewares (auth, validação, logs)
│   ├── utils/           # Utilitários (logger, erros, etc.)
│   ├── types/           # Tipos TypeScript
│   ├── database/        # Conexão e configuração do BD
│   ├── generated/       # Código gerado pelo Prisma
│   └── server.ts        # Ponto de entrada
├── prisma/
│   └── schema.prisma    # Schema da base de dados
├── uploads/             # Arquivos carregados
├── logs/               # Arquivos de log
└── dist/               # Código compilado
```

## 🚀 **Configuração e Instalação**

### **1. Pré-requisitos**

```bash
# Node.js 18 ou superior
node --version

# PostgreSQL 14 ou superior
psql --version

# Git
git --version
```

### **2. Clonar e Instalar**

```bash
# Clonar repositório
git clone <url-do-repositorio>
cd backend

# Instalar dependências
npm install

# Ou usando yarn
yarn install
```

### **3. Configurar Variáveis de Ambiente**

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações
nano .env
```

**Configurações obrigatórias:**

```env
# Base de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/universidade_lusiada"

# JWT
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
JWT_REFRESH_SECRET="sua_chave_refresh_secreta_aqui"

# Servidor
PORT=3001
NODE_ENV=development
```

### **4. Configurar Base de Dados**

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Aplicar schema à base de dados
npm run prisma:push

# (Opcional) Popular com dados de teste
npm run seed
```

### **5. Executar Aplicação**

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start

# Testes
npm test
```

## 📚 **Endpoints da API**

### **🔐 Autenticação**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Fazer login |
| POST | `/auth/refresh` | Renovar token |
| POST | `/auth/logout` | Fazer logout |
| POST | `/auth/forgot-password` | Recuperar senha |
| POST | `/auth/reset-password` | Redefinir senha |
| POST | `/auth/change-password` | Alterar senha |
| GET | `/auth/me` | Perfil do usuário |

### **👥 Usuários**

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/users` | Listar usuários | Admin/Professor |
| POST | `/users` | Criar usuário | Admin |
| GET | `/users/:id` | Obter usuário | Próprio/Admin |
| PUT | `/users/:id` | Atualizar usuário | Próprio/Admin |
| DELETE | `/users/:id` | Excluir usuário | Admin |
| PATCH | `/users/:id/status` | Alterar status | Admin |
| GET | `/users/stats` | Estatísticas | Admin |
| GET | `/users/search` | Buscar usuários | Autenticado |

### **📊 Dashboard**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard/stats` | Estatísticas gerais |

### **📄 Documentação**

- **Swagger UI:** `http://localhost:3001/api-docs`
- **Health Check:** `http://localhost:3001/health`

## 🔒 **Segurança**

### **Autenticação JWT**

```javascript
// Headers da requisição
{
  "Authorization": "Bearer <seu_jwt_token>"
}
```

### **Níveis de Acesso**

1. **ADMIN** - Acesso total ao sistema
2. **PROFESSOR** - Gestão de turmas e notas
3. **ESTUDANTE** - Acesso aos próprios dados
4. **FUNCIONARIO** - Operações administrativas específicas

### **Rate Limiting**

- **Limite:** 100 requisições por 15 minutos
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`

## 🗃️ **Base de Dados**

### **Modelos Principais**

- **User** - Usuários do sistema
- **Curso** - Cursos académicos
- **Disciplina** - Disciplinas dos cursos
- **Matricula** - Matrículas dos estudantes
- **Nota** - Sistema de avaliação
- **Propina** - Gestão financeira
- **Notificacao** - Sistema de notificações

### **Comandos Prisma**

```bash
# Visualizar base de dados
npm run prisma:studio

# Gerar migração
npm run prisma:migrate

# Reset da base de dados
npx prisma migrate reset

# Popular com dados
npm run seed
```

## 📝 **Logs**

### **Níveis de Log**

- **error** - Erros críticos
- **warn** - Avisos importantes
- **info** - Informações gerais
- **debug** - Informações de depuração

### **Localização**

- **Console** - Desenvolvimento
- **Arquivos** - `logs/app.log` e `logs/error.log`

## 🧪 **Testes**

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com coverage
npm run test:coverage
```

## 🛠️ **Scripts Disponíveis**

```bash
npm run dev          # Executar em desenvolvimento
npm run build        # Compilar TypeScript
npm start            # Executar em produção
npm test             # Executar testes
npm run lint         # Verificar código
npm run lint:fix     # Corrigir problemas de lint
npm run prisma:*     # Comandos do Prisma
```

## 🐳 **Docker (Opcional)**

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

```bash
# Executar com Docker
docker build -t universidade-backend .
docker run -p 3001:3001 universidade-backend
```

## 🔧 **Desenvolvimento**

### **Adicionando Novas Funcionalidades**

1. **Criar modelo** no `schema.prisma`
2. **Gerar migração** com Prisma
3. **Criar repository** em `src/repositories/`
4. **Criar service** em `src/services/`
5. **Criar controller** em `src/controllers/`
6. **Adicionar rotas** com validações
7. **Documentar** com Swagger
8. **Criar testes** unitários

### **Estrutura de Resposta Padrão**

```javascript
// Sucesso
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso",
  "pagination": { ... } // Opcional
}

// Erro
{
  "success": false,
  "error": {
    "message": "Descrição do erro",
    "code": "ERROR_CODE",
    "details": { ... }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/endpoint"
}
```

## 🚨 **Troubleshooting**

### **Problemas Comuns**

1. **Erro de conexão com BD**
   ```bash
   # Verificar se PostgreSQL está rodando
   sudo service postgresql status
   
   # Verificar string de conexão no .env
   echo $DATABASE_URL
   ```

2. **Erro de permissões**
   ```bash
   # Verificar permissões do usuário no PostgreSQL
   sudo -u postgres psql
   \du
   ```

3. **Porta já em uso**
   ```bash
   # Verificar processo na porta
   lsof -i :3001
   
   # Matar processo
   kill -9 <PID>
   ```

## 📞 **Suporte**

- **Email:** suporte@ulstp.ac.st
- **Documentação:** [Wiki do Projeto]
- **Issues:** [GitHub Issues]

## 📄 **Licença**

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**🎓 Universidade Lusíada de São Tomé e Príncipe** 