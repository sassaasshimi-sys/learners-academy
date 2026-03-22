'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Shield, GraduationCap, Users, ArrowRight, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
    color: 'var(--primary)',
    bg: 'bg-primary/5',
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
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center flex-grow justify-center">
        {/* Refined Header Section */}
        <motion.div 
          className="text-center mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-8"
          >
            <div className="relative w-24 h-24 mx-auto p-4 rounded-3xl bg-white shadow-premium border border-border/50 group hover:scale-105 transition-transform duration-500">
              <Image 
                src="/images/logo.png" 
                alt="The Learners Academy Logo" 
                fill 
                className="object-contain p-4"
                priority
              />
            </div>
          </motion.div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground leading-tight">
            The Learners Academy
          </h1>
          
          <p className="text-lg text-muted-foreground font-serif leading-relaxed px-4">
            A sophisticated digital environment engineered for academic excellence, institutional integrity, and pedagogical precision.
          </p>
        </motion.div>

        {/* Portal Selection Grid */}
        <motion.div 
          className="grid gap-6 md:grid-cols-3 w-full max-w-5xl"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {PORTALS.map((portal) => (
            <motion.div
              key={portal.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="group"
            >
              <Link href={portal.href} className="block h-full">
                <Card className="h-full border-border/50 bg-card/40 backdrop-blur-xl hover:border-primary/20 transition-premium shadow-premium group-hover:shadow-premium-lg overflow-hidden flex flex-col p-0">
                  <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                  
                  <CardContent className="p-7 flex flex-col items-center text-center flex-grow">
                    <div className={`p-4 rounded-2xl ${portal.bg} mb-5 border border-transparent group-hover:border-primary/10 transition-all duration-300`}>
                      <portal.icon className="w-7 h-7 transition-transform duration-500 group-hover:scale-110" style={{ color: portal.color }} />
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold mb-1.5 group-hover:text-primary transition-colors">
                      {portal.title}
                    </h3>
                    
                    <p className="text-editorial-label text-[8px] mb-3 opacity-40 tracking-[0.2em] font-bold">
                      {portal.subtitle}
                    </p>
                    
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-6 flex-grow">
                      {portal.description}
                    </p>

                    <Button 
                      variant="outline" 
                      className="w-full h-10 text-xs border-primary/10 bg-primary/5 hover:bg-primary hover:text-white transition-premium group/btn px-4"
                    >
                      Enter Portal
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
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
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-muted-foreground"
        >
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold opacity-30 hover:opacity-100 transition-opacity">
            <Lock className="w-3 h-3" />
            Encryption
          </div>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold opacity-30 hover:opacity-100 transition-opacity">
            <Shield className="w-3 h-3" />
            Audit Ready
          </div>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold opacity-30 hover:opacity-100 transition-opacity">
            <GraduationCap className="w-3 h-3" />
            Integrity
          </div>
        </motion.div>
      </div>

      {/* Subtle Bottom Bar */}
      <footer className="w-full py-4 px-8 border-t border-border/40 flex justify-between items-center text-[9px] uppercase tracking-widest font-medium text-muted-foreground/50">
        <span>&copy; {new Date().getFullYear()} The Learners Academy</span>
        <div className="flex gap-5">
          <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  )
}
