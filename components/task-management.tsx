"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { Archive, Check, ListTodo, Plus, Search } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"

type Task = { id: string; title: string; description: string; status: string; priority: string; department_id: string | null; assignee_user_id: string | null; created_by: string; due_date: string | null; created_at: string }
type Department = { id: string; name: string }
type Staff = { id: string; user_id: string | null; display_name: string }
type Subtask = { id: string; task_id: string; title: string; is_complete: boolean; position: number }
type Activity = { id: string; entity_id: string | null; action: string; created_at: string }
const statuses = ["todo", "in_progress", "blocked", "done"]

export function TaskManagement() {
  const { organisation, user, role } = useAuth()
  const canManage=["org_admin","manager","department_head"].includes(role??"")
  const [tasks, setTasks] = useState<Task[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(async () => {
    if (!organisation) return
    const [taskRows, departmentsResult, staffResult, subtaskResult, activityResult] = await Promise.all([
      listWorkspaceRows<Task>("tasks", organisation.id),
      listWorkspaceRows<Department>("departments", organisation.id, false),
      listWorkspaceRows<Staff>("staff_profiles", organisation.id, false),
      listWorkspaceRows<Subtask>("task_subtasks", organisation.id, false),
      listWorkspaceRows<Activity>("activity_logs", organisation.id, false),
    ])
    setTasks(taskRows.rows); setDepartments(departmentsResult.rows.filter(d => (d as Department & {status?: string}).status === "active")); setStaff(staffResult.rows); setSubtasks(subtaskResult.rows); setActivity(activityResult.rows)
    const message = taskRows.error || departmentsResult.error || staffResult.error || subtaskResult.error || activityResult.error
    if (message) toast.error(message)
  }, [organisation])
  useEffect(() => { void refresh() }, [refresh])

  const filtered = useMemo(() => tasks.filter(task => `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase())), [tasks, search])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!organisation || !user) return
    const form = new FormData(event.currentTarget)
    const values = {
      title: String(form.get("title") ?? "").trim(), description: String(form.get("description") ?? "").trim(),
      priority: String(form.get("priority") ?? "medium"), status: String(form.get("status") ?? "todo"),
      due_date: String(form.get("due_date") ?? "") || null,
      department_id: !["", "none"].includes(String(form.get("department_id") ?? "")) ? String(form.get("department_id")) : null,
      assignee_user_id: !["", "unassigned"].includes(String(form.get("assignee_user_id") ?? "")) ? String(form.get("assignee_user_id")) : null,
    }
    if (!values.title) return
    setSaving(true)
    try {
      if (editing) await updateWorkspaceRow("tasks", organisation.id, editing.id, values)
      else await insertWorkspaceRow("tasks", organisation.id, { ...values, created_by: user.id })
      toast.success(editing ? "Task updated" : "Task created")
      setDialogOpen(false); setEditing(null); await refresh()
    } catch (error) { toast.error(error instanceof Error ? error.message : "Couldn't save task") }
    finally { setSaving(false) }
  }

  async function changeStatus(task: Task, status: string) {
    if (!organisation) return
    try {
      await updateWorkspaceRow("tasks", organisation.id, task.id, { status, completed_at: status === "done" ? new Date().toISOString() : null })
      await refresh()
    } catch (error) { toast.error(error instanceof Error ? error.message : "Couldn't update task") }
  }

  async function archive(task: Task) {
    if (!organisation || !window.confirm(`Archive “${task.title}”?`)) return
    try { await archiveWorkspaceRow("tasks", organisation.id, task.id); toast.success("Task archived"); await refresh() }
    catch (error) { toast.error(error instanceof Error ? error.message : "Couldn't archive task") }
  }

  async function addSubtask(event: FormEvent<HTMLFormElement>, taskId: string) {
    event.preventDefault()
    if (!organisation) return
    const form = new FormData(event.currentTarget)
    const title = String(form.get("subtask") ?? "").trim()
    if (!title) return
    try { await insertWorkspaceRow("task_subtasks", organisation.id, { task_id: taskId, title, position: subtasks.filter(item=>item.task_id===taskId).length }); await refresh() }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not add subtask") }
  }

  async function toggleSubtask(subtask: Subtask, checked: boolean) {
    if (!organisation) return
    try { await updateWorkspaceRow("task_subtasks", organisation.id, subtask.id, { is_complete: checked }); await refresh() }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not update subtask") }
  }

  function openEdit(task: Task) { setEditing(task); setDialogOpen(true) }
  function openCreate() { setEditing(null); setDialogOpen(true) }

  return <Layout><div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-cyan-700">PerformX</p><h1 className="text-3xl font-bold tracking-tight">Tasks</h1><p className="text-muted-foreground">Create, assign, and follow work across your departments.</p></div><Dialog open={dialogOpen} onOpenChange={open=>{setDialogOpen(open);if(!open)setEditing(null)}}>{canManage||user?<DialogTrigger asChild><Button onClick={openCreate}><Plus className="mr-2 h-4 w-4"/>New task</Button></DialogTrigger>:null}<DialogContent><form onSubmit={save} className="space-y-4"><DialogHeader><DialogTitle>{editing?"Edit task":"Create task"}</DialogTitle><DialogDescription>Tasks are visible only within your organisation.</DialogDescription></DialogHeader><div className="space-y-2"><Label htmlFor="task-title">Title</Label><Input id="task-title" name="title" required maxLength={240} defaultValue={editing?.title}/></div><div className="space-y-2"><Label htmlFor="task-desc">Description</Label><Textarea id="task-desc" name="description" defaultValue={editing?.description}/></div><div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Priority</Label><Select name="priority" defaultValue={editing?.priority??"medium"}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Status</Label><Select name="status" defaultValue={editing?.status??"todo"}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{statuses.map(status=><SelectItem key={status} value={status}>{status.replaceAll("_"," ")}</SelectItem>)}</SelectContent></Select></div></div><div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label htmlFor="task-date">Due date</Label><Input id="task-date" name="due_date" type="date" defaultValue={editing?.due_date??""}/></div><div className="space-y-2"><Label>Department</Label><Select name="department_id" defaultValue={editing?.department_id??"none"}><SelectTrigger><SelectValue placeholder="No department"/></SelectTrigger><SelectContent><SelectItem value="none">No department</SelectItem>{departments.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div></div><div className="space-y-2"><Label>Assignee</Label><Select name="assignee_user_id" defaultValue={editing?.assignee_user_id??(canManage?"unassigned":user?.id??"unassigned")}><SelectTrigger><SelectValue placeholder="Unassigned"/></SelectTrigger><SelectContent><SelectItem value="unassigned">Unassigned</SelectItem>{staff.filter(person=>person.user_id&&(canManage||person.user_id===user?.id)).map(person=><SelectItem key={person.user_id!} value={person.user_id!}>{person.display_name}</SelectItem>)}</SelectContent></Select></div><DialogFooter><Button type="submit" disabled={saving}>{saving?"Saving…":editing?"Save changes":"Create task"}</Button></DialogFooter></form></DialogContent></Dialog></div>
    <div className="relative max-w-lg"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input className="pl-9" placeholder="Search tasks…" value={search} onChange={event=>setSearch(event.target.value)}/></div>
    {tasks.length===0?<Card><CardContent className="flex flex-col items-center py-14 text-center"><ListTodo className="mb-4 h-8 w-8 text-cyan-700"/><h2 className="font-semibold">No tasks in this workspace</h2><p className="mt-1 text-sm text-muted-foreground">Create the first task to start tracking responsibilities and progress.</p></CardContent></Card>:filtered.length===0?<p className="py-10 text-center text-sm text-muted-foreground">No tasks match that search.</p>:<div className="space-y-3">{filtered.map(task=>{const canEdit=canManage||task.created_by===user?.id||task.assignee_user_id===user?.id;const taskSubtasks=subtasks.filter(item=>item.task_id===task.id).sort((a,b)=>a.position-b.position);const taskActivity=activity.filter(item=>item.entity_id===task.id).slice(0,6);return <Card key={task.id}><CardContent className="flex flex-wrap items-center justify-between gap-4 p-4"><button disabled={!canEdit} className="min-w-0 flex-1 text-left disabled:cursor-default" onClick={()=>openEdit(task)}><p className="truncate font-medium">{task.title}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description||"No description"}</p><p className="mt-2 text-xs text-muted-foreground">{task.due_date?`Due ${new Date(`${task.due_date}T00:00:00`).toLocaleDateString()}`:"No due date"} · {departments.find(d=>d.id===task.department_id)?.name??"No department"} · {staff.find(person=>person.user_id===task.assignee_user_id)?.display_name??"Unassigned"}</p></button><div className="flex items-center gap-2"><span className="hidden rounded-full bg-muted px-2 py-1 text-xs capitalize sm:inline-flex">{task.priority}</span>{canEdit?<Select value={task.status} onValueChange={status=>void changeStatus(task,status)}><SelectTrigger className="w-36"><SelectValue/></SelectTrigger><SelectContent>{statuses.map(status=><SelectItem key={status} value={status}>{status.replaceAll("_"," ")}</SelectItem>)}</SelectContent></Select>:<span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">{task.status.replaceAll("_"," ")}</span>}{canManage&&<Button variant="ghost" size="icon" aria-label={`Archive ${task.title}`} onClick={()=>void archive(task)}><Archive className="h-4 w-4"/></Button>}{task.status==="done"&&<Check className="h-4 w-4 text-emerald-600"/>}</div><details className="basis-full border-t pt-3"><summary className="cursor-pointer text-sm font-medium">Subtasks ({taskSubtasks.length}) and recent history</summary><div className="grid gap-4 pt-3 md:grid-cols-2"><div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subtasks</p>{taskSubtasks.length===0?<p className="text-sm text-muted-foreground">No subtasks.</p>:taskSubtasks.map(item=><label key={item.id} className="flex items-center gap-2 text-sm"><Checkbox checked={item.is_complete} onCheckedChange={checked=>void toggleSubtask(item,checked===true)}/><span className={item.is_complete?"text-muted-foreground line-through":""}>{item.title}</span></label>)}{canEdit&&<form onSubmit={event=>void addSubtask(event,task.id)} className="flex gap-2"><Input name="subtask" placeholder="Add a subtask…" maxLength={240} required/><Button type="submit" variant="outline" size="sm">Add</Button></form>}</div><div className="space-y-2"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent history</p>{taskActivity.length===0?<p className="text-sm text-muted-foreground">No changes recorded.</p>:taskActivity.map(item=><p key={item.id} className="text-sm text-muted-foreground">Task {item.action} · {new Date(item.created_at).toLocaleString()}</p>)}</div></div></details></CardContent></Card>})}</div>}
  </div></Layout>
}
