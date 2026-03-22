'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Archive,
  Users,
  Clock,
  Calendar,
  BookOpen,
} from 'lucide-react'
import { mockCourses, mockTeachers } from '@/lib/mock-data'
import type { Course } from '@/lib/types'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const teacherId = formData.get('teacher') as string
    const teacher = mockTeachers.find(t => t.id === teacherId)
    
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      level: formData.get('level') as Course['level'],
      teacherId: teacherId,
      teacherName: teacher?.name || 'TBD',
      capacity: parseInt(formData.get('capacity') as string) || 20,
      enrolled: 0,
      status: 'draft',
      schedule: formData.get('schedule') as string,
      duration: formData.get('duration') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    }
    setCourses([...courses, newCourse])
    setIsAddDialogOpen(false)
    toast.success('Course created successfully')
  }

  const handleStatusChange = (course: Course, newStatus: Course['status']) => {
    setCourses(courses.map(c => 
      c.id === course.id ? { ...c, status: newStatus } : c
    ))
    toast.success(`Course ${newStatus}`)
  }

  const handleDelete = (course: Course) => {
    setCourses(courses.filter(c => c.id !== course.id))
    toast.success('Course deleted')
  }

  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'beginner':
        return 'bg-success/10 text-success border-success/20'
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'advanced':
        return 'bg-primary/10 text-primary border-primary/20'
    }
  }

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success hover:bg-success/90'
      case 'completed':
        return 'bg-primary hover:bg-primary/90'
      case 'draft':
        return 'bg-secondary text-secondary-foreground'
      case 'archived':
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your English language courses
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new course.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCourse}>
              <FieldGroup className="py-4">
                <Field>
                  <FieldLabel>Course Title</FieldLabel>
                  <Input name="title" placeholder="e.g., Advanced Grammar Mastery" required />
                </Field>
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea 
                    name="description" 
                    placeholder="Describe what students will learn..."
                    rows={3}
                    required 
                  />
                </Field>
                <div className="grid gap-4 grid-cols-2">
                  <Field>
                    <FieldLabel>Level</FieldLabel>
                    <Select name="level" defaultValue="beginner">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Capacity</FieldLabel>
                    <Input name="capacity" type="number" placeholder="20" defaultValue={20} />
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Assign Teacher</FieldLabel>
                  <Select name="teacher">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeachers.filter(t => t.status === 'active').map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Schedule</FieldLabel>
                  <Input name="schedule" placeholder="e.g., Mon, Wed, Fri - 9:00 AM" required />
                </Field>
                <div className="grid gap-4 grid-cols-2">
                  <Field>
                    <FieldLabel>Duration</FieldLabel>
                    <Input name="duration" placeholder="e.g., 8 weeks" required />
                  </Field>
                  <Field>
                    <FieldLabel>Start Date</FieldLabel>
                    <Input name="startDate" type="date" required />
                  </Field>
                </div>
                <Field>
                  <FieldLabel>End Date</FieldLabel>
                  <Input name="endDate" type="date" required />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Course</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="text-3xl">{courses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Courses</CardDescription>
            <CardTitle className="text-3xl text-success">
              {courses.filter(c => c.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Enrollment</CardDescription>
            <CardTitle className="text-3xl">
              {courses.reduce((acc, c) => acc + c.enrolled, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Capacity Used</CardDescription>
            <CardTitle className="text-3xl">
              {Math.round(
                courses.reduce((acc, c) => acc + (c.enrolled / c.capacity * 100), 0) / courses.length
              )}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No courses found</p>
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} className="hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        setSelectedCourse(course)
                        setIsViewDialogOpen(true)
                      }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {course.status === 'draft' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(course, 'active')}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {course.status === 'active' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(course, 'completed')}>
                          <Archive className="w-4 h-4 mr-2" />
                          Mark Complete
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(course)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg leading-snug line-clamp-2 mt-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Instructor</span>
                  <span className="font-medium">{course.teacherName}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Enrollment</span>
                    <span className="font-medium">{course.enrolled}/{course.capacity}</span>
                  </div>
                  <Progress value={(course.enrolled / course.capacity) * 100} className="h-2" />
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolled}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge className={getStatusColor(course.status)}>
                    {course.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(course.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Course Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6 py-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={getLevelColor(selectedCourse.level)}>
                    {selectedCourse.level}
                  </Badge>
                  <Badge className={getStatusColor(selectedCourse.status)}>
                    {selectedCourse.status}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold">{selectedCourse.title}</h3>
                <p className="text-muted-foreground mt-2">{selectedCourse.description}</p>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="font-medium">{selectedCourse.teacherName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{selectedCourse.duration}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Schedule</p>
                <p className="font-medium">{selectedCourse.schedule}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Enrollment Capacity</span>
                  <span className="font-medium">{selectedCourse.enrolled} / {selectedCourse.capacity}</span>
                </div>
                <Progress value={(selectedCourse.enrolled / selectedCourse.capacity) * 100} className="h-3" />
              </div>

              <div className="grid gap-4 grid-cols-2 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedCourse.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedCourse.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
