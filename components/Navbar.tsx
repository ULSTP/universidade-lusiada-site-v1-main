"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { OptimizedImage } from "@/components/OptimizedImage"

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const menuRef = useRef<HTMLDivElement>(null)

  const menuItems = [
    { name: "Início", href: "/" },
    { name: "Sobre", href: "/sobre" },
    { name: "Cursos", href: "/cursos" },
    { name: "Contacto", href: "/contato" },
  ]

  useEffect(() => {
    setMounted(true)
    // Recuperar preferência de tema do localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark')
    }
  }, [])

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((prev) => (prev + 1) % menuItems.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        const link = menuRef.current?.querySelector(`[data-index="${focusedIndex}"]`) as HTMLElement
        link?.click()
        break
      case 'Escape':
        setMobileMenuOpen(false)
        break
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de busca
    console.log("Searching for:", searchQuery)
  }

  // Não renderizar nada até que o componente esteja montado no cliente
  if (!mounted) {
    return null
  }

  return (
    <nav 
      className="bg-lusiada-blue-800 text-white shadow-lg sticky top-0 z-50"
      role="navigation"
      aria-label="Menu principal"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link 
              href="/"
              aria-label="Página inicial"
              className="focus:outline-none focus:ring-2 focus:ring-lusiada-gold-400 rounded-md"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <OptimizedImage
                  src="/images/logotipo.webp"
                  alt="Universidade Lusíada Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                  priority
                />
              </motion.div>
            </Link>
            <Link 
              href="/" 
              className="text-xl font-bold focus:outline-none focus:ring-2 focus:ring-lusiada-gold-400 rounded-md px-2"
            >
              ULSTP
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form 
              onSubmit={handleSearch} 
              className="w-full relative"
              role="search"
              aria-label="Buscar no site"
            >
              <Input
                type="text"
                placeholder="Buscar cursos, notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20 focus:ring-2 focus:ring-lusiada-gold-400"
                aria-label="Campo de busca"
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" 
                aria-hidden="true"
              />
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-lusiada-gold-400 transition-colors focus:outline-none focus:ring-2 focus:ring-lusiada-gold-400 rounded-md px-2 py-1"
                aria-current={item.href === '/' ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/portal-aluno"
              className="px-4 py-2 bg-lusiada-gold-600 text-white rounded-md hover:bg-lusiada-gold-700 transition-colors focus:outline-none focus:ring-2 focus:ring-lusiada-gold-400"
              aria-label="Acessar portal do aluno"
            >
              Portal do Aluno
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-lusiada-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-lusiada-gold-400"
              aria-label={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
              type="button"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-lusiada-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-lusiada-gold-400"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-lusiada-blue-700"
              role="menu"
              aria-label="Menu mobile"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <div className="px-3 py-2">
                  <form 
                    onSubmit={handleSearch} 
                    className="relative"
                    role="search"
                    aria-label="Buscar no site"
                  >
                    <Input
                      type="text"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20 focus:ring-2 focus:ring-lusiada-gold-400"
                      aria-label="Campo de busca"
                    />
                    <Search 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" 
                      aria-hidden="true"
                    />
                  </form>
                </div>

                {menuItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    data-index={index}
                    className="block px-3 py-2 hover:bg-lusiada-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-lusiada-gold-400"
                    onClick={() => setMobileMenuOpen(false)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    tabIndex={focusedIndex === index ? 0 : -1}
                    role="menuitem"
                    aria-current={item.href === '/' ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}

                <Link
                  href="/portal-aluno"
                  className="block px-3 py-2 bg-lusiada-gold-600 text-white rounded-md hover:bg-lusiada-gold-700 transition-colors focus:outline-none focus:ring-2 focus:ring-lusiada-gold-400 text-center mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                  aria-label="Acessar portal do aluno"
                >
                  Portal do Aluno
                </Link>

                <button
                  onClick={toggleDarkMode}
                  className="block w-full text-left px-3 py-2 hover:bg-lusiada-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-lusiada-gold-400"
                  aria-label={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
                  type="button"
                  role="menuitem"
                >
                  {darkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
} 