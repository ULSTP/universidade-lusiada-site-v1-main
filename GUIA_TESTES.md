# 🧪 Guia Completo de Testes - Sistema Universidade Lusíada

## 🚀 **Como Testar o Sistema**

### **1. 🌐 Iniciar o Sistema**

1. **Abrir terminal** na pasta do projeto
2. **Executar servidor:**
   ```bash
   npm run dev
   ```
3. **Aguardar** a mensagem: `Ready - started server on 0.0.0.0:3000`
4. **Abrir navegador** em: `http://localhost:3000`

---

## 📋 **Roteiro de Testes Completo**

### **TESTE 1: 🏠 Página Principal**
- **URL:** `http://localhost:3000`
- **Verificar:**
  - ✅ Página carrega sem erros
  - ✅ Menu de navegação funcional
  - ✅ Links para diferentes secções
  - ✅ Design responsivo

### **TESTE 2: 📝 Registo de Utilizador**
- **URL:** `http://localhost:3000/auth/signup`
- **Testar como Aluno:**
  1. Escolher "Aluno"
  2. Preencher todos os campos:
     - Email: `teste@aluno.pt`
     - Password: `123456789`
     - Nome: `João`
     - Apelido: `Silva`
     - Número de Aluno: `20241001`
     - Data Nascimento: `01/01/2000`
     - Nacionalidade: `Portuguesa`
  3. **Clicar "Registar"**
  4. **Resultado esperado:** ✅ "Conta criada com sucesso!"

- **Testar como Admin:**
  1. Escolher "Administrador"
  2. Preencher:
     - Email: `admin@teste.pt`
     - Password: `admin123`
     - Nome: `Maria`
     - Apelido: `Santos`
     - ID Funcionário: `ADM001`
     - Departamento: `TI`
  3. **Resultado esperado:** ✅ Conta de admin criada

### **TESTE 3: 🚪 Login do Sistema**
- **URL:** `http://localhost:3000/auth/signin`
- **Testar:**
  1. Email: `teste@aluno.pt`
  2. Password: `123456789`
  3. **Clicar "Entrar"**
  4. **Resultado esperado:** ✅ Redirecionamento para portal

### **TESTE 4: 🎓 Portal do Aluno**
- **URL:** `http://localhost:3000/portal-aluno`
- **Verificar (após login):**
  - ✅ Dashboard principal carrega
  - ✅ Menu lateral funcional
  - ✅ Informações do utilizador
  - ✅ Links para diferentes secções

### **TESTE 5: 📚 Secções do Portal**
- **Académico:** `/portal-aluno/academico`
  - ✅ Disciplinas actuais
  - ✅ Histórico académico
  - ✅ Progresso do curso

- **Documentos:** `/portal-aluno/documentos`
  - ✅ Lista de documentos
  - ✅ Download/visualização

- **Horários:** `/portal-aluno/horarios`
  - ✅ Calendário de aulas
  - ✅ Horário semanal

- **Notificações:** `/portal-aluno/notificacoes`
  - ✅ Lista de avisos
  - ✅ Marcar como lido

### **TESTE 6: 🔐 Proteção de Rotas**
- **Testar sem login:**
  1. Abrir `http://localhost:3000/portal-aluno` (sem estar logado)
  2. **Resultado esperado:** ✅ Redirecionamento para login

### **TESTE 7: 🚪 Logout**
- **No portal do aluno:**
  1. Clicar no botão de logout
  2. **Resultado esperado:** ✅ Redirecionamento para página inicial

---

## 🔧 **Testes de API (Opcionais)**

### **Testar APIs Directamente:**

```bash
# Testar registo de aluno
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@teste.pt",
    "password": "123456789",
    "userType": "student",
    "firstName": "API",
    "lastName": "Teste",
    "studentId": "API001",
    "dateOfBirth": "2000-01-01",
    "nationality": "Portuguesa"
  }'

# Verificar se utilizador foi criado
curl http://localhost:3000/api/auth/session
```

---

## 📊 **Verificar Base de Dados**

### **Ver dados criados:**
```bash
npx prisma studio
```
- Abre interface visual da base de dados
- Verificar tabelas: `User`, `Student`, `Admin`
- Confirmar dados inseridos

---

## ❌ **Erros Comuns e Soluções**

### **Erro 404 no Portal:**
- **Causa:** Servidor não iniciado
- **Solução:** `npm run dev`

### **Erro de Autenticação:**
- **Causa:** Variáveis de ambiente
- **Solução:** Verificar `.env` tem `NEXTAUTH_SECRET`

### **Erro na Base de Dados:**
- **Causa:** Schema não aplicado
- **Solução:** `npx prisma db push`

### **Erro 500 no Registo:**
- **Causa:** Campos obrigatórios em falta
- **Solução:** Preencher todos os campos do formulário

---

## 🎯 **Checklist de Testes Rápidos**

- [ ] ✅ Servidor a funcionar (`npm run dev`)
- [ ] ✅ Página inicial carrega (`localhost:3000`)
- [ ] ✅ Registo de aluno funciona
- [ ] ✅ Login funciona
- [ ] ✅ Portal do aluno acessível
- [ ] ✅ Logout funciona
- [ ] ✅ Proteção de rotas activa
- [ ] ✅ Base de dados recebe dados

---

## 🚀 **Links Rápidos Para Testar**

1. **Página Principal:** [http://localhost:3000](http://localhost:3000)
2. **Registo:** [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
3. **Login:** [http://localhost:3000/auth/signin](http://localhost:3000/auth/signin)
4. **Portal Aluno:** [http://localhost:3000/portal-aluno](http://localhost:3000/portal-aluno)
5. **Base de Dados:** `npx prisma studio`

**Sistema está pronto para uso! 🎉** 