import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KanbanSquare, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore, useUserDataStore } from '@/lib/store'
import { fetchUserApplications, updateApplicationStatus, deleteApplication } from '@/lib/api'
import { toast } from 'sonner'

const STAGES = [
  { id: 'interested', label: 'Interested', color: 'bg-muted/50 border-border/50', headerColor: 'bg-muted text-muted-foreground' },
  { id: 'researching', label: 'Researching', color: 'bg-cyan/5 border-cyan/20', headerColor: 'bg-cyan/10 text-cyan' },
  { id: 'preparing', label: 'Preparing', color: 'bg-amber/5 border-amber/20', headerColor: 'bg-amber/10 text-amber' },
  { id: 'applied', label: 'Applied', color: 'bg-primary/5 border-primary/20', headerColor: 'bg-primary/10 text-primary' },
  { id: 'interview', label: 'Interview', color: 'bg-rose/5 border-rose/20', headerColor: 'bg-rose/10 text-rose' },
  { id: 'accepted', label: 'Accepted', color: 'bg-emerald/5 border-emerald/20', headerColor: 'bg-emerald/10 text-emerald' },
  { id: 'rejected', label: 'Rejected', color: 'bg-destructive/5 border-destructive/20', headerColor: 'bg-destructive/10 text-destructive' },
]

export function TrackerPage() {
  const { user } = useAuthStore()
  const { applications, setApplications, updateApplication, removeApplication } = useUserDataStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchUserApplications(user.id).then(({ data }) => {
      if (data) setApplications(data as any)
      setLoading(false)
    })
  }, [user?.id])

  const handleMove = async (appId: string, newStage: string) => {
    updateApplication(appId, { status: newStage as any })
    const { error } = await updateApplicationStatus(appId, newStage)
    if (error) toast.error('Failed to update status')
    else toast.success(`Moved to ${newStage}`)
  }

  const handleDelete = async (appId: string) => {
    removeApplication(appId)
    await deleteApplication(appId)
    toast.success('Removed from tracker')
  }

  const byStage = (stageId: string) => applications.filter(a => a.status === stageId)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2"><KanbanSquare className="size-7 text-amber" /> Tracker</h1>
          <p className="text-muted-foreground mt-1">Manage your entire application pipeline</p>
        </div>
        <Button asChild size="sm" className="bg-emerald text-emerald-foreground hover:bg-emerald/90">
          <Link to="/scholarships"><Plus className="size-4 mr-1.5" /> Add scholarship</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(s => <div key={s.id} className="w-72 flex-shrink-0 h-64 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20">
          <KanbanSquare className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No applications tracked</h3>
          <p className="text-muted-foreground mb-4">Find a scholarship and click "Track Application"</p>
          <Button asChild><Link to="/scholarships">Browse scholarships</Link></Button>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="flex gap-4 min-w-max">
            {STAGES.map(stage => {
              const items = byStage(stage.id)
              return (
                <div key={stage.id} className={`w-72 flex-shrink-0 rounded-2xl border ${stage.color} flex flex-col`}>
                  <div className={`px-4 py-3 rounded-t-2xl ${stage.headerColor} flex items-center justify-between`}>
                    <span className="text-sm font-bold">{stage.label}</span>
                    <span className="text-xs font-bold opacity-70">{items.length}</span>
                  </div>
                  <div className="p-3 space-y-2 flex-1 min-h-24">
                    {items.map(app => (
                      <div key={app.id} className="p-3 rounded-xl bg-card border border-border shadow-sm group">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <Link to={`/scholarships/${app.scholarship_id}`} className="text-sm font-medium hover:text-emerald transition-colors line-clamp-2 block">
                              {app.scholarship?.title || 'Unknown scholarship'}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5">{app.scholarship?.provider}</p>
                            {app.scholarship?.deadline && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Deadline: {new Date(app.scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>

                        {stage.id !== 'accepted' && stage.id !== 'rejected' && (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <select
                              value={app.status}
                              onChange={e => handleMove(app.id, e.target.value)}
                              className="w-full text-xs bg-transparent text-muted-foreground cursor-pointer rounded border border-border/50 px-2 py-1 hover:border-border transition-colors"
                            >
                              {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="text-center py-6 text-xs text-muted-foreground/50">Empty</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {applications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card text-center">
            <div className="text-2xl font-black text-foreground">{applications.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total</div>
          </div>
          <div className="p-4 rounded-xl border border-emerald/20 bg-emerald/5 text-center">
            <div className="text-2xl font-black text-emerald">{byStage('accepted').length}</div>
            <div className="text-xs text-muted-foreground mt-1">Accepted</div>
          </div>
          <div className="p-4 rounded-xl border border-amber/20 bg-amber/5 text-center">
            <div className="text-2xl font-black text-amber">{byStage('applied').length + byStage('interview').length}</div>
            <div className="text-xs text-muted-foreground mt-1">In Review</div>
          </div>
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-center">
            <div className="text-2xl font-black text-primary">{byStage('preparing').length + byStage('researching').length}</div>
            <div className="text-xs text-muted-foreground mt-1">In Progress</div>
          </div>
        </div>
      )}
    </div>
  )
}
