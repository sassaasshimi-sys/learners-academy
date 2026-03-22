"use client"

import { useState } from "react"
import { mockAssignments, mockCourses, mockSubmissions } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  FileText,
  Upload,
  Send
} from "lucide-react"

export default function StudentAssignmentsPage() {
  const [selectedAssignment, setSelectedAssignment] = useState<typeof mockAssignments[0] | null>(null)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [submissionText, setSubmissionText] = useState("")

  // Simulate student's assignments (using student s1)
  const studentSubmissions = mockSubmissions.filter(s => s.studentId === "s1")
  
  const pendingAssignments = mockAssignments.filter(a => {
    const hasSubmitted = studentSubmissions.some(s => s.assignmentId === a.id)
    const isPastDue = new Date(a.dueDate) < new Date()
    return !hasSubmitted && !isPastDue
  })

  const submittedAssignments = mockAssignments.filter(a => {
    return studentSubmissions.some(s => s.assignmentId === a.id)
  })

  const overdueAssignments = mockAssignments.filter(a => {
    const hasSubmitted = studentSubmissions.some(s => s.assignmentId === a.id)
    const isPastDue = new Date(a.dueDate) < new Date()
    return !hasSubmitted && isPastDue
  })

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgencyBadge = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate)
    if (days < 0) {
      return <Badge variant="destructive">Overdue</Badge>
    } else if (days === 0) {
      return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Due Today</Badge>
    } else if (days <= 2) {
      return <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">Due Soon</Badge>
    } else if (days <= 7) {
      return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">{days} Days Left</Badge>
    } else {
      return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">{days} Days Left</Badge>
    }
  }

  const handleSubmit = () => {
    // Mock submission - in real app would save to database
    setSubmitDialogOpen(false)
    setSubmissionText("")
    setSelectedAssignment(null)
  }

  const AssignmentCard = ({ assignment, showSubmit = true }: { assignment: typeof mockAssignments[0], showSubmit?: boolean }) => {
    const course = mockCourses.find(c => c.id === assignment.courseId)
    const submission = studentSubmissions.find(s => s.assignmentId === assignment.id)
    
    return (
      <Card className="transition-all hover:border-primary/50 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{assignment.title}</h3>
                {!submission && getUrgencyBadge(assignment.dueDate)}
                {submission?.status === "graded" && (
                  <Badge className="bg-green-500/10 text-green-600">
                    Graded: {submission.grade}%
                  </Badge>
                )}
                {submission?.status === "submitted" && (
                  <Badge className="bg-primary/10 text-primary">Submitted</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{course?.name}</p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{assignment.description}</p>
              
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {assignment.maxPoints} Points
                </span>
              </div>
            </div>
            
            {showSubmit && !submission && (
              <Button
                onClick={() => {
                  setSelectedAssignment(assignment)
                  setSubmitDialogOpen(true)
                }}
              >
                Submit
              </Button>
            )}
            {submission && (
              <Button variant="outline" size="sm">
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          My Assignments
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and submit your course assignments
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-3">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{pendingAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{submittedAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-red-500/10 p-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{overdueAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-yellow-500/10 p-3">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {submittedAssignments.filter(a => 
                  studentSubmissions.find(s => s.assignmentId === a.id)?.status === "graded"
                ).length}
              </p>
              <p className="text-sm text-muted-foreground">Graded</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pendingAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="submitted" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Submitted ({submittedAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Overdue ({overdueAssignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h3 className="mt-4 font-medium">All caught up!</h3>
                <p className="text-sm text-muted-foreground">You have no pending assignments</p>
              </CardContent>
            </Card>
          ) : (
            pendingAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No submissions yet</h3>
                <p className="text-sm text-muted-foreground">Start working on your assignments</p>
              </CardContent>
            </Card>
          ) : (
            submittedAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} showSubmit={false} />
            ))
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {overdueAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h3 className="mt-4 font-medium">Great job!</h3>
                <p className="text-sm text-muted-foreground">You have no overdue assignments</p>
              </CardContent>
            </Card>
          ) : (
            overdueAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Submit Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">{selectedAssignment?.description}</p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span>Due: {selectedAssignment && new Date(selectedAssignment.dueDate).toLocaleDateString()}</span>
                <span>Points: {selectedAssignment?.maxPoints}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Answer</label>
              <Textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Attach File (Optional)</label>
              <div className="flex items-center gap-2">
                <Input type="file" className="flex-1" />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              Submit Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
