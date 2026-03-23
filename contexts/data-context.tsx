'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { 
  Teacher, Student, Course, Assignment, Submission, 
  DashboardStats, ChartData, Schedule, Question, 
  AssessmentTemplate, StudentTest 
} from '@/lib/types'
import * as mockData from '@/lib/mock-data'

const DATA_STORAGE_KEY = 'learners_academy_data'

interface DataContextType {
  teachers: Teacher[]
  students: Student[]
  courses: Course[]
  assignments: Assignment[]
  submissions: Submission[]
  stats: DashboardStats
  schedules: Schedule[]
  questions: Question[]
  assessments: AssessmentTemplate[]
  enrollments: any[]
  
  // Actions
  enrollStudent: (student: Student) => void
  removeStudent: (id: string) => void
  updateStudentStatus: (id: string, status: Student['status']) => void
  publishAssessment: (assessment: AssessmentTemplate) => void
  removeAssessment: (id: string) => void
  submitTestResult: (result: StudentTest) => void
  updateCourseProgress: (courseId: string, progress: number) => void
  addQuestion: (question: Question) => void
  deleteQuestion: (id: string) => void
  
  // Reset
  resetToDefaults: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<{
    teachers: Teacher[]
    students: Student[]
    courses: Course[]
    assignments: Assignment[]
    submissions: Submission[]
    stats: DashboardStats
    schedules: Schedule[]
    questions: Question[]
    assessments: AssessmentTemplate[]
    enrollments: any[]
  }>({
    teachers: [],
    students: [],
    courses: [],
    assignments: [],
    submissions: [],
    stats: mockData.mockDashboardStats,
    schedules: [],
    questions: [],
    assessments: [],
    enrollments: [],
  })

  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from localStorage or mockData
  useEffect(() => {
    const initializeData = () => {
      try {
        const stored = localStorage.getItem(DATA_STORAGE_KEY)
        if (stored) {
          setData(JSON.parse(stored))
          console.log('Restored data from storage')
        } else {
          // Fallback to initial mocks
          const initial = {
            teachers: mockData.mockTeachers,
            students: mockData.mockStudents,
            courses: mockData.mockCourses,
            assignments: mockData.mockAssignments,
            submissions: mockData.mockSubmissions,
            stats: mockData.mockDashboardStats,
            schedules: mockData.mockSchedules,
            questions: mockData.mockQuestions,
            assessments: mockData.mockAssessments,
            enrollments: mockData.mockEnrollments,
          }
          setData(initial)
          localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(initial))
          console.log('Initialized with mock data')
        }
      } catch (error) {
        console.error('Failed to initialize data:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeData()
  }, [])

  // Persist state changes to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data))
    }
  }, [data, isInitialized])

  // Helper to generate a unique access code for assessments
  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Actions
  const enrollStudent = useCallback((student: Student) => {
    setData(prev => ({
      ...prev,
      students: [...prev.students, student],
      stats: {
        ...prev.stats,
        totalStudents: prev.stats.totalStudents + 1
      }
    }))
  }, [])

  const removeStudent = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id),
      stats: {
        ...prev.stats,
        totalStudents: Math.max(0, prev.stats.totalStudents - 1)
      }
    }))
  }, [])

  const updateStudentStatus = useCallback((id: string, status: Student['status']) => {
    setData(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, status } : s)
    }))
  }, [])

  const publishAssessment = useCallback((assessment: AssessmentTemplate) => {
    const assessmentWithCode = {
      ...assessment,
      accessCode: assessment.accessCode || generateAccessCode()
    }
    setData(prev => ({
      ...prev,
      assessments: [assessmentWithCode, ...prev.assessments]
    }))
  }, [])

  const removeAssessment = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      assessments: prev.assessments.filter(a => a.id !== id)
    }))
  }, [])

  const submitTestResult = useCallback((result: StudentTest) => {
    setData(prev => {
      const template = prev.assessments.find(a => a.id === result.templateId)
      
      const newSubmission: Submission = {
        id: `sub-${Date.now()}`,
        assignmentId: result.templateId,
        assignmentTitle: template?.title || 'Test',
        studentId: result.studentId,
        studentName: result.studentName,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        grade: result.score,
      }

      return {
        ...prev,
        submissions: [newSubmission, ...prev.submissions],
      }
    })
    
    toast.success('Test submitted successfully')
  }, [])

  const updateCourseProgress = useCallback((courseId: string, progress: number) => {
    setData(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === courseId ? { ...c, progress } : c)
    }))
  }, [])

  const addQuestion = useCallback((question: Question) => {
    setData(prev => ({
      ...prev,
      questions: [question, ...prev.questions]
    }))
  }, [])

  const deleteQuestion = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }))
  }, [])

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(DATA_STORAGE_KEY)
    const initial = {
      teachers: mockData.mockTeachers,
      students: mockData.mockStudents,
      courses: mockData.mockCourses,
      assignments: mockData.mockAssignments,
      submissions: mockData.mockSubmissions,
      stats: mockData.mockDashboardStats,
      schedules: mockData.mockSchedules,
      questions: mockData.mockQuestions,
      assessments: mockData.mockAssessments,
      enrollments: mockData.mockEnrollments,
    }
    setData(initial)
    toast.info('Database reset to defaults')
  }, [])

  return (
    <DataContext.Provider value={{
      ...data,
      enrollStudent,
      removeStudent,
      updateStudentStatus,
      publishAssessment,
      removeAssessment,
      submitTestResult,
      updateCourseProgress,
      addQuestion,
      deleteQuestion,
      resetToDefaults,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
