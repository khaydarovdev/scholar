import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search, Globe, TrendingUp, Star, Users, Zap, CheckCircle, GraduationCap, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScholarshipCard } from '@/components/ScholarshipCard'
import { fetchFeaturedScholarships } from '@/lib/api'
import type { Scholarship } from '@/lib/supabase'

const STATS = [
  { label: 'Active Scholarships', value: '200+', icon: GraduationCap, color: 'text-emerald' },
  { label: 'Partner Countries', value: '30+', icon: Globe, color: 'text-cyan' },
  { label: 'Students Matched', value: '12,000+', icon: Users, color: 'text-amber' },
  { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'text-rose' },
]

const TESTIMONIALS = [
  { name: 'Aisha Mensah', country: 'Ghana', scholarship: 'Gates Cambridge', quote: 'ScholarPath matched me to Gates Cambridge in minutes. The deadline tracker saved my application.', avatar: 'AM', degree: 'PhD Computer Science' },
  { name: 'Ryo Tanaka', country: 'Japan', scholarship: 'Fulbright', quote: 'Found 8 scholarships matching my profile. Applied to 3, got accepted to Fulbright. Incredible platform.', avatar: 'RT', degree: 'Masters Economics' },
  { name: 'Sara Al-Hamid', country: 'Jordan', scholarship: 'DAAD', quote: 'The recommendation engine understood exactly what I needed. Got my DAAD scholarship for Germany.', avatar: 'SA', degree: 'Masters Engineering' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Create your profile', desc: 'Tell us your degree level, field, countries of interest, and academic background in 2 minutes.' },
  { step: '02', title: 'Get matched', desc: 'Our rule-based engine cross-references your profile against 200+ scholarships and ranks them by compatibility.' },
  { step: '03', title: 'Track and apply', desc: 'Save scholarships, track deadlines on your calendar, and manage your entire application pipeline.' },
]

export function HomePage() {
  const [featured, setFeatured] = useState<Scholarship[]>([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchFeaturedScholarships().then(({ data }) => {
      if (data) setFeatured(data as Scholarship[])
    })
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/scholarships?search=${encodeURIComponent(search)}`)
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-20 left-1/4 size-[500px] rounded-full bg-emerald/8 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 size-[400px] rounded-full bg-cyan/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] rounded-full bg-primary/3 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald/30 bg-emerald/5 text-emerald text-xs font-semibold mb-6 uppercase tracking-wider">
              <Zap className="size-3" />
              AI-Powered Scholarship Matching
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
              Your path to <br />
              <span className="gradient-text">global funding.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed mb-10">
              Discover and match with 200+ international scholarships across 30+ countries. Built for students who are serious about their academic future.
            </p>

            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search scholarships, countries, providers..."
                  className="pl-10 h-12 bg-card border-border text-base"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6 bg-emerald text-emerald-foreground hover:bg-emerald/90 font-semibold">
                Search <ArrowRight className="size-4 ml-2" />
              </Button>
            </form>

            <div className="flex flex-wrap gap-2">
              {['Fully Funded', 'PhD', 'Germany', 'UK', 'USA', 'Japan'].map(tag => (
                <Link key={tag} to={`/scholarships?search=${tag}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent text-xs px-3 py-1">{tag}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`rounded-full bg-foreground/30 ${i === 0 ? 'w-6 h-1.5' : 'w-1.5 h-1.5'}`} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="text-center">
                <div className={`text-4xl font-black ${color} mb-1`}>{value}</div>
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <Icon className={`size-4 ${color}`} />
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured scholarships */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald mb-2">Spotlight</p>
              <h2 className="text-4xl font-black tracking-tight">Featured scholarships</h2>
              <p className="text-muted-foreground mt-2">Handpicked opportunities with upcoming deadlines</p>
            </div>
            <Link to="/scholarships" className="hidden sm:flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              View all <ArrowRight className="size-4" />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.slice(0, 6).map(s => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/scholarships">View all scholarships <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-card/20 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald mb-2">Process</p>
            <h2 className="text-4xl font-black tracking-tight">How ScholarPath works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald/20 to-cyan/20 border border-emerald/20 text-2xl font-black gradient-text mb-4">
                  {step}
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald mb-2">Success Stories</p>
            <h2 className="text-4xl font-black tracking-tight">Students who made it</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, country, scholarship, quote, avatar, degree }) => (
              <div key={name} className="p-6 rounded-2xl border border-border bg-card card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-amber text-amber" />)}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80 mb-5">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-gradient-to-br from-emerald/20 to-cyan/20 flex items-center justify-center text-xs font-bold text-emerald">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">{degree} · {country}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-xs border-emerald/20 text-emerald bg-emerald/5">{scholarship}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-background via-background to-background border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-0 right-0 size-96 rounded-full bg-emerald/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-64 rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald/30 bg-emerald/5 text-emerald text-xs font-semibold mb-6 uppercase tracking-wider">
            <Target className="size-3" />
            Start Free Today
          </div>
          <h2 className="text-5xl font-black tracking-tighter mb-4">
            Ready to find your <span className="gradient-text">scholarship?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join 12,000+ students who discovered their funding through ScholarPath.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="h-12 px-8 bg-emerald text-emerald-foreground hover:bg-emerald/90 font-semibold text-base">
              <Link to="/register">Create free account <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 font-semibold text-base">
              <Link to="/scholarships">Browse scholarships</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6">
            {['No credit card required', 'Free forever', '2-minute setup'].map(item => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle className="size-4 text-emerald" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
