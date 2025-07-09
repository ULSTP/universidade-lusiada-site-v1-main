import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Schema de validação para registro
const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).default('STUDENT'),
  studentId: z.string().optional(), // Matrícula para estudantes
  employeeId: z.string().optional(), // ID de funcionário para professores/admins
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  dateOfBirth: z.string().optional(), // Para estudantes
  nationality: z.string().optional(), // Para estudantes
  specialization: z.string().optional(), // Para professores
  department: z.string().optional(), // Para professores/admins
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = registerSchema.parse(body)

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      )
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Criar usuário base
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      }
    })

    // Criar perfil específico baseado no papel
    if (validatedData.role === 'STUDENT') {
      if (!validatedData.studentId || !validatedData.dateOfBirth || !validatedData.nationality) {
        return NextResponse.json(
          { error: 'Dados obrigatórios para estudante não fornecidos' },
          { status: 400 }
        )
      }

      await prisma.student.create({
        data: {
          userId: user.id,
          studentId: validatedData.studentId,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          dateOfBirth: new Date(validatedData.dateOfBirth),
          nationality: validatedData.nationality,
        }
      })
    } else if (validatedData.role === 'TEACHER') {
      if (!validatedData.employeeId || !validatedData.specialization || !validatedData.department) {
        return NextResponse.json(
          { error: 'Dados obrigatórios para professor não fornecidos' },
          { status: 400 }
        )
      }

      await prisma.teacher.create({
        data: {
          userId: user.id,
          employeeId: validatedData.employeeId,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          specialization: validatedData.specialization,
          department: validatedData.department,
        }
      })
    } else if (validatedData.role === 'ADMIN') {
      if (!validatedData.employeeId || !validatedData.department) {
        return NextResponse.json(
          { error: 'Dados obrigatórios para administrador não fornecidos' },
          { status: 400 }
        )
      }

      await prisma.admin.create({
        data: {
          userId: user.id,
          employeeId: validatedData.employeeId,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          department: validatedData.department,
          permissions: JSON.stringify(['read', 'write', 'delete']), // Permissões como JSON string
        }
      })
    }

    // Retornar sucesso (sem a senha)
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[AUTH_REGISTER]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 