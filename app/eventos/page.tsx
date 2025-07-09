"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { Calendar, Clock, MapPin, Search, ChevronLeft, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Tooltip } from '@/components/Tooltip'

interface Evento {
  id: number
  titulo: string
  descricao: string
  data: string
  hora: string
  local: string
  categoria: string
  imagem: string
  vagas: number
  inscritos: number
}

const eventosMock: Evento[] = [
  {
    id: 1,
    titulo: "Palestra: Inteligência Artificial na Educação",
    descricao: "Uma palestra sobre como a IA está transformando o ensino superior e as oportunidades que isso traz para os estudantes.",
    data: "2024-04-15",
    hora: "14:00",
    local: "Auditório Principal",
    categoria: "Palestra",
    imagem: "/images/eventos/palestra-ia.jpg",
    vagas: 100,
    inscritos: 45
  },
  {
    id: 2,
    titulo: "Workshop de Programação Web",
    descricao: "Aprenda as tecnologias mais recentes em desenvolvimento web, incluindo React, Next.js e TypeScript.",
    data: "2024-04-20",
    hora: "09:00",
    local: "Laboratório de Informática",
    categoria: "Workshop",
    imagem: "/images/eventos/workshop-web.jpg",
    vagas: 30,
    inscritos: 28
  },
  {
    id: 3,
    titulo: "Feira de Carreiras 2024",
    descricao: "Encontre oportunidades de estágio e emprego com as principais empresas do país.",
    data: "2024-05-10",
    hora: "10:00",
    local: "Pátio Central",
    categoria: "Feira",
    imagem: "/images/eventos/feira-carreiras.jpg",
    vagas: 200,
    inscritos: 150
  }
]

export default function EventosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null)
  const [selectedCategoria, setSelectedCategoria] = useState<string>('')

  const categorias = Array.from(new Set(eventosMock.map(evento => evento.categoria)))

  const filteredEventos = eventosMock.filter(evento => {
    const matchesSearch = evento.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         evento.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategoria = !selectedCategoria || evento.categoria === selectedCategoria
    return matchesSearch && matchesCategoria
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getVagasDisponiveis = (evento: Evento) => {
    return evento.vagas - evento.inscritos
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
          <h1 className="text-4xl font-bold text-center mb-4">Eventos</h1>
          <p className="text-lg text-center text-gray-200">Participe dos eventos da ULSTP</p>
        </div>
      </motion.div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs 
          items={[
            { label: 'Eventos', href: '/eventos' },
            selectedEvento ? { label: selectedEvento.titulo } : { label: 'Todos os Eventos' }
          ]} 
        />

        {selectedEvento ? (
          // Visualização de Evento Individual
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Tooltip content="Voltar para a lista de eventos">
              <Button
                variant="ghost"
                className="mb-8"
                onClick={() => setSelectedEvento(null)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar para Eventos
              </Button>
            </Tooltip>

            <motion.article 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                src={selectedEvento.imagem}
                alt={selectedEvento.titulo}
                className="w-full h-96 object-cover"
              />
              <div className="p-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex items-center text-gray-500 mb-4"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(selectedEvento.data)}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{selectedEvento.hora}</span>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-3xl font-bold text-gray-900 mb-4"
                >
                  {selectedEvento.titulo}
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="prose max-w-none mb-6"
                >
                  <p className="text-gray-600 leading-relaxed">
                    {selectedEvento.descricao}
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-6 mb-8"
                >
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Local</p>
                      <p className="font-medium">{selectedEvento.local}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Vagas</p>
                      <p className="font-medium">
                        {getVagasDisponiveis(selectedEvento)} vagas disponíveis
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Tooltip content="Inscreva-se neste evento">
                    <Button className="w-full">
                      Inscrever-se no Evento
                    </Button>
                  </Tooltip>
                </motion.div>
              </div>
            </motion.article>
          </motion.div>
        ) : (
          // Lista de Eventos
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
                    <Tooltip content="Pesquise por título ou descrição do evento">
                      <Input
                        type="text"
                        placeholder="Pesquisar eventos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Tooltip content="Mostrar todos os eventos">
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
              </div>
            </motion.div>

            {/* Lista de Eventos */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredEventos.map((evento) => (
                  <motion.article
                    key={evento.id}
                    variants={itemVariants}
                    layout
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedEvento(evento)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={evento.imagem}
                      alt={evento.titulo}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(evento.data)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{evento.hora}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {evento.titulo}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {evento.descricao}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-500">{evento.local}</span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {evento.categoria}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredEventos.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <p className="text-gray-500">Nenhum evento encontrado.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 