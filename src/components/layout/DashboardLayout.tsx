import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Sparkles, Bookmark, Calendar, KanbanSquare,
  User, Settings, BookOpen, Menu, X, LogOut, ChevronRight, Shield
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ModeToggle } from '@/components/mode-toggle'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recommendations', icon: Sparkles, label: 'Matches' },
  { to: '/saved', icon: Bookmark, label: 'Saved' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/tracker', icon: KanbanSquare, label: 'Tracker' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuthStore()

  const isActive = (path: string) => location.pathname === path
  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div className="flex h-svh bg-background overflow-hidden">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-border bg-sidebar transition-transform duration-300
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-16 items-center justify-between px-5 border-b border-sidebar-border flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-gradient-to-br from-emerald to-cyan flex items-center justify-center">
              <BookOpen className="size-3.5 text-white" />
            </div>
            <span className="font-bold text-sidebar-foreground tracking-tight">Scholar<span className="text-emerald">Path</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-0.5">
            {navItems.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                  ${isActive(to)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                  }
                `}
              >
                <Icon className="size-4 flex-shrink-0" />
                {label}
                {isActive(to) && <ChevronRight className="size-3 ml-auto opacity-60" />}
              </Link>
            ))}
          </nav>

          {profile?.is_admin && (
            <div className="mt-6 pt-6 border-t border-sidebar-border">
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">Admin</p>
              <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all">
                <Shield className="size-4" /> Admin Panel
              </Link>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer" onClick={() => navigate('/profile')}>
            <Avatar className="size-8">
              <AvatarFallback className="bg-emerald/20 text-emerald text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{profile?.full_name || 'My Account'}</p>
              <p className="text-xs text-sidebar-foreground/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="mt-1 flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-destructive hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 flex-shrink-0 bg-background/80 backdrop-blur-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
            <Menu className="size-5" />
          </button>
          <div className="hidden lg:flex items-center gap-2">
            <div className="text-sm font-medium">{navItems.find(n => isActive(n.to))?.label || 'Dashboard'}</div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <ModeToggle />
            <button onClick={() => navigate('/profile')}>
              <Avatar className="size-8">
                <AvatarFallback className="bg-emerald/20 text-emerald text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
