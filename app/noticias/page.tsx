"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { Calendar, Clock, Search, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Tooltip } from '@/components/Tooltip'

interface Noticia {
  id: number
  titulo: string
  resumo: string
  conteudo: string
  data: string
  categoria: string
  imagem: string
}

const noticiasMock: Noticia[] = [
  {
    id: 1,
    titulo: "ULSTP inaugura novo laboratório de informática",
    resumo: "A Universidade Lusíada de São Tomé e Príncipe inaugurou um novo laboratório de informática com equipamentos de última geração.",
    conteudo: "A Universidade Lusíada de São Tomé e Príncipe inaugurou um novo laboratório de informática com equipamentos de última geração. O laboratório conta com 30 computadores de última geração, projetores interativos e uma rede de internet de alta velocidade. Esta iniciativa visa melhorar a qualidade do ensino e proporcionar aos alunos um ambiente adequado para o desenvolvimento de suas habilidades tecnológicas.",
    data: "2024-03-15",
    categoria: "Infraestrutura",
    imagem: "/images/noticias/lab-informatica.jpg"
  },
  {
    id: 2,
    titulo: "ULSTP assina parceria com universidade portuguesa",
    resumo: "A ULSTP firmou uma parceria estratégica com uma renomada universidade portuguesa para intercâmbio acadêmico.",
    conteudo: "A Universidade Lusíada de São Tomé e Príncipe firmou uma parceria estratégica com uma renomada universidade portuguesa. Esta parceria permitirá o intercâmbio de estudantes e professores, além de projetos de pesquisa conjuntos. Os alunos da ULSTP terão a oportunidade de estudar em Portugal por um semestre, enquanto estudantes portugueses virão para São Tomé e Príncipe.",
    data: "2024-03-10",
    categoria: "Parcerias",
    imagem: "/images/noticias/parceria.jpg"
  },
  {
    id: 3,
    titulo: "ULSTP realiza semana cultural",
    resumo: "A universidade promoveu uma semana cultural com diversas atividades artísticas e culturais.",
    conteudo: "A Universidade Lusíada de São Tomé e Príncipe realizou sua tradicional semana cultural, que contou com diversas atividades artísticas e culturais. O evento incluiu exposições de arte, apresentações musicais, palestras sobre cultura são-tomense e workshops de dança tradicional. A semana cultural é um momento importante para celebrar a diversidade cultural e promover a integração entre os estudantes.",
    data: "2024-03-05",
    categoria: "Eventos",
    imagem: "/images/noticias/semana-cultural.jpg"
  }
]

export default function NoticiasPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null)
  const [selectedCategoria, setSelectedCategoria] = useState<string>('')

  const categorias = Array.from(new Set(noticiasMock.map(noticia => noticia.categoria)))

  const filteredNoticias = noticiasMock.filter(noticia => {
    const matchesSearch = noticia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         noticia.resumo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategoria = !selectedCategoria || noticia.categoria === selectedCategoria
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
          <h1 className="text-4xl font-bold text-center mb-4">Notícias</h1>
          <p className="text-lg text-center text-gray-200">Fique por dentro das últimas novidades da ULSTP</p>
        </div>
      </motion.div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-16">
        <Breadcrumbs 
          items={[
            { label: 'Notícias', href: '/noticias' },
            selectedNoticia ? { label: selectedNoticia.titulo } : { label: 'Todas as Notícias' }
          ]} 
        />

        {selectedNoticia ? (
          // Visualização de Notícia Individual
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Tooltip content="Voltar para a lista de notícias">
              <Button
                variant="ghost"
                className="mb-8"
                onClick={() => setSelectedNoticia(null)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar para Notícias
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
                src={selectedNoticia.imagem}
                alt={selectedNoticia.titulo}
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
                  <span>{formatDate(selectedNoticia.data)}</span>
                  <span className="mx-2">•</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {selectedNoticia.categoria}
                  </span>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-3xl font-bold text-gray-900 mb-4"
                >
                  {selectedNoticia.titulo}
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="prose max-w-none"
                >
                  <p className="text-gray-600 leading-relaxed">
                    {selectedNoticia.conteudo}
                  </p>
                </motion.div>
              </div>
            </motion.article>
          </motion.div>
        ) : (
          // Lista de Notícias
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
                    <Tooltip content="Pesquise por título ou conteúdo da notícia">
                      <Input
                        type="text"
                        placeholder="Pesquisar notícias..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Tooltip content="Mostrar todas as notícias">
                    <Button
                      variant={selectedCategoria === '' ? 'default' : 'outline'}
                      onClick={() => setSelectedCategoria('')}
                    >
                      Todas
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

            {/* Lista de Notícias */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredNoticias.map((noticia) => (
                  <motion.article
                    key={noticia.id}
                    variants={itemVariants}
                    layout
                    className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedNoticia(noticia)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={noticia.imagem}
                      alt={noticia.titulo}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(noticia.data)}</span>
                        <span className="mx-2">•</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {noticia.categoria}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {noticia.titulo}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {noticia.resumo}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredNoticias.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <p className="text-gray-500">Nenhuma notícia encontrada.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 