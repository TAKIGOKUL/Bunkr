'use client'

import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Course } from '@/lib/supabase'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CoursesPage() {
  const { user } = useAuth()
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const { data: courses = [], refetch } = useQuery({
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

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setEditTitle(course.title)
  }

  const handleSave = async () => {
    if (!editingCourse || !editTitle.trim()) return

    const { error } = await supabase
      .from('courses')
      .update({ title: editTitle.trim() })
      .eq('id', editingCourse.id)

    if (!error) {
      setEditingCourse(null)
      setEditTitle('')
      refetch()
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all associated sessions.')) {
      return
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (!error) {
      refetch()
    }
  }

  const handleCancel = () => {
    setEditingCourse(null)
    setEditTitle('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Courses</h1>
        <Link
          href="/dashboard/courses/new"
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card p-6">
            {editingCourse?.id === course.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input"
                  placeholder="Course title"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="btn btn-primary flex-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">{course.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 text-text-secondary hover:text-accent transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 text-text-secondary hover:text-danger transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-text-secondary">
                  <p>Created: {new Date(course.created_at).toLocaleDateString()}</p>
                  <p>Updated: {new Date(course.updated_at).toLocaleDateString()}</p>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="btn btn-outline flex-1"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Sessions
                  </Link>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">No courses yet</h3>
          <p className="text-text-secondary mb-6">Start by adding your first course to track attendance</p>
          <Link href="/dashboard/courses/new" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Course
          </Link>
        </div>
      )}
    </div>
  )
}
