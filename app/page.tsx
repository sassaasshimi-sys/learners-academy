'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, GraduationCap, Users, ArrowRight, Lock, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { STIFF_SPRING } from '@/lib/premium-motion'

const PORTALS = [
  {
    title: 'Academic Administration',
    subtitle: 'Institutional Oversight',
    description: 'Manage institutional records, faculty registry, and high-level academic metrics with precision.',
    href: '/admin',
    icon: Shield,
    color: 'var(--primary)',
    bg: 'bg-primary/5',
    accent: 'Registry'
  },
  {
    title: 'Faculty Operations',
    subtitle: 'Pedagogical Hub',
    description: 'Orchestrate curriculum development, manage class schedules, and analyze student progress patterns.',
    href: '/teacher',
    icon: Users,
    color: 'var(--accent)',
    bg: 'bg-accent/5',
    accent: 'Faculty'
  },
  {
    title: 'Assessment & Examination',
    subtitle: 'High-Integrity Vault',
    description: 'Access secure proctored environments, undergo academic audits, and review analytical feedback.',
    href: '/student',
    icon: Lock,
    color: 'var(--primary)',
    bg: 'bg-primary/5',
    accent: 'Student'
  }
]

export default function MasterHubPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 text-foreground overflow-hidden relative flex flex-col">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center flex-grow justify-center">
        {/* Refined Header Section */}
        <motion.div 
          className="text-center mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/5 border border-primary/10 mb-6"
          >
            <GraduationCap className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent italic">
            Learners Academy
          </h1>
          
          <p className="text-xl text-muted-foreground font-serif italic leading-relaxed">
            A sophisticated digital environment engineered for academic excellence, institutional integrity, and pedagogical precision.
          </p>
        </motion.div>

        {/* Portal Selection Grid */}
        <motion.div 
          className="grid gap-6 md:grid-cols-3 w-full max-w-6xl"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {PORTALS.map((portal) => (
            <motion.div
              key={portal.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              className="group"
            >
              <Link href={portal.href} className="block h-full">
                <Card className="h-full border-border/50 bg-card/40 backdrop-blur-xl hover:border-primary/30 transition-premium shadow-premium group-hover:shadow-premium-lg overflow-hidden flex flex-col p-0">
                  {/* Visual Header Accent */}
                  <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-700 ease-in-out" />
                  
                  <CardContent className="p-8 flex flex-col items-center text-center flex-grow">
                    <div className={`p-5 rounded-2xl ${portal.bg} mb-6 border border-transparent group-hover:border-primary/10 transition-all duration-500`}>
                      <portal.icon className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" style={{ color: portal.color }} />
                    </div>
                    
                    <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors italic">
                      {portal.title}
                    </h3>
                    
                    <p className="text-editorial-label text-[9px] mb-4 opacity-50 tracking-[0.2em]">
                      {portal.subtitle}
                    </p>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-grow">
                      {portal.description}
                    </p>

                    <Button 
                      variant="outline" 
                      className="w-full h-11 border-primary/10 bg-primary/5 hover:bg-primary hover:text-white transition-premium group/btn"
                    >
                      Enter Portal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Institutional Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 flex flex-wrap justify-center gap-10 text-muted-foreground"
        >
          <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 hover:opacity-100 transition-opacity">
            <Lock className="w-3.5 h-3.5" />
            End-to-End Encryption
          </div>
          <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 hover:opacity-100 transition-opacity">
            <Shield className="w-3.5 h-3.5" />
            Audit Protocol Ready
          </div>
          <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 hover:opacity-100 transition-opacity">
            <GraduationCap className="w-3.5 h-3.5" />
            Academic Integrity
          </div>
        </motion.div>
      </div>

      {/* Subtle Bottom Bar */}
      <footer className="w-full py-6 px-8 border-t border-border/50 flex justify-between items-center text-[10px] uppercase tracking-widest font-medium text-muted-foreground/60">
        <span>&copy; {new Date().getFullYear()} The Learners Academy</span>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-primary transition-colors">Digital Privacy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}
