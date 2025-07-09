import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  BookOpen,
  Clock,
  GraduationCap,
  Star
} from 'lucide-react';

interface ProgressoCursoProps {
  curso: string;
  creditosTotais: number;
  creditosConcluidos: number;
  disciplinasTotais: number;
  disciplinasConcluidas: number;
  semestreAtual: number;
  semestresTotais: number;
}

const ProgressoCurso = ({
  curso,
  creditosTotais,
  creditosConcluidos,
  disciplinasTotais,
  disciplinasConcluidas,
  semestreAtual,
  semestresTotais
}: ProgressoCursoProps) => {
  const calcularPorcentagem = (atual: number, total: number) => {
    return Math.round((atual / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{curso}</h2>
            <p className="text-sm text-gray-600">Progresso do Curso</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Créditos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Créditos</span>
                  </div>
                  <span className="text-sm font-bold">
                    {creditosConcluidos}/{creditosTotais}
                  </span>
                </div>
                <Progress
                  value={calcularPorcentagem(creditosConcluidos, creditosTotais)}
                  className="h-2"
                />
                <p className="text-xs text-gray-600">
                  {calcularPorcentagem(creditosConcluidos, creditosTotais)}% concluído
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Disciplinas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium">Disciplinas</span>
                  </div>
                  <span className="text-sm font-bold">
                    {disciplinasConcluidas}/{disciplinasTotais}
                  </span>
                </div>
                <Progress
                  value={calcularPorcentagem(disciplinasConcluidas, disciplinasTotais)}
                  className="h-2"
                />
                <p className="text-xs text-gray-600">
                  {calcularPorcentagem(disciplinasConcluidas, disciplinasTotais)}% concluído
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Semestres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Semestres</span>
                  </div>
                  <span className="text-sm font-bold">
                    {semestreAtual}/{semestresTotais}
                  </span>
                </div>
                <Progress
                  value={calcularPorcentagem(semestreAtual, semestresTotais)}
                  className="h-2"
                />
                <p className="text-xs text-gray-600">
                  {calcularPorcentagem(semestreAtual, semestresTotais)}% concluído
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Mensagem de Motivação */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              Continue assim! Você está fazendo um ótimo progresso no seu curso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressoCurso; 