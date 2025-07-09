import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Schema de validação para contato
const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email deve ser válido'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
  type: z.enum(['GENERAL', 'ADMISSION', 'ACADEMIC', 'TECHNICAL', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
})

// GET /api/contacts - Listar contatos (apenas admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se o usuário é admin
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (priority) {
      where.priority = priority
    }
    
    if (status) {
      where.status = status
    }

    // Buscar contatos com paginação
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.contact.count({ where })
    ])

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('[CONTACTS_GET]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Criar contato (público)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = contactSchema.parse(body)

    // Criar contato
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        type: validatedData.type,
        priority: validatedData.priority || 'MEDIUM',
        status: 'PENDING',
        createdAt: new Date()
      }
    })

    return NextResponse.json(contact, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('[CONTACTS_POST]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 