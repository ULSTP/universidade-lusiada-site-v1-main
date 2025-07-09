"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/images/universidade-lusiada.webp"
              alt="Universidade Lusíada Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <span className="text-xl font-bold text-[#1B3159]">ULSTP</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {[
              { name: "Início", href: "/" },
              { name: "Sobre", href: "/sobre" },
              { name: "Cursos", href: "/cursos" },
              { name: "Portal do Aluno", href: "/portal-aluno" },
              { name: "Contato", href: "/contato" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[#1B3159] font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-[#1B3159]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {[
                { name: "Início", href: "/" },
                { name: "Sobre", href: "/sobre" },
                { name: "Cursos", href: "/cursos" },
                { name: "Portal do Aluno", href: "/portal-aluno" },
                { name: "Contato", href: "/contato" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#1B3159] font-medium block transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 