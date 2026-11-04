"use client"

import { useCallback, useEffect, useState } from "react"
import { BarChart3, CheckCircle2, CircleDashed, Plus, Target, Users } from "lucide-react"
import { toast } from "sonner"
import { Layout } from "@/components/layout"
import { useAuth } from "@/components/auth-provider"
import { listWorkspaceRows, insertWorkspaceRow } from "@/lib/workspace-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Task = { id: string; title: string; status: string; priority: string; due_date: string | null; created_at: string }
type Goal = { id: string; status: string }
type StaffProfile = { id: string; status: string }

export function Dashboard() {
  const { organisation, user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [staff, setStaff] = useState<StaffProfile[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const refresh = useCallback(async () => {
    if (!organisation) return
    const [taskRows, goalRows, staffRows] = await Promise.all([
      listWorkspaceRows<Task>("tasks", organisation.id),
      listWorkspaceRows<Goal>("goals", organisation.id),
      listWorkspaceRows<StaffProfile>("staff_profiles", organisation.id, false),
    ])
    if (taskRows.error || goalRows.error || staffRows.error) toast.error(taskRows.error || goalRows.error || staffRows.error || "Couldn't load workspace data")
    setTasks(taskRows.rows)
    setGoals(goalRows.rows)
    setStaff(staffRows.rows)
  }, [organisation])

  useEffect(() => { void refresh() }, [refresh])

  async function createTask(formData: FormData) {
    if (!organisation || !user) return
    const title = String(formData.get("title") ?? "").trim()
    if (!title) return
    setIsSaving(true)
    try {
      await insertWorkspaceRow("tasks", organisation.id, {
        title,
        description: String(formData.get("description") ?? "").trim(),
        priority: String(formData.get("priority") ?? "medium"),
        due_date: String(formData.get("due_date") ?? "") || null,
        created_by: user.id,
      })
      toast.success("Task created")
      setIsOpen(false)
      await refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't create the task")
    } finally { setIsSaving(false) }
  }

  const completedTasks = tasks.filter(task => task.status === "done").length
  const openTasks = tasks.length - completedTasks
  const activeGoals = goals.filter(goal => goal.status !== "completed" && goal.status !== "cancelled").length

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-medium text-cyan-700">{organisation?.name ?? "Your workspace"}</p><h1 className="text-3xl font-bold tracking-tight">Overview</h1><p className="text-muted-foreground">A live view of work, people, and goals across your organisation.</p></div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add task</Button></DialogTrigger>
            <DialogContent>
              <form action={createTask} className="space-y-4">
                <DialogHeader><DialogTitle>Create task</DialogTitle><DialogDescription>Connect the task to your organisation's work.</DialogDescription></DialogHeader>
                <div className="space-y-2"><Label htmlFor="task-title">Title</Label><Input id="task-title" name="title" maxLength={240} required /></div>
                <div className="space-y-2"><Label htmlFor="task-description">Description</Label><Textarea id="task-description" name="description" /></div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="task-priority">Priority</Label><Select name="priority" defaultValue="medium"><SelectTrigger id="task-priority"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label htmlFor="task-due">Due date</Label><Input id="task-due" name="due_date" type="date" /></div></div>
                <DialogFooter><Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : "Create task"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Open tasks" value={openTasks} icon={CircleDashed} detail="Tasks not yet completed" />
          <MetricCard title="Completed tasks" value={completedTasks} icon={CheckCircle2} detail="Recorded as complete" />
          <MetricCard title="Active goals" value={activeGoals} icon={Target} detail="Goals in progress or at risk" />
          <MetricCard title="Active staff" value={staff.filter(person => person.status === "active").length} icon={Users} detail="People in this workspace" />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Recent tasks</CardTitle><p className="text-sm text-muted-foreground">Latest work recorded in your workspace.</p></div><BarChart3 className="h-5 w-5 text-muted-foreground" /></CardHeader>
          <CardContent>
            {tasks.length === 0 ? <div className="rounded-lg border border-dashed p-10 text-center"><p className="font-medium">No tasks yet</p><p className="mt-1 text-sm text-muted-foreground">Create a task to start tracking work across your organisation.</p></div> : <div className="divide-y">{tasks.slice(0, 8).map(task => <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{task.title}</p><p className="text-sm text-muted-foreground">{task.due_date ? `Due ${new Date(`${task.due_date}T00:00:00`).toLocaleDateString()}` : "No due date"}</p></div><div className="flex items-center gap-2 text-sm"><span className="rounded-full bg-muted px-2.5 py-1 capitalize">{task.status.replaceAll("_", " ")}</span><span className="text-muted-foreground capitalize">{task.priority}</span></div></div>)}</div>}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

function MetricCard({ title, value, icon: Icon, detail }: { title: string; value: number; icon: typeof Users; detail: string }) {
  return <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle><Icon className="h-4 w-4 text-cyan-700" /></CardHeader><CardContent><div className="text-2xl font-bold">{value}</div><p className="text-xs text-muted-foreground">{detail}</p></CardContent></Card>
}
