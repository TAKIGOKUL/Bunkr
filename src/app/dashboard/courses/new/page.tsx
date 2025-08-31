'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewCoursePage() {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          title: title.trim(),
          owner: user?.id,
        })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard/courses')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/courses"
          className="btn btn-ghost"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Link>
      </div>

      <div className="card p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Add New Course</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="label block mb-2">
              Course Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Enter course title"
              required
            />
          </div>

          {error && (
            <div className="text-danger text-sm p-3 bg-danger/10 rounded">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="btn btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Course'}
            </button>
            <Link
              href="/dashboard/courses"
              className="btn btn-outline"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
