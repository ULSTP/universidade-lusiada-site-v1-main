# Sistema de Gestão de Disciplinas - Implementação Completa

## 📋 Visão Geral

Foi implementado um sistema completo de gestão de disciplinas para a Universidade Lusíada de São Tomé e Príncipe, seguindo as melhores práticas de desenvolvimento backend e arquitetura em camadas.

## 🏗️ Arquitetura Implementada

### Camadas da Aplicação

```
📁 src/
├── 📁 types/
│   └── subject.ts              # Tipos TypeScript
├── 📁 repositories/
│   └── SubjectRepository.ts    # Camada de acesso a dados
├── 📁 services/
│   └── SubjectService.ts       # Lógica de negócio
├── 📁 controllers/
│   └── subjects/
│       ├── SubjectController.ts # Controlador HTTP
│       └── routes.ts           # Definição de rotas
└── 📁 middlewares/
    └── validations/
        └── subjectValidation.ts # Validações de entrada
```

## 🔧 Funcionalidades Implementadas

### 1. CRUD Completo de Disciplinas

#### Criar Disciplina
- **Endpoint**: `POST /api/v1/subjects`
- **Validações**: Código único, curso/departamento existentes, professor válido
- **Campos obrigatórios**: código, nome, cargaHoraria, creditos, semestre, tipo
- **Campos opcionais**: descrição, objetivos, programa, metodologia, avaliação, bibliografia, pré-requisitos, competências

#### Listar Disciplinas
- **Endpoint**: `GET /api/v1/subjects`
- **Recursos**: Paginação, busca, filtros múltiplos, ordenação
- **Filtros disponíveis**: curso, departamento, professor, semestre, tipo, status, créditos
- **Busca**: Por nome, código ou descrição

#### Obter Disciplina por ID
- **Endpoint**: `GET /api/v1/subjects/:id`
- **Inclui**: Dados completos com relacionamentos (curso, departamento, professor, estatísticas)

#### Atualizar Disciplina
- **Endpoint**: `PUT /api/v1/subjects/:id`
- **Validações**: Verificação de existência, código único (se alterado)
- **Campos atualizáveis**: Todos os campos exceto ID e timestamps

#### Excluir Disciplina
- **Endpoint**: `DELETE /api/v1/subjects/:id`
- **Proteções**: Impede exclusão se há inscrições ativas ou turmas associadas

### 2. Gestão de Status
- **Endpoint**: `PATCH /api/v1/subjects/:id/status`
- **Status disponíveis**: ATIVA, INATIVA, SUSPENSA
- **Auditoria**: Log de mudanças de status

### 3. Consultas Especializadas

#### Disciplinas por Curso
- **Endpoint**: `GET /api/v1/subjects/course/:cursoId`
- **Ordenação**: Por semestre (crescente)
- **Inclui**: Professor responsável e estatísticas

#### Disciplinas por Professor
- **Endpoint**: `GET /api/v1/subjects/professor/:professorId`
- **Validação**: Verifica se é professor válido
- **Inclui**: Curso e departamento associados

#### Busca Rápida
- **Endpoint**: `GET /api/v1/subjects/search?q=termo`
- **Limitação**: Máximo 50 resultados
- **Campos pesquisados**: Nome, código, descrição

### 4. Estatísticas e Relatórios
- **Endpoint**: `GET /api/v1/subjects/stats`
- **Métricas incluídas**:
  - Total de disciplinas
  - Distribuição por status
  - Distribuição por tipo
  - Distribuição por semestre
  - Distribuição por créditos
  - Top 5 disciplinas com mais inscrições
  - Quantidade de disciplinas sem turmas

## 📊 Modelo de Dados

### Campos da Disciplina

```typescript
interface Subject {
  id: string;                    // UUID único
  codigo: string;                // Código da disciplina (ex: MAT101)
  nome: string;                  // Nome da disciplina
  descricao?: string;            // Descrição detalhada
  cargaHoraria: number;          // Carga horária em horas
  creditos: number;              // Número de créditos
  semestre: number;              // Semestre de oferta (1-12)
  tipo: TipoDisciplina;          // OBRIGATORIA | OPTATIVA | ESTAGIO | TCC
  status: StatusDisciplina;      // ATIVA | INATIVA | SUSPENSA
  prerequisitos?: string[];      // Lista de pré-requisitos
  competencias?: string[];       // Competências desenvolvidas
  objetivos?: string;            // Objetivos da disciplina
  programa?: string;             // Programa da disciplina
  metodologia?: string;          // Metodologia de ensino
  avaliacao?: string;            // Sistema de avaliação
  bibliografia?: string[];       // Bibliografia
  departamentoId: string;        // Referência ao departamento
  cursoId: string;               // Referência ao curso
  professorId?: string;          // Professor responsável
  criadoEm: Date;
  atualizadoEm: Date;
}
```

