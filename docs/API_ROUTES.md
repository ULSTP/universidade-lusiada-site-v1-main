# Documentação das Rotas de API

Todas as rotas exigem autenticação via NextAuth, exceto onde indicado.

---

## Cursos

### Listar cursos
- **GET** `/api/courses`
- Parâmetros de query: `status`, `level`, `teacherId`, `page`, `limit`
- Exige autenticação
- Exemplo de resposta:
```json
{
  "courses": [ ... ],
  "pagination": { "page": 1, "limit": 10, "total": 100, "pages": 10 }
}
```

### Criar curso
- **POST** `/api/courses`
- Body: `{ code, name, description?, credits, duration, level, maxStudents?, teacherId? }`
- Apenas ADMIN ou TEACHER
- Exemplo de resposta: curso criado

### Obter curso específico
- **GET** `/api/courses/[id]`
- Exige autenticação
- Exemplo de resposta: dados completos do curso

### Atualizar curso
- **PUT** `/api/courses/[id]`
- Apenas ADMIN ou TEACHER
- Body: campos a atualizar

### Deletar curso
- **DELETE** `/api/courses/[id]`
- Apenas ADMIN
- Não pode deletar se houver matrículas ou disciplinas

---

## Disciplinas

### Listar disciplinas
- **GET** `/api/subjects`
- Parâmetros de query: `courseId`, `teacherId`, `semester`, `status`, `page`, `limit`
- Exige autenticação

### Criar disciplina
- **POST** `/api/subjects`
- Apenas ADMIN ou TEACHER
- Body: `{ code, name, description?, credits, semester, courseId, teacherId?, workload, prerequisites? }`

---

## Matrículas

### Listar matrículas
- **GET** `/api/enrollments`
- Parâmetros de query: `studentId`, `courseId`, `status`, `academicYear`, `semester`, `page`, `limit`
- Exige autenticação

### Criar matrícula
- **POST** `/api/enrollments`
- ADMIN ou o próprio estudante
- Body: `{ studentId, courseId, academicYear, semester, status? }`

---

## Notas

### Listar notas
- **GET** `/api/grades`
- Parâmetros de query: `enrollmentId`, `subjectId`, `studentId`, `teacherId`, `semester`, `academicYear`, `type`, `page`, `limit`
- Exige autenticação

### Criar nota
- **POST** `/api/grades`
- Apenas ADMIN ou TEACHER
- Body: `{ enrollmentId, subjectId, grade, semester, academicYear, type, description? }`

---

## Frequência

### Listar frequência
- **GET** `/api/attendance`
- Parâmetros de query: `enrollmentId`, `subjectId`, `studentId`, `teacherId`, `status`, `startDate`, `endDate`, `page`, `limit`
- Exige autenticação

### Criar registro de frequência
- **POST** `/api/attendance`
- Apenas ADMIN ou TEACHER
- Body: `{ enrollmentId, subjectId, date, status, description? }`

---

## Documentos

### Listar documentos
- **GET** `/api/documents`
- Parâmetros de query: `studentId`, `teacherId`, `adminId`, `type`, `status`, `page`, `limit`
- Exige autenticação
- Permissões: estudante vê seus documentos, professor os seus, admin vê todos

### Criar documento
- **POST** `/api/documents`
- Exige autenticação
- Body: `{ title, description?, type, studentId?, teacherId?, adminId?, fileUrl, fileSize, mimeType, status? }`
- Permissões: admin pode criar para qualquer um, usuário só para si

---

## Notificações

### Listar notificações
- **GET** `/api/notifications`
- Parâmetros de query: `type`, `priority`, `read`, `page`, `limit`
- Exige autenticação
- Retorna notificações do usuário, do seu papel ou globais

### Criar notificação
- **POST** `/api/notifications`
- Apenas ADMIN ou TEACHER
- Body: `{ title, message, type, priority, targetRole?, targetUserId?, link?, expiresAt? }`

### Marcar como lida
- **PUT** `/api/notifications/[id]/read`
- Exige autenticação
- Marca a notificação como lida para o usuário

---

## Contatos

### Listar contatos
- **GET** `/api/contacts`
- Apenas ADMIN
- Parâmetros de query: `type`, `priority`, `status`, `page`, `limit`

### Criar contato
- **POST** `/api/contacts`
- Público (não exige autenticação)
- Body: `{ name, email, phone?, subject, message, type, priority? }`

---

## Estatísticas do Dashboard

### Obter estatísticas
- **GET** `/api/dashboard/stats`
- Exige autenticação
- Retorna estatísticas diferentes conforme o papel do usuário (admin, professor, estudante)

---

## Observações Gerais
- Todos os endpoints retornam erros padronizados em caso de falha de validação, autenticação ou permissão.
- Os parâmetros de paginação são opcionais (`page`, `limit`).
- Para detalhes de cada modelo, consulte o schema Prisma. 