"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Book, 
  Calendar, 
  FileText, 
  Bell, 
  Download, 
  Clock, 
  Wallet, 
  FileSpreadsheet, 
  Search,
  User,
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  Trophy,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

const PortalAlunoClientPage = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({
    matricula: 'josedossantosloureiro8@gmail.com',
    senha: ''
  })

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Novas notas disponíveis para Matemática I', time: '2h atrás' },
    { id: 2, type: 'warning', message: 'Prazo para matrícula em disciplinas optativas: 3 dias', time: '5h atrás' },
    { id: 3, type: 'success', message: 'Pagamento da mensalidade confirmado', time: '1 dia atrás' },
    { id: 4, type: 'info', message: 'Workshop de Desenvolvimento Web - Inscrições abertas', time: '3h atrás' },
    { id: 5, type: 'warning', message: 'Documento de declaração de matrícula pronto', time: '1 dia atrás' }
  ])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginData.matricula && loginData.senha) {
      setIsLoggedIn(true)
      console.log("Login successful:", loginData)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setLoginData({ matricula: 'josedossantosloureiro8@gmail.com', senha: '' })
  }

  const services = [
    {
      icon: Book,
      title: "Área Acadêmica",
      description: "Acesse notas, frequência e material didático",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/portal-aluno/academico",
      stats: "8 disciplinas ativas"
    },
    {
      icon: Calendar,
      title: "Horários e Agenda",
      description: "Consulte seu horário de aulas e calendário acadêmico",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      href: "/portal-aluno/horarios",
      stats: "3 aulas hoje"
    },
    {
      icon: FileText,
      title: "Documentos",
      description: "Solicite documentos e declarações",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      href: "/portal-aluno/documentos",
      stats: "2 pendentes"
    },
    {
      icon: Bell,
      title: "Notificações",
      description: "Acompanhe avisos e comunicados importantes",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      href: "/portal-aluno/notificacoes",
      stats: `${notifications.length} novas`
    }
  ]

  const quickAccess = [
    {
      icon: Download,
      title: "Biblioteca Digital",
      href: "/portal-aluno/biblioteca",
      description: "Acesso a e-books e artigos"
    },
    {
      icon: Clock,
      title: "Histórico Escolar",
      href: "/portal-aluno/historico",
      description: "Seu desempenho acadêmico"
    },
    {
      icon: Wallet,
      title: "Situação Financeira",
      href: "/portal-aluno/financeiro",
      description: "Mensalidades e pagamentos"
    },
    {
      icon: FileSpreadsheet,
      title: "Requerimentos",
      href: "/portal-aluno/requerimentos",
      description: "Solicitações acadêmicas"
    }
  ]

  // Simular dados do estudante logado
  const studentData = {
    nome: "José dos Santos Loureiro",
    matricula: "2021001234",
    curso: "Engenharia Informática",
    foto: "/images/avatar-placeholder.jpg"
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <main className="flex-1 min-h-screen">
        {!isLoggedIn ? (
          // Login Page
          <>
            {/* Hero Section */}
            <section className="w-full bg-[#1B3159] text-white py-16">
              <div className="container mx-auto px-4 text-center">
                <motion.h1 
                  className="text-4xl font-bold mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Portal do Aluno
                </motion.h1>
                <motion.p 
                  className="text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Acesse seus serviços acadêmicos
                </motion.p>
              </div>
            </section>

            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-12">
                    {/* Login Section */}
                    <motion.div 
                      className="bg-white p-8 rounded-lg shadow-lg"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">Login</h2>
                      <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <Input
                            type="text"
                            placeholder="josedossantosloureiro8@gmail.com"
                            value={loginData.matricula}
                            onChange={(e) => setLoginData({...loginData, matricula: e.target.value})}
                            className="w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1B3159] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Senha
                          </label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={loginData.senha}
                              onChange={(e) => setLoginData({...loginData, senha: e.target.value})}
                              className="w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1B3159] focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="remember-me"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="h-4 w-4 text-[#1B3159] focus:ring-[#1B3159] border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                              Lembrar-me
                            </label>
                          </div>
                          <a href="#" className="text-sm text-[#1B3159] hover:underline">
                            Esqueceu a senha?
                          </a>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-[#1B3159] hover:bg-[#2a4a85] text-white"
                        >
                          Entrar
                        </Button>
                      </form>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                          Não tem uma conta?{" "}
                          <a href="#" className="text-[#1B3159] hover:underline">
                            Contacte a secretaria
                          </a>
                        </p>
                      </div>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">Serviços Disponíveis</h2>
                      <div className="space-y-4">
                        {services.map((service, index) => (
                          <div key={index} className={`${service.bgColor} p-4 rounded-lg`}>
                            <div className="flex items-center">
                              <service.icon className={`w-6 h-6 ${service.iconColor} mr-3`} />
                              <div>
                                <h3 className="font-semibold text-gray-900">{service.title}</h3>
                                <p className="text-sm text-gray-600">{service.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            {/* Voltar para Página Inicial */}
            <div className="container mx-auto px-4 pb-12">
              <div className="max-w-4xl mx-auto">
                <a href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Página Inicial
                </a>
              </div>
            </div>
          </>
        ) : (
          // Dashboard Page (After Login)
          <>
            {/* Welcome Header */}
            <section className="w-full bg-[#1B3159] text-white py-8">
              <div className="container mx-auto px-4">
                <motion.div 
                  className="flex flex-col md:flex-row items-center justify-between"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="w-16 h-16 bg-lusiada-gold-400 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-lusiada-blue-800" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Bem-vindo, {studentData.nome}!</h1>
                      <p className="text-blue-200">{studentData.curso} • Matrícula: {studentData.matricula}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-[#1B3159]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </motion.div>
              </div>
            </section>

            <section className="py-12 bg-gray-50">
              <div className="container mx-auto px-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: Star, label: "CR Atual", value: "8.7", color: "text-yellow-500" },
                    { icon: BookOpen, label: "Disciplinas", value: "8", color: "text-blue-500" },
                    { icon: Users, label: "Período", value: "5º", color: "text-green-500" },
                    { icon: Trophy, label: "Conquistas", value: "12", color: "text-purple-500" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-white p-4 rounded-lg shadow-sm text-center"
                    >
                      <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Main Services */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {services.map((service, index) => (
                    <motion.a
                      key={index}
                      href={service.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`${service.bgColor} p-6 rounded-xl hover:shadow-lg transition-shadow`}
                    >
                      <service.icon className={`w-8 h-8 ${service.iconColor} mb-4`} />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">{service.stats}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Quick Access and Notifications */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Quick Access */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {quickAccess.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <item.icon className="w-6 h-6 text-gray-600 mb-2" />
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </a>
                      ))}
                    </div>
                  </motion.div>

                  {/* Notifications */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-xl font-semibold mb-4">Notificações</h2>
                    <div className="bg-white rounded-lg shadow-sm divide-y">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start">
                            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-500 mt-1" />}
                            {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />}
                            {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-1" />}
                            <div className="ml-3">
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <a
                        href="/portal-aluno/notificacoes"
                        className="block p-4 text-center text-sm text-[#1B3159] hover:bg-gray-50"
                      >
                        Ver todas as notificações
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default PortalAlunoClientPage; 