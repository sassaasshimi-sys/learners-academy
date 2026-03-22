'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { getRoleRedirectPath } from '@/lib/auth-mock'
import { Logo } from '@/components/logo'
import { Spinner } from '@/components/ui/spinner'

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <Logo size="xl" href={null} className="mb-8" />
      <div className="flex items-center gap-3 text-muted-foreground">
        <Spinner className="w-5 h-5" />
        <span>Loading...</span>
      </div>
    </div>
  )
}
