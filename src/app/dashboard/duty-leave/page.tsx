'use client'

import { useAuth } from '@/contexts/auth-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { DutyLeave } from '@/lib/supabase'
import { useState } from 'react'
import { Plus, Upload, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function DutyLeavePage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [reason, setReason] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const { data: dutyLeaves = [] } = useQuery({
    queryKey: ['duty-leave', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('duty_leave')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as DutyLeave[]
    },
    enabled: !!user?.id,
  })

  const createDutyLeave = useMutation({
    mutationFn: async (data: {
      from_date: string
      to_date: string
      reason: string
      file_path?: string
    }) => {
      const { error } = await supabase
        .from('duty_leave')
        .insert({
          ...data,
          user_id: user?.id,
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duty-leave', user?.id] })
      setShowForm(false)
      setFromDate('')
      setToDate('')
      setReason('')
      setFile(null)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromDate || !toDate || !reason) return

    setLoading(true)

    try {
      let filePath = null
      if (file) {
        const fileName = `${user?.id}/${Date.now()}_${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('duty-leave')
          .upload(fileName, file)

        if (uploadError) throw uploadError
        filePath = fileName
      }

      await createDutyLeave.mutateAsync({
        from_date: fromDate,
        to_date: toDate,
        reason,
        file_path: filePath || undefined,
      })
    } catch (error) {
      console.error('Error creating duty leave:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-success'
      case 'rejected':
        return 'text-danger'
      default:
        return 'text-warning'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-danger" />
      default:
        return <Clock className="w-4 h-4 text-warning" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Duty Leave</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Request Leave'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Request Duty Leave</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromDate" className="label block mb-2">
                  From Date
                </label>
                <input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label htmlFor="toDate" className="label block mb-2">
                  To Date
                </label>
                <input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="label block mb-2">
                Reason
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Enter reason for leave"
                required
              />
            </div>

            <div>
              <label htmlFor="file" className="label block mb-2">
                Supporting Document (Optional)
              </label>
              <input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || !fromDate || !toDate || !reason}
                className="btn btn-primary"
              >
                <Upload className="w-4 h-4 mr-2" />
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {dutyLeaves.map((leave) => (
          <div key={leave.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}
                </h3>
                <p className="text-text-secondary mt-1">{leave.reason}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(leave.status)}
                <span className={`font-medium ${getStatusColor(leave.status)}`}>
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>Submitted: {new Date(leave.created_at).toLocaleDateString()}</span>
              {leave.file_path && (
                <a
                  href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/duty-leave/${leave.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-accent hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Document</span>
                </a>
              )}
            </div>
          </div>
        ))}

        {dutyLeaves.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No duty leave requests</h3>
            <p className="text-text-secondary mb-6">Submit your first duty leave request</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Request Leave
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
