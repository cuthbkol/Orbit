"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { Mail, Plus, Search, Users } from "lucide-react"
import { toast } from "sonner"
import { Layout } from "@/components/layout"
import { useAuth } from "@/components/auth-provider"
import { listWorkspaceRows, updateWorkspaceRow } from "@/lib/workspace-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Staff = { id: string; user_id: string | null; display_name: string; work_email: string | null; job_title: string; department_id: string | null; status: string; skills: string[] }
type Department = { id: string; name: string }
type Membership = { id: string; user_id: string; role: string; status: string }
const roleOptions = ["org_admin", "manager", "department_head", "staff"]

export function TeamManagement() {
  const { organisation, role } = useAuth()
  const [staff, setStaff] = useState<Staff[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const refresh = useCallback(async () => {
    if (!organisation) return
    const [p,d,m] = await Promise.all([
      listWorkspaceRows<Staff>("staff_profiles", organisation.id, false),
      listWorkspaceRows<Department>("departments", organisation.id, false),
      listWorkspaceRows<Membership>("organisation_memberships", organisation.id, false),
    ])
    setStaff(p.rows.filter(row=>row.status!=="inactive")); setDepartments(d.rows); setMemberships(m.rows); setLoading(false)
    if(p.error||d.error||m.error)toast.error(p.error||d.error||m.error||"Could not load team")
  },[organisation])
  useEffect(()=>{void refresh()},[refresh])
  const filtered=useMemo(()=>staff.filter(person=>`${person.display_name} ${person.work_email??""} ${person.job_title}`.toLowerCase().includes(search.toLowerCase())),[staff,search])

  async function invite(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!organisation)return;const form=new FormData(event.currentTarget);const departmentId=String(form.get("department_id")??"");setSaving(true);try{const response=await fetch("/api/invitations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({organisationId:organisation.id,email:String(form.get("email")??"").trim(),fullName:String(form.get("full_name")??"").trim(),jobTitle:String(form.get("job_title")??"").trim(),departmentId:departmentId&&departmentId!=="none"?departmentId:null,role:String(form.get("role")??"staff")})});const result=await response.json();if(!response.ok)throw new Error(result.error||"Could not send invitation");toast.success("Invitation sent");setOpen(false);await refresh()}catch(error){toast.error(error instanceof Error?error.message:"Could not send invitation")}finally{setSaving(false)}}
  async function changeRole(person:Staff, nextRole:string){if(!organisation||!person.user_id)return;const member=memberships.find(item=>item.user_id===person.user_id);if(!member)return;try{await updateWorkspaceRow("organisation_memberships",organisation.id,member.id,{role:nextRole});toast.success("Role updated");await refresh()}catch(error){toast.error(error instanceof Error?error.message:"Could not update role")}}

  return <Layout><div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-cyan-700">Organisation</p><h1 className="text-3xl font-bold tracking-tight">Team</h1><p className="text-muted-foreground">Invite people to your workspace and manage their organisation roles.</p></div>{role==="org_admin"&&<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4"/>Invite staff</Button></DialogTrigger><DialogContent><form onSubmit={invite} className="space-y-4"><DialogHeader><DialogTitle>Invite a colleague</DialogTitle><DialogDescription>They’ll receive an email link to join this workspace.</DialogDescription></DialogHeader><div className="space-y-2"><Label htmlFor="staff-name">Full name</Label><Input id="staff-name" name="full_name" required minLength={2} maxLength={160}/></div><div className="space-y-2"><Label htmlFor="staff-email">Work email</Label><Input id="staff-email" name="email" type="email" required maxLength={320}/></div><div className="space-y-2"><Label htmlFor="staff-title">Job title</Label><Input id="staff-title" name="job_title" maxLength={160}/></div><div className="space-y-2"><Label>Department</Label><Select name="department_id" defaultValue="none"><SelectTrigger><SelectValue placeholder="No department"/></SelectTrigger><SelectContent><SelectItem value="none">No department</SelectItem>{departments.map(department=><SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Workspace role</Label><Select name="role" defaultValue="staff"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{roleOptions.map(item=><SelectItem key={item} value={item}>{item.replaceAll("_"," ")}</SelectItem>)}</SelectContent></Select></div><DialogFooter><Button type="submit" disabled={saving}>{saving?"Sending…":"Send invitation"}</Button></DialogFooter></form></DialogContent></Dialog>}</div>
    <div className="relative max-w-lg"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input className="pl-9" placeholder="Search team…" value={search} onChange={event=>setSearch(event.target.value)}/></div>
    {loading?<p className="text-sm text-muted-foreground">Loading team…</p>:staff.length===0?<Card><CardContent className="flex flex-col items-center py-14 text-center"><Users className="mb-4 h-8 w-8 text-cyan-700"/><h2 className="font-semibold">No team members yet</h2><p className="mt-1 text-sm text-muted-foreground">Invite colleagues to connect their responsibilities and performance to this workspace.</p></CardContent></Card>:filtered.length===0?<p className="py-10 text-center text-sm text-muted-foreground">No team members match that search.</p>:<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(person=>{const membership=memberships.find(item=>item.user_id===person.user_id);const department=departments.find(item=>item.id===person.department_id);const initials=person.display_name.split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]?.toUpperCase()).join("")||"U";return <Card key={person.id}><CardHeader><div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 font-semibold text-cyan-900">{initials}</div><span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">{membership?.status??person.status}</span></div><CardTitle className="pt-2">{person.display_name}</CardTitle><CardDescription>{person.job_title||"Team member"}</CardDescription></CardHeader><CardContent className="space-y-3"><p className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4"/>{person.work_email||"No email"}</p><p className="text-sm text-muted-foreground">{department?.name??"No department"}</p>{role==="org_admin"&&membership?<Select value={membership.role} onValueChange={value=>void changeRole(person,value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{roleOptions.map(item=><SelectItem key={item} value={item}>{item.replaceAll("_"," ")}</SelectItem>)}</SelectContent></Select>:<p className="text-xs capitalize text-muted-foreground">Role: {membership?.role?.replaceAll("_"," ")??"Profile only"}</p>}</CardContent></Card>})}</div>}
  </div></Layout>
}
