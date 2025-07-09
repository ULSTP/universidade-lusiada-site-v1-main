"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  const logout = async () => {
    await signOut({ redirect: false })
    router.push('/auth/signin')
  }

  const requireAuth = (redirectTo = '/auth/signin') => {
    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push(redirectTo)
      }
    }, [status, router, redirectTo])

    return { isAuthenticated, isLoading, session }
  }

  const requireRole = (requiredRole: string, redirectTo = '/auth/signin') => {
    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push(redirectTo)
      } else if (status === 'authenticated' && session?.user?.role !== requiredRole) {
        router.push('/unauthorized')
      }
    }, [status, session, router, redirectTo, requiredRole])

    return { isAuthenticated, isLoading, session, hasRole: session?.user?.role === requiredRole }
  }

  return {
    session,
    isAuthenticated,
    isLoading,
    logout,
    requireAuth,
    requireRole,
    user: session?.user
  }
} 