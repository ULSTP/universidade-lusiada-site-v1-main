"use client"

import React, { useState } from 'react';
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  BookOpen
} from 'lucide-react';

const HorariosPage = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState('semanal'); // 'semanal' | 'mensal'

  // Dados das aulas
  const horarios = [
    {
      id: 1,
      disciplina: "Matemática I",
      professor: "Prof. Dr. Carlos Silva",
      sala: "Lab 101",
      dia: "Segunda",
      horarioInicio: "08:00",
      horarioFim: "10:00",
      tipo: "Teórica",
      color: "bg-blue-500"
    },
    {
      id: 2,
      disciplina: "Programação I",
      professor: "Prof. Ana Santos",
      sala: "Lab 205",
      dia: "Segunda",
      horarioInicio: "10:15",
      horarioFim: "12:15",
      tipo: "Prática",
      color: "bg-green-500"
    },
    {
      id: 3,
      disciplina: "Física I",
      professor: "Prof. João Costa",
      sala: "Sala 304",
      dia: "Terça",
      horarioInicio: "14:00",
      horarioFim: "16:00",
      tipo: "Teórica",
      color: "bg-purple-500"
    },
    {
      id: 4,
      disciplina: "Inglês Técnico",
      professor: "Prof. Maria Oliveira",
      sala: "Sala 102",
      dia: "Quarta",
      horarioInicio: "08:00",
      horarioFim: "09:30",
      tipo: "Teórica",
      color: "bg-yellow-500"
    },
    {
      id: 5,
      disciplina: "Algoritmos",
      professor: "Prof. Pedro Lima",
      sala: "Lab 207",
      dia: "Quinta",
      horarioInicio: "10:15",
      horarioFim: "12:15",
      tipo: "Prática",
      color: "bg-red-500"
    },
    {
      id: 6,
      disciplina: "Base de Dados",
      professor: "Prof. Rita Ferreira",
      sala: "Lab 203",
      dia: "Sexta",
      horarioInicio: "14:00",
      horarioFim: "17:00",
      tipo: "Prática",
      color: "bg-indigo-500"
    }
  ];

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const horariosGrid = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Eventos do calendário acadêmico
  const eventosAcademicos = [
    {
      data: "2024-12-20",
      evento: "Fim do Semestre 2024.1",
      tipo: "importante"
    },
    {
      data: "2025-01-15",
      evento: "Início das Inscrições",
      tipo: "info"
    },
    {
      data: "2025-02-01",
      evento: "Início do Semestre 2025.1",
      tipo: "importante"
    },
    {
      data: "2025-02-28",
      evento: "Carnaval - Sem aulas",
      tipo: "feriado"
    }
  ];

  const getAulasPorDia = (dia: string) => {
    return horarios.filter(horario => horario.dia === dia);
  };

  const formatarHorario = (inicio: string, fim: string) => {
    return `${inicio} - ${fim}`;
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Horários e Agenda</h1>
                <p className="text-sm text-gray-600">Gerir os seus horários de aulas e eventos acadêmicos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Área principal - Horário Semanal */}
          <div className="lg:col-span-3">
            {/* Controles de visualização */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Horário Semanal</h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'semanal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('semanal')}
                  >
                    Semanal
                  </Button>
                  <Button
                    variant={viewMode === 'mensal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('mensal')}
                  >
                    Mensal
                  </Button>
                </div>
              </div>

              {/* Grade de horários */}
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Cabeçalho da semana */}
                  <div className="grid grid-cols-6 gap-1 mb-4">
                    <div className="p-3 font-medium text-gray-500 text-sm">Horário</div>
                    {diasSemana.map((dia) => (
                      <div key={dia} className="p-3 font-medium text-gray-900 text-center bg-gray-50 rounded-lg">
                        {dia}
                      </div>
                    ))}
                  </div>

                  {/* Grade de horários */}
                  <div className="space-y-1">
                    {horariosGrid.map((hora) => (
                      <div key={hora} className="grid grid-cols-6 gap-1">
                        <div className="p-3 text-sm text-gray-500 font-medium border-r">
                          {hora}
                        </div>
                        {diasSemana.map((dia) => {
                          const aulasDoDia = getAulasPorDia(dia);
                          const aulaNoHorario = aulasDoDia.find(aula => 
                            aula.horarioInicio <= hora && aula.horarioFim > hora
                          );

                          return (
                            <div key={`${dia}-${hora}`} className="min-h-[60px] border rounded-lg">
                              {aulaNoHorario && (
                                <motion.div
                                  className={`${aulaNoHorario.color} text-white p-2 rounded-lg h-full flex flex-col justify-center text-xs`}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="font-semibold">{aulaNoHorario.disciplina}</div>
                                  <div className="flex items-center mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {aulaNoHorario.sala}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatarHorario(aulaNoHorario.horarioInicio, aulaNoHorario.horarioFim)}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Lista de disciplinas */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Disciplinas do Semestre</h3>
              <div className="space-y-3">
                {horarios.map((horario, index) => (
                  <motion.div
                    key={horario.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 ${horario.color} rounded-full`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{horario.disciplina}</h4>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {horario.professor}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {horario.sala}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            horario.tipo === 'Teórica' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {horario.tipo}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {horario.dia}, {formatarHorario(horario.horarioInicio, horario.horarioFim)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Calendário e Eventos */}
          <div className="space-y-6">
            {/* Próximas aulas */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Aulas</h3>
              <div className="space-y-3">
                {horarios.slice(0, 3).map((aula, index) => (
                  <div key={aula.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 ${aula.color} rounded-full flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{aula.disciplina}</p>
                      <p className="text-xs text-gray-500">{aula.sala} • {aula.horarioInicio}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Ver Todas
              </Button>
            </motion.div>

            {/* Calendário acadêmico */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendário Acadêmico</h3>
              <div className="space-y-3">
                {eventosAcademicos.map((evento, index) => (
                  <div key={index} className="border-l-4 border-lusiada-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{evento.evento}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        evento.tipo === 'importante' ? 'bg-red-100 text-red-800' :
                        evento.tipo === 'feriado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {evento.tipo}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{evento.data}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Calendário Completo
              </Button>
            </motion.div>

            {/* Estatísticas rápidas */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total de Disciplinas</span>
                  <span className="font-semibold text-lusiada-blue-600">{horarios.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Horas por Semana</span>
                  <span className="font-semibold text-lusiada-blue-600">24h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Aulas Práticas</span>
                  <span className="font-semibold text-green-600">
                    {horarios.filter(h => h.tipo === 'Prática').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Aulas Teóricas</span>
                  <span className="font-semibold text-blue-600">
                    {horarios.filter(h => h.tipo === 'Teórica').length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorariosPage; 