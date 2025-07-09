"use client"

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link 
          href="/" 
          className="flex items-center hover:text-[#1B3159] transition-colors"
          title="Página Inicial"
        >
          <Home className="w-4 h-4" />
        </Link>
      </motion.div>

      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center"
        >
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[#1B3159] transition-colors"
              title={item.label}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#1B3159] font-medium">{item.label}</span>
          )}
        </motion.div>
      ))}
    </nav>
  )
} 