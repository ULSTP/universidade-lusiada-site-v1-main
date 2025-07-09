# 🚀 Configuração do Supabase

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma nova organização ou use uma existente
4. Clique em "New Project"
5. Escolha um nome para o projeto (ex: `universidade-lusiada`)
6. Defina uma senha forte para a base de dados
7. Escolha uma região próxima (ex: `West Europe`)
8. Clique em "Create new project"

## 2. Obter Credenciais

Após criar o projeto, vá para **Settings > API**:

- **Project URL**: `https://[YOUR-PROJECT-REF].supabase.co`
- **Project API Keys > anon public**: `[YOUR-ANON-KEY]`
- **Database Password**: A senha que definiu

## 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env` e substitua os valores:

```env
# Supabase Configuration
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL=https://[SEU-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[SUA-ANON-KEY]
```

**Exemplo:**
```env
DATABASE_URL="postgresql://postgres:minhasenha123@db.abcdefghijk.supabase.co:5432/postgres"
SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Aplicar Schema da Base de Dados

Execute os comandos:

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar schema à base de dados Supabase
npx prisma db push
```

## 5. Verificar Conexão

1. Reinicie o servidor: `npm run dev`
2. Tente registar um novo utilizador
3. Verifique no Supabase Dashboard se os dados foram criados

## 6. Funcionalidades do Supabase

✅ **Base de dados PostgreSQL** - Totalmente gerida
✅ **Autenticação** - Integrada com NextAuth
✅ **API REST automática** - Gerada automaticamente
✅ **Realtime** - Subscrições em tempo real
✅ **Storage** - Para ficheiros e imagens
✅ **Edge Functions** - Funções serverless

## 7. Monitorização

No Dashboard do Supabase pode:
- Ver dados das tabelas
- Monitorizar logs
- Gerir utilizadores
- Configurar políticas RLS (Row Level Security)

## 8. Backup e Segurança

- ✅ Backups automáticos diários
- ✅ SSL/TLS encryption
- ✅ Row Level Security (RLS)
- ✅ Monitorização 24/7 