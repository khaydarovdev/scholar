import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, GraduationCap, Users, ChevronLeft, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/scholarships', icon: GraduationCap, label: 'Scholarships' },
  { to: '/admin/users', icon: Users, label: 'Users' },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-svh bg-background">
      <header className="h-16 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-gradient-to-br from-emerald to-cyan flex items-center justify-center">
              <BookOpen className="size-3.5 text-white" />
            </div>
            <span className="font-bold tracking-tight">Scholar<span className="gradient-text">Path</span></span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <span className="text-sm font-semibold text-muted-foreground">Admin</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="size-4 mr-1" /> Dashboard
        </Button>
      </header>
      <div className="flex">
        <aside className="w-56 border-r border-border min-h-[calc(100svh-4rem)] p-4">
          <nav className="space-y-1">
            {adminNav.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === to ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                <Icon className="size-4" /> {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
