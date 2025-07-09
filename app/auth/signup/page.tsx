"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2, GraduationCap, BookOpen, Shield } from 'lucide-react'
import Link from 'next/link'

type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN'

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userRole, setUserRole] = useState<UserRole>('STUDENT')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    studentId: '',
    employeeId: '',
    dateOfBirth: '',
    nationality: '',
    specialization: '',
    department: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validações básicas
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userRole,
          firstName: formData.firstName,
          lastName: formData.lastName,
          studentId: userRole === 'STUDENT' ? formData.studentId : undefined,
          employeeId: userRole !== 'STUDENT' ? formData.employeeId : undefined,
          dateOfBirth: userRole === 'STUDENT' ? formData.dateOfBirth : undefined,
          nationality: userRole === 'STUDENT' ? formData.nationality : undefined,
          specialization: userRole === 'TEACHER' ? formData.specialization : undefined,
          department: formData.department
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta')
      } else {
        setSuccess('Conta criada com sucesso! Redirecionando para login...')
        setTimeout(() => {
          router.push('/auth/signin')
        }, 2000)
      }
    } catch (error) {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'STUDENT':
        return <GraduationCap className="h-4 w-4" />
      case 'TEACHER':
        return <BookOpen className="h-4 w-4" />
      case 'ADMIN':
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'STUDENT':
        return 'Estudante da Universidade Lusíada'
      case 'TEACHER':
        return 'Professor da Universidade Lusíada'
      case 'ADMIN':
        return 'Administrador do Sistema'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
                <CardDescription>
                  Registre-se na Universidade Lusíada
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Tipo de Usuário */}
              <div className="space-y-2">
                <Label>Tipo de Usuário</Label>
                <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon('STUDENT')}
                        <span>Estudante</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TEACHER">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon('TEACHER')}
                        <span>Professor</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon('ADMIN')}
                        <span>Administrador</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600">{getRoleDescription(userRole)}</p>
              </div>

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Seu nome"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Seu sobrenome"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Campos específicos por tipo de usuário */}
              {userRole === 'STUDENT' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Matrícula</Label>
                    <Input
                      id="studentId"
                      name="studentId"
                      placeholder="Número de matrícula"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nacionalidade</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      placeholder="Sua nacionalidade"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">ID de Funcionário</Label>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      placeholder="ID de funcionário"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      name="department"
                      placeholder="Seu departamento"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {userRole === 'TEACHER' && (
                <div className="space-y-2">
                  <Label htmlFor="specialization">Especialização</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    placeholder="Sua especialização"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Senhas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  href="/auth/signin"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 