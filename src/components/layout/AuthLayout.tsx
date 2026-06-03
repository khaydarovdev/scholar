import { Outlet, Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-svh flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-background via-background to-background">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-emerald/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 size-64 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-gradient-to-br from-emerald to-cyan flex items-center justify-center">
              <BookOpen className="size-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Scholar<span className="gradient-text">Path</span></span>
          </Link>
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald">Scholarship Discovery</p>
                <h1 className="text-5xl font-bold tracking-tight leading-tight">
                  Find your <br/><span className="gradient-text">funding.</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Match with 200+ scholarships from 30+ countries. AI-powered recommendations built for serious applicants.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[['200+', 'Scholarships'], ['30+', 'Countries'], ['94%', 'Match Rate']].map(([num, label]) => (
                  <div key={label} className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-2xl font-bold gradient-text">{num}</div>
                    <div className="text-xs text-muted-foreground mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-gradient-to-br from-emerald to-cyan flex items-center justify-center">
                <BookOpen className="size-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">Scholar<span className="gradient-text">Path</span></span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
