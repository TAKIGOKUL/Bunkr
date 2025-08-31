'use client'

import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Session } from '@/lib/supabase'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CalendarPage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          courses!inner(owner, title)
        `)
        .eq('courses.owner', user?.id)
        .order('date', { ascending: false })

      if (error) throw error
      return data as (Session & { courses: { owner: string; title: string } })[]
    },
    enabled: !!user?.id,
  })

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const absentDates = sessions.filter(s => s.status === 'absent')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Calendar</h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigateMonth('prev')} className="btn btn-ghost">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-semibold text-text-primary">{monthName}</h2>
          <button onClick={() => navigateMonth('next')} className="btn btn-ghost">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Absent Dates</h3>
          {absentDates.length === 0 ? (
            <p className="text-text-secondary text-center py-4">No absent dates found</p>
          ) : (
            <div className="space-y-2">
              {absentDates.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-danger/10 rounded">
                  <div>
                    <span className="text-text-primary font-medium">
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                    <p className="text-sm text-text-secondary">{session.courses.title}</p>
                  </div>
                  <span className="text-danger text-sm font-medium">Absent</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Attendance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-text-secondary">Present:</span>
              <span className="text-success font-medium">
                {sessions.filter(s => s.status === 'present').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Late:</span>
              <span className="text-warning font-medium">
                {sessions.filter(s => s.status === 'late').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Absent:</span>
              <span className="text-danger font-medium">
                {sessions.filter(s => s.status === 'absent').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Excused:</span>
              <span className="text-secondary font-medium">
                {sessions.filter(s => s.status === 'excused').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
