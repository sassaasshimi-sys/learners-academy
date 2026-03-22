'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Plus,
  Search,
  Calendar,
  Users,
  FileText,
  Edit,
  Trash2,
  Eye,
  Clock,
} from 'lucide-react'
import { mockAssignments, mockCourses } from '@/lib/mock-data'
import type { Assignment } from '@/lib/types'

const myClasses = mockCourses.filter(c => c.teacherId === 'teacher-1')
const myAssignments = mockAssignments.filter(a => a.teacherId === 'teacher-1')

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(myAssignments)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateAssignment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const courseId = formData.get('course') as string
    const course = myClasses.find(c => c.id === courseId)
    
    const newAssignment: Assignment = {
      id: `assignment-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      courseId: courseId,
      courseName: course?.title || '',
      teacherId: 'teacher-1',
      dueDate: formData.get('dueDate') as string,
      status: 'active',
      submissionsCount: 0,
      totalStudents: course?.enrolled || 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setAssignments([newAssignment, ...assignments])
    setIsCreateOpen(false)
    toast.success('Assignment created successfully')
  }

  const handleDelete = (assignment: Assignment) => {
    setAssignments(assignments.filter(a => a.id !== assignment.id))
    toast.success('Assignment deleted')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Assignments
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage assignments for your classes
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Add a new assignment for your students
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAssignment}>
              <FieldGroup className="py-4">
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input name="title" placeholder="Assignment title" required />
                </Field>
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea 
                    name="description" 
                    placeholder="Describe the assignment requirements..."
                    rows={3}
                    required 
                  />
                </Field>
                <Field>
                  <FieldLabel>Class</FieldLabel>
                  <Select name="course" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {myClasses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Due Date</FieldLabel>
                  <Input name="dueDate" type="date" required />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Assignment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Assignments</CardDescription>
            <CardTitle className="text-3xl">{assignments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-success">
              {assignments.filter(a => a.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Closed</CardDescription>
            <CardTitle className="text-3xl text-muted-foreground">
              {assignments.filter(a => a.status === 'closed').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Submission Rate</CardDescription>
            <CardTitle className="text-3xl">
              {Math.round(
                assignments.reduce((acc, a) => acc + (a.submissionsCount / a.totalStudents * 100), 0) / assignments.length
              )}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No assignments found</p>
            </CardContent>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={assignment.status === 'active' ? 'default' : 'secondary'}
                        className={assignment.status === 'active' ? 'bg-success hover:bg-success/90' : ''}
                      >
                        {assignment.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{assignment.courseName}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{assignment.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{assignment.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{assignment.submissionsCount}/{assignment.totalStudents} submitted</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Created {new Date(assignment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Submissions</span>
                        <span className="font-medium">
                          {Math.round((assignment.submissionsCount / assignment.totalStudents) * 100)}%
                        </span>
                      </div>
                      <Progress value={(assignment.submissionsCount / assignment.totalStudents) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(assignment)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
