"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800">
              Acesso Negado
            </CardTitle>
            <CardDescription className="text-red-600">
              Você não tem permissão para acessar esta página
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Desculpe, mas você não possui as permissões necessárias para acessar este recurso. 
              Entre em contato com o administrador se acredita que isso é um erro.
            </p>

            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline">
                <Link href="/" className="flex items-center justify-center">
                  <Home className="mr-2 h-4 w-4" />
                  Voltar ao Início
                </Link>
              </Button>
              
              <Button asChild>
                <Link href="/auth/signin" className="flex items-center justify-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Fazer Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 