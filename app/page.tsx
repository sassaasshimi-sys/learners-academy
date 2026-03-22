'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, GraduationCap, Users, ArrowRight, BookOpen, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const PORTALS = [
  {
    title: 'Academic Administration',
    subtitle: 'Management & Data Registry',
    description: 'Oversee student enrollments, faculty data, academic classes, and institutional metrics.',
    href: '/admin',
    icon: Shield,
    color: 'var(--color-primary)',
    bg: 'bg-primary/5',
    accent: 'Registry'
  },
  {
    title: 'Faculty Operations',
    subtitle: 'Pedagogical Orchestration',
    description: 'Manage class schedules, build assessment libraries, and analyze student performance patterns.',
    href: '/teacher',
    icon: Users,
    color: 'var(--color-accent)',
    bg: 'bg-accent/5',
    accent: 'Faculty Hub'
  },
  {
    title: 'Assessment & Examination',
    subtitle: 'Secure Academic Vault',
    description: 'Access proctored environments, undergo academic audits, and receive analytical feedback.',
    href: '/student',
    icon: Lock,
    color: 'var(--color-primary)',
    bg: 'bg-primary/5',
    accent: 'Vault Entry'
  }
]

export default function MasterHubPage() {
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-primary/30 text-white overflow-hidden relative">
      {/* Cinematic Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center min-h-screen justify-center">
        {/* Typographic Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
          </motion.div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight italic mb-4">
            The Learners Academy
          </h1>
          <p className="text-xl text-slate-400 font-serif italic max-w-2xl mx-auto">
            A digital ecosystem architected for institutional excellence, pedagogical precision, and academic integrity.
          </p>
        </motion.div>

        {/* Portal Grid */}
        <motion.div 
          className="grid gap-8 md:grid-cols-3 w-full max-w-7xl"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {PORTALS.map((portal) => (
            <motion.div
              key={portal.title}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 30 },
                show: { opacity: 1, scale: 1, y: 0 }
              }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link href={portal.href}>
                <Card className="h-full border-white/5 bg-white/[0.03] backdrop-blur-2xl overflow-hidden hover:border-white/20 transition-all duration-500 shadow-2xl relative">
                  {/* Hover Accent */}
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] uppercase tracking-widest font-bold text-white/50 border border-white/10">
                      {portal.accent}
                    </div>
                  </div>

                  <CardContent className="p-10 flex flex-col items-center text-center h-full">
                    <div className={`p-6 rounded-3xl ${portal.bg} mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                      <portal.icon className="w-10 h-10" style={{ color: portal.color }} />
                    </div>
                    
                    <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors italic">
                      {portal.title}
                    </h3>
                    <p className="text-editorial-label text-[10px] mb-6 opacity-60">
                      {portal.subtitle}
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed mb-10 min-h-[60px]">
                      {portal.description}
                    </p>

                    <Button className="mt-auto w-full group/btn h-12 text-md font-bold transition-premium hover:shadow-primary/20 hover:shadow-lg">
                      Enter Portal
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Integrity Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 flex gap-8 text-slate-500"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold">
            <Lock className="w-3 h-3" />
            Encrypted
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold">
            <Shield className="w-3 h-3" />
            Audit-Ready
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold">
            <GraduationCap className="w-3 h-3" />
            Institutional
          </div>
        </motion.div>
      </div>
    </div>
  )
}
