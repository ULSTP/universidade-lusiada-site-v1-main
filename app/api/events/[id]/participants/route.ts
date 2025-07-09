import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema de validação para inscrição em evento
const participantSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
})

// GET /api/events/[id]/participants - Listar participantes
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const participants = await prisma.eventParticipant.findMany({
      where: {
        eventId: params.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(participants)
  } catch (error) {
    console.error("[EVENT_PARTICIPANTS_GET]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}

// POST /api/events/[id]/participants - Inscrever participante
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const validatedData = participantSchema.parse(body)

    // Verificar se o evento existe e está publicado
    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
        published: true,
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    })

    if (!event) {
      return new NextResponse("Evento não encontrado", { status: 404 })
    }

    // Verificar se o evento já começou
    if (new Date(event.startDate) < new Date()) {
      return new NextResponse("Evento já iniciado", { status: 400 })
    }

    // Verificar se há vagas disponíveis
    if (
      event.maxParticipants &&
      event._count.participants >= event.maxParticipants
    ) {
      return new NextResponse("Evento lotado", { status: 400 })
    }

    // Verificar se o email já está inscrito
    const existingParticipant = await prisma.eventParticipant.findFirst({
      where: {
        eventId: params.id,
        email: validatedData.email,
      },
    })

    if (existingParticipant) {
      return new NextResponse("Email já inscrito", { status: 400 })
    }

    const participant = await prisma.eventParticipant.create({
      data: {
        ...validatedData,
        eventId: params.id,
      },
    })

    return NextResponse.json(participant)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    console.error("[EVENT_PARTICIPANTS_POST]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
} 