'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { getRoleRedirectPath } from '@/lib/auth-mock'
import { Logo } from '@/components/logo'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated && user) {
      router.push(getRoleRedirectPath(user.role))
    } else {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Logo size="lg" className="mb-8" />
      <Spinner className="w-12 h-12 text-primary" />
      <div className="mt-8 text-center">
        <p className="text-muted-foreground animate-pulse">Initializing your experience...</p>
        <Button 
          variant="link" 
          className="mt-4 text-xs text-muted-foreground"
          onClick={() => router.push('/auth/login')}
        >
          Stuck? Go to Login
        </Button>
      </div>
    </div>
  )
}
