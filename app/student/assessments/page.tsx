'use client'

import { useState, useEffect } from "react"
import { mockAssessments, mockQuestions } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Lock,
  Timer
} from "lucide-react"
import type { AssessmentTemplate, Question } from "@/lib/types"

export default function StudentAssessmentsPage() {
  const [activeTest, setActiveTest] = useState<AssessmentTemplate | null>(null)
  const [isTestEngineOpen, setIsTestEngineOpen] = useState(false)
  const [randomizedQuestions, setRandomizedQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)

  // Test Engine Logic
  const startTest = (assessment: AssessmentTemplate) => {
    // 1. Get relevant questions from library
    const pool = mockQuestions.filter(q => q.phase === assessment.phase || q.phase === 'Both')
    
    // 2. Randomize and select (e.g. 5 questions)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 5) // Mocking a 5-question test
    
    setRandomizedQuestions(selected)
    setActiveTest(assessment)
    setTimeLeft(assessment.durationMinutes * 60)
    setIsTestEngineOpen(true)
    setCurrentQuestionIndex(0)
    setAnswers({})
  }

  // Timer
  useEffect(() => {
    if (isTestEngineOpen && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && isTestEngineOpen) {
      finishTest()
    }
  }, [timeLeft, isTestEngineOpen])

  const finishTest = () => {
    setIsTestEngineOpen(false)
    toast.success("Assessment submitted successfully! Your teacher will review it shortly.")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          Assessments
        </h1>
        <p className="mt-2 text-muted-foreground">
          View your upcoming and past assessments
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockAssessments.map((test) => (
          <Card key={test.id} className="group overflow-hidden border-none shadow-sm ring-1 ring-border bg-card hover:ring-primary/50 transition-all">
            <div className="h-2 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={test.phase === 'First Test' ? 'outline' : 'secondary'}>
                  {test.phase}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {test.durationMinutes} mins
                </div>
              </div>
              <CardTitle className="mt-2 font-serif">{test.title}</CardTitle>
              <CardDescription>
                Nature: {test.nature} • {test.totalMarks} Marks
              </CardDescription>
            </CardHeader>
            <CardFooter className="bg-muted/30 py-3">
              <Button 
                onClick={() => startTest(test)} 
                className="w-full group/btn"
              >
                Start Assessment
                <Play className="w-4 h-4 ml-2 fill-current group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Test Engine Dialog */}
      <Dialog open={isTestEngineOpen} onOpenChange={(open) => {
        if (!open) {
          if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
            setIsTestEngineOpen(false)
          }
        }
      }}>
        <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b bg-muted/30">
            <div className="flex justify-between items-center w-full">
              <div>
                <DialogTitle className="font-serif">{activeTest?.title}</DialogTitle>
                <DialogDescription>Question {currentQuestionIndex + 1} of {randomizedQuestions.length}</DialogDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono text-sm ${timeLeft < 300 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-primary/10 text-primary'}`}>
                  <Timer className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8">
            {randomizedQuestions.length > 0 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="uppercase tracking-[0.2em] text-[10px]">
                    {randomizedQuestions[currentQuestionIndex].category}
                  </Badge>
                  <h3 className="text-xl font-medium leading-relaxed">
                    {randomizedQuestions[currentQuestionIndex].content}
                  </h3>
                </div>

                {randomizedQuestions[currentQuestionIndex].type === 'MCQ' ? (
                  <RadioGroup 
                    value={answers[randomizedQuestions[currentQuestionIndex].id]}
                    onValueChange={(val) => setAnswers({...answers, [randomizedQuestions[currentQuestionIndex].id]: val})}
                    className="space-y-3 pt-4"
                  >
                    {randomizedQuestions[currentQuestionIndex].options?.map((opt, i) => (
                      <div key={i} className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setAnswers({...answers, [randomizedQuestions[currentQuestionIndex].id]: opt})}>
                        <RadioGroupItem value={opt} id={`opt-${i}`} />
                        <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer leading-tight">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2 pt-4">
                    <Label>Your Answer</Label>
                    <Textarea 
                      placeholder="Type your response here..." 
                      className="min-h-[200px]"
                      value={answers[randomizedQuestions[currentQuestionIndex].id] || ''}
                      onChange={(e) => setAnswers({...answers, [randomizedQuestions[currentQuestionIndex].id]: e.target.value})}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="p-6 border-t bg-muted/30 flex justify-between items-center sm:justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQuestionIndex === randomizedQuestions.length - 1 ? (
                <Button onClick={finishTest} className="bg-success hover:bg-success/90">
                  Finish & Submit
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </DialogFooter>
          
          <div className="px-6 pb-2">
            <Progress value={((currentQuestionIndex + 1) / randomizedQuestions.length) * 100} className="h-1" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
