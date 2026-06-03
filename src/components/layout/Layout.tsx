import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, BookOpen, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store'
import { ModeToggle } from '@/components/mode-toggle'

export function Layout() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-svh flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="size-8 rounded-lg bg-gradient-to-br from-emerald to-cyan flex items-center justify-center shadow-sm">
                <BookOpen className="size-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Scholar<span className="gradient-text">Path</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link to="/" className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>Home</Link>
              <Link to="/scholarships" className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive('/scholarships') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>Scholarships</Link>
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <ModeToggle />
              {user ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="size-4 mr-1.5" /> Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>Sign out</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
                  <Button size="sm" onClick={() => navigate('/register')} className="bg-emerald text-emerald-foreground hover:bg-emerald/90">
                    Get started
                  </Button>
                </div>
              )}
            </div>

            <div className="flex md:hidden items-center gap-2">
              <ModeToggle />
              <button onClick={() => setOpen(!open)} className="p-2 rounded-md text-muted-foreground hover:text-foreground">
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent">Home</Link>
            <Link to="/scholarships" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent">Scholarships</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent">Dashboard</Link>
                <button onClick={() => { signOut(); setOpen(false) }} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-accent">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent">Sign in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium bg-emerald text-white hover:bg-emerald/90">Get started</Link>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-7 rounded-lg bg-gradient-to-br from-emerald to-cyan flex items-center justify-center">
                  <BookOpen className="size-3.5 text-white" />
                </div>
                <span className="font-bold tracking-tight">Scholar<span className="gradient-text">Path</span></span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">The world's most comprehensive scholarship discovery and matching platform.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h4 className="text-sm font-semibold mb-3">Platform</h4>
                <div className="space-y-2">
                  <Link to="/scholarships" className="block text-sm text-muted-foreground hover:text-foreground">Browse</Link>
                  <Link to="/register" className="block text-sm text-muted-foreground hover:text-foreground">Sign up</Link>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Explore</h4>
                <div className="space-y-2">
                  <Link to="/scholarships?degree=masters" className="block text-sm text-muted-foreground hover:text-foreground">Masters</Link>
                  <Link to="/scholarships?degree=phd" className="block text-sm text-muted-foreground hover:text-foreground">PhD</Link>
                  <Link to="/scholarships?funding=fully-funded" className="block text-sm text-muted-foreground hover:text-foreground">Fully Funded</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2026 ScholarPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
