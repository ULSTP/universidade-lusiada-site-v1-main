import { PrismaClient } from '@prisma/client';
import { CreateGradeData, UpdateGradeData, GradeFilters, CreateBulkGradesData } from '../types/grade';

export class GradeRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateGradeData) {
    return this.prisma.nota.create({
      data: {
        estudanteId: data.estudanteId,
        disciplinaId: data.disciplinaId,
        avaliacaoId: data.avaliacaoId,
        tipoAvaliacao: data.tipoAvaliacao,
        nome: data.nome,
        nota: data.nota,
        peso: data.peso,
        dataAvaliacao: data.dataAvaliacao,
        observacoes: data.observacoes,
        periodo: data.periodo,
        anoLetivo: data.anoLetivo,
        semestre: data.semestre,
        status: 'ATIVO',
      },
      include: {
        estudante: {
          select: {
            id: true,
            nome: true,
            email: true,
            numeroEstudante: true,
          },
        },
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            creditos: true,
            curso: {
              select: {
                id: true,
                nome: true,
                codigo: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.nota.findUnique({
      where: { id },
      include: {
        estudante: {
          select: {
            id: true,
            nome: true,
            email: true,
            numeroEstudante: true,
          },
        },
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            creditos: true,
            curso: {
              select: {
                id: true,
                nome: true,
                codigo: true,
              },
            },
          },
        },
      },
    });
  }

  async findMany(filters: GradeFilters) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        {
          estudante: {
            nome: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          estudante: {
            numeroEstudante: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          disciplina: {
            nome: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          disciplina: {
            codigo: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          nome: { contains: filters.search, mode: 'insensitive' },
        },
      ];
    }

    if (filters.estudanteId) {
      where.estudanteId = filters.estudanteId;
    }

    if (filters.disciplinaId) {
      where.disciplinaId = filters.disciplinaId;
    }

    if (filters.avaliacaoId) {
      where.avaliacaoId = filters.avaliacaoId;
    }

    if (filters.tipoAvaliacao) {
      where.tipoAvaliacao = filters.tipoAvaliacao;
    }

    if (filters.periodo) {
      where.periodo = filters.periodo;
    }

    if (filters.anoLetivo) {
      where.anoLetivo = filters.anoLetivo;
    }

    if (filters.semestre) {
      where.semestre = filters.semestre;
    }

    if (filters.notaMinima !== undefined) {
      where.nota = { ...where.nota, gte: filters.notaMinima };
    }

    if (filters.notaMaxima !== undefined) {
      where.nota = { ...where.nota, lte: filters.notaMaxima };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const [grades, total] = await Promise.all([
      this.prisma.nota.findMany({
        where,
        include: {
          estudante: {
            select: {
              id: true,
              nome: true,
              email: true,
              numeroEstudante: true,
            },
          },
          disciplina: {
            select: {
              id: true,
              codigo: true,
              nome: true,
              creditos: true,
              curso: {
                select: {
                  id: true,
                  nome: true,
                  codigo: true,
                },
              },
            },
          },
        },
        orderBy: filters.ordenacao || { dataAvaliacao: 'desc' },
        skip: filters.skip,
        take: filters.take,
      }),
      this.prisma.nota.count({ where }),
    ]);

    return { grades, total };
  }

  async update(id: string, data: UpdateGradeData) {
    return this.prisma.nota.update({
      where: { id },
      data: {
        ...(data.nota !== undefined && { nota: data.nota }),
        ...(data.peso !== undefined && { peso: data.peso }),
        ...(data.observacoes !== undefined && { observacoes: data.observacoes }),
        ...(data.dataAvaliacao && { dataAvaliacao: data.dataAvaliacao }),
        ...(data.status && { status: data.status }),
      },
      include: {
        estudante: {
          select: {
            id: true,
            nome: true,
            email: true,
            numeroEstudante: true,
          },
        },
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            creditos: true,
            curso: {
              select: {
                id: true,
                nome: true,
                codigo: true,
              },
            },
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.nota.delete({
      where: { id },
    });
  }

  async createBulk(data: CreateBulkGradesData) {
    const gradesData = data.notas.map(nota => ({
      estudanteId: nota.estudanteId,
      disciplinaId: data.disciplinaId,
      avaliacaoId: data.avaliacaoId,
      tipoAvaliacao: data.tipoAvaliacao,
      nome: data.nome,
      nota: nota.nota,
      peso: data.peso,
      dataAvaliacao: data.dataAvaliacao,
      observacoes: nota.observacoes,
      periodo: data.periodo,
      anoLetivo: data.anoLetivo,
      semestre: data.semestre,
      status: 'ATIVO' as const,
    }));

    return this.prisma.nota.createMany({
      data: gradesData,
    });
  }

  async getStudentGrades(estudanteId: string, disciplinaId: string, periodo: string) {
    const grades = await this.prisma.nota.findMany({
      where: {
        estudanteId,
        disciplinaId,
        periodo,
        status: 'ATIVO',
      },
      include: {
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            creditos: true,
          },
        },
      },
      orderBy: { dataAvaliacao: 'asc' },
    });

    // Calcular nota final
    const totalPeso = grades.reduce((sum, grade) => sum + grade.peso, 0);
    const notaPonderada = grades.reduce((sum, grade) => sum + (grade.nota * grade.peso), 0);
    const notaFinal = totalPeso > 0 ? notaPonderada / totalPeso : undefined;

    // Determinar status
    let status: 'APROVADO' | 'REPROVADO' | 'EM_ANDAMENTO' = 'EM_ANDAMENTO';
    const mediaMinima = 10; // Pode ser configurável
    
    if (totalPeso >= 1.0) { // Todas as avaliações foram feitas
      status = notaFinal && notaFinal >= mediaMinima ? 'APROVADO' : 'REPROVADO';
    }

    return {
      estudanteId,
      disciplinaId,
      periodo,
      avaliacoes: grades,
      notaFinal,
      status,
      mediaMinima,
      totalPesoAvaliacoes: totalPeso,
      avaliacoesPendentes: totalPeso < 1.0 ? ['Avaliações pendentes'] : [],
    };
  }

  async getSubjectGradesReport(disciplinaId: string, periodo: string) {
    // Buscar todos os estudantes inscritos na disciplina
    const inscricoes = await this.prisma.inscricao.findMany({
      where: {
        disciplinaId,
        periodo,
        status: 'APROVADA',
      },
      include: {
        estudante: {
          select: {
            id: true,
            nome: true,
            numeroEstudante: true,
          },
        },
      },
    });

    // Buscar todas as notas da disciplina no período
    const allGrades = await this.prisma.nota.findMany({
      where: {
        disciplinaId,
        periodo,
        status: 'ATIVO',
      },
      include: {
        estudante: {
          select: {
            id: true,
            nome: true,
            numeroEstudante: true,
          },
        },
      },
    });

    // Agrupar notas por estudante
    const gradesByStudent = allGrades.reduce((acc, grade) => {
      if (!acc[grade.estudanteId]) {
        acc[grade.estudanteId] = [];
      }
      acc[grade.estudanteId].push(grade);
      return acc;
    }, {} as Record<string, any[]>);

    // Calcular estatísticas para cada estudante
    const estudantes = inscricoes.map(inscricao => {
      const studentGrades = gradesByStudent[inscricao.estudanteId] || [];
      const totalPeso = studentGrades.reduce((sum, grade) => sum + grade.peso, 0);
      const notaPonderada = studentGrades.reduce((sum, grade) => sum + (grade.nota * grade.peso), 0);
      const notaFinal = totalPeso > 0 ? notaPonderada / totalPeso : undefined;
      
      let status = 'EM_ANDAMENTO';
      if (totalPeso >= 1.0) {
        status = notaFinal && notaFinal >= 10 ? 'APROVADO' : 'REPROVADO';
      }

      return {
        estudante: inscricao.estudante,
        notaFinal,
        status,
        totalAvaliacoes: studentGrades.length,
      };
    });

    // Calcular estatísticas gerais
    const notasFinais = estudantes
      .filter(e => e.notaFinal !== undefined)
      .map(e => e.notaFinal!);

    const totalEstudantes = estudantes.length;
    const aprovados = estudantes.filter(e => e.status === 'APROVADO').length;
    const reprovados = estudantes.filter(e => e.status === 'REPROVADO').length;
    const emAndamento = estudantes.filter(e => e.status === 'EM_ANDAMENTO').length;

    const mediaGeral = notasFinais.length > 0 
      ? notasFinais.reduce((sum, nota) => sum + nota, 0) / notasFinais.length 
      : 0;

    const notaMaisAlta = notasFinais.length > 0 ? Math.max(...notasFinais) : 0;
    const notaMaisBaixa = notasFinais.length > 0 ? Math.min(...notasFinais) : 0;

    // Distribuição de notas
    const distribuicaoNotas = [
      { faixa: '0-5', quantidade: 0, percentual: 0 },
      { faixa: '6-9', quantidade: 0, percentual: 0 },
      { faixa: '10-13', quantidade: 0, percentual: 0 },
      { faixa: '14-16', quantidade: 0, percentual: 0 },
      { faixa: '17-20', quantidade: 0, percentual: 0 },
    ];

    notasFinais.forEach(nota => {
      if (nota <= 5) distribuicaoNotas[0].quantidade++;
      else if (nota <= 9) distribuicaoNotas[1].quantidade++;
      else if (nota <= 13) distribuicaoNotas[2].quantidade++;
      else if (nota <= 16) distribuicaoNotas[3].quantidade++;
      else distribuicaoNotas[4].quantidade++;
    });

    distribuicaoNotas.forEach(faixa => {
      faixa.percentual = notasFinais.length > 0 
        ? Math.round((faixa.quantidade / notasFinais.length) * 100) 
        : 0;
    });

    return {
      disciplinaId,
      periodo,
      totalEstudantes,
      aprovados,
      reprovados,
      emAndamento,
      mediaGeral: Math.round(mediaGeral * 100) / 100,
      notaMaisAlta,
      notaMaisBaixa,
      distribuicaoNotas,
      estudantes,
    };
  }

  async getStats() {
    const [
      total,
      porTipoAvaliacao,
      porPeriodo,
      porStatus,
      mediaGeral,
      distribuicaoNotas,
    ] = await Promise.all([
      this.prisma.nota.count(),
      this.prisma.nota.groupBy({
        by: ['tipoAvaliacao'],
        _count: { id: true },
      }),
      this.prisma.nota.groupBy({
        by: ['periodo'],
        _count: { id: true },
        orderBy: { periodo: 'desc' },
      }),
      this.prisma.nota.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.nota.aggregate({
        _avg: { nota: true },
      }),
      this.prisma.nota.findMany({
        select: { nota: true },
        where: { status: 'ATIVO' },
      }),
    ]);

    // Calcular distribuição de notas
    const notas = distribuicaoNotas.map(n => n.nota);
    const distribuicao = {
      '0-5': notas.filter(n => n <= 5).length,
      '6-9': notas.filter(n => n > 5 && n <= 9).length,
      '10-13': notas.filter(n => n > 9 && n <= 13).length,
      '14-16': notas.filter(n => n > 13 && n <= 16).length,
      '17-20': notas.filter(n => n > 16).length,
    };

    // Buscar disciplinas com maior média
    const disciplinasComMaiorMedia = await this.prisma.nota.groupBy({
      by: ['disciplinaId'],
      _avg: { nota: true },
      _count: { id: true },
      orderBy: { _avg: { nota: 'desc' } },
      take: 5,
    });

    const disciplinasIds = disciplinasComMaiorMedia.map(item => item.disciplinaId);
    const disciplinasDetalhes = await this.prisma.disciplina.findMany({
      where: { id: { in: disciplinasIds } },
      select: { id: true, codigo: true, nome: true },
    });

    const disciplinasComDetalhes = disciplinasComMaiorMedia.map(item => ({
      disciplina: disciplinasDetalhes.find(d => d.id === item.disciplinaId)!,
      media: Math.round((item._avg.nota || 0) * 100) / 100,
      totalAvaliacoes: item._count.id,
    }));

    // Calcular aprovações/reprovações
    const estudantesStats = await this.calculateStudentStats();

    return {
      total,
      porTipoAvaliacao: porTipoAvaliacao.reduce((acc, item) => {
        acc[item.tipoAvaliacao] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      porPeriodo: porPeriodo.reduce((acc, item) => {
        acc[item.periodo] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      porStatus: porStatus.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      mediaGeral: Math.round((mediaGeral._avg.nota || 0) * 100) / 100,
      aprovacoes: estudantesStats.aprovados,
      reprovacoes: estudantesStats.reprovados,
      emAndamento: estudantesStats.emAndamento,
      distribuicaoNotas: distribuicao,
      disciplinasComMaiorMedia: disciplinasComDetalhes,
    };
  }

  private async calculateStudentStats() {
    // Esta é uma implementação simplificada
    // Em produção, seria melhor criar uma view ou procedure para isso
    const inscricoes = await this.prisma.inscricao.findMany({
      where: { status: 'APROVADA' },
      select: {
        estudanteId: true,
        disciplinaId: true,
        periodo: true,
      },
    });

    let aprovados = 0;
    let reprovados = 0;
    let emAndamento = 0;

    for (const inscricao of inscricoes) {
      const summary = await this.getStudentGrades(
        inscricao.estudanteId,
        inscricao.disciplinaId,
        inscricao.periodo
      );

      if (summary.status === 'APROVADO') aprovados++;
      else if (summary.status === 'REPROVADO') reprovados++;
      else emAndamento++;
    }

    return { aprovados, reprovados, emAndamento };
  }

  async getStudentTranscript(estudanteId: string) {
    const estudante = await this.prisma.user.findUnique({
      where: { id: estudanteId },
      select: {
        id: true,
        nome: true,
        email: true,
        numeroEstudante: true,
      },
    });

    if (!estudante) return null;

    // Buscar todas as inscrições do estudante
    const inscricoes = await this.prisma.inscricao.findMany({
      where: {
        estudanteId,
        status: 'APROVADA',
      },
      include: {
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            creditos: true,
            semestre: true,
          },
        },
      },
      orderBy: [{ anoLetivo: 'asc' }, { semestre: 'asc' }],
    });

    const disciplinas = [];
    let creditosObtidos = 0;
    let creditosTotais = 0;
    let totalNotas = 0;
    let somaNotas = 0;

    for (const inscricao of inscricoes) {
      const summary = await this.getStudentGrades(
        estudanteId,
        inscricao.disciplinaId,
        inscricao.periodo
      );

      creditosTotais += inscricao.disciplina.creditos;
      if (summary.status === 'APROVADO') {
        creditosObtidos += inscricao.disciplina.creditos;
      }

      if (summary.notaFinal) {
        totalNotas++;
        somaNotas += summary.notaFinal;
      }

      disciplinas.push({
        disciplina: inscricao.disciplina,
        periodo: inscricao.periodo,
        avaliacoes: summary.avaliacoes,
        notaFinal: summary.notaFinal,
        status: summary.status,
        dataInscricao: inscricao.dataInscricao,
        dataAprovacao: summary.status === 'APROVADO' ? new Date() : undefined,
      });
    }

    const mediaGeral = totalNotas > 0 ? somaNotas / totalNotas : 0;
    const percentualConclusao = creditosTotais > 0 ? (creditosObtidos / creditosTotais) * 100 : 0;

    return {
      estudanteId,
      estudante,
      disciplinas,
      resumo: {
        totalDisciplinas: disciplinas.length,
        disciplinasAprovadas: disciplinas.filter(d => d.status === 'APROVADO').length,
        disciplinasReprovadas: disciplinas.filter(d => d.status === 'REPROVADO').length,
        disciplinasEmAndamento: disciplinas.filter(d => d.status === 'EM_ANDAMENTO').length,
        creditosObtidos,
        creditosTotais,
        mediaGeral: Math.round(mediaGeral * 100) / 100,
        percentualConclusao: Math.round(percentualConclusao),
      },
    };
  }

  async getTeacherDashboard(professorId: string, periodo: string) {
    // Buscar disciplinas do professor no período
    const disciplinas = await this.prisma.disciplina.findMany({
      where: {
        professorId,
        status: 'ATIVA',
      },
      select: {
        id: true,
        codigo: true,
        nome: true,
      },
    });

    const disciplinasData = [];
    let totalEstudantes = 0;
    let totalAvaliacoes = 0;
    let avaliacoesPendentes = 0;

    for (const disciplina of disciplinas) {
      const report = await this.getSubjectGradesReport(disciplina.id, periodo);
      
      disciplinasData.push({
        disciplina,
        totalEstudantes: report.totalEstudantes,
        avaliacoesLancadas: report.totalEstudantes * 3, // Exemplo: 3 avaliações por disciplina
        avaliacoesPendentes: Math.max(0, (report.totalEstudantes * 3) - totalAvaliacoes),
        mediaGeral: report.mediaGeral,
        aprovados: report.aprovados,
        reprovados: report.reprovados,
        emAndamento: report.emAndamento,
      });

      totalEstudantes += report.totalEstudantes;
    }

    return {
      professorId,
      periodo,
      disciplinas: disciplinasData,
      resumo: {
        totalDisciplinas: disciplinas.length,
        totalEstudantes,
        totalAvaliacoes,
        avaliacoesPendentes,
        mediaGeralTurmas: disciplinasData.length > 0 
          ? disciplinasData.reduce((sum, d) => sum + d.mediaGeral, 0) / disciplinasData.length 
          : 0,
      },
    };
  }
} 