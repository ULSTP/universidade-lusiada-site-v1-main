import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Rotas protegidas que requerem autenticação
    const protectedRoutes = [
      '/portal-aluno',
      '/portal-professor', 
      '/admin',
      '/api/auth/me',
      '/api/auth/change-password'
    ]

    // Verificar se a rota atual é protegida
    const isProtectedRoute = protectedRoutes.some(route => 
      path.startsWith(route)
    )

    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Verificar permissões específicas por papel
    if (path.startsWith('/portal-aluno') && token?.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (path.startsWith('/portal-professor') && token?.role !== 'TEACHER') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/portal-aluno/:path*',
    '/portal-professor/:path*', 
    '/admin/:path*',
    '/api/auth/me',
    '/api/auth/change-password'
  ]
} 