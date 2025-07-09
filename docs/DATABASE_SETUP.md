# Configuração do Banco de Dados

## 📋 Pré-requisitos

1. **PostgreSQL** instalado e rodando
2. **Node.js** e **pnpm** instalados
3. Todas as dependências instaladas (`pnpm install`)

## 🗄️ Configuração do PostgreSQL

### 1. Instalar PostgreSQL

**Windows:**
- Baixar e instalar do site oficial: https://www.postgresql.org/download/windows/
- Ou usar o instalador do Chocolatey: `choco install postgresql`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Criar Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE universidade_lusiada;

# Criar usuário (opcional)
CREATE USER universidade_user WITH PASSWORD 'sua_senha_aqui';

# Dar permissões
GRANT ALL PRIVILEGES ON DATABASE universidade_lusiada TO universidade_user;

# Sair
\q
```

### 3. Configurar Variáveis de Ambiente

Editar o arquivo `.env.local`:

```env
# Database
DATABASE_URL="postgresql://universidade_user:sua_senha_aqui@localhost:5432/universidade_lusiada"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-aqui-mude-em-producao"
NEXTAUTH_URL="http://localhost:3000"
```

## 🚀 Migração do Banco

### 1. Gerar Migração Inicial

```bash
npx prisma migrate dev --name init
```

### 2. Aplicar Migração

```bash
npx prisma migrate deploy
```

### 3. Verificar Status

```bash
npx prisma migrate status
```

## 📊 Seed do Banco (Dados Iniciais)

### 1. Criar Arquivo de Seed

```bash
mkdir prisma/seed
touch prisma/seed.ts
```

### 2. Executar Seed

```bash
npx prisma db seed
```

## 🔧 Comandos Úteis

```bash
# Visualizar banco no Prisma Studio
npx prisma studio

# Resetar banco (cuidado!)
npx prisma migrate reset

# Gerar cliente Prisma
npx prisma generate

# Verificar schema
npx prisma validate
```

## 🛠️ Solução de Problemas

### Erro de Conexão
- Verificar se o PostgreSQL está rodando
- Verificar credenciais no DATABASE_URL
- Verificar se o banco existe

### Erro de Permissão
- Verificar se o usuário tem permissões adequadas
- Verificar se o banco está acessível

### Erro de Migração
- Verificar se o schema está válido
- Verificar se não há conflitos de migração

## 📁 Estrutura do Banco

O banco inclui os seguintes modelos principais:

- **User** - Usuários do sistema
- **Student** - Estudantes
- **Teacher** - Professores
- **Admin** - Administradores
- **Course** - Cursos
- **Subject** - Disciplinas
- **Enrollment** - Matrículas
- **Grade** - Notas
- **Attendance** - Frequência
- **Document** - Documentos
- **Event** - Eventos
- **Notification** - Notificações
- **Newsletter** - Newsletter
- **Contact** - Contatos

## 🔐 Segurança

- Sempre use senhas fortes
- Mude as chaves secretas em produção
- Use variáveis de ambiente
- Configure SSL em produção
- Faça backups regulares 