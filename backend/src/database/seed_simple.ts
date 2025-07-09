import { PrismaClient, UserType, UserStatus, Gender, CourseLevel } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed da base de dados PostgreSQL...');

  try {
    // Hash padrão para senhas de teste
    const defaultPasswordHash = await bcrypt.hash('123456', 12);

    // Criar departamentos
    const departamentos = await Promise.all([
      prisma.departamento.create({
        data: {
          nome: 'Ciências da Computação',
          codigo: 'CC',
          descricao: 'Departamento de Ciências da Computação e Tecnologia',
          chefe: 'Prof. João Silva'
        }
      }),
      prisma.departamento.create({
        data: {
          nome: 'Administração',
          codigo: 'ADM', 
          descricao: 'Departamento de Administração e Gestão',
          chefe: 'Prof. Maria Santos'
        }
      })
    ]);

    console.log(`✅ ${departamentos.length} departamentos criados`);

    // Criar usuários
    const users = await Promise.all([
      // Admin
      prisma.user.create({
        data: {
          nome: 'Administrador do Sistema',
          email: 'admin@ulstp.ac.st',
          senha: defaultPasswordHash,
          tipoUsuario: UserType.ADMIN,
          estado: UserStatus.ATIVO,
          genero: Gender.MASCULINO,
          telefone: '+239 222 1234'
        }
      }),

      // Professores
      prisma.user.create({
        data: {
          nome: 'Prof. Maria Silva',
          email: 'maria.silva@ulstp.ac.st',
          senha: defaultPasswordHash,
          tipoUsuario: UserType.PROFESSOR,
          estado: UserStatus.ATIVO,
          genero: Gender.FEMININO,
          dataNascimento: new Date('1975-03-15'),
          telefone: '+239 222 5678',
          numeroFuncionario: 'PROF001'
        }
      }),

      prisma.user.create({
        data: {
          nome: 'Prof. João Santos',
          email: 'joao.santos@ulstp.ac.st',
          senha: defaultPasswordHash,
          tipoUsuario: UserType.PROFESSOR,
          estado: UserStatus.ATIVO,
          genero: Gender.MASCULINO,
          dataNascimento: new Date('1980-07-22'),
          telefone: '+239 222 9012',
          numeroFuncionario: 'PROF002'
        }
      }),

      // Estudantes
      prisma.user.create({
        data: {
          nome: 'Ana Costa',
          email: 'ana.costa@estudante.ulstp.ac.st',
          senha: defaultPasswordHash,
          tipoUsuario: UserType.ESTUDANTE,
          estado: UserStatus.ATIVO,
          genero: Gender.FEMININO,
          dataNascimento: new Date('2002-05-10'),
          telefone: '+239 991 2345',
          numeroEstudante: '20240001'
        }
      }),

      prisma.user.create({
        data: {
          nome: 'Pedro Almeida',
          email: 'pedro.almeida@estudante.ulstp.ac.st',
          senha: defaultPasswordHash,
          tipoUsuario: UserType.ESTUDANTE,
          estado: UserStatus.ATIVO,
          genero: Gender.MASCULINO,
          dataNascimento: new Date('2001-12-03'),
          telefone: '+239 991 6789',
          numeroEstudante: '20240002'
        }
      })
    ]);

    console.log(`✅ ${users.length} usuários criados`);

    // Criar cursos
    const cursos = await Promise.all([
      prisma.curso.create({
        data: {
          nome: 'Licenciatura em Engenharia Informática',
          codigo: 'LEI',
          descricao: 'Curso de formação em tecnologias da informação',
          nivel: CourseLevel.LICENCIATURA,
          duracaoAnos: 4,
          duracaoSemestres: 8,
          creditosMinimos: 240,
          departamentoId: departamentos[0].id,
          coordenadorId: users[1].id // Prof. Maria Silva
        }
      }),

      prisma.curso.create({
        data: {
          nome: 'Licenciatura em Administração',
          codigo: 'LAD',
          descricao: 'Curso de formação em gestão e administração',
          nivel: CourseLevel.LICENCIATURA,
          duracaoAnos: 4,
          duracaoSemestres: 8,
          creditosMinimos: 240,
          departamentoId: departamentos[1].id,
          coordenadorId: users[2].id // Prof. João Santos
        }
      })
    ]);

    console.log(`✅ ${cursos.length} cursos criados`);

    // Criar disciplinas
    const disciplinas = await Promise.all([
      prisma.disciplina.create({
        data: {
          codigo: 'MAT101',
          nome: 'Matemática I',
          descricao: 'Conceitos fundamentais de matemática para informática',
          cargaHoraria: 60,
          creditos: 4,
          semestre: 1,
          anoLetivo: 2024,
          obrigatoria: true,
          preRequisitos: [],
          cursoId: cursos[0].id
        }
      }),

      prisma.disciplina.create({
        data: {
          codigo: 'INF101',
          nome: 'Introdução à Programação',
          descricao: 'Fundamentos de programação de computadores',
          cargaHoraria: 75,
          creditos: 5,
          semestre: 1,
          anoLetivo: 2024,
          obrigatoria: true,
          preRequisitos: [],
          cursoId: cursos[0].id
        }
      }),

      prisma.disciplina.create({
        data: {
          codigo: 'ADM101',
          nome: 'Introdução à Administração',
          descricao: 'Conceitos fundamentais de administração',
          cargaHoraria: 60,
          creditos: 4,
          semestre: 1,
          anoLetivo: 2024,
          obrigatoria: true,
          preRequisitos: [],
          cursoId: cursos[1].id
        }
      })
    ]);

    console.log(`✅ ${disciplinas.length} disciplinas criadas`);

    // Criar turmas
    const turmas = await Promise.all([
      prisma.turma.create({
        data: {
          nome: 'LEI 1º Ano - Turma A',
          codigo: 'LEI-1A',
          cursoId: cursos[0].id,
          ano: 1,
          semestre: 1,
          anoLetivo: 2024,
          maxEstudantes: 30
        }
      }),

      prisma.turma.create({
        data: {
          nome: 'LAD 1º Ano - Turma A',
          codigo: 'LAD-1A',
          cursoId: cursos[1].id,
          ano: 1,
          semestre: 1,
          anoLetivo: 2024,
          maxEstudantes: 25
        }
      })
    ]);

    console.log(`✅ ${turmas.length} turmas criadas`);

    // Criar salas
    const salas = await Promise.all([
      prisma.classroom.create({
        data: {
          numero: 'S101',
          nome: 'Sala de Informática 1',
          tipoSala: 'LABORATORIO',
          capacidade: 30,
          localizacao: 'Bloco A - 1º Piso',
          equipamentos: ['Computadores', 'Projetor', 'Quadro interativo']
        }
      }),

      prisma.classroom.create({
        data: {
          numero: 'S201',
          nome: 'Sala de Aula 1',
          tipoSala: 'AULA_COMUM',
          capacidade: 40,
          localizacao: 'Bloco B - 2º Piso',
          equipamentos: ['Projetor', 'Quadro', 'Sistema de som']
        }
      })
    ]);

    console.log(`✅ ${salas.length} salas criadas`);

    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n📊 Dados criados:');
    console.log(`- ${departamentos.length} departamentos`);
    console.log(`- ${users.length} usuários`);
    console.log(`- ${cursos.length} cursos`);
    console.log(`- ${disciplinas.length} disciplinas`);
    console.log(`- ${turmas.length} turmas`);
    console.log(`- ${salas.length} salas`);

    console.log('\n🔑 Credenciais de teste:');
    console.log('📧 admin@ulstp.ac.st / 🔒 123456 (Admin)');
    console.log('📧 maria.silva@ulstp.ac.st / 🔒 123456 (Professor)');
    console.log('📧 ana.costa@estudante.ulstp.ac.st / 🔒 123456 (Estudante)');

  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 