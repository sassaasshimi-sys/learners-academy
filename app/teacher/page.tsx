'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Users,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { mockCourses, mockAssignments, mockSubmissions, mockStudents } from '@/lib/mock-data'

// Filter to show only the teacher's data (for demo, using teacher-1)
const myCourses = mockCourses.filter(c => c.teacherId === 'teacher-1')
const myAssignments = mockAssignments.filter(a => a.teacherId === 'teacher-1')
const pendingSubmissions = mockSubmissions.filter(s => s.status === 'pending')

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
    title: 'Total Students',
    value: myCourses.reduce((acc, c) => acc + c.enrolled, 0),
    icon: Users,
    href: '/teacher/progress',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Active Assignments',
    value: myAssignments.filter(a => a.status === 'active').length,
    icon: FileText,
    href: '/teacher/assignments',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    title: 'Pending Reviews',
    value: pendingSubmissions.length,
    icon: Clock,
    href: '/teacher/submissions',
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
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s an overview of your teaching activities.
          </p>
        </div>
        <Button asChild>
          <Link href="/teacher/assignments?action=create">
            <Plus className="w-4 h-4 mr-2" />
            New Assignment
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover-lift cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Classes</CardTitle>
              <CardDescription>Your current teaching schedule</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/teacher/classes">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {myCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.schedule}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {course.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolled} students</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Assignments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Track assignment submissions</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/teacher/assignments">
                Manage
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {myAssignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.courseName}</p>
                  </div>
                  <Badge 
                    variant={assignment.status === 'active' ? 'default' : 'secondary'}
                    className={assignment.status === 'active' ? 'bg-success hover:bg-success/90' : ''}
                  >
                    {assignment.status}
                  </Badge>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Submissions</span>
                    <span className="font-medium">{assignment.submissionsCount}/{assignment.totalStudents}</span>
                  </div>
                  <Progress value={(assignment.submissionsCount / assignment.totalStudents) * 100} className="h-2" />
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pending Submissions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>Submissions waiting for your feedback</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/teacher/submissions">
              Review All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {pendingSubmissions.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-muted-foreground">All caught up! No pending reviews.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {submission.studentName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{submission.studentName}</p>
                      <p className="text-xs text-muted-foreground">{submission.assignmentTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Schedule</CardTitle>
          <CardDescription>Your classes for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myCourses.filter(c => c.status === 'active').slice(0, 3).map((course, index) => (
              <div key={course.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {9 + index}:00
                </div>
                <div className="flex-1">
                  <p className="font-medium">{course.title}</p>
                  <p className="text-sm text-muted-foreground">{course.schedule}</p>
                </div>
                <Badge variant="outline">{course.enrolled} students</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
