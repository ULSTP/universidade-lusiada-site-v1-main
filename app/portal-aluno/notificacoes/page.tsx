"use client"

import React, { useState } from 'react';
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ArrowLeft,
  Search,
  Filter,
  Trash2,
  MarkAsRead,
  Archive,
  Settings,
  Calendar,
  BookOpen,
  FileText,
  CreditCard,
  Users,
  Trophy
} from 'lucide-react';

const NotificacoesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todas");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Dados das notificações
  const [notificacoes, setNotificacoes] = useState([
    {
      id: "1",
      tipo: "academica",
      titulo: "Novas notas disponíveis",
      descricao: "As notas da disciplina Matemática I foram publicadas. Acesse a área acadêmica para visualizar.",
      data: "2024-12-15",
      hora: "14:30",
      lida: false,
      prioridade: "alta",
      icone: BookOpen,
      remetente: "Sistema Acadêmico"
    },
    {
      id: "2",
      tipo: "financeira",
      titulo: "Pagamento confirmado",
      descricao: "Seu pagamento da mensalidade de dezembro foi confirmado com sucesso.",
      data: "2024-12-14",
      hora: "10:15",
      lida: true,
      prioridade: "normal",
      icone: CreditCard,
      remetente: "Departamento Financeiro"
    },
    {
      id: "3",
      tipo: "administrativa",
      titulo: "Prazo para matrícula em disciplinas optativas",
      descricao: "Lembrete: O prazo para matrícula em disciplinas optativas termina em 3 dias.",
      data: "2024-12-13",
      hora: "09:00",
      lida: false,
      prioridade: "media",
      icone: Calendar,
      remetente: "Secretaria Acadêmica"
    },
    {
      id: "4",
      tipo: "documentos",
      titulo: "Documento pronto para retirada",
      descricao: "Sua declaração de matrícula está pronta. Protocolo: SOL001",
      data: "2024-12-12",
      hora: "16:45",
      lida: true,
      prioridade: "normal",
      icone: FileText,
      remetente: "Departamento de Documentos"
    },
    {
      id: "5",
      tipo: "eventos",
      titulo: "Inscrições abertas para Workshop",
      descricao: "Workshop de Desenvolvimento Web - Inscrições até 20 de dezembro. Vagas limitadas!",
      data: "2024-12-11",
      hora: "11:20",
      lida: false,
      prioridade: "baixa",
      icone: Users,
      remetente: "Centro de Eventos"
    },
    {
      id: "6",
      tipo: "academica",
      titulo: "Resultado da avaliação publicado",
      descricao: "O resultado da avaliação de Programação I foi publicado. Parabéns pelo excelente desempenho!",
      data: "2024-12-10",
      hora: "13:15",
      lida: true,
      prioridade: "alta",
      icone: Trophy,
      remetente: "Prof. Ana Santos"
    }
  ]);

  const tiposNotificacao = [
    { id: "todas", nome: "Todas", count: notificacoes.length },
    { id: "academica", nome: "Acadêmica", count: notificacoes.filter(n => n.tipo === "academica").length },
    { id: "financeira", nome: "Financeira", count: notificacoes.filter(n => n.tipo === "financeira").length },
    { id: "administrativa", nome: "Administrativa", count: notificacoes.filter(n => n.tipo === "administrativa").length },
    { id: "documentos", nome: "Documentos", count: notificacoes.filter(n => n.tipo === "documentos").length },
    { id: "eventos", nome: "Eventos", count: notificacoes.filter(n => n.tipo === "eventos").length }
  ];

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'border-l-red-500 bg-red-50/50';
      case 'media':
        return 'border-l-yellow-500 bg-yellow-50/50';
      case 'baixa':
        return 'border-l-green-500 bg-green-50/50';
      default:
        return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotificacoes = notificacoes.filter(notif => {
    const matchesSearch = notif.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.remetente.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "todas" || notif.tipo === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleMarkAsRead = (id: string) => {
    setNotificacoes(prev => prev.map(notif => 
      notif.id === id ? { ...notif, lida: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotificacoes(prev => prev.map(notif => ({ ...notif, lida: true })));
  };

  const handleDelete = (id: string) => {
    setNotificacoes(prev => prev.filter(notif => notif.id !== id));
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredNotificacoes.map(n => n.id);
    setSelectedNotifications(
      selectedNotifications.length === allIds.length ? [] : allIds
    );
  };

  const countNaoLidas = notificacoes.filter(n => !n.lida).length;

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
                <h1 className="text-2xl font-bold text-gray-900">
                  Notificações
                  {countNaoLidas > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                      {countNaoLidas}
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-600">Gerir as suas notificações e alertas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Marcar Todas como Lidas
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filtros */}
          <div className="space-y-6">
            {/* Busca */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar notificações..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Filtros por tipo */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Tipo</h3>
              <div className="space-y-2">
                {tiposNotificacao.map((tipo) => (
                  <button
                    key={tipo.id}
                    onClick={() => setSelectedFilter(tipo.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedFilter === tipo.id 
                        ? 'bg-lusiada-blue-100 text-lusiada-blue-900' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{tipo.nome}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedFilter === tipo.id 
                        ? 'bg-lusiada-blue-200 text-lusiada-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tipo.count}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Estatísticas rápidas */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-semibold text-gray-900">{notificacoes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Não lidas</span>
                  <span className="font-semibold text-red-600">{countNaoLidas}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lidas</span>
                  <span className="font-semibold text-green-600">
                    {notificacoes.length - countNaoLidas}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Prioridade Alta</span>
                  <span className="font-semibold text-orange-600">
                    {notificacoes.filter(n => n.prioridade === 'alta').length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Área principal - Lista de notificações */}
          <div className="lg:col-span-3 space-y-6">
            {/* Controles de ação em massa */}
            {selectedNotifications.length > 0 && (
              <motion.div 
                className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-lusiada-blue-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedNotifications.length} notificação(ões) selecionada(s)
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Marcar como Lidas
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Archive className="w-4 h-4" />
                      Arquivar
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Cabeçalho da lista */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedFilter === "todas" ? "Todas as Notificações" : 
                   tiposNotificacao.find(t => t.id === selectedFilter)?.nome || "Notificações"}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSelectAll}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedNotifications.length === filteredNotificacoes.length && filteredNotificacoes.length > 0}
                      onChange={() => {}}
                      className="rounded"
                    />
                    Selecionar Todas
                  </Button>
                </div>
              </div>

              {/* Lista de notificações */}
              {filteredNotificacoes.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma notificação encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotificacoes.map((notificacao, index) => (
                    <motion.div
                      key={notificacao.id}
                      className={`border-l-4 rounded-lg p-6 transition-all hover:shadow-md cursor-pointer ${
                        notificacao.lida ? 'bg-white' : getPrioridadeColor(notificacao.prioridade)
                      } ${selectedNotifications.includes(notificacao.id) ? 'ring-2 ring-lusiada-blue-500' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      onClick={() => !notificacao.lida && handleMarkAsRead(notificacao.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notificacao.id)}
                          onChange={() => handleSelectNotification(notificacao.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 rounded"
                        />
                        
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            notificacao.lida ? 'bg-gray-100' : 'bg-lusiada-blue-100'
                          }`}>
                            <notificacao.icone className={`w-5 h-5 ${
                              notificacao.lida ? 'text-gray-500' : 'text-lusiada-blue-600'
                            }`} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className={`text-lg font-semibold ${
                                  notificacao.lida ? 'text-gray-700' : 'text-gray-900'
                                }`}>
                                  {notificacao.titulo}
                                </h3>
                                {!notificacao.lida && (
                                  <div className="w-2 h-2 bg-lusiada-blue-500 rounded-full"></div>
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  getPrioridadeBadge(notificacao.prioridade)
                                }`}>
                                  {notificacao.prioridade}
                                </span>
                              </div>
                              
                              <p className={`text-sm mb-3 leading-relaxed ${
                                notificacao.lida ? 'text-gray-600' : 'text-gray-800'
                              }`}>
                                {notificacao.descricao}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {notificacao.data} às {notificacao.hora}
                                </div>
                                <div className="flex items-center">
                                  <Bell className="w-3 h-3 mr-1" />
                                  {notificacao.remetente}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              {!notificacao.lida && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notificacao.id);
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Marcar como Lida
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notificacao.id);
                                }}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal de Configurações */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Configurações de Notificações</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Notificações por Email</h4>
                  <p className="text-sm text-gray-600">Receber notificações no seu email</p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Notificações Push</h4>
                  <p className="text-sm text-gray-600">Receber notificações no navegador</p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Notificações Acadêmicas</h4>
                  <p className="text-sm text-gray-600">Notas, frequência e avisos</p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Notificações Financeiras</h4>
                  <p className="text-sm text-gray-600">Pagamentos e mensalidades</p>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <Button className="flex-1">
                Salvar Configurações
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSettings(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NotificacoesPage;