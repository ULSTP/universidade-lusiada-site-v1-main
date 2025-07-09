"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronRight,
  BookOpen,
  Users,
  Award,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Settings,
  Scale,
  BarChart3,
  Ruler,
  ExternalLink,
  Search,
  Calendar,
  Clock,
  Star,
  Download,
  Play,
  ChevronLeft,
  X,
  Menu,
} from "lucide-react"

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  // Galeria de imagens do campus
  const campusImages = [
    { src: "/placeholder.svg?height=400&width=600", alt: "Biblioteca Central", title: "Biblioteca Central" },
    {
      src: "/placeholder.svg?height=400&width=600",
      alt: "Laboratório de Informática",
      title: "Laboratório de Informática",
    },
    { src: "/placeholder.svg?height=400&width=600", alt: "Auditório Principal", title: "Auditório Principal" },
    { src: "/placeholder.svg?height=400&width=600", alt: "Campus Principal", title: "Campus Principal" },
    { src: "/placeholder.svg?height=400&width=600", alt: "Sala de Aula", title: "Sala de Aula Moderna" },
    { src: "/placeholder.svg?height=400&width=600", alt: "Laboratório de Ciências", title: "Laboratório de Ciências" },
  ]

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(isDark)

    // Auto-rotate gallery images
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % campusImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [campusImages.length])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de busca
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      {/* Hero Section com vídeo de fundo */}
      <section id="inicio" className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=600&width=1200"
            alt="Edifício da Universidade"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />

          {/* Elementos decorativos */}
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-lusiada-gold-400/30 rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-lusiada-blue-400/30 rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              Bem-vindo à Universidade
              <br />
              <span className="text-lusiada-gold-400">Lusíada de São Tomé e Príncipe</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              Excelência, Ciência e Humanismo
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              <Button
                size="lg"
                className="bg-lusiada-gold-600 hover:bg-lusiada-gold-700 text-white px-8 py-3 text-lg font-semibold group"
              >
                Saber Mais
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-lusiada-blue-800 px-8 py-3 text-lg font-semibold group flex items-center"
                onClick={() => setShowGallery(true)}
              >
                <Play className="mr-2 w-5 h-5" />
                <span>Ver Campus</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Quick Stats Banner */}
      <section className="bg-lusiada-blue-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: Users, number: "2,500+", label: "Estudantes Ativos" },
              { icon: BookOpen, number: "25+", label: "Cursos Oferecidos" },
              { icon: Award, number: "15+", label: "Anos de Tradição" },
              { icon: Star, number: "95%", label: "Taxa de Empregabilidade" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <stat.icon className="w-8 h-8 mb-2 text-lusiada-gold-400" />
                <h3 className="text-2xl font-bold">{stat.number}</h3>
                <p className="text-sm text-blue-200">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre a ULSTP com timeline */}
      <section id="sobre" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                Sobre a ULSTP
              </motion.h2>

              <motion.p
                className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                A Universidade Lusíada de São Tomé e Príncipe é uma instituição de ensino superior comprometida com a
                excelência académica, a investigação científica e o desenvolvimento sustentável do país.
              </motion.p>

              {/* Timeline */}
              <div className="space-y-6">
                {[
                  { year: "2009", event: "Fundação da ULSTP" },
                  { year: "2012", event: "Primeiros graduados" },
                  { year: "2018", event: "Expansão do campus" },
                  { year: "2024", event: "15 anos de excelência" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 bg-lusiada-gold-600 text-white rounded-full flex items-center justify-center font-bold">
                      {item.year.slice(-2)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.year}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <img
                  src={campusImages[currentImageIndex].src || "/placeholder.svg"}
                  alt={campusImages[currentImageIndex].alt}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold">{campusImages[currentImageIndex].title}</h3>
                </div>

                {/* Gallery navigation */}
                <div className="absolute bottom-6 right-6 flex space-x-2">
                  {campusImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-lusiada-gold-400" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>

              <Button
                onClick={() => setShowGallery(true)}
                className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full hover:bg-black/70 transition-colors flex items-center gap-2"
                title="Ver mais fotos da galeria"
              >
                <span>Ver mais</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos com filtros */}
      <section id="cursos" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Cursos Disponíveis
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Settings,
                name: "Engenharia",
                color: "text-lusiada-blue-600",
                description: "Informática, Civil, Eletrotécnica",
                students: "450+",
              },
              {
                icon: Scale,
                name: "Direito",
                color: "text-lusiada-gold-600",
                description: "Direito, Criminologia",
                students: "320+",
              },
              {
                icon: BarChart3,
                name: "Gestão",
                color: "text-lusiada-blue-600",
                description: "Administração, Economia",
                students: "380+",
              },
              {
                icon: Ruler,
                name: "Arquitetura",
                color: "text-lusiada-gold-600",
                description: "Arquitetura, Urbanismo",
                students: "180+",
              },
            ].map((course, index) => (
              <motion.div
                key={index}
                className="text-center group cursor-pointer bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-500 transition-colors shadow-md">
                  <course.icon className={`w-10 h-10 ${course.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{course.description}</p>
                <div className="flex items-center justify-center text-lusiada-gold-600 text-sm font-semibold">
                  <Users className="w-4 h-4 mr-1" />
                  {course.students}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-lusiada-blue-600 text-lusiada-blue-600 hover:bg-lusiada-blue-600 hover:text-white px-8 py-3"
            >
              Ver Todos os Cursos
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Investigação expandida */}
      <section
        id="investigacao"
        className="py-20 bg-gradient-to-br from-lusiada-blue-50 to-lusiada-gold-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Investigação & Projetos
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Centro de Investigação"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Centro de Investigação Científica
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                O nosso centro de investigação desenvolve projetos inovadores nas áreas de desenvolvimento sustentável,
                tecnologias emergentes e ciências sociais, contribuindo para o progresso de São Tomé e Príncipe.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { number: "25+", label: "Projetos Ativos" },
                  { number: "50+", label: "Publicações" },
                  { number: "15+", label: "Parcerias" },
                  { number: "100+", label: "Investigadores" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <h4 className="text-2xl font-bold text-lusiada-blue-600">{stat.number}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Button className="bg-lusiada-blue-600 hover:bg-lusiada-blue-700 text-white">
                Ver Projetos
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Depoimentos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Depoimentos de Estudantes
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: "Maria Santos",
                  course: "Engenharia Informática",
                  text: "A ULSTP proporcionou-me uma formação de excelência que me preparou para os desafios do mercado de trabalho.",
                  rating: 5,
                },
                {
                  name: "João Silva",
                  course: "Direito",
                  text: "Os professores são altamente qualificados e o ambiente académico é estimulante para o aprendizado.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-lusiada-gold-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.course}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notícias expandidas */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Notícias e Eventos</h2>
            <Button
              variant="outline"
              className="border-lusiada-blue-600 text-lusiada-blue-600 hover:bg-lusiada-blue-600 hover:text-white"
            >
              Ver Todas
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Cerimónia de Graduação 2024",
                date: "15 de Dezembro, 2024",
                time: "09:00",
                description:
                  "Celebração dos novos graduados da ULSTP com a presença de autoridades nacionais e internacionais.",
                category: "Evento",
                image: "/placeholder.svg?height=200&width=300",
                featured: true,
              },
              {
                title: "Nova Parceria com Universidade de Coimbra",
                date: "10 de Dezembro, 2024",
                time: "14:30",
                description: "Acordo de cooperação académica para intercâmbio de estudantes e docentes.",
                category: "Notícia",
                image: "/placeholder.svg?height=200&width=300",
                featured: false,
              },
              {
                title: "Conferência Internacional de Desenvolvimento",
                date: "5 de Janeiro, 2025",
                time: "08:00",
                description: "Evento sobre desenvolvimento sustentável em pequenos estados insulares.",
                category: "Evento",
                image: "/placeholder.svg?height=200&width=300",
                featured: false,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  item.featured ? "md:col-span-2 md:row-span-2" : ""
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className={`w-full object-cover ${item.featured ? "h-64" : "h-48"}`}
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.category === "Evento" ? "bg-lusiada-gold-600 text-white" : "bg-lusiada-blue-600 text-white"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {item.date}
                    {item.time && (
                      <>
                        <Clock className="w-4 h-4 ml-4 mr-2" />
                        {item.time}
                      </>
                    )}
                  </div>

                  <h3
                    className={`font-bold text-gray-900 dark:text-white mb-3 ${item.featured ? "text-2xl" : "text-xl"}`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{item.description}</p>

                  <Button variant="link" className="text-lusiada-blue-600 hover:text-lusiada-blue-700 p-0 h-auto">
                    Ler mais
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissões melhoradas */}
      <section id="estudantes" className="py-20 bg-gradient-to-br from-lusiada-blue-900 to-lusiada-blue-800 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Candidaturas e Admissões
            </motion.h2>
            <motion.p
              className="text-xl text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Junte-se à nossa comunidade académica e faça parte da próxima geração de líderes de São Tomé e Príncipe
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold mb-8">Como Candidatar-se</h3>
              <div className="space-y-6">
                {[
                  { step: "Preencha o formulário de candidatura online", icon: "📝" },
                  { step: "Submeta os documentos necessários", icon: "📄" },
                  { step: "Realize o exame de admissão", icon: "✏️" },
                  { step: "Aguarde os resultados", icon: "⏳" },
                  { step: "Efetue a matrícula", icon: "🎓" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-lusiada-gold-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      {item.icon}
                    </div>
                    <span className="text-lg">{item.step}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-lusiada-gold-600 hover:bg-lusiada-gold-700 text-white px-8 py-3">
                  Candidatar Agora
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-lusiada-blue-800 px-8 py-3"
                >
                  <Download className="mr-2 w-5 h-5" />
                  Baixar Prospecto
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-8">Datas Importantes</h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Candidaturas Abertas",
                    period: "Janeiro - Março 2025",
                    color: "border-lusiada-gold-400",
                    status: "Abertas",
                  },
                  {
                    title: "Exames de Admissão",
                    period: "Abril 2025",
                    color: "border-blue-400",
                    status: "Proximamente",
                  },
                  {
                    title: "Resultados",
                    period: "Maio 2025",
                    color: "border-green-400",
                    status: "Aguardando",
                  },
                  {
                    title: "Início das Aulas",
                    period: "Setembro 2025",
                    color: "border-purple-400",
                    status: "Programado",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`border-l-4 ${item.color} pl-6 py-2`}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{item.status}</span>
                    </div>
                    <p className="text-blue-100">{item.period}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-lusiada-gold-600/20 rounded-lg border border-lusiada-gold-400/30">
                <h4 className="font-semibold mb-2">💡 Dica Importante</h4>
                <p className="text-sm text-blue-100">
                  Candidate-se cedo para garantir a sua vaga! Oferecemos bolsas de estudo para estudantes com excelente
                  desempenho académico.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer expandido */}
      <footer id="contacto" className="bg-lusiada-blue-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Logo e descrição */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/images/universidade-lusiada.webp"
                  alt="Universidade Lusíada Logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="text-2xl font-bold">ULSTP</h3>
                  <p className="text-sm text-blue-200">Universidade Lusíada de São Tomé e Príncipe</p>
                </div>
              </div>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Comprometidos com a excelência académica e a formação integral dos nossos estudantes, contribuindo para
                o desenvolvimento sustentável de São Tomé e Príncipe.
              </p>

              {/* Newsletter */}
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">📧 Newsletter</h4>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Seu email"
                    className="bg-white/10 border-white/20 text-white placeholder-white/70"
                  />
                  <Button className="bg-lusiada-gold-600 hover:bg-lusiada-gold-700">Subscrever</Button>
                </div>
              </div>
            </div>

            {/* Links rápidos */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Links Rápidos</h3>
              <div className="space-y-3">
                {[
                  { name: "Início", href: "#inicio" },
                  { name: "Sobre", href: "/sobre" },
                  { name: "Cursos", href: "/cursos" },
                  { name: "Portal do Aluno", href: "/portal-aluno" },
                  { name: "Biblioteca", href: "#" },
                ].map((link, index) => (
                  <a key={index} href={link.href} className="block hover:text-lusiada-gold-400 transition-colors">
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-lusiada-gold-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Campus Principal</p>
                    <p className="text-blue-200 text-sm">
                      Rua da Independência
                      <br />
                      São Tomé e Príncipe
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-lusiada-gold-400" />
                  <div>
                    <p className="font-medium">+ 239 222 485739</p>
                    <p className="text-blue-200 text-sm">Segunda a Sexta: 8h-17h</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-lusiada-gold-400" />
                  <div>
                    <p className="font-medium">info@ulstp.st</p>
                    <p className="text-blue-200 text-sm">admissoes@ulstp.st</p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowContactForm(true)}
                  className="bg-lusiada-gold-600 hover:bg-lusiada-gold-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
                  title="Abrir formulário de contacto"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contacte-nos</span>
                </Button>
              </div>

              {/* Redes sociais */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Siga-nos</h4>
                <div className="flex space-x-3">
                  {[
                    { icon: Facebook, href: "#", label: "Facebook" },
                    { icon: Instagram, href: "#", label: "Instagram" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                    { icon: Youtube, href: "#", label: "YouTube" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-lusiada-blue-700 rounded-full flex items-center justify-center hover:bg-lusiada-gold-600 transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-lusiada-blue-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm">
              © 2024 Universidade Lusíada de São Tomé e Príncipe. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal da Galeria */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowGallery(false)}
                className="absolute -top-12 right-0 text-white hover:text-lusiada-gold-400 transition-colors"
                title="Fechar galeria"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="relative">
                <img
                  src={campusImages[currentImageIndex].src || "/placeholder.svg"}
                  alt={campusImages[currentImageIndex].alt}
                  className="w-full h-96 object-cover rounded-lg"
                />

                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? campusImages.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  title="Imagem anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === campusImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  title="Próxima imagem"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                  <h3 className="font-semibold">{campusImages[currentImageIndex].title}</h3>
                </div>
              </div>

              <div className="flex justify-center mt-4 space-x-2">
                {campusImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-lusiada-gold-400" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal do Formulário de Contacto */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Contacte-nos</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="absolute right-4 top-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  title="Fechar formulário"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                  <Input type="text" placeholder="Seu nome completo" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <Input type="email" placeholder="seu@email.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assunto</label>
                  <Input type="text" placeholder="Assunto da mensagem" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mensagem</label>
                  <Textarea placeholder="Sua mensagem..." rows={4} />
                </div>

                <Button className="w-full bg-lusiada-blue-600 hover:bg-lusiada-blue-700 text-white">
                  Enviar Mensagem
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
