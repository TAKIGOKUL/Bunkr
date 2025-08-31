'use client'

import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/contexts/theme-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/lib/supabase'
import { useState } from 'react'
import { Sun, Moon, User, Save, Globe } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme, setTheme } = useTheme()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [timezone, setTimezone] = useState('Asia/Kolkata')

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data as Profile | null
    },
    enabled: !!user?.id,
  })

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...data,
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
      setEditing(false)
    },
  })

  const handleEdit = () => {
    setFullName(profile?.full_name || '')
    setRollNo(profile?.roll_no || '')
    setTimezone(profile?.timezone || 'Asia/Kolkata')
    setEditing(true)
  }

  const handleSave = async () => {
    await updateProfile.mutateAsync({
      full_name: fullName.trim() || null,
      roll_no: rollNo.trim() || null,
      timezone,
    })
  }

  const handleCancel = () => {
    setEditing(false)
    setFullName(profile?.full_name || '')
    setRollNo(profile?.roll_no || '')
    setTimezone(profile?.timezone || 'Asia/Kolkata')
  }

  const timezones = [
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Europe/London',
    'Europe/Paris',
    'America/New_York',
    'America/Los_Angeles',
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Settings</h1>

      {/* Theme Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Theme</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Current Theme</span>
            <div className="flex items-center space-x-2">
              <span className="text-text-primary font-medium">
                {theme === 'dark' ? 'Midnight Scholar' : 'Metallic Luxe'}
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-surface transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-accent" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                theme === 'dark'
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 bg-[#0a0a0b] border border-[#3a3a3e] rounded mx-auto mb-2"></div>
                <span className="text-sm font-medium text-text-primary">Midnight Scholar</span>
              </div>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                theme === 'light'
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 bg-[#f8f9fa] border border-[#dadce0] rounded mx-auto mb-2"></div>
                <span className="text-sm font-medium text-text-primary">Metallic Luxe</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Profile</h2>
          {!editing && (
            <button
              onClick={handleEdit}
              className="btn btn-outline"
            >
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="label block mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="rollNo" className="label block mb-2">
                Roll Number
              </label>
              <input
                id="rollNo"
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="input"
                placeholder="Enter your roll number"
              />
            </div>

            <div>
              <label htmlFor="timezone" className="label block mb-2">
                Timezone
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="input pl-10"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={updateProfile.isPending}
                className="btn btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-text-secondary">Full Name</span>
              <span className="text-text-primary">
                {profile?.full_name || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Roll Number</span>
              <span className="text-text-primary">
                {profile?.roll_no || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Timezone</span>
              <span className="text-text-primary">
                {profile?.timezone || 'Asia/Kolkata'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Account</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-text-secondary">Email</span>
            <span className="text-text-primary">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Member Since</span>
            <span className="text-text-primary">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
