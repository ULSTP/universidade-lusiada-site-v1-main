-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'PROFESSOR', 'ESTUDANTE', 'FUNCIONARIO');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ATIVO', 'INATIVO', 'SUSPENSO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('LICENCIATURA', 'MESTRADO', 'DOUTORAMENTO', 'ESPECIALIZACAO', 'TECNOLOGO');

-- CreateEnum
CREATE TYPE "MatriculaStatus" AS ENUM ('ATIVA', 'CANCELADA', 'TRANCADA', 'CONCLUIDA', 'TRANSFERIDA');

-- CreateEnum
CREATE TYPE "InscricaoStatus" AS ENUM ('ATIVA', 'APROVADO', 'REPROVADO', 'CANCELADA', 'TRANCADA');

-- CreateEnum
CREATE TYPE "TipoNota" AS ENUM ('PROVA', 'TRABALHO', 'PROJETO', 'PARTICIPACAO', 'EXAME_FINAL', 'OUTRO');

-- CreateEnum
CREATE TYPE "PresencaStatus" AS ENUM ('PRESENTE', 'AUSENTE', 'ATRASO', 'JUSTIFICADO');

-- CreateEnum
CREATE TYPE "PropinaStatus" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO', 'ISENTO');

-- CreateEnum
CREATE TYPE "MetodoPagamento" AS ENUM ('DINHEIRO', 'TRANSFERENCIA', 'CARTAO', 'CHEQUE', 'BOLETO', 'PIX', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoNotificacao" AS ENUM ('SISTEMA', 'ACADEMICO', 'FINANCEIRO', 'EVENTO', 'AVISO', 'EMERGENCIA');

-- CreateEnum
CREATE TYPE "PrioridadeNotificacao" AS ENUM ('BAIXA', 'NORMAL', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('HISTORICO', 'DECLARACAO', 'CERTIFICADO', 'DIPLOMA', 'COMPROVANTE_MATRICULA', 'COMPROVANTE_PAGAMENTO', 'IDENTIDADE_ESTUDANTIL', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusDocumento" AS ENUM ('ATIVO', 'ARQUIVADO', 'EXPIRADO');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "StatusHorario" AS ENUM ('ATIVO', 'CANCELADO', 'SUSPENSO', 'CONCLUIDO');

-- CreateEnum
CREATE TYPE "TipoSala" AS ENUM ('AULA_COMUM', 'LABORATORIO', 'AUDITORIO', 'BIBLIOTECA', 'SALA_CONFERENCIA', 'GINASIO');

-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('PERIODO_LETIVO', 'FERIAS', 'PROVA', 'FERIADO', 'EVENTO_ACADEMICO', 'MANUTENCAO');

-- CreateEnum
CREATE TYPE "TipoConflito" AS ENUM ('PROFESSOR_SOBREPOSICAO', 'SALA_SOBREPOSICAO', 'CAPACIDADE_EXCEDIDA', 'HORARIO_INDISPONIVEL');

-- CreateEnum
CREATE TYPE "Severidade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT,
    "tipo_usuario" "UserType" NOT NULL,
    "estado" "UserStatus" NOT NULL DEFAULT 'ATIVO',
    "genero" "Gender",
    "data_nascimento" TIMESTAMP(3),
    "telefone" TEXT,
    "avatar" TEXT,
    "numero_estudante" TEXT,
    "numero_funcionario" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "departamentos" (
    "id_departamento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "codigo" TEXT NOT NULL,
    "chefe_departamento" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id_departamento")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id_curso" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "codigo" TEXT NOT NULL,
    "nivel" "CourseLevel" NOT NULL,
    "duracao_anos" INTEGER NOT NULL,
    "duracao_semestres" INTEGER NOT NULL,
    "creditos_minimos" INTEGER NOT NULL,
    "coordenador_id" TEXT,
    "id_departamento" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id_curso")
);

-- CreateTable
CREATE TABLE "disciplinas" (
    "id_disciplina" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "codigo" TEXT NOT NULL,
    "carga_horaria" INTEGER NOT NULL,
    "creditos" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,
    "ano_letivo" INTEGER NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,
    "pre_requisitos" TEXT[],
    "id_curso" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id_disciplina")
);

-- CreateTable
CREATE TABLE "turmas" (
    "id_turma" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "id_curso" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,
    "ano_letivo" INTEGER NOT NULL,
    "max_estudantes" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id_turma")
);

-- CreateTable
CREATE TABLE "turma_disciplinas" (
    "id_turma_disciplina" TEXT NOT NULL,
    "id_turma" TEXT NOT NULL,
    "id_disciplina" TEXT NOT NULL,
    "id_professor" TEXT NOT NULL,
    "sala" TEXT,
    "dia_semana" INTEGER NOT NULL,
    "horario_inicio" TEXT NOT NULL,
    "horario_fim" TEXT NOT NULL,
    "ano_letivo" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "turma_disciplinas_pkey" PRIMARY KEY ("id_turma_disciplina")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id_matricula" TEXT NOT NULL,
    "numero_matricula" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_turma" TEXT NOT NULL,
    "id_curso" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,
    "ano_letivo" INTEGER NOT NULL,
    "data_matricula" TIMESTAMP(3) NOT NULL,
    "estado" "MatriculaStatus" NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id_matricula")
);

-- CreateTable
CREATE TABLE "inscricoes" (
    "id_inscricao" TEXT NOT NULL,
    "id_matricula" TEXT NOT NULL,
    "id_disciplina" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "data_inscricao" TIMESTAMP(3) NOT NULL,
    "estado" "InscricaoStatus" NOT NULL,
    "nota_final" DOUBLE PRECISION,
    "creditos" INTEGER,
    "observacoes" TEXT,

    CONSTRAINT "inscricoes_pkey" PRIMARY KEY ("id_inscricao")
);

-- CreateTable
CREATE TABLE "notas" (
    "id_nota" TEXT NOT NULL,
    "id_inscricao" TEXT,
    "id_disciplina" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "tipo" "TipoNota" NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "data_avaliacao" TIMESTAMP(3) NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "notas_pkey" PRIMARY KEY ("id_nota")
);

-- CreateTable
CREATE TABLE "presencas" (
    "id_presenca" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_disciplina" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "status" "PresencaStatus" NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "presencas_pkey" PRIMARY KEY ("id_presenca")
);

-- CreateTable
CREATE TABLE "propinas" (
    "id_propina" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "mes_referencia" INTEGER NOT NULL,
    "ano_referencia" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "valor_desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valor_multa" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valor_total" DECIMAL(10,2) NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL,
    "estado" "PropinaStatus" NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "propinas_pkey" PRIMARY KEY ("id_propina")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id_pagamento" TEXT NOT NULL,
    "id_propina" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "numero_recibo" TEXT NOT NULL,
    "data_pagamento" TIMESTAMP(3) NOT NULL,
    "valor_pago" DECIMAL(10,2) NOT NULL,
    "metodo_pagamento" "MetodoPagamento" NOT NULL,
    "referencia" TEXT,
    "observacoes" TEXT,
    "processado_por" TEXT,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id_pagamento")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id_notificacao" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tipo" "TipoNotificacao" NOT NULL,
    "prioridade" "PrioridadeNotificacao" NOT NULL DEFAULT 'NORMAL',
    "id_usuario" TEXT,
    "tipo_usuario" "UserType",
    "global" BOOLEAN NOT NULL DEFAULT false,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "data_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_leitura" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "link" TEXT,
    "metadados" JSONB,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id_notificacao")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id_documento" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoDocumento" NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "arquivo" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "status" "StatusDocumento" NOT NULL DEFAULT 'ATIVO',
    "publico" BOOLEAN NOT NULL DEFAULT false,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id_documento")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id_horario" TEXT NOT NULL,
    "disciplina_id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "sala_id" TEXT NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "hora_fim" TEXT NOT NULL,
    "duracao_minutos" INTEGER NOT NULL,
    "ano_letivo" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3) NOT NULL,
    "recorrente" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "status_horario" "StatusHorario" NOT NULL DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id_horario")
);

-- CreateTable
CREATE TABLE "salas" (
    "id_sala" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "nome" TEXT,
    "tipo_sala" "TipoSala" NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "localizacao" TEXT,
    "equipamentos" TEXT[],
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("id_sala")
);

-- CreateTable
CREATE TABLE "calendario_academico" (
    "id_evento" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo_evento" "TipoEvento" NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3) NOT NULL,
    "hora_inicio" TEXT,
    "hora_fim" TEXT,
    "dia_inteiro" BOOLEAN NOT NULL DEFAULT false,
    "ano_letivo" INTEGER NOT NULL,
    "semestre" INTEGER,
    "recorrente" BOOLEAN NOT NULL DEFAULT false,
    "cor" TEXT,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendario_academico_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "conflitos_horario" (
    "id_conflito" TEXT NOT NULL,
    "horario_id" TEXT NOT NULL,
    "sala_id" TEXT,
    "tipo_conflito" "TipoConflito" NOT NULL,
    "descricao" TEXT NOT NULL,
    "severidade" "Severidade" NOT NULL DEFAULT 'MEDIA',
    "resolvido" BOOLEAN NOT NULL DEFAULT false,
    "resolucao" TEXT,
    "data_deteccao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_resolucao" TIMESTAMP(3),
    "resolvido_por" TEXT,

    CONSTRAINT "conflitos_horario_pkey" PRIMARY KEY ("id_conflito")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_numero_estudante_key" ON "usuarios"("numero_estudante");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_numero_funcionario_key" ON "usuarios"("numero_funcionario");

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_nome_key" ON "departamentos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_codigo_key" ON "departamentos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_codigo_key" ON "cursos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "disciplinas_codigo_key" ON "disciplinas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "turmas_codigo_key" ON "turmas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "turma_disciplinas_id_turma_id_disciplina_ano_letivo_semestr_key" ON "turma_disciplinas"("id_turma", "id_disciplina", "ano_letivo", "semestre");

-- CreateIndex
CREATE UNIQUE INDEX "matriculas_numero_matricula_key" ON "matriculas"("numero_matricula");

-- CreateIndex
CREATE UNIQUE INDEX "matriculas_id_usuario_id_curso_ano_letivo_key" ON "matriculas"("id_usuario", "id_curso", "ano_letivo");

-- CreateIndex
CREATE UNIQUE INDEX "inscricoes_id_matricula_id_disciplina_key" ON "inscricoes"("id_matricula", "id_disciplina");

-- CreateIndex
CREATE UNIQUE INDEX "presencas_id_usuario_id_disciplina_data_key" ON "presencas"("id_usuario", "id_disciplina", "data");

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_numero_recibo_key" ON "pagamentos"("numero_recibo");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_disciplina_id_professor_id_sala_id_dia_semana_hora_key" ON "horarios"("disciplina_id", "professor_id", "sala_id", "dia_semana", "hora_inicio", "ano_letivo", "semestre");

-- CreateIndex
CREATE UNIQUE INDEX "salas_numero_key" ON "salas"("numero");

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamentos"("id_departamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_coordenador_id_fkey" FOREIGN KEY ("coordenador_id") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplinas" ADD CONSTRAINT "disciplinas_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "cursos"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "cursos"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_disciplinas" ADD CONSTRAINT "turma_disciplinas_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "disciplinas"("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_disciplinas" ADD CONSTRAINT "turma_disciplinas_id_turma_fkey" FOREIGN KEY ("id_turma") REFERENCES "turmas"("id_turma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_disciplinas" ADD CONSTRAINT "turma_disciplinas_id_professor_fkey" FOREIGN KEY ("id_professor") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_id_turma_fkey" FOREIGN KEY ("id_turma") REFERENCES "turmas"("id_turma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "cursos"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscricoes" ADD CONSTRAINT "inscricoes_id_matricula_fkey" FOREIGN KEY ("id_matricula") REFERENCES "matriculas"("id_matricula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscricoes" ADD CONSTRAINT "inscricoes_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "disciplinas"("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscricoes" ADD CONSTRAINT "inscricoes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas" ADD CONSTRAINT "notas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas" ADD CONSTRAINT "notas_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "disciplinas"("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presencas" ADD CONSTRAINT "presencas_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "disciplinas"("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propinas" ADD CONSTRAINT "propinas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_id_propina_fkey" FOREIGN KEY ("id_propina") REFERENCES "propinas"("id_propina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "disciplinas"("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "salas"("id_sala") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conflitos_horario" ADD CONSTRAINT "conflitos_horario_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "horarios"("id_horario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conflitos_horario" ADD CONSTRAINT "conflitos_horario_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "salas"("id_sala") ON DELETE SET NULL ON UPDATE CASCADE;
