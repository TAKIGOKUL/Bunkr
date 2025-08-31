'use client'

import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Course, Session } from '@/lib/supabase'
import { Plus, BookOpen, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  const { data: courses = [] } = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('owner', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Course[]
    },
    enabled: !!user?.id,
  })

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          courses!inner(owner)
        `)
        .eq('courses.owner', user?.id)

      if (error) throw error
      return data as (Session & { courses: { owner: string } })[]
    },
    enabled: !!user?.id,
  })

  const calculateAttendance = (courseId: string) => {
    const courseSessions = sessions.filter(s => s.course_id === courseId)
    if (courseSessions.length === 0) return 0

    const totalSessions = courseSessions.filter(s => s.status !== 'excused').length
    if (totalSessions === 0) return 0

    const presentCount = courseSessions.filter(s => s.status === 'present').length
    const lateCount = courseSessions.filter(s => s.status === 'late').length

    return Math.round(((presentCount + lateCount * 0.5) / totalSessions) * 100)
  }

  const overallAttendance = courses.length > 0 
    ? Math.round(courses.reduce((acc, course) => acc + calculateAttendance(course.id), 0) / courses.length)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <Link
          href="/dashboard/courses/new"
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-text-primary">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <Calendar className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Sessions</p>
              <p className="text-2xl font-bold text-text-primary">{sessions.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Overall Attendance</p>
              <p className="text-2xl font-bold text-text-primary">{overallAttendance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Your Courses</h2>
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary mb-4">No courses yet</p>
            <Link href="/dashboard/courses/new" className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Course
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-card/50 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-text-primary">{course.title}</h3>
                  <p className="text-sm text-text-secondary">
                    Created {new Date(course.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-text-secondary">Attendance</p>
                    <p className="text-lg font-semibold text-accent">
                      {calculateAttendance(course.id)}%
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="btn btn-outline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
