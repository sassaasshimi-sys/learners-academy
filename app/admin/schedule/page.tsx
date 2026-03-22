'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { toast } from 'sonner'
import {
  Plus,
  Search,
  CalendarDays,
  Clock,
  MapPin,
  Trash2,
  Edit,
} from 'lucide-react'
import { mockSchedules, mockTeachers } from '@/lib/mock-data'
import type { Schedule } from '@/lib/types'

const CLASS_LEVELS = [
  'Pre-Foundation',
  'Foundation One',
  'Foundation Two',
  'Foundation Three',
  'Beginners',
  'Level One',
  'Level Two',
  'Level Three',
  'Level Four',
  'Level Five',
  'Level Six',
  'Level Advanced',
  'Professional Advanced',
  'Speaking Class',
  'Grammar Speaking Class',
  'IELTS Preparation Course'
]

const TIME_SLOTS = [
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM',
  '08:00 PM - 09:00 PM',
]

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredSchedules = schedules.filter(s =>
    s.classTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newSchedule: Schedule = {
      id: `schedule-${Date.now()}`,
      classTitle: formData.get('classTitle') as string,
      teacherName: formData.get('teacherName') as string,
      timing: formData.get('timing') as string,
      roomNumber: formData.get('roomNumber') as string,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], // Default full week for simplicity
    }

    setSchedules([...schedules, newSchedule])
    setIsAddDialogOpen(false)
    toast.success('Schedule created successfully')
  }

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id))
    toast.success('Schedule removed')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Class Schedule
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage academic timings and classroom assignments
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Create Schedule</DialogTitle>
              <DialogDescription>
                Assign a teacher and room to a class time.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSchedule}>
              <FieldGroup className="py-4 space-y-4">
                <Field>
                  <FieldLabel>Class</FieldLabel>
                  <Select name="classTitle" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASS_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Teacher</FieldLabel>
                  <Select name="teacherName" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.name}>{teacher.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Class Timing</FieldLabel>
                  <Select name="timing" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(slot => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Room Number</FieldLabel>
                  <Input name="roomNumber" placeholder="e.g. 101" required />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Schedule</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Schedules</CardDescription>
            <CardTitle className="text-2xl">{schedules.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rooms in Use</CardDescription>
            <CardTitle className="text-2xl">{new Set(schedules.map(s => s.roomNumber)).size}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Daily Classes</CardDescription>
            <CardTitle className="text-2xl">{schedules.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Schedule Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Master Schedule</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search schedule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Class & Teacher</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{schedule.classTitle}</p>
                        <p className="text-xs text-muted-foreground">{schedule.teacherName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm">{schedule.timing}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-code">Room {schedule.roomNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(schedule.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
