# 📚 Como Adicionar Cursos no Prisma Studio

## 🎯 **Problema Resolvido!**

A página de cursos agora está **100% integrada** com a base de dados! Os cursos que adicionar no Prisma Studio aparecerão automaticamente na página.

## 🚀 **Como Adicionar Cursos:**

### **1. Aceder ao Prisma Studio**
```bash
npx prisma studio
```
- Abre em: `http://localhost:5555`

### **2. Navegar para a Tabela Course**
1. No Prisma Studio, clicar em **"Course"**
2. Clicar em **"Add record"**

### **3. Preencher os Dados do Curso**

**Campos Obrigatórios:**
- **code**: Código do curso (ex: `ENG001`)
- **name**: Nome do curso (ex: `Engenharia Informática`)
- **credits**: Número de créditos (ex: `180`)
- **duration**: Duração em semestres (ex: `6`)
- **level**: Nível do curso:
  - `BACHELOR` - Licenciatura
  - `MASTER` - Mestrado
  - `DOCTORATE` - Doutoramento
  - `CERTIFICATE` - Certificado

**Campos Opcionais:**
- **description**: Descrição do curso
- **maxStudents**: Número máximo de alunos
- **teacherId**: ID de um professor (se existir)

### **4. Exemplo de Curso:**
```json
{
  "code": "ENG001",
  "name": "Engenharia Informática",
  "description": "Curso de Engenharia Informática focado no desenvolvimento de software e sistemas.",
  "credits": 180,
  "duration": 6,
  "level": "BACHELOR",
  "maxStudents": 45,
  "currentStudents": 0,
  "status": "ACTIVE"
}
```

### **5. Salvar o Curso**
1. Clicar em **"Save 1 change"**
2. O curso será adicionado à base de dados

## ✅ **Verificar Resultado:**

1. **Ir para:** `http://localhost:3001/cursos`
2. **O novo curso deve aparecer automaticamente!**
3. **Funcionalidades disponíveis:**
   - 🔍 **Pesquisa**: Pesquisar por nome ou descrição
   - 🏷️ **Filtros**: Filtrar por nível (Licenciatura, Mestrado, etc.)
   - 📊 **Estatísticas**: Contador automático de cursos

## 🎨 **Funcionalidades da Página:**

### **🔍 Pesquisa Inteligente:**
- Pesquisa por nome do curso
- Pesquisa por descrição
- Resultados em tempo real

### **🏷️ Filtros Dinâmicos:**
- **Todos**: Mostrar todos os cursos
- **Licenciatura**: Só cursos de licenciatura
- **Mestrado**: Só mestrados
- **Doutoramento**: Só doutoramentos
- **Certificado**: Só certificados

### **📊 Informações Mostradas:**
- Nome e descrição do curso
- Nível e créditos
- Duração em semestres
- Número de vagas
- Professor responsável
- Disciplinas associadas
- Código do curso
- Número de alunos inscritos

### **⚡ Estados da Página:**
- **Loading**: Mostra spinner durante carregamento
- **Erro**: Mostra mensagem de erro se API falhar
- **Vazio**: Mostra mensagem se não há cursos
- **Sem resultados**: Mostra se filtros não retornam resultados

## 🔄 **Integração Completa:**

✅ **Frontend ↔ Backend**: Página React conectada à API  
✅ **API ↔ Base de Dados**: API Prisma funcional  
✅ **Filtros Dinâmicos**: Pesquisa e filtros em tempo real  
✅ **Estados de Loading**: UX completa  
✅ **Design Responsivo**: Funciona em mobile e desktop  

## 📝 **Testar o Sistema:**

1. **Adicionar curso no Prisma Studio**
2. **Actualizar página de cursos** (`F5`)
3. **Verificar se aparece na lista**
4. **Testar pesquisa** (escrever nome do curso)
5. **Testar filtros** (clicar nos botões de nível)

**🎉 Sistema totalmente funcional!** 