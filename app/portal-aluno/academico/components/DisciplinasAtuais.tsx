import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface Disciplina {
  id: number;
  nome: string;
  codigo: string;
  professor: string;
  creditos: number;
  horario: string;
  sala: string;
  notas: {
    av1: number | null;
    av2: number | null;
    trabalho: number | null;
    final: number | null;
  };
  frequencia: number;
  status: string;
  proximaAula: string;
}

interface DisciplinasAtuaisProps {
  disciplinas: Disciplina[];
}

const DisciplinasAtuais = ({ disciplinas }: DisciplinasAtuaisProps) => {
  const calcularMedia = (notas: Disciplina['notas']) => {
    const notasValidas = Object.values(notas).filter(nota => nota !== null) as number[];
    return notasValidas.length > 0 ? 
      (notasValidas.reduce((acc, nota) => acc + nota, 0) / notasValidas.length).toFixed(1) : 
      '-';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'reprovado':
        return 'bg-red-100 text-red-800';
      case 'cursando':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Disciplinas do Semestre Atual</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {disciplinas.map((disciplina, index) => (
          <motion.div
            key={disciplina.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Informações Principais */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-lusiada-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{disciplina.nome}</h3>
                      <p className="text-sm text-gray-600">{disciplina.codigo} • {disciplina.creditos} créditos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{disciplina.professor}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{disciplina.horario}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Sala {disciplina.sala}</span>
                    </div>
                  </div>
                </div>

                {/* Status e Notas */}
                <div className="flex flex-col md:items-end space-y-2">
                  <Badge className={getStatusColor(disciplina.status)}>
                    {disciplina.status}
                  </Badge>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Média Atual</p>
                    <p className="text-2xl font-bold text-lusiada-blue-600">
                      {calcularMedia(disciplina.notas)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barra de Progresso e Frequência */}
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frequência</span>
                    <span className="font-medium">{disciplina.frequencia}%</span>
                  </div>
                  <Progress value={disciplina.frequencia} className="h-2" />
                  
                  {disciplina.frequencia < 75 && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Frequência abaixo do mínimo necessário (75%)</span>
                    </div>
                  )}
                </div>

                {/* Próxima Aula */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-lusiada-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Próxima Aula</p>
                    <p className="text-sm text-gray-600">{disciplina.proximaAula}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DisciplinasAtuais; 