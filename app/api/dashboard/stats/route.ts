import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard/stats - Obter estatísticas do dashboard
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Verificar se o usuário está autenticado
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const academicYear = searchParams.get('academicYear') || new Date().getFullYear().toString()
    const semester = parseInt(searchParams.get('semester') || '1')

    let stats: any = {}

    // Estatísticas baseadas no papel do usuário
    if (session.user.role === 'ADMIN') {
      // Estatísticas para admin
      const [
        totalStudents,
        totalTeachers,
        totalCourses,
        totalSubjects,
        activeEnrollments,
        pendingDocuments,
        unreadNotifications,
        pendingContacts
      ] = await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.course.count(),
        prisma.subject.count(),
        prisma.enrollment.count({
          where: {
            status: 'ACTIVE',
            academicYear: academicYear,
            semester: semester
          }
        }),
        prisma.document.count({
          where: {
            status: 'PENDING'
          }
        }),
        prisma.notification.count({
          where: {
            OR: [
              { targetUserId: session.user.id },
              { targetRole: 'ALL' },
              { targetRole: 'ADMIN' }
            ],
            read: false
          }
        }),
        prisma.contact.count({
          where: {
            status: 'PENDING'
          }
        })
      ])

      stats = {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalSubjects,
        activeEnrollments,
        pendingDocuments,
        unreadNotifications,
        pendingContacts
      }

    } else if (session.user.role === 'TEACHER') {
      // Estatísticas para professor
      const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id }
      })

      if (!teacher) {
        return NextResponse.json(
          { error: 'Perfil de professor não encontrado' },
          { status: 404 }
        )
      }

      const [
        mySubjects,
        myCourses,
        totalStudents,
        unreadNotifications,
        recentGrades
      ] = await Promise.all([
        prisma.subject.count({
          where: {
            teacherId: teacher.id
          }
        }),
        prisma.course.count({
          where: {
            teacherId: teacher.id
          }
        }),
        prisma.enrollment.count({
          where: {
            course: {
              teacherId: teacher.id
            },
            status: 'ACTIVE',
            academicYear: academicYear,
            semester: semester
          }
        }),
        prisma.notification.count({
          where: {
            OR: [
              { targetUserId: session.user.id },
              { targetRole: 'ALL' },
              { targetRole: 'TEACHER' }
            ],
            read: false
          }
        }),
        prisma.grade.count({
          where: {
            subject: {
              teacherId: teacher.id
            },
            academicYear: academicYear,
            semester: semester
          }
        })
      ])

      stats = {
        mySubjects,
        myCourses,
        totalStudents,
        unreadNotifications,
        recentGrades
      }

    } else if (session.user.role === 'STUDENT') {
      // Estatísticas para estudante
      const student = await prisma.student.findUnique({
        where: { userId: session.user.id }
      })

      if (!student) {
        return NextResponse.json(
          { error: 'Perfil de estudante não encontrado' },
          { status: 404 }
        )
      }

      const [
        myEnrollments,
        myGrades,
        myAttendance,
        unreadNotifications,
        pendingDocuments
      ] = await Promise.all([
        prisma.enrollment.count({
          where: {
            studentId: student.id,
            status: 'ACTIVE'
          }
        }),
        prisma.grade.count({
          where: {
            enrollment: {
              studentId: student.id
            },
            academicYear: academicYear,
            semester: semester
          }
        }),
        prisma.attendance.count({
          where: {
            enrollment: {
              studentId: student.id
            },
            academicYear: academicYear,
            semester: semester
          }
        }),
        prisma.notification.count({
          where: {
            OR: [
              { targetUserId: session.user.id },
              { targetRole: 'ALL' },
              { targetRole: 'STUDENT' }
            ],
            read: false
          }
        }),
        prisma.document.count({
          where: {
            studentId: student.id,
            status: 'PENDING'
          }
        })
      ])

      stats = {
        myEnrollments,
        myGrades,
        myAttendance,
        unreadNotifications,
        pendingDocuments
      }
    }

    return NextResponse.json({
      stats,
      academicYear,
      semester
    })

  } catch (error) {
    console.error('[DASHBOARD_STATS_GET]', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 