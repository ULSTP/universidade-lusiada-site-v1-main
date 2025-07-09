"use client"

import { useState, useEffect } from 'react'
import { Search, BookOpen, Newspaper, Calendar, ChevronLeft } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Tooltip } from '@/components/Tooltip'

interface SearchResult {
  id: string
  type: 'curso' | 'noticia' | 'evento'
  title: string
  description: string
  date?: string
  url: string
}

export default function BuscaPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'todos' | 'cursos' | 'noticias' | 'eventos'>('todos')

  // Simulação de dados de busca
  const mockData: SearchResult[] = [
    {
      id: '1',
      type: 'curso',
      title: 'Licenciatura em Informática',
      description: 'Curso de graduação em informática com foco em desenvolvimento de software.',
      url: '/cursos/informatica'
    },
    {
      id: '2',
      type: 'noticia',
      title: 'Inauguração do Novo Laboratório',
      description: 'Universidade inaugura novo laboratório de informática com equipamentos de última geração.',
      date: '2024-03-15',
      url: '/noticias/inauguracao-laboratorio'
    },
    {
      id: '3',
      type: 'evento',
      title: 'Semana Académica 2024',
      description: 'Evento anual com palestras, workshops e atividades culturais.',
      date: '2024-04-20',
      url: '/eventos/semana-academica-2024'
    }
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulação de busca
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const filteredResults = mockData.filter(item => {
      const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = activeFilter === 'todos' || item.type === activeFilter
      return matchesQuery && matchesFilter
    })

    setResults(filteredResults)
    setIsLoading(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'curso':
        return <BookOpen className="w-5 h-5" />
      case 'noticia':
        return <Newspaper className="w-5 h-5" />
      case 'evento':
        return <Calendar className="w-5 h-5" />
      default:
        return <Search className="w-5 h-5" />
    }
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
          <h1 className="text-4xl font-bold text-center mb-4">Busca</h1>
          <p className="text-lg text-center text-gray-200">Encontre o que você procura</p>
        </div>
      </motion.div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs 
          items={[
            { label: 'Busca', href: '/busca' },
            { label: searchQuery ? `Resultados para "${searchQuery}"` : 'Todos os Resultados' }
          ]} 
        />

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
                <Tooltip content="Digite o que você está procurando">
                  <Input
                    type="text"
                    placeholder="O que você está procurando?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </Tooltip>
              </div>
            </div>
            <div className="flex gap-2">
              <Tooltip content="Mostrar todos os resultados">
                <Button
                  variant={activeFilter === 'todos' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('todos')}
                >
                  Todos
                </Button>
              </Tooltip>
              <Tooltip content="Filtrar apenas cursos">
                <Button
                  variant={activeFilter === 'cursos' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('cursos')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Cursos
                </Button>
              </Tooltip>
              <Tooltip content="Filtrar apenas notícias">
                <Button
                  variant={activeFilter === 'noticias' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('noticias')}
                >
                  <Newspaper className="w-4 h-4 mr-2" />
                  Notícias
                </Button>
              </Tooltip>
              <Tooltip content="Filtrar apenas eventos">
                <Button
                  variant={activeFilter === 'eventos' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('eventos')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Eventos
                </Button>
              </Tooltip>
            </div>
          </div>
        </motion.div>

        {/* Resultados da Busca */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <AnimatePresence>
            {results.map((result) => (
              <motion.article
                key={result.id}
                variants={itemVariants}
                layout
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="p-6">
                  <div className="flex items-center text-gray-500 mb-4">
                    {result.type === 'curso' && <BookOpen className="w-4 h-4 mr-2" />}
                    {result.type === 'noticia' && <Newspaper className="w-4 h-4 mr-2" />}
                    {result.type === 'evento' && <Calendar className="w-4 h-4 mr-2" />}
                    <span className="capitalize">{result.type}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {result.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {result.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {result.date}
                    </span>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                      Ver mais
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {results.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <p className="text-gray-500">Nenhum resultado encontrado.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 