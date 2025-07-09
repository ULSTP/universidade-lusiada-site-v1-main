const { PrismaClient } = require('../lib/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed da base de dados Supabase...\n');

  // 1. Criar Departamentos
  console.log('🏢 Criando departamentos...');
  const departamentos = await Promise.all([
    prisma.departamento.create({
      data: {
        nome: 'Engenharia e Tecnologia',
        descricao: 'Departamento responsável pelos cursos de engenharia e tecnologia'
      }
    }),
    prisma.departamento.create({
      data: {
        nome: 'Ciências Sociais e Humanas',
        descricao: 'Departamento de ciências sociais, humanas e comunicação'
      }
    }),
    prisma.departamento.create({
      data: {
        nome: 'Economia e Gestão',
        descricao: 'Departamento de economia, gestão e administração'
      }
    }),
    prisma.departamento.create({
      data: {
        nome: 'Direito',
        descricao: 'Departamento de ciências jurídicas'
      }
    })
  ]);
  console.log(`✅ ${departamentos.length} departamentos criados`);

  // 2. Criar Cursos
  console.log('\n📚 Criando cursos...');
  const cursos = await Promise.all([
    // Engenharia e Tecnologia
    prisma.curso.create({
      data: {
        nome: 'Engenharia Informática',
        descricao: 'Curso de licenciatura em Engenharia Informática',
        nivel: 'LICENCIATURA',
        duracaoAnos: 3,
        departamentoId: departamentos[0].id
      }
    }),
    prisma.curso.create({
      data: {
        nome: 'Engenharia Civil',
        descricao: 'Curso de licenciatura em Engenharia Civil',
        nivel: 'LICENCIATURA',
        duracaoAnos: 4,
        departamentoId: departamentos[0].id
      }
    }),
    // Ciências Sociais
    prisma.curso.create({
      data: {
        nome: 'Comunicação Social',
        descricao: 'Curso de licenciatura em Comunicação Social',
        nivel: 'LICENCIATURA',
        duracaoAnos: 3,
        departamentoId: departamentos[1].id
      }
    }),
    // Economia e Gestão
    prisma.curso.create({
      data: {
        nome: 'Gestão de Empresas',
        descricao: 'Curso de licenciatura em Gestão de Empresas',
        nivel: 'LICENCIATURA',
        duracaoAnos: 3,
        departamentoId: departamentos[2].id
      }
    }),
    prisma.curso.create({
      data: {
        nome: 'Economia',
        descricao: 'Curso de licenciatura em Economia',
        nivel: 'LICENCIATURA',
        duracaoAnos: 3,
        departamentoId: departamentos[2].id
      }
    }),
    // Direito
    prisma.curso.create({
      data: {
        nome: 'Direito',
        descricao: 'Curso de licenciatura em Direito',
        nivel: 'LICENCIATURA',
        duracaoAnos: 4,
        departamentoId: departamentos[3].id
      }
    }),
    // Mestrados
    prisma.curso.create({
      data: {
        nome: 'Mestrado em Gestão',
        descricao: 'Mestrado em Gestão de Empresas',
        nivel: 'MESTRADO',
        duracaoAnos: 2,
        departamentoId: departamentos[2].id
      }
    })
  ]);
  console.log(`✅ ${cursos.length} cursos criados`);

  // 3. Criar Disciplinas (exemplo para Engenharia Informática)
  console.log('\n📖 Criando disciplinas...');
  const disciplinas = await Promise.all([
    // 1º Ano - Engenharia Informática
    prisma.disciplina.create({
      data: {
        nome: 'Programação I',
        descricao: 'Introdução à programação',
        cargaHoraria: 60,
        semestre: 1,
        cursoId: cursos[0].id // Engenharia Informática
      }
    }),
    prisma.disciplina.create({
      data: {
        nome: 'Matemática I',
        descricao: 'Matemática para engenharia',
        cargaHoraria: 60,
        semestre: 1,
        cursoId: cursos[0].id
      }
    }),
    prisma.disciplina.create({
      data: {
        nome: 'Programação II',
        descricao: 'Programação orientada a objetos',
        cargaHoraria: 60,
        semestre: 2,
        cursoId: cursos[0].id
      }
    }),
    // Gestão de Empresas
    prisma.disciplina.create({
      data: {
        nome: 'Contabilidade Geral',
        descricao: 'Princípios de contabilidade',
        cargaHoraria: 45,
        semestre: 1,
        cursoId: cursos[3].id // Gestão de Empresas
      }
    }),
    prisma.disciplina.create({
      data: {
        nome: 'Marketing',
        descricao: 'Fundamentos de marketing',
        cargaHoraria: 45,
        semestre: 2,
        cursoId: cursos[3].id
      }
    })
  ]);
  console.log(`✅ ${disciplinas.length} disciplinas criadas`);

  // 4. Criar Utilizadores
  console.log('\n👥 Criando utilizadores...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const usuarios = await Promise.all([
    // Administrador
    prisma.user.create({
      data: {
        nome: 'José Administrador',
        email: 'admin@ulstp.ac.st',
        senha: hashedPassword,
        tipoUsuario: 'ADMIN',
        estado: 'ATIVO',
        genero: 'M',
        dataNascimento: new Date('1980-01-15'),
        telefone: '+239 999 0001'
      }
    }),
    // Professor
    prisma.user.create({
      data: {
        nome: 'Maria Silva',
        email: 'maria.silva@ulstp.ac.st',
        senha: hashedPassword,
        tipoUsuario: 'PROFESSOR',
        estado: 'ATIVO',
        genero: 'F',
        dataNascimento: new Date('1975-03-20'),
        telefone: '+239 999 0002'
      }
    }),
    // Estudantes
    prisma.user.create({
      data: {
        nome: 'João Santos',
        email: 'joao.santos@estudante.ulstp.ac.st',
        senha: hashedPassword,
        tipoUsuario: 'ESTUDANTE',
        estado: 'ATIVO',
        genero: 'M',
        dataNascimento: new Date('2000-05-10'),
        telefone: '+239 999 1001'
      }
    }),
    prisma.user.create({
      data: {
        nome: 'Ana Costa',
        email: 'ana.costa@estudante.ulstp.ac.st',
        senha: hashedPassword,
        tipoUsuario: 'ESTUDANTE',
        estado: 'ATIVO',
        genero: 'F',
        dataNascimento: new Date('1999-12-25'),
        telefone: '+239 999 1002'
      }
    }),
    prisma.user.create({
      data: {
        nome: 'Pedro Oliveira',
        email: 'pedro.oliveira@estudante.ulstp.ac.st',
        senha: hashedPassword,
        tipoUsuario: 'ESTUDANTE',
        estado: 'ATIVO',
        genero: 'M',
        dataNascimento: new Date('2001-08-15'),
        telefone: '+239 999 1003'
      }
    })
  ]);
  console.log(`✅ ${usuarios.length} utilizadores criados`);

  // 5. Criar Turmas
  console.log('\n🎓 Criando turmas...');
  const turmas = await Promise.all([
    prisma.turma.create({
      data: {
        cursoId: cursos[0].id, // Engenharia Informática
        ano: 2024,
        semestre: 1,
        descricao: 'Turma A - 1º Ano Eng. Informática'
      }
    }),
    prisma.turma.create({
      data: {
        cursoId: cursos[3].id, // Gestão de Empresas
        ano: 2024,
        semestre: 1,
        descricao: 'Turma A - 1º Ano Gestão'
      }
    })
  ]);
  console.log(`✅ ${turmas.length} turmas criadas`);

  // 6. Criar Matrículas
  console.log('\n📝 Criando matrículas...');
  const matriculas = await Promise.all([
    // João Santos - Engenharia Informática
    prisma.matricula.create({
      data: {
        usuarioId: usuarios[2].id, // João Santos
        turmaId: turmas[0].id,
        cursoId: cursos[0].id,
        ano: 2024,
        semestre: 1,
        dataMatricula: new Date('2024-09-01'),
        estado: 'ATIVA'
      }
    }),
    // Ana Costa - Gestão de Empresas
    prisma.matricula.create({
      data: {
        usuarioId: usuarios[3].id, // Ana Costa
        turmaId: turmas[1].id,
        cursoId: cursos[3].id,
        ano: 2024,
        semestre: 1,
        dataMatricula: new Date('2024-09-01'),
        estado: 'ATIVA'
      }
    }),
    // Pedro Oliveira - Engenharia Informática
    prisma.matricula.create({
      data: {
        usuarioId: usuarios[4].id, // Pedro Oliveira
        turmaId: turmas[0].id,
        cursoId: cursos[0].id,
        ano: 2024,
        semestre: 1,
        dataMatricula: new Date('2024-09-02'),
        estado: 'ATIVA'
      }
    })
  ]);
  console.log(`✅ ${matriculas.length} matrículas criadas`);

  // 7. Criar Propinas
  console.log('\n💰 Criando propinas...');
  const propinas = await Promise.all([
    prisma.propina.create({
      data: {
        usuarioId: usuarios[2].id, // João Santos
        periodo: '2024-1º Semestre',
        valor: 150000.00, // 1500 STN
        dataEmissao: new Date('2024-08-15'),
        estado: 'PENDENTE',
        multa: 0
      }
    }),
    prisma.propina.create({
      data: {
        usuarioId: usuarios[3].id, // Ana Costa
        periodo: '2024-1º Semestre',
        valor: 150000.00,
        dataEmissao: new Date('2024-08-15'),
        estado: 'PAGO',
        multa: 0
      }
    })
  ]);
  console.log(`✅ ${propinas.length} propinas criadas`);

  // 8. Criar Pagamento (exemplo)
  console.log('\n💳 Criando pagamentos...');
  const pagamentos = await Promise.all([
    prisma.pagamento.create({
      data: {
        propinaId: propinas[1].id, // Ana Costa
        dataPagamento: new Date('2024-09-01'),
        valorPago: 150000.00,
        metodoPagamento: 'TRANSFERENCIA',
        recibo: 'REC-2024-001'
      }
    })
  ]);
  console.log(`✅ ${pagamentos.length} pagamentos criados`);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📊 Resumo dos dados criados:');
  console.log(`• ${departamentos.length} Departamentos`);
  console.log(`• ${cursos.length} Cursos`);
  console.log(`• ${disciplinas.length} Disciplinas`);
  console.log(`• ${usuarios.length} Utilizadores`);
  console.log(`• ${turmas.length} Turmas`);
  console.log(`• ${matriculas.length} Matrículas`);
  console.log(`• ${propinas.length} Propinas`);
  console.log(`• ${pagamentos.length} Pagamentos`);

  console.log('\n👤 Contas de teste criadas:');
  console.log('📧 admin@ulstp.ac.st (Admin) - Senha: 123456');
  console.log('📧 maria.silva@ulstp.ac.st (Professor) - Senha: 123456');
  console.log('📧 joao.santos@estudante.ulstp.ac.st (Estudante) - Senha: 123456');
  console.log('📧 ana.costa@estudante.ulstp.ac.st (Estudante) - Senha: 123456');
  console.log('📧 pedro.oliveira@estudante.ulstp.ac.st (Estudante) - Senha: 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 