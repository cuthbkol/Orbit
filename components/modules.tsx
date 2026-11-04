"use client"

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react"
import { Download, Plus, Target, Megaphone, Archive } from "lucide-react"
import { toast } from "sonner"
import { Layout } from "@/components/layout"
import { useAuth } from "@/components/auth-provider"
import { archiveWorkspaceRow, insertWorkspaceRow, listWorkspaceRows, updateWorkspaceRow } from "@/lib/workspace-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Goal = { id: string; title: string; description: string; level: string; metric_name: string | null; target: number | null; current_value: number | null; unit: string | null; target_date: string | null; status: string; owner_user_id: string | null }
type Department = { id: string; name: string }
type Staff = { id: string; user_id: string | null; display_name: string; job_title: string }
type Announcement = { id: string; title: string; body: string; status: string; published_at: string | null; created_at: string }
type Task = { id: string; title: string; status: string; priority: string; due_date: string | null; created_at: string }

export function GoalsModule() {
  const { organisation, user, role } = useAuth()
  const canManage = ["org_admin","manager","department_head"].includes(role ?? "")
  const [goals, setGoals] = useState<Goal[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const refresh = useCallback(async () => {
    if (!organisation) return
    const [g, d, s] = await Promise.all([
      listWorkspaceRows<Goal>("goals", organisation.id),
      listWorkspaceRows<Department>("departments", organisation.id, false),
      listWorkspaceRows<Staff>("staff_profiles", organisation.id, false),
    ])
    setGoals(g.rows); setDepartments(d.rows); setStaff(s.rows); setLoading(false)
    if (g.error || d.error || s.error) toast.error(g.error || d.error || s.error || "Could not load goals")
  }, [organisation])
  useEffect(() => { void refresh() }, [refresh])

  async function createGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!organisation || !user) return
    const form = new FormData(event.currentTarget)
    const level = String(form.get("level"))
    try {
      await insertWorkspaceRow("goals", organisation.id, {
        title: String(form.get("title") ?? "").trim(), description: String(form.get("description") ?? "").trim(),
        level, metric_name: String(form.get("metric_name") ?? "").trim() || null,
        target: form.get("target") ? Number(form.get("target")) : null, current_value: 0,
        unit: String(form.get("unit") ?? "").trim() || null,
        target_date: String(form.get("target_date") ?? "") || null,
        department_id: level === "department" ? String(form.get("department_id") ?? "") || null : null,
        owner_user_id: level === "individual" ? (canManage ? String(form.get("owner_user_id") ?? "") || null : user.id) : null,
        status: "not_started", created_by: user.id,
      })
      toast.success("Goal created")
      setOpen(false)
      await refresh()
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not create goal") }
  }

  async function recordProgress(goal: Goal, value: number, note: string) {
    if (!organisation || !user) return
    try {
      const completed = goal.target !== null && value >= goal.target
      await updateWorkspaceRow("goals", organisation.id, goal.id, { current_value: value, status: completed ? "completed" : "in_progress" })
      await insertWorkspaceRow("goal_updates", organisation.id, { goal_id: goal.id, value, note, created_by: user.id })
      toast.success("Progress recorded")
      await refresh()
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not record progress") }
  }

  async function archive(goal: Goal) {
    if (!organisation || !window.confirm(`Archive “${goal.title}”?`)) return
    try { await archiveWorkspaceRow("goals", organisation.id, goal.id); toast.success("Goal archived"); await refresh() }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not archive goal") }
  }

  return <Layout><div className="space-y-6"><ModuleHeader eyebrow="PerformX" title="Goals" description="Set measurable organisational, departmental, and individual targets." action={canManage||role==="staff"?<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4"/>Create goal</Button></DialogTrigger><DialogContent><form onSubmit={createGoal} className="space-y-4"><DialogHeader><DialogTitle>New goal</DialogTitle><DialogDescription>Define an owner, measurable target, and due date.</DialogDescription></DialogHeader><div className="space-y-2"><Label htmlFor="goal-title">Goal title</Label><Input id="goal-title" name="title" required maxLength={240}/></div><div className="space-y-2"><Label htmlFor="goal-description">Description</Label><Textarea id="goal-description" name="description"/></div><div className="space-y-2"><Label>Goal level</Label><Select name="level" defaultValue={canManage?"organisation":"individual"}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{canManage&&<><SelectItem value="organisation">Organisation</SelectItem><SelectItem value="department">Department</SelectItem></>}<SelectItem value="individual">Individual</SelectItem></SelectContent></Select></div><div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="goal-metric">Metric</Label><Input id="goal-metric" name="metric_name" placeholder="e.g. Service response time"/></div><div className="space-y-2"><Label htmlFor="goal-target">Target value</Label><Input id="goal-target" name="target" type="number" step="any" min="0"/></div></div><div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="goal-unit">Unit</Label><Input id="goal-unit" name="unit" placeholder="e.g. days, %"/></div><div className="space-y-2"><Label htmlFor="goal-date">Target date</Label><Input id="goal-date" name="target_date" type="date"/></div></div>{canManage&&<><div className="space-y-2"><Label htmlFor="goal-department">Department (for department goals)</Label><Select name="department_id"><SelectTrigger id="goal-department"><SelectValue placeholder="Select a department"/></SelectTrigger><SelectContent>{departments.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="goal-owner">Owner (for individual goals)</Label><Select name="owner_user_id"><SelectTrigger id="goal-owner"><SelectValue placeholder="Select a staff member"/></SelectTrigger><SelectContent>{staff.filter(person=>person.user_id).map(person=><SelectItem key={person.user_id!} value={person.user_id!}>{person.display_name}</SelectItem>)}</SelectContent></Select></div></>}<DialogFooter><Button type="submit">Save goal</Button></DialogFooter></form></DialogContent></Dialog>:undefined}/>
    {loading?<p className="text-sm text-muted-foreground">Loading goals…</p>:goals.length===0?<EmptyModule icon={Target} title="No goals yet" detail="Create the first goal for your organisation. Targets and progress will be used in PerformX reporting."/>:<div className="grid gap-4 md:grid-cols-2">{goals.map(goal=>{const progress=goal.target?Math.min(100,Math.max(0,((goal.current_value??0)/goal.target)*100)):0;const canUpdate=canManage||(goal.level==="individual"&&goal.owner_user_id===user?.id); return <Card key={goal.id}><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>{goal.title}</CardTitle><CardDescription className="mt-1">{goal.level} goal{goal.target_date?` · Due ${new Date(`${goal.target_date}T00:00:00`).toLocaleDateString()}`:""}</CardDescription></div><span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize">{goal.status.replaceAll("_"," ")}</span></div></CardHeader><CardContent className="space-y-3"><p className="text-sm text-muted-foreground">{goal.description||"No description provided."}</p>{goal.target!==null&&<><div className="flex justify-between text-sm"><span>{goal.metric_name||"Progress"}</span><span>{goal.current_value??0} / {goal.target} {goal.unit||""}</span></div><div className="h-2 overflow-hidden rounded bg-muted"><div className="h-full rounded bg-cyan-600" style={{width:`${progress}%`}}/></div>{canUpdate&&<ProgressControl goal={goal} onSave={recordProgress}/>}</>}{canManage&&<Button variant="ghost" size="sm" onClick={()=>void archive(goal)}><Archive className="mr-2 h-4 w-4"/>Archive</Button>}</CardContent></Card>})}</div>}</div></Layout>
}

function ProgressControl({goal,onSave}:{goal:Goal;onSave:(goal:Goal,value:number,note:string)=>Promise<void>}) {
  const [open,setOpen]=useState(false)
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=new FormData(event.currentTarget);const value=Number(form.get("value"));if(Number.isFinite(value)){await onSave(goal,value,String(form.get("note")??""));setOpen(false)}}
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="outline" size="sm">Update progress</Button></DialogTrigger><DialogContent><form onSubmit={submit} className="space-y-4"><DialogHeader><DialogTitle>Record goal progress</DialogTitle><DialogDescription>Progress changes are saved as a history entry.</DialogDescription></DialogHeader><div className="space-y-2"><Label htmlFor={`value-${goal.id}`}>Current {goal.unit||"value"}</Label><Input id={`value-${goal.id}`} name="value" type="number" step="any" min="0" defaultValue={goal.current_value??0} required/></div><div className="space-y-2"><Label htmlFor={`note-${goal.id}`}>Update note</Label><Textarea id={`note-${goal.id}`} name="note"/></div><DialogFooter><Button type="submit">Save progress</Button></DialogFooter></form></DialogContent></Dialog>
}

export function AnnouncementsModule() {
  const {organisation,role}=useAuth()
  const canManage=["org_admin","manager","department_head"].includes(role??"")
  const [rows,setRows]=useState<Announcement[]>([])
  const [open,setOpen]=useState(false)
  const [loading,setLoading]=useState(true)
  const refresh=useCallback(async()=>{if(!organisation)return;const result=await listWorkspaceRows<Announcement>("announcements",organisation.id,false);setRows(result.rows);setLoading(false);if(result.error)toast.error(result.error)},[organisation])
  useEffect(()=>{void refresh()},[refresh])
  async function create(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!organisation)return;const form=new FormData(event.currentTarget);try{await insertWorkspaceRow("announcements",organisation.id,{title:String(form.get("title")??"").trim(),body:String(form.get("body")??"").trim(),status:"published",published_at:new Date().toISOString()});toast.success("Announcement published");setOpen(false);await refresh()}catch(error){toast.error(error instanceof Error?error.message:"Could not publish announcement")}}
  async function archive(row:Announcement){if(!organisation||!window.confirm(`Archive “${row.title}”?`))return;try{await updateWorkspaceRow("announcements",organisation.id,row.id,{status:"archived"});toast.success("Announcement archived");await refresh()}catch(error){toast.error(error instanceof Error?error.message:"Could not archive announcement")}}
  const published=rows.filter(row=>row.status==="published")
  return <Layout><div className="space-y-6"><ModuleHeader eyebrow="ORBIT" title="Announcements" description="Share organisation-wide updates with your workspace." action={canManage?<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4"/>New announcement</Button></DialogTrigger><DialogContent><form onSubmit={create} className="space-y-4"><DialogHeader><DialogTitle>Publish announcement</DialogTitle><DialogDescription>Published announcements are visible to members of this workspace.</DialogDescription></DialogHeader><div className="space-y-2"><Label htmlFor="announcement-title">Title</Label><Input id="announcement-title" name="title" required maxLength={240}/></div><div className="space-y-2"><Label htmlFor="announcement-body">Message</Label><Textarea id="announcement-body" name="body" rows={6} required/></div><DialogFooter><Button type="submit">Publish</Button></DialogFooter></form></DialogContent></Dialog>:undefined}/>
    {loading?<p className="text-sm text-muted-foreground">Loading announcements…</p>:published.length===0?<EmptyModule icon={Megaphone} title="No published announcements" detail="Share an update with your organisation when you have something to communicate."/>:<div className="space-y-3">{published.map(row=><Card key={row.id}><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle>{row.title}</CardTitle><CardDescription className="mt-1">Published {row.published_at?new Date(row.published_at).toLocaleDateString():new Date(row.created_at).toLocaleDateString()}</CardDescription></div>{canManage&&<Button variant="ghost" size="sm" onClick={()=>void archive(row)}><Archive className="mr-2 h-4 w-4"/>Archive</Button>}</div></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm leading-6">{row.body}</p></CardContent></Card>)}</div>}</div></Layout>
}

export function ReportsModule() {
  const {organisation}=useAuth()
  const [tasks,setTasks]=useState<Task[]>([])
  const [goals,setGoals]=useState<Goal[]>([])
  const [staff,setStaff]=useState<Staff[]>([])
  const [loading,setLoading]=useState(true)
  const refresh=useCallback(async()=>{if(!organisation)return;const [t,g,s]=await Promise.all([listWorkspaceRows<Task>("tasks",organisation.id),listWorkspaceRows<Goal>("goals",organisation.id),listWorkspaceRows<Staff>("staff_profiles",organisation.id,false)]);setTasks(t.rows);setGoals(g.rows);setStaff(s.rows);setLoading(false);if(t.error||g.error||s.error)toast.error(t.error||g.error||s.error||"Could not load reports")},[organisation])
  useEffect(()=>{void refresh()},[refresh])
  function exportTasks(){const headings=["Title","Status","Priority","Due date","Created"];const rows=tasks.map(t=>[t.title,t.status,t.priority,t.due_date??"",t.created_at.slice(0,10)]);const csv=[headings,...rows].map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(",")).join("\r\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const link=document.createElement("a");link.href=url;link.download="orbit-tasks-report.csv";link.click();URL.revokeObjectURL(url)}
  const completed=tasks.filter(task=>task.status==="done").length
  return <Layout><div className="space-y-6"><ModuleHeader eyebrow="PerformX" title="Reports" description="Live summaries calculated from this organisation’s records." action={<Button variant="outline" onClick={exportTasks} disabled={tasks.length===0}><Download className="mr-2 h-4 w-4"/>Export tasks CSV</Button>}/>
    {loading?<p className="text-sm text-muted-foreground">Preparing reports…</p>:<><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><ReportMetric title="Tasks recorded" value={tasks.length}/><ReportMetric title="Task completion" value={tasks.length?`${Math.round(completed/tasks.length*100)}%`:"—"}/><ReportMetric title="Goals recorded" value={goals.length}/><ReportMetric title="Staff profiles" value={staff.length}/></div><Card><CardHeader><CardTitle>Task activity</CardTitle><CardDescription>Recent task records from this workspace. No sample values are included.</CardDescription></CardHeader><CardContent>{tasks.length===0?<p className="text-sm text-muted-foreground">Task reports will appear here once tasks are recorded.</p>:<div className="divide-y">{tasks.slice(0,20).map(task=><div key={task.id} className="flex flex-wrap justify-between gap-2 py-3"><span className="font-medium">{task.title}</span><span className="text-sm text-muted-foreground">{task.status.replaceAll("_"," ")} · {task.priority} · {task.due_date||"No due date"}</span></div>)}</div>}</CardContent></Card><Card><CardHeader><CardTitle>Goal achievement</CardTitle><CardDescription>Goal progress is based on each goal’s current value and target.</CardDescription></CardHeader><CardContent>{goals.length===0?<p className="text-sm text-muted-foreground">Goal reports will appear here once goals are recorded.</p>:<div className="divide-y">{goals.map(goal=>{const rate=goal.target?Math.min(100,Math.max(0,((goal.current_value??0)/goal.target)*100)):null;return <div key={goal.id} className="flex flex-wrap justify-between gap-2 py-3"><span className="font-medium">{goal.title}</span><span className="text-sm text-muted-foreground">{rate===null?goal.status:`${Math.round(rate)}% of target`}</span></div>})}</div>}</CardContent></Card></>}
  </div></Layout>
}

function ModuleHeader({eyebrow,title,description,action}:{eyebrow:string;title:string;description:string;action?:ReactNode}){return <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-cyan-700">{eyebrow}</p><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="text-muted-foreground">{description}</p></div>{action}</div>}
function EmptyModule({icon:Icon,title,detail}:{icon:typeof Target;title:string;detail:string}){return <Card><CardContent className="flex flex-col items-center py-14 text-center"><Icon className="mb-4 h-8 w-8 text-cyan-700"/><h2 className="font-semibold">{title}</h2><p className="mt-1 max-w-lg text-sm text-muted-foreground">{detail}</p></CardContent></Card>}
function ReportMetric({title,value}:{title:string;value:number|string}){return <Card><CardHeader className="pb-2"><CardDescription>{title}</CardDescription><CardTitle className="text-2xl">{value}</CardTitle></CardHeader></Card>}
