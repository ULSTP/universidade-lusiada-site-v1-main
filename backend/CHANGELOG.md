# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-01-15

### ✨ Adicionado
- 🏗️ Arquitetura completa do backend
- 🔐 Sistema de autenticação JWT
- 👥 CRUD completo de usuários
- 📊 Sistema de logs estruturado
- 🛡️ Middlewares de segurança
- 📚 Documentação Swagger/OpenAPI
- 🗃️ Schema Prisma completo
- 🌱 Sistema de seed
- ⚡ Rate limiting
- 🔍 Validação de dados
- 📄 Health check endpoint

### 🎯 Funcionalidades Principais
- **Autenticação**
  - Login/logout
  - Refresh tokens
  - Recuperação de senha
  - Alteração de senha

- **Gestão de Usuários**
  - CRUD completo
  - Diferentes tipos (Admin, Professor, Estudante, Funcionário)
  - Sistema de permissões
  - Busca e filtros
  - Estatísticas

- **Segurança**
  - Hash de senhas com bcrypt
  - Rate limiting
  - Validação de entrada
  - CORS configurado
  - Headers de segurança

### 🛠️ Tecnologias Utilizadas
- Node.js 18+
- Express.js + TypeScript
- PostgreSQL + Prisma ORM
- JWT para autenticação
- Winston para logs
- Express Validator
- Swagger/OpenAPI 3.0

### 📁 Estrutura
- Arquitetura em camadas (Controllers, Services, Repositories)
- Middleware de tratamento de erros
- Configuração centralizada
- Types TypeScript
- Documentação completa

### 🚀 Deploy
- Configuração para produção
- Docker ready
- Environment variables
- Health checks

---

## [1.1.0] - 2024-01-16

### ✨ Adicionado - Sistema de Disciplinas
- 📚 **CRUD Completo de Disciplinas**
  - Criação com validações rigorosas
  - Listagem com paginação e filtros
  - Atualização de dados completos
  - Exclusão com verificação de dependências
  - Gestão de status (ATIVA/INATIVA/SUSPENSA)

### 🔍 Funcionalidades de Consulta
- **Busca Avançada**
  - Pesquisa por nome, código ou descrição
  - Filtros por curso, departamento, professor
  - Filtros por semestre, tipo e status
  - Ordenação personalizável

- **Consultas Especializadas**
  - Disciplinas por curso
  - Disciplinas por professor
  - Busca rápida com limitação de resultados
  - Estatísticas completas do sistema

### 📊 Estatísticas e Relatórios
- Total de disciplinas
- Distribuição por status
- Distribuição por tipo (Obrigatória/Optativa/Estágio/TCC)
- Distribuição por semestre
- Distribuição por créditos
- Top 5 disciplinas com mais inscrições
- Identificação de disciplinas sem turmas

### 🛠️ Componentes Implementados
- **SubjectRepository**: Camada de acesso a dados
- **SubjectService**: Lógica de negócio completa
- **SubjectController**: Controlador HTTP
- **SubjectValidation**: Validações de entrada
- **Types**: Interfaces TypeScript completas

### 📖 Documentação
- **Swagger/OpenAPI**: Documentação completa da API
- **IMPLEMENTACAO_DISCIPLINAS.md**: Guia técnico detalhado
- Exemplos de uso e casos de teste

### 🧪 Dados de Teste
- Disciplinas para Engenharia Informática
- Disciplinas para Administração
- Disciplinas para Direito
- Exemplos de pré-requisitos e competências

### 🔐 Segurança
- Autenticação JWT obrigatória
- Validação de tipos de usuário
- Auditoria completa de operações
- Logs estruturados

### 🎯 Endpoints Implementados
```
POST   /api/v1/subjects              # Criar disciplina
GET    /api/v1/subjects              # Listar com filtros
GET    /api/v1/subjects/:id          # Obter por ID
PUT    /api/v1/subjects/:id          # Atualizar
DELETE /api/v1/subjects/:id          # Excluir
PATCH  /api/v1/subjects/:id/status   # Alterar status
GET    /api/v1/subjects/stats        # Estatísticas
GET    /api/v1/subjects/search       # Busca rápida
GET    /api/v1/subjects/course/:id   # Por curso
GET    /api/v1/subjects/professor/:id # Por professor
```

---

## 🔮 **Próximas Versões**

### [1.2.0] - Planejado
- Sistema de turmas
- Matrículas e inscrições
- Sistema de notas
- Calendário acadêmico

### [1.2.0] - Planejado
- Sistema financeiro (propinas)
- Pagamentos
- Relatórios financeiros
- Dashboard analytics

### [1.3.0] - Planejado
- Sistema de notificações
- Upload de documentos
- Email templates
- Backup automático

---

**🎓 Universidade Lusíada de São Tomé e Príncipe** 