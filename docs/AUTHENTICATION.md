# Sistema de Autenticação

## 📋 Visão Geral

O sistema de autenticação da Universidade Lusíada utiliza **NextAuth.js** com **Prisma** para gerenciar usuários, sessões e permissões. O sistema suporta três tipos de usuários: **Estudantes**, **Professores** e **Administradores**.

## 🔐 Funcionalidades

### ✅ Implementadas
- ✅ **Login/Logout** com credenciais
- ✅ **Registro** de novos usuários
- ✅ **Validação** de dados com Zod
- ✅ **Criptografia** de senhas com bcrypt
- ✅ **Sessões** JWT
- ✅ **Proteção de rotas** com middleware
- ✅ **Controle de acesso** baseado em papéis
- ✅ **Alteração de senha**
- ✅ **Perfis específicos** por tipo de usuário

### 🚧 Em Desenvolvimento
- 🔄 **Recuperação de senha** por email
- 🔄 **Verificação de email**
- 🔄 **Login social** (Google, Microsoft)
- 🔄 **Autenticação de dois fatores**

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
app/
├── api/auth/
│   ├── [...nextauth]/route.ts    # Rota principal do NextAuth
│   ├── register/route.ts         # API de registro
│   ├── me/route.ts              # API de perfil do usuário
│   └── change-password/route.ts # API de alteração de senha
├── auth/
│   ├── signin/page.tsx          # Página de login
│   └── signup/page.tsx          # Página de registro
└── unauthorized/page.tsx        # Página de acesso negado

components/
├── providers/
│   └── AuthProvider.tsx         # Provider de autenticação
└── ui/                          # Componentes de UI

hooks/
└── useAuth.ts                   # Hook personalizado

lib/
├── auth.ts                      # Configuração do NextAuth
└── prisma.ts                    # Cliente Prisma

middleware.ts                    # Middleware de proteção
```

## 👥 Tipos de Usuários

### 🎓 Estudante (STUDENT)
- **Acesso**: Portal do Aluno
- **Funcionalidades**: Ver notas, frequência, documentos, etc.
- **Campos obrigatórios**: Matrícula, data de nascimento, nacionalidade

### 👨‍🏫 Professor (TEACHER)
- **Acesso**: Portal do Professor
- **Funcionalidades**: Gerenciar notas, frequência, cursos, etc.
- **Campos obrigatórios**: ID de funcionário, especialização, departamento

### 🛡️ Administrador (ADMIN)
- **Acesso**: Painel Administrativo
- **Funcionalidades**: Gerenciar usuários, cursos, sistema, etc.
- **Campos obrigatórios**: ID de funcionário, departamento

## 🔧 Configuração

### Variáveis de Ambiente
```env
# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://..."

# Email (opcional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="seu-email@gmail.com"
EMAIL_SERVER_PASSWORD="sua-senha-de-app"
```

### Instalação
```bash
# Instalar dependências
pnpm add next-auth @next-auth/prisma-adapter bcryptjs

# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev
```

## 🚀 Uso

### Login
```typescript
import { signIn } from 'next-auth/react'

const handleLogin = async () => {
  const result = await signIn('credentials', {
    email: 'user@example.com',
    password: 'password',
    redirect: false
  })
}
```

### Verificar Autenticação
```typescript
import { useSession } from 'next-auth/react'

function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Carregando...</div>
  if (status === 'unauthenticated') return <div>Não autenticado</div>
  
  return <div>Bem-vindo, {session.user.name}!</div>
}
```

### Hook Personalizado
```typescript
import { useAuth } from '@/hooks/useAuth'

function ProtectedComponent() {
  const { requireAuth, user } = useAuth()
  const { isAuthenticated, isLoading } = requireAuth()
  
  if (isLoading) return <div>Carregando...</div>
  if (!isAuthenticated) return null
  
  return <div>Conteúdo protegido</div>
}
```

### Proteção por Papel
```typescript
import { useAuth } from '@/hooks/useAuth'

function AdminOnlyComponent() {
  const { requireRole } = useAuth()
  const { hasRole } = requireRole('ADMIN')
  
  if (!hasRole) return <div>Acesso negado</div>
  
  return <div>Painel administrativo</div>
}
```

## 🔒 Segurança

### Proteção de Rotas
O middleware protege automaticamente:
- `/portal-aluno/*` - Apenas estudantes
- `/portal-professor/*` - Apenas professores  
- `/admin/*` - Apenas administradores
- `/api/auth/me` - Usuários autenticados
- `/api/auth/change-password` - Usuários autenticados

### Validação de Dados
- **Zod** para validação de schemas
- **Sanitização** de inputs
- **Rate limiting** nas APIs
- **Criptografia** de senhas

### Sessões
- **JWT** para sessões
- **Expiração** automática
- **Renovação** automática
- **Logout** seguro

## 📱 APIs

### POST /api/auth/register
Registra um novo usuário.

**Body:**
```json
{
  "name": "Nome Completo",
  "email": "user@example.com",
  "password": "senha123",
  "role": "STUDENT",
  "firstName": "Nome",
  "lastName": "Sobrenome",
  "studentId": "2024001",
  "dateOfBirth": "2000-01-01",
  "nationality": "São-tomense"
}
```

### GET /api/auth/me
Retorna informações do usuário logado.

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "Nome Completo",
    "role": "STUDENT",
    "student": {
      "studentId": "2024001",
      "firstName": "Nome",
      "lastName": "Sobrenome"
    }
  }
}
```

### POST /api/auth/change-password
Altera a senha do usuário.

**Body:**
```json
{
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```

## 🛠️ Desenvolvimento

### Adicionar Novo Provider
```typescript
// lib/auth.ts
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({...}),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ]
}
```

### Adicionar Novo Campo
```prisma
// prisma/schema.prisma
model User {
  // ... campos existentes
  phone String?
}
```

### Criar Nova Rota Protegida
```typescript
// middleware.ts
export const config = {
  matcher: [
    // ... rotas existentes
    '/nova-rota/:path*'
  ]
}
```

## 🐛 Solução de Problemas

### Erro de Sessão
- Verificar `NEXTAUTH_SECRET`
- Verificar `NEXTAUTH_URL`
- Limpar cookies do navegador

### Erro de Banco
- Verificar `DATABASE_URL`
- Executar `npx prisma migrate dev`
- Verificar conexão com PostgreSQL

### Erro de Permissão
- Verificar papel do usuário no banco
- Verificar middleware
- Verificar configuração de rotas

## 📚 Recursos Adicionais

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js/)
- [Zod Documentation](https://zod.dev/) 