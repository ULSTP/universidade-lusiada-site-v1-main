import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Iniciando seed da base de dados...');

  try {
    // Limpar dados existentes (cuidado em produção!)
    if (process.env.NODE_ENV !== 'production') {
      await prisma.user.deleteMany();
      await prisma.departamento.deleteMany();
      logger.info('🗑️ Dados existentes removidos');
    }

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
      }),
      prisma.departamento.create({
        data: {
          nome: 'Direito',
          codigo: 'DIR',
          descricao: 'Departamento de Ciências Jurídicas',
          chefe: 'Prof. Carlos Mendes'
        }
      })
    ]);

    logger.info(`✅ ${departamentos.length} departamentos criados`);

    // Criar usuários
    const users = await Promise.all([
      // Admin
      prisma.user.create({
        data: {
          nome: 'Administrador do Sistema',
          email: 'admin@ulstp.ac.st',
          senha: defaultPasswordHash,
          tipoUsuario: 'ADMIN',
          estado: 'ATIVO',
          genero: 'MASCULINO',
          telefone: '+239 222 1234'
        }
      }),

      // Professores
      prisma.user.create({
        data: {
          nome: 'Prof. Maria Silva',
          email: 'maria.silva@ulstp.ac.st',
          senha: defaultPasswordHash,
          tipoUsuario: 'PROFESSOR',
          estado: 'ATIVO',
          genero: 'FEMININO',
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
          tipoUsuario: 'PROFESSOR',
          estado: 'ATIVO',
          genero: 'MASCULINO',
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
          tipoUsuario: 'ESTUDANTE',
          estado: 'ATIVO',
          genero: 'FEMININO',
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
          tipoUsuario: 'ESTUDANTE',
          estado: 'ATIVO',
          genero: 'MASCULINO',
          dataNascimento: new Date('2001-12-03'),
          telefone: '+239 991 6789',
          numeroEstudante: '20240002'
        }
      }),

      prisma.user.create({
        data: {
          nome: 'Carla Ferreira',
          email: 'carla.ferreira@estudante.ulstp.ac.st',
          senha: defaultPasswordHash,
          tipoUsuario: 'ESTUDANTE',
          estado: 'ATIVO',
          genero: 'FEMININO',
          dataNascimento: new Date('2003-08-18'),
          telefone: '+239 991 0123',
          numeroEstudante: '20240003'
        }
      }),

      // Funcionários
      prisma.user.create({
        data: {
          nome: 'Secretária Administrativa',
          email: 'secretaria@ulstp.ac.st',
          senha: defaultPasswordHash,
          tipoUsuario: 'FUNCIONARIO',
          estado: 'ATIVO',
          genero: 'FEMININO',
          telefone: '+239 222 4567',
          numeroFuncionario: 'FUNC001'
        }
      }),

      prisma.user.create({
        data: {
          nome: 'Tesoureiro',
          email: 'tesouraria@ulstp.ac.st',
          senha: defaultPasswordHash,
          tipoUsuario: 'FUNCIONARIO',
          estado: 'ATIVO',
          genero: 'MASCULINO',
          telefone: '+239 222 8901',
          numeroFuncionario: 'FUNC002'
        }
      })
    ]);

    logger.info(`✅ ${users.length} usuários criados`);

    // Criar alguns cursos
    const cursos = await Promise.all([
      prisma.curso.create({
        data: {
          nome: 'Licenciatura em Engenharia Informática',
          codigo: 'LEI',
          descricao: 'Curso de formação em tecnologias da informação',
          nivel: 'LICENCIATURA',
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
          nivel: 'LICENCIATURA',
          duracaoAnos: 4,
          duracaoSemestres: 8,
          creditosMinimos: 240,
          departamentoId: departamentos[1].id,
          coordenadorId: users[2].id // Prof. João Santos
        }
      }),

      prisma.curso.create({
        data: {
          nome: 'Licenciatura em Direito',
          codigo: 'LDIR',
          descricao: 'Curso de formação em ciências jurídicas',
          nivel: 'LICENCIATURA',
          duracaoAnos: 4,
          duracaoSemestres: 8,
          creditosMinimos: 240,
          departamentoId: departamentos[2].id
        }
      })
    ]);

    logger.info(`✅ ${cursos.length} cursos criados`);

    // Criar disciplinas para o curso de Engenharia Informática
    const disciplinas = await Promise.all([
      // 1º Semestre
      prisma.disciplina.create({
        data: {
          nome: 'Introdução à Programação',
          codigo: 'IP001',
          descricao: 'Fundamentos de programação e lógica computacional',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 1,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      prisma.disciplina.create({
        data: {
          nome: 'Matemática I',
          codigo: 'MAT001',
          descricao: 'Cálculo diferencial e integral',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 1,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      prisma.disciplina.create({
        data: {
          nome: 'Física I',
          codigo: 'FIS001',
          descricao: 'Mecânica e termodinâmica',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 1,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      // 2º Semestre
      prisma.disciplina.create({
        data: {
          nome: 'Programação Orientada a Objetos',
          codigo: 'POO001',
          descricao: 'Conceitos de POO e implementação prática',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 2,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      prisma.disciplina.create({
        data: {
          nome: 'Matemática II',
          codigo: 'MAT002',
          descricao: 'Álgebra linear e estatística',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 2,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      prisma.disciplina.create({
        data: {
          nome: 'Estruturas de Dados',
          codigo: 'ED001',
          descricao: 'Implementação e uso de estruturas de dados',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 2,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      // 3º Semestre
      prisma.disciplina.create({
        data: {
          nome: 'Bases de Dados',
          codigo: 'BD001',
          descricao: 'Modelagem e implementação de bases de dados',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 3,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      prisma.disciplina.create({
        data: {
          nome: 'Redes de Computadores',
          codigo: 'RC001',
          descricao: 'Fundamentos de redes e protocolos',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 3,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      prisma.disciplina.create({
        data: {
          nome: 'Algoritmos e Complexidade',
          codigo: 'AC001',
          descricao: 'Análise de algoritmos e otimização',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 3,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      // 4º Semestre
      prisma.disciplina.create({
        data: {
          nome: 'Desenvolvimento Web',
          codigo: 'DW001',
          descricao: 'Tecnologias web frontend e backend',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 4,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      prisma.disciplina.create({
        data: {
          nome: 'Sistemas Operativos',
          codigo: 'SO001',
          descricao: 'Arquitetura e funcionamento de SO',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 4,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      prisma.disciplina.create({
        data: {
          nome: 'Engenharia de Software',
          codigo: 'ES001',
          descricao: 'Metodologias e práticas de desenvolvimento',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 4,
          anoLetivo: 2024,
          obrigatoria: true,
          cursoId: cursos[0].id
        }
      }),

      // Disciplina optativa
      prisma.disciplina.create({
        data: {
          nome: 'Inteligência Artificial',
          codigo: 'IA001',
          descricao: 'Fundamentos de IA e machine learning',
          cargaHoraria: 60,
          creditos: 6,
          semestre: 5,
          anoLetivo: 2024,
          obrigatoria: false,
          cursoId: cursos[0].id
        }
      })
    ]);

    logger.info(`✅ ${disciplinas.length} disciplinas criadas`);

    // Criar turmas
    const turmas = await Promise.all([
      prisma.turma.create({
        data: {
          nome: 'Turma A - 1º Ano',
          codigo: 'LEI-1A-2024',
          cursoId: cursos[0].id,
          ano: 1,
          semestre: 1,
          anoLetivo: 2024,
          maxEstudantes: 30
        }
      }),

      prisma.turma.create({
        data: {
          nome: 'Turma B - 1º Ano',
          codigo: 'LEI-1B-2024',
          cursoId: cursos[0].id,
          ano: 1,
          semestre: 1,
          anoLetivo: 2024,
          maxEstudantes: 30
        }
      })
    ]);

    logger.info(`✅ ${turmas.length} turmas criadas`);

    // Criar matrículas para estudantes
    const matriculas = await Promise.all([
      prisma.matricula.create({
        data: {
          numeroMatricula: '20240001',
          usuarioId: users[3].id, // Ana Costa
          cursoId: cursos[0].id,
          turmaId: turmas[0].id,
          anoLetivo: 2024,
          semestre: 1,
          status: 'ATIVA'
        }
      }),

      prisma.matricula.create({
        data: {
          numeroMatricula: '20240002',
          usuarioId: users[4].id, // Pedro Almeida
          cursoId: cursos[0].id,
          turmaId: turmas[0].id,
          anoLetivo: 2024,
          semestre: 1,
          status: 'ATIVA'
        }
      }),

      prisma.matricula.create({
        data: {
          numeroMatricula: '20240003',
          usuarioId: users[5].id, // Carla Ferreira
          cursoId: cursos[0].id,
          turmaId: turmas[1].id,
          anoLetivo: 2024,
          semestre: 1,
          status: 'ATIVA'
        }
      })
    ]);

    logger.info(`✅ ${matriculas.length} matrículas criadas`);

    // Criar algumas inscrições em disciplinas
    const inscricoes = await Promise.all([
      // Ana Costa - 1º semestre
      prisma.inscricao.create({
        data: {
          estudanteId: users[3].id,
          disciplinaId: disciplinas[0].id,
          turmaId: turmas[0].id,
          periodo: '2024.1',
          anoLetivo: 2024,
          semestre: 1,
          status: 'ATIVA'
        }
      }),

      prisma.inscricao.create({
        data: {
          estudanteId: users[3].id,
          disciplinaId: disciplinas[1].id,
          turmaId: turmas[0].id,
          periodo: '2024.1',
          anoLetivo: 2024,
          semestre: 1,
          status: 'ATIVA'
        }
      }),

      // Pedro Almeida - 1º semestre
      prisma.inscricao.create({
        data: {
          estudanteId: users[4].id,
          disciplinaId: disciplinas[0].id,
          turmaId: turmas[0].id,
          periodo: '2024.1',
          anoLetivo: 2024,
          semestre: 1,
          status: 'ATIVA'
        }
      }),

      prisma.inscricao.create({
        data: {
          estudanteId: users[4].id,
          disciplinaId: disciplinas[2].id,
          turmaId: turmas[0].id,
          periodo: '2024.1',
          anoLetivo: 2024,
          semestre: 1,
          status: 'ATIVA'
        }
      })
    ]);

    logger.info(`✅ ${inscricoes.length} inscrições criadas`);

    // Criar algumas notas de exemplo
    const notas = await Promise.all([
      prisma.nota.create({
        data: {
          estudanteId: users[3].id,
          disciplinaId: disciplinas[0].id,
          tipoNota: 'PROVA',
          valor: 15.5,
          peso: 0.3,
          dataAvaliacao: new Date('2024-10-15'),
          observacoes: 'Bom desempenho no primeiro teste'
        }
      }),

      prisma.nota.create({
        data: {
          estudanteId: users[3].id,
          disciplinaId: disciplinas[0].id,
          tipoNota: 'PROVA',
          valor: 17.0,
          peso: 0.3,
          dataAvaliacao: new Date('2024-11-15'),
          observacoes: 'Excelente no segundo teste'
        }
      }),

      prisma.nota.create({
        data: {
          estudanteId: users[3].id,
          disciplinaId: disciplinas[0].id,
          tipoNota: 'EXAME_FINAL',
          valor: 16.0,
          peso: 0.4,
          dataAvaliacao: new Date('2024-12-20'),
          observacoes: 'Bom desempenho no exame final'
        }
      })
    ]);

    logger.info(`✅ ${notas.length} notas criadas`);

    // Criar algumas notificações
    const notificacoes = await Promise.all([
      prisma.notificacao.create({
        data: {
          usuarioId: users[3].id,
          titulo: 'Nova nota disponível',
          mensagem: 'A nota do teste 1 de Introdução à Programação está disponível.',
          tipo: 'NOTA',
          lida: false,
          dataEnvio: new Date()
        }
      }),

      prisma.notificacao.create({
        data: {
          usuarioId: users[4].id,
          titulo: 'Lembrete de inscrição',
          mensagem: 'As inscrições para o 2º semestre abrem em breve.',
          tipo: 'INSCRICAO',
          lida: false,
          dataEnvio: new Date()
        }
      })
    ]);

    logger.info(`✅ ${notificacoes.length} notificações criadas`);

    logger.info('🎉 Seed da base de dados concluído com sucesso!');
    logger.info('📋 Dados de acesso:');
    logger.info('👤 Admin: admin@ulstp.ac.st / 123456');
    logger.info('👨‍🏫 Professor: maria.silva@ulstp.ac.st / 123456');
    logger.info('👩‍🎓 Estudante: ana.costa@estudante.ulstp.ac.st / 123456');

  } catch (error) {
    logger.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
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