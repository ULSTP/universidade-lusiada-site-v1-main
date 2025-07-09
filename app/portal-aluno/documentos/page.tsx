"use client"

import React, { useState } from 'react';
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Eye
} from 'lucide-react';

const DocumentosPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [newRequest, setNewRequest] = useState({
    tipo: "",
    finalidade: "",
    observacoes: ""
  });

  // Tipos de documentos disponíveis
  const tiposDocumentos = [
    {
      id: "declaracao_matricula",
      nome: "Declaração de Matrícula",
      descricao: "Comprova que o estudante está matriculado",
      prazo: "2 dias úteis",
      taxa: "Gratuito"
    },
    {
      id: "historico_escolar",
      nome: "Histórico Escolar",
      descricao: "Relação completa das disciplinas cursadas",
      prazo: "5 dias úteis",
      taxa: "5€"
    },
    {
      id: "certificado_conclusao",
      nome: "Certificado de Conclusão",
      descricao: "Documento de conclusão de curso",
      prazo: "10 dias úteis",
      taxa: "15€"
    },
    {
      id: "declaracao_frequencia",
      nome: "Declaração de Frequência",
      descricao: "Comprova a frequência às aulas",
      prazo: "3 dias úteis",
      taxa: "Gratuito"
    },
    {
      id: "carta_recomendacao",
      nome: "Carta de Recomendação",
      descricao: "Carta de recomendação acadêmica",
      prazo: "7 dias úteis",
      taxa: "10€"
    }
  ];

  // Solicitações em andamento
  const solicitacoes = [
    {
      id: "SOL001",
      tipo: "Declaração de Matrícula",
      dataSolicitacao: "2024-12-10",
      status: "concluido",
      prazoEstimado: "2024-12-12",
      finalidade: "Estágio curricular",
      observacoes: "Urgente para processo de estágio",
      linkDownload: "/documents/declaracao_001.pdf"
    },
    {
      id: "SOL002",
      tipo: "Histórico Escolar",
      dataSolicitacao: "2024-12-12",
      status: "processando",
      prazoEstimado: "2024-12-17",
      finalidade: "Candidatura a bolsa de estudos",
      observacoes: "Até 5º período"
    },
    {
      id: "SOL003",
      tipo: "Declaração de Frequência",
      dataSolicitacao: "2024-12-13",
      status: "pendente",
      prazoEstimado: "2024-12-16",
      finalidade: "Transporte público",
      observacoes: ""
    },
    {
      id: "SOL004",
      tipo: "Carta de Recomendação",
      dataSolicitacao: "2024-12-08",
      status: "rejeitado",
      prazoEstimado: "2024-12-15",
      finalidade: "Candidatura mestrado",
      observacoes: "Falta comprovante de pagamento",
      motivoRejeicao: "Documentação incompleta"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processando':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'pendente':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'rejeitado':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'processando':
        return 'Em Processamento';
      case 'pendente':
        return 'Pendente';
      case 'rejeitado':
        return 'Rejeitado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'processando':
        return 'bg-yellow-100 text-yellow-800';
      case 'pendente':
        return 'bg-blue-100 text-blue-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRequest.tipo && newRequest.finalidade) {
      console.log("Nova solicitação:", newRequest);
      setShowNewRequest(false);
      setNewRequest({ tipo: "", finalidade: "", observacoes: "" });
      // Aqui você adicionaria a lógica para enviar a solicitação
    }
  };

  const filteredSolicitacoes = solicitacoes.filter(sol => {
    const matchesSearch = sol.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sol.finalidade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "todos" || sol.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

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
                <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
                <p className="text-sm text-gray-600">Solicite e acompanhe seus documentos acadêmicos</p>
              </div>
            </div>
            
            <Button onClick={() => setShowNewRequest(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Solicitação
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Área principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filtros e busca */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por tipo de documento ou finalidade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-lusiada-blue-500 focus:border-transparent"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="pendente">Pendente</option>
                    <option value="processando">Em Processamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="rejeitado">Rejeitado</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Lista de solicitações */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="space-y-4">
                {filteredSolicitacoes.map((solicitacao) => (
                  <div 
                    key={solicitacao.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <h3 className="font-semibold text-gray-900">{solicitacao.tipo}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{solicitacao.finalidade}</p>
                        {solicitacao.observacoes && (
                          <p className="text-sm text-gray-500">{solicitacao.observacoes}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(solicitacao.status)}`}>
                          {getStatusText(solicitacao.status)}
                        </span>
                        {solicitacao.status === 'concluido' && (
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Solicitado em {new Date(solicitacao.dataSolicitacao).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Prazo: {new Date(solicitacao.prazoEstimado).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {solicitacao.status === 'rejeitado' && (
                        <div className="text-red-500">
                          {solicitacao.motivoRejeicao}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-lg shadow-sm p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-lg font-semibold mb-4">Tipos de Documentos</h2>
              <div className="space-y-4">
                {tiposDocumentos.map((tipo) => (
                  <div key={tipo.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{tipo.nome}</h3>
                    <p className="text-sm text-gray-600 mt-1">{tipo.descricao}</p>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <span>Prazo: {tipo.prazo}</span>
                      <span>Taxa: {tipo.taxa}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal de Nova Solicitação */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Nova Solicitação</h2>
                <button
                  onClick={() => setShowNewRequest(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleNewRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento
                  </label>
                  <select
                    value={newRequest.tipo}
                    onChange={(e) => setNewRequest({ ...newRequest, tipo: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-lusiada-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione um documento</option>
                    {tiposDocumentos.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Finalidade
                  </label>
                  <Input
                    type="text"
                    value={newRequest.finalidade}
                    onChange={(e) => setNewRequest({ ...newRequest, finalidade: e.target.value })}
                    placeholder="Ex: Candidatura a bolsa de estudos"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <Textarea
                    value={newRequest.observacoes}
                    onChange={(e) => setNewRequest({ ...newRequest, observacoes: e.target.value })}
                    placeholder="Informações adicionais relevantes"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewRequest(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Enviar Solicitação
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DocumentosPage;