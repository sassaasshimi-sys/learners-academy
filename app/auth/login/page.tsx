'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { ShieldCheck, GraduationCap, BookOpen, ArrowLeft, Mail, Lock } from 'lucide-react'
import type { UserRole } from '@/lib/types/auth'

const portalOptions = [
  {
    role: 'admin' as UserRole,
    title: 'Administrator',
    description: 'Manage teachers, students, courses, and institute settings',
    icon: ShieldCheck,
    gradient: 'from-primary to-primary/80',
    demoEmail: 'admin@learnersacademy.com',
  },
  {
    role: 'teacher' as UserRole,
    title: 'Teacher',
    description: 'Manage classes, assignments, and track student progress',
    icon: BookOpen,
    gradient: 'from-accent to-accent/80',
    demoEmail: 'teacher@learnersacademy.com',
  },
  {
    role: 'student' as UserRole,
    title: 'Student',
    description: 'Access courses, submit assignments, and view grades',
    icon: GraduationCap,
    gradient: 'from-success to-success/80',
    demoEmail: 'student@learnersacademy.com',
  },
]

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const selectedPortal = portalOptions.find(p => p.role === selectedRole)

  const handleSelectRole = (role: UserRole) => {
    const portal = portalOptions.find(p => p.role === role)
    setSelectedRole(role)
    setEmail(portal?.demoEmail || '')
    setPassword('demo123')
    setError('')
  }

  const handleBack = () => {
    setSelectedRole(null)
    setEmail('')
    setPassword('')
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return

    setError('')

    try {
      await login({ email, password, role: selectedRole })
      toast.success('Welcome back!', {
        description: `Signed in as ${selectedPortal?.title}`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      toast.error('Login failed', {
        description: 'Please check your credentials and try again',
      })
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Logo Header */}
      <div className="flex flex-col items-center mb-8">
        <Logo size="lg" href={null} className="mb-4" />
        <p className="text-muted-foreground text-center text-balance">
          Premium English Language Education
        </p>
      </div>

      {/* Portal Selection */}
      {!selectedRole ? (
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-serif text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Select your portal to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-3">
              {portalOptions.map((portal) => {
                const Icon = portal.icon
                return (
                  <button
                    key={portal.role}
                    onClick={() => handleSelectRole(portal.role)}
                    className="group relative flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-secondary/50 transition-all duration-200 text-left hover-lift"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-0.5">
                        {portal.title} Portal
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {portal.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 pt-2">
            <div className="w-full h-px bg-border" />
            <p className="text-sm text-muted-foreground text-center">
              New to The Learners Academy?{' '}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      ) : (
        /* Login Form */
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 -ml-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to portal selection
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedPortal?.gradient} flex items-center justify-center shadow-md`}>
                {selectedPortal && (() => {
                  const Icon = selectedPortal.icon
                  return <Icon className="w-5 h-5 text-white" />
                })()}
              </div>
              <div>
                <CardTitle className="font-serif text-xl">{selectedPortal?.title} Login</CardTitle>
              </div>
            </div>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </Field>

                {error && <FieldError>{error}</FieldError>}

                <div className="flex items-center justify-between">
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-4 pt-2">
            <div className="w-full flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Demo Credentials</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="w-full bg-muted/50 rounded-lg p-3 text-sm">
              <p className="text-muted-foreground">
                Email: <span className="text-foreground font-mono">{selectedPortal?.demoEmail}</span>
              </p>
              <p className="text-muted-foreground">
                Password: <span className="text-foreground font-mono">demo123</span>
              </p>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
