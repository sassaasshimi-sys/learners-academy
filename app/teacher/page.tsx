'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Users,
  ClipboardList,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  Plus,
  Library,
  TrendingUp
} from 'lucide-react'
import { mockCourses, mockAssignments, mockSubmissions } from '@/lib/mock-data'

// Filter to show only the teacher's data (for demo, using teacher-1)
const myCourses = mockCourses.filter(c => c.teacherId === 'teacher-1')
const pendingSubmissions = mockSubmissions.filter(s => s.status === 'submitted')

const stats = [
  {
    title: 'My Classes',
    value: myCourses.length,
    icon: BookOpen,
    href: '/teacher/classes',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Library Blocks',
    value: 24, // Placeholder for total questions
    icon: Library,
    href: '/teacher/library',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Active Tests',
    value: 3,
    icon: ClipboardList,
    href: '/teacher/assessments',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    title: 'Pending Scores',
    value: pendingSubmissions.length,
    icon: Clock,
    href: '/teacher/results',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
]

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-editorial-label">
            Elevating education through digital excellence.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/teacher/library">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Link>
          </Button>
          <Button asChild>
            <Link href="/teacher/assessments">
              Generate Test
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover-lift cursor-pointer border-none shadow-sm ring-1 ring-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest leading-none">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-serif">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Assessments */}
        <Card className="border-none shadow-sm ring-1 ring-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif">Active Assessments</CardTitle>
              <CardDescription>Track ongoing test participation</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/5">
              <Link href="/teacher/assessments">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAssignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="p-4 rounded-xl border hover:bg-muted/30 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">{assignment.title}</h4>
                    <p className="text-xs text-muted-foreground">{assignment.courseName}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] tracking-wider uppercase font-bold text-success border-success/20 bg-success/5">
                    Active
                  </Badge>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                    <span>Submissions</span>
                    <span>{assignment.submissionsCount}/{assignment.totalStudents}</span>
                  </div>
                  <Progress value={(assignment.submissionsCount / assignment.totalStudents) * 100} className="h-1.5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Test Performance */}
        <Card className="border-none shadow-sm ring-1 ring-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-lg">Class Performance</CardTitle>
              <CardDescription>Overall student progress</CardDescription>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{course.title}</span>
                    <span className="text-muted-foreground">Avg. 84%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Phases */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-primary/40">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">First Test Phase</CardTitle>
            <CardContent className="p-0 pt-2">
              <p className="text-sm text-muted-foreground italic">"Pulling 12 questions from Grammar, Reading, and Vocab for the current term's mid-assessments."</p>
            </CardContent>
          </CardHeader>
        </Card>
        <Card className="border-l-4 border-l-accent/40">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-accent">Last Test Phase</CardTitle>
            <CardContent className="p-0 pt-2">
              <p className="text-sm text-muted-foreground italic">"Comprehensive final assessment encompassing all four skills and grammar fundamentals."</p>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
