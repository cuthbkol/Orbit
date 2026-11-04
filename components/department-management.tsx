"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Archive, Building2, Plus, Users } from "lucide-react"
import { toast } from "sonner"
import { Layout } from "@/components/layout"
import { useAuth } from "@/components/auth-provider"
import { insertWorkspaceRow, listWorkspaceRows, updateWorkspaceRow } from "@/lib/workspace-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Department = { id: string; name: string; description: string; head_user_id: string | null; status: string }
type Staff = { id: string; user_id: string | null; department_id: string | null; display_name: string }
type Task = { id: string; department_id: string | null; status: string }

export function DepartmentManagement() {
  const { organisation, role } = useAuth()
  const canManage=["org_admin","manager","department_head"].includes(role??"")
  const [departments, setDepartments] = useState<Department[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [editing, setEditing] = useState<Department | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const refresh = useCallback(async () => {
    if (!organisation) return
    const [d,s,t] = await Promise.all([
      listWorkspaceRows<Department>("departments", organisation.id, false),
      listWorkspaceRows<Staff>("staff_profiles", organisation.id, false),
      listWorkspaceRows<Task>("tasks", organisation.id),
    ])
    setDepartments(d.rows.filter(row=>row.status!=="archived")); setStaff(s.rows); setTasks(t.rows); setLoading(false)
    if(d.error||s.error||t.error) toast.error(d.error||s.error||t.error||"Could not load departments")
  },[organisation])
  useEffect(()=>{void refresh()},[refresh])

  async function save(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!organisation)return;const form=new FormData(event.currentTarget);const headUser=String(form.get("head_user_id")??"");const values={name:String(form.get("name")??"").trim(),description:String(form.get("description")??"").trim(),head_user_id:headUser&&headUser!=="none"?headUser:null,status:"active"};if(!values.name)return;try{if(editing)await updateWorkspaceRow("departments",organisation.id,editing.id,values);else await insertWorkspaceRow("departments",organisation.id,values);toast.success(editing?"Department updated":"Department created");setOpen(false);setEditing(null);await refresh()}catch(error){toast.error(error instanceof Error?error.message:"Could not save department")}}
  async function archive(department:Department){if(!organisation||!window.confirm(`Archive “${department.name}”?`))return;try{await updateWorkspaceRow("departments",organisation.id,department.id,{status:"archived"});toast.success("Department archived");await refresh()}catch(error){toast.error(error instanceof Error?error.message:"Could not archive department")}}
  function startEdit(department:Department){setEditing(department);setOpen(true)}
  function startCreate(){setEditing(null)}

  return <Layout><div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-cyan-700">Organisation</p><h1 className="text-3xl font-bold tracking-tight">Departments</h1><p className="text-muted-foreground">Organise staff and task activity into clear reporting structures.</p></div>{canManage&&<Dialog open={open} onOpenChange={value=>{setOpen(value);if(!value)setEditing(null)}}><DialogTrigger asChild><Button onClick={startCreate}><Plus className="mr-2 h-4 w-4"/>Add department</Button></DialogTrigger><DialogContent><form onSubmit={save} className="space-y-4"><DialogHeader><DialogTitle>{editing?"Edit department":"New department"}</DialogTitle><DialogDescription>Department records are scoped to your organisation.</DialogDescription></DialogHeader><div className="space-y-2"><Label htmlFor="department-name">Name</Label><Input id="department-name" name="name" required maxLength={160} defaultValue={editing?.name}/></div><div className="space-y-2"><Label htmlFor="department-description">Description</Label><Textarea id="department-description" name="description" defaultValue={editing?.description}/></div><div className="space-y-2"><Label>Department head</Label><Select name="head_user_id" defaultValue={editing?.head_user_id??"none"}><SelectTrigger><SelectValue placeholder="Unassigned"/></SelectTrigger><SelectContent><SelectItem value="none">Unassigned</SelectItem>{staff.filter(person=>person.user_id).map(person=><SelectItem key={person.user_id!} value={person.user_id!}>{person.display_name}</SelectItem>)}</SelectContent></Select></div><DialogFooter><Button type="submit">Save department</Button></DialogFooter></form></DialogContent></Dialog>}</div>
    {loading?<p className="text-sm text-muted-foreground">Loading departments…</p>:departments.length===0?<Card><CardContent className="flex flex-col items-center py-14 text-center"><Building2 className="mb-4 h-8 w-8 text-cyan-700"/><h2 className="font-semibold">No departments yet</h2><p className="mt-1 text-sm text-muted-foreground">Create departments to connect staff, tasks, and goals.</p></CardContent></Card>:<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{departments.map(department=>{const memberCount=staff.filter(person=>person.department_id===department.id).length;const departmentTasks=tasks.filter(task=>task.department_id===department.id);return <Card key={department.id}><CardHeader><div className="flex items-start justify-between gap-2"><div><CardTitle>{department.name}</CardTitle><CardDescription className="mt-1">{department.description||"No description"}</CardDescription></div><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-800">Active</span></div></CardHeader><CardContent><div className="mb-4 flex gap-5 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Users className="h-4 w-4"/>{memberCount} staff</span><span>{departmentTasks.filter(task=>task.status==="done").length}/{departmentTasks.length} tasks done</span></div>{canManage&&<div className="flex gap-2"><Button variant="outline" size="sm" onClick={()=>startEdit(department)}>Edit</Button><Button variant="ghost" size="sm" onClick={()=>void archive(department)}><Archive className="mr-2 h-4 w-4"/>Archive</Button></div>}</CardContent></Card>})}</div>}</div></Layout>
}