## 🛡️ Validações Implementadas

### Validações de Entrada
- **Código**: 2-20 caracteres, apenas letras maiúsculas e números
- **Nome**: 2-200 caracteres obrigatórios
- **Carga Horária**: 1-500 horas
- **Créditos**: 1-20 créditos
- **Semestre**: 1-12
- **Descrição**: Máximo 1000 caracteres
- **Objetivos**: Máximo 2000 caracteres
- **Programa**: Máximo 5000 caracteres
- **Metodologia/Avaliação**: Máximo 2000 caracteres cada

### Validações de Negócio
- Código único por disciplina
- Curso deve existir
- Departamento deve existir
- Professor deve existir e ter tipo PROFESSOR
- Não permite exclusão com dependências

## 🔐 Segurança e Autenticação

### Middleware de Autenticação
- Todas as rotas protegidas por JWT
- Verificação de token válido
- Log de todas as operações com ID do usuário

### Auditoria
- Log estruturado com Winston
- Rastreamento de criação, atualização e exclusão
- Registro de mudanças de status
- Informações de contexto (usuário, timestamps)

## 📖 Documentação da API

### Swagger/OpenAPI
- Documentação completa de todos os endpoints
- Esquemas de dados detalhados
- Exemplos de requisições e respostas
- Códigos de status HTTP documentados

### Exemplos de Uso

```bash
# Criar disciplina
POST /api/v1/subjects
{
  "codigo": "MAT101",
  "nome": "Matemática I",
  "cargaHoraria": 60,
  "creditos": 4,
  "semestre": 1,
  "tipo": "OBRIGATORIA",
  "departamentoId": "uuid",
  "cursoId": "uuid"
}

# Listar com filtros
GET /api/v1/subjects?cursoId=uuid&semestre=1&status=ATIVA&pagina=1&limite=10

# Buscar disciplinas
GET /api/v1/subjects/search?q=matemática

# Atualizar status
PATCH /api/v1/subjects/:id/status
{
  "status": "INATIVA"
}
```

## 🧪 Dados de Teste

### Disciplinas Criadas no Seed
1. **Engenharia Informática**:
   - MAT101 - Matemática I (1º sem)
   - INF101 - Introdução à Programação (1º sem)
   - MAT102 - Matemática II (2º sem)
   - INF102 - Programação Orientada a Objetos (2º sem)

2. **Administração**:
   - ADM101 - Introdução à Administração (1º sem)
   - ECO101 - Economia (1º sem)
   - OPT101 - Empreendedorismo (3º sem, Optativa)

3. **Direito**:
   - DIR101 - Introdução ao Direito (1º sem)
   - DIR102 - Direito Constitucional (2º sem)

## 🚀 Próximos Passos

### Funcionalidades Recomendadas
1. **Sistema de Turmas**: Gestão de turmas por disciplina
2. **Sistema de Inscrições**: Inscrição de estudantes em disciplinas
3. **Sistema de Notas**: Gestão de avaliações e notas
4. **Horários**: Gestão de horários das disciplinas
5. **Relatórios Avançados**: Dashboards e relatórios detalhados

### Melhorias Técnicas
1. **Cache**: Implementar cache Redis para consultas frequentes
2. **Testes**: Testes unitários e de integração
3. **Performance**: Otimização de consultas complexas
4. **Notificações**: Sistema de notificações para mudanças

## 📝 Padrões de Código

### Arquitetura em Camadas
- **Repository**: Acesso direto aos dados (Prisma)
- **Service**: Lógica de negócio e validações
- **Controller**: Manipulação de requisições HTTP
- **Validation**: Middleware de validação de entrada

### Boas Práticas Implementadas
- Injeção de dependências
- Tratamento centralizado de erros
- Logging estruturado
- Validação em múltiplas camadas
- Tipagem forte com TypeScript
- Documentação da API
- Códigos de status HTTP apropriados

## 🔍 Monitoramento

### Logs Implementados
- Criação de disciplinas
- Atualizações e mudanças de status
- Exclusões (com verificações de dependência)
- Erros e exceções
- Operações de busca e filtros

### Métricas Disponíveis
- Total de disciplinas por status
- Distribuição por tipo e semestre
- Performance de queries
- Estatísticas de uso da API 