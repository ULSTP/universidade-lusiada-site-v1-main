"use client"

import React, { useState } from 'react';
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Download,
  Eye,
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Filter,
  Search,
  AlertTriangle
} from 'lucide-react';
import HistoricoAcademico from './components/HistoricoAcademico';
import ProgressoCurso from './components/ProgressoCurso';
import DisciplinasAtuais from './components/DisciplinasAtuais';

const AcademicoPage = () => {
  const [selectedSemestre, setSelectedSemestre] = useState("2024.1");

  // Dados do progresso do curso
  const dadosProgresso = {
    curso: "Engenharia Informática",
    creditosTotais: 240,
    creditosConcluidos: 120,
    disciplinasTotais: 48,
    disciplinasConcluidas: 24,
    semestreAtual: 5,
    semestresTotais: 10
  };

  // Dados das disciplinas atuais
  const disciplinasAtuais = [
    {
      id: 1,
      nome: "Programação Web",
      codigo: "INF301",
      professor: "Prof. Dr. Carlos Silva",
      creditos: 4,
      horario: "Seg/Qua 14:00-16:00",
      sala: "Lab 3",
      notas: {
        av1: 8.5,
        av2: null,
        trabalho: 9.0,
        final: null
      },
      frequencia: 90,
      status: "Cursando",
      proximaAula: "Segunda-feira, 14:00"
    },
    {
      id: 2,
      nome: "Banco de Dados II",
      codigo: "INF302",
      professor: "Profa. Ana Santos",
      creditos: 6,
      horario: "Ter/Qui 08:00-10:00",
      sala: "Lab 2",
      notas: {
        av1: 7.8,
        av2: null,
        trabalho: 8.5,
        final: null
      },
      frequencia: 85,
      status: "Cursando",
      proximaAula: "Terça-feira, 08:00"
    },
    {
      id: 3,
      nome: "Redes de Computadores",
      codigo: "INF303",
      professor: "Prof. João Costa",
      creditos: 4,
      horario: "Qua/Sex 10:00-12:00",
      sala: "Lab 1",
      notas: {
        av1: 6.5,
        av2: null,
        trabalho: null,
        final: null
      },
      frequencia: 70,
      status: "Cursando",
      proximaAula: "Quarta-feira, 10:00"
    }
  ];

  const semestres = ["2024.1", "2023.2", "2023.1", "2022.2"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a 
                href="/portal-aluno" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao Portal
              </a>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">Área Acadêmica</h1>
                <p className="text-sm text-gray-600">Consulte suas notas, frequência e desempenho</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedSemestre}
                onChange={(e) => setSelectedSemestre(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-lusiada-blue-500 focus:border-transparent"
              >
                {semestres.map((sem) => (
                  <option key={sem} value={sem}>Semestre {sem}</option>
                ))}
              </select>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Boletim PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="disciplinas" className="space-y-6">
          <TabsList className="bg-white p-1 border">
            <TabsTrigger value="disciplinas" className="data-[state=active]:bg-lusiada-blue-50">
              Disciplinas Atuais
            </TabsTrigger>
            <TabsTrigger value="progresso" className="data-[state=active]:bg-lusiada-blue-50">
              Progresso do Curso
            </TabsTrigger>
            <TabsTrigger value="historico" className="data-[state=active]:bg-lusiada-blue-50">
              Histórico Acadêmico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disciplinas" className="mt-6">
            <DisciplinasAtuais disciplinas={disciplinasAtuais} />
          </TabsContent>

          <TabsContent value="progresso" className="mt-6">
            <ProgressoCurso {...dadosProgresso} />
          </TabsContent>

          <TabsContent value="historico" className="mt-6">
            <HistoricoAcademico />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AcademicoPage;