'use client'

import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Hash, 
  Phone,
  ShieldCheck
} from 'lucide-react'

export default function TeacherSettingsPage() {
  const { user } = useAuth()

  const profileData = [
    {
      label: 'Teacher Name',
      value: user?.name,
      icon: User,
      description: 'The full name displayed across the academy'
    },
    {
      label: 'Email Address',
      value: user?.email,
      icon: Mail,
      description: 'Primary contact and login email'
    },
    {
      label: 'Employee ID',
      value: user?.employeeId || 'EMP-101', // Fallback for demo
      icon: Hash,
      description: 'Institutional identification number'
    },
    {
      label: 'Phone Number',
      value: user?.phone || '+92 300 1234567', // Fallback for demo
      icon: Phone,
      description: 'Contact number for administrative purposes'
    }
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Profile Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-editorial-meta">
          Manage your professional identity within the academy registry.
        </p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border overflow-hidden bg-card">
        <CardHeader className="bg-muted/30 border-b pb-4 pt-4 px-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-serif text-primary border border-primary/20">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'T'}
            </div>
            <div>
              <CardTitle className="font-serif text-xl leading-none">{user?.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 tracking-widest uppercase font-bold text-primary border-primary/20 bg-primary/5">
                  Registry: Teacher
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                  <ShieldCheck className="w-3 h-3 text-success/70" />
                  <span>Verified Faculty</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-px bg-border/50">
            {profileData.map((item, index) => (
              <div key={index} className="bg-card p-5 hover:bg-muted/10 transition-colors group">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{item.label}</p>
                    <item.icon className="w-3.5 h-3.5 text-primary/30 group-hover:text-primary/60 transition-colors" />
                  </div>
                  <p className="font-medium text-base text-foreground leading-tight">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl bg-primary/[0.03] border border-primary/10 p-5">
        <div className="flex items-start gap-3">
          <div className="p-1 rounded bg-primary/10 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-primary text-sm uppercase tracking-wider">Administrative Registry</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              These records are synchronized with the central administration database. 
              Contact the Registrar&apos;s Office to initiate any institutional updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
