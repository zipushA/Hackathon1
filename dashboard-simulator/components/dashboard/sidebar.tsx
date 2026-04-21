'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Play
} from 'lucide-react'

const instructorNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/representatives', label: 'Representatives', icon: Users },
  { href: '/dashboard/scripts', label: 'Scripts', icon: FileText },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
]

const representativeNavItems = [
  { href: '/representative', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/representative/simulations', label: 'Simulations', icon: Play },
  { href: '/representative/progress', label: 'Progress', icon: BarChart3 },
]

interface SidebarProps {
  role: 'instructor' | 'representative'
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const navItems = role === 'instructor' ? instructorNavItems : representativeNavItems

  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">SimuCoach</h1>
            <p className="text-xs text-sidebar-muted">
              {role === 'instructor' ? 'מדריך' : 'נציג'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && item.href !== '/representative' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-5 w-5" />
            יציאה
          </Link>
        </div>
      </div>
    </aside>
  )
}
