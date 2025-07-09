"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { Calendar, Bell, Search, ChevronLeft, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Tooltip } from '@/components/Tooltip'

interface Aviso {
  id: number
  titulo: string
  conteudo: string
  data: string
  tipo: 'info' | 'alerta' | 'urgente'
  categoria: string
  expiraEm?: string
}

const avisosMock: Aviso[] = [
  {
    id: 1,
    titulo: "Inscrições Abertas para o 2º Semestre",
    conteudo: "As inscrições para o 2º semestre letivo de 2024 estão abertas. Os alunos devem realizar sua inscrição até o dia 30 de junho.",
    data: "2024-03-15",
    tipo: "info",
    categoria: "Acadêmico",
    expiraEm: "2024-06-30"
  },
  {
    id: 2,
    titulo: "Manutenção do Sistema Acadêmico",
    conteudo: "O sistema acadêmico estará indisponível para manutenção no dia 20 de março, das 22h às 02h do dia seguinte.",
    data: "2024-03-10",
    tipo: "alerta",
    categoria: "Sistema",
    expiraEm: "2024-03-21"
  },
  {
    id: 3,
    titulo: "Prazo Final para Entrega de Trabalhos",
    conteudo: "Lembramos que o prazo final para entrega dos trabalhos do 1º semestre é dia 15 de abril. Não haverá prorrogação.",
    data: "2024-03-05",
    tipo: "urgente",
    categoria: "Acadêmico",
    expiraEm: "2024-04-15"
  }
]

export default function AvisosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAviso, setSelectedAviso] = useState<Aviso | null>(null)
  const [selectedCategoria, setSelectedCategoria] = useState<string>('')
  const [selectedTipo, setSelectedTipo] = useState<string>('')

  const categorias = Array.from(new Set(avisosMock.map(aviso => aviso.categoria)))
  const tipos = ['info', 'alerta', 'urgente']

  const filteredAvisos = avisosMock.filter(aviso => {
    const matchesSearch = aviso.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         aviso.conteudo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategoria = !selectedCategoria || aviso.categoria === selectedCategoria
    const matchesTipo = !selectedTipo || aviso.tipo === selectedTipo
    return matchesSearch && matchesCategoria && matchesTipo
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'urgent':
        return <Bell className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1B3159] text-white py-16"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Avisos</h1>
          <p className="text-lg text-center text-gray-200">Fique por dentro das últimas informações</p>
        </div>
      </motion.div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs 
          items={[
            { label: 'Avisos', href: '/avisos' },
            selectedAviso ? { label: selectedAviso.titulo } : { label: 'Todos os Avisos' }
          ]} 
        />

        {selectedAviso ? (
          // Visualização de Aviso Individual
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Tooltip content="Voltar para a lista de avisos">
              <Button
                variant="ghost"
                className="mb-8"
                onClick={() => setSelectedAviso(null)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar para Avisos
              </Button>
            </Tooltip>

            <motion.article 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex items-center text-gray-500 mb-4"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(selectedAviso.data)}</span>
                  <span className="mx-2">•</span>
                  {getTipoIcon(selectedAviso.tipo)}
                  <span className="ml-2 capitalize">{selectedAviso.tipo}</span>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-3xl font-bold text-gray-900 mb-4"
                >
                  {selectedAviso.titulo}
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="prose max-w-none mb-6"
                >
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {selectedAviso.conteudo}
                  </p>
                </motion.div>
                {selectedAviso.expiraEm && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                  >
                    <p className="text-yellow-800">
                      Este aviso expira em {formatDate(selectedAviso.expiraEm)}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.article>
          </motion.div>
        ) : (
          // Lista de Avisos
          <>
            {/* Barra de Pesquisa e Filtros */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Tooltip content="Pesquise por título ou conteúdo do aviso">
                      <Input
                        type="text"
                        placeholder="Pesquisar avisos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Tooltip content="Mostrar todos os avisos">
                    <Button
                      variant={selectedCategoria === '' ? 'default' : 'outline'}
                      onClick={() => setSelectedCategoria('')}
                    >
                      Todos
                    </Button>
                  </Tooltip>
                  {categorias.map((categoria) => (
                    <Tooltip key={categoria} content={`Filtrar por ${categoria}`}>
                      <Button
                        variant={selectedCategoria === categoria ? 'default' : 'outline'}
                        onClick={() => setSelectedCategoria(categoria)}
                      >
                        {categoria}
                      </Button>
                    </Tooltip>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Tooltip content="Filtrar por tipo de aviso">
                    <Button
                      variant={selectedTipo === '' ? 'default' : 'outline'}
                      onClick={() => setSelectedTipo('')}
                    >
                      Todos os Tipos
                    </Button>
                  </Tooltip>
                  {tipos.map((tipo) => (
                    <Tooltip key={tipo} content={`Filtrar por ${tipo}`}>
                      <Button
                        variant={selectedTipo === tipo ? 'default' : 'outline'}
                        onClick={() => setSelectedTipo(tipo)}
                      >
                        {getTipoIcon(tipo)}
                        <span className="ml-2 capitalize">{tipo}</span>
                      </Button>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Lista de Avisos */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredAvisos.map((aviso) => (
                  <motion.article
                    key={aviso.id}
                    variants={itemVariants}
                    layout
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedAviso(aviso)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(aviso.data)}</span>
                        <span className="mx-2">•</span>
                        {getTipoIcon(aviso.tipo)}
                        <span className="ml-2 capitalize">{aviso.tipo}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {aviso.titulo}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {aviso.conteudo}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {aviso.categoria}
                        </span>
                        {aviso.expiraEm && (
                          <span className="text-sm text-gray-500">
                            Expira em {formatDate(aviso.expiraEm)}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredAvisos.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <p className="text-gray-500">Nenhum aviso encontrado.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 