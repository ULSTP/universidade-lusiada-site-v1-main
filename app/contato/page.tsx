"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react'
import { motion } from "framer-motion"

interface FormData {
  nome: string
  email: string
  assunto: string
  mensagem: string
}

interface FormErrors {
  nome?: string
  email?: string
  assunto?: string
  mensagem?: string
}

export default function ContatoPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    } else if (formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.assunto.trim()) {
      newErrors.assunto = 'Assunto é obrigatório'
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória'
    } else if (formData.mensagem.length < 10) {
      newErrors.mensagem = 'Mensagem deve ter pelo menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aqui você adicionaria a lógica real de envio do formulário
      console.log('Dados do formulário:', formData)
      
      setMessage({
        type: 'success',
        text: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
      })
      
      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        assunto: '',
        mensagem: ''
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[#1B3159] text-white py-16"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Contacte-nos</h1>
          <p className="text-lg text-center text-gray-200">Estamos aqui para ajudar</p>
        </div>
      </motion.div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Informações de Contato */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-900">Informações de Contato</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-[#1B3159]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Endereço</h3>
                  <p className="text-gray-600 mt-1">
                    Rua da Independência<br />
                    São Tomé e Príncipe
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-[#1B3159]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Telefone</h3>
                  <p className="text-gray-600 mt-1">+239 222 485739</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-[#1B3159]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600 mt-1">
                    info@ulstp.st<br />
                    admissoes@ulstp.st
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-[#1B3159]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Horário de Funcionamento</h3>
                  <p className="text-gray-600 mt-1">
                    Segunda a Sexta: 8h-17h<br />
                    Sábado: 8h-12h
                  </p>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Siga-nos</h3>
              <div className="flex gap-4">
                <a href="https://facebook.com/ulstp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1B3159]/10 rounded-full flex items-center justify-center hover:bg-[#1B3159]/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="#1B3159" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="https://instagram.com/ulstp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1B3159]/10 rounded-full flex items-center justify-center hover:bg-[#1B3159]/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="#1B3159" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="#1B3159" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 6.5H17.51" stroke="#1B3159" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/ulstp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1B3159]/10 rounded-full flex items-center justify-center hover:bg-[#1B3159]/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.845-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z" stroke="#1B3159" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="https://wa.me/2399999999" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1B3159]/10 rounded-full flex items-center justify-center hover:bg-[#1B3159]/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.26-1.64A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.26-1.44l-.38-.22-3.72.98.99-3.62-.25-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" stroke="#1B3159" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Formulário de Contato */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie-nos uma Mensagem</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome"
                  className={`w-full ${errors.nome ? 'border-red-500' : ''}`}
                />
                {errors.nome && (
                  <p className="mt-1 text-sm text-red-500">{errors.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Digite seu email"
                  className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto
                </label>
                <Input
                  type="text"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  placeholder="Digite o assunto"
                  className={`w-full ${errors.assunto ? 'border-red-500' : ''}`}
                />
                {errors.assunto && (
                  <p className="mt-1 text-sm text-red-500">{errors.assunto}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <Textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="Digite sua mensagem"
                  rows={5}
                  className={`w-full ${errors.mensagem ? 'border-red-500' : ''}`}
                />
                {errors.mensagem && (
                  <p className="mt-1 text-sm text-red-500">{errors.mensagem}</p>
                )}
              </div>

              {message.text && (
                <div className={`p-4 rounded-md ${
                  message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#1B3159] hover:bg-[#1B3159]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Mapa */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Nossa Localização</h2>
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7526223154563!2d6.7321!3d0.3364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMjAnMTEuMCJOIDbCsDQzJzU1LjYiRQ!5e0!3m2!1spt-PT!2sst!4v1635789876543!5m2!1spt-PT!2sst"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>

        {/* Link de Volta */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <Link 
            href="/" 
            className="inline-flex items-center text-[#1B3159] hover:underline"
          >
            ← Voltar para Página Inicial
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 