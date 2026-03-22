"use client"

import { useState } from "react"
import { mockSubmissions, mockAssignments, mockStudents, mockCourses } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, FileText, CheckCircle, Clock, AlertCircle, Download, Eye } from "lucide-react"

export default function SubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState<typeof mockSubmissions[0] | null>(null)
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false)
  const [grade, setGrade] = useState("")
  const [feedback, setFeedback] = useState("")

  const filteredSubmissions = mockSubmissions.filter(submission => {
    const student = mockStudents.find(s => s.id === submission.studentId)
    const assignment = mockAssignments.find(a => a.id === submission.assignmentId)
    
    const matchesSearch = student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment?.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "submitted":
        return <Clock className="h-4 w-4 text-primary" />
      case "late":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Graded</Badge>
      case "submitted":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Pending Review</Badge>
      case "late":
        return <Badge variant="destructive">Late</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleGrade = () => {
    // Mock grading - in real app would save to database
    setGradeDialogOpen(false)
    setGrade("")
    setFeedback("")
    setSelectedSubmission(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">Submissions</h1>
        <p className="mt-2 text-muted-foreground">Review and grade student submissions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Submissions</SelectItem>
            <SelectItem value="submitted">Pending Review</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
            <SelectItem value="late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{mockSubmissions.filter(s => s.status === "submitted").length}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{mockSubmissions.filter(s => s.status === "graded").length}</p>
              <p className="text-sm text-muted-foreground">Graded</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-red-500/10 p-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{mockSubmissions.filter(s => s.status === "late").length}</p>
              <p className="text-sm text-muted-foreground">Late Submissions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>Click on a submission to review and grade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubmissions.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No submissions found
              </div>
            ) : (
              filteredSubmissions.map((submission) => {
                const student = mockStudents.find(s => s.id === submission.studentId)
                const assignment = mockAssignments.find(a => a.id === submission.assignmentId)
                const course = mockCourses.find(c => c.id === assignment?.courseId)

                return (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student?.avatar} alt={student?.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {student?.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{student?.name}</p>
                          {getStatusBadge(submission.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {assignment?.title} • {course?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {submission.grade && (
                        <span className="mr-2 font-semibold text-primary">{submission.grade}%</span>
                      )}
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setGradeDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {submission.status !== "graded" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission)
                            setGradeDialogOpen(true)
                          }}
                        >
                          Grade
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              {selectedSubmission && (() => {
                const student = mockStudents.find(s => s.id === selectedSubmission.studentId)
                const assignment = mockAssignments.find(a => a.id === selectedSubmission.assignmentId)
                return `Review ${student?.name}'s submission for "${assignment?.title}"`
              })()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium">Submission Content</p>
              <p className="text-sm text-muted-foreground">
                {selectedSubmission?.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
              </p>
              {selectedSubmission?.fileUrl && (
                <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                  <Download className="mr-1 h-3 w-3" />
                  Download attached file
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Grade (0-100)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Feedback</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback for the student..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGrade}>
              Submit Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
