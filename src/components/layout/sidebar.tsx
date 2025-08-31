'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  BookOpen, 
  Calendar, 
  FileText, 
  Settings,
  BarChart3
} from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Duty Leave', href: '/dashboard/duty-leave', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-surface border-r border-border min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent text-background'
                      : 'text-text-secondary hover:text-text-primary hover:bg-card'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
