"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Mail, MessageSquare, Plus, Send } from "lucide-react"
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

type Message={id:string;sender_user_id:string;recipient_user_id:string|null;subject:string|null;body:string;read_at:string|null;created_at:string}
type Staff={id:string;user_id:string|null;display_name:string}

export function Communication(){
  const {organisation,user}=useAuth()
  const [messages,setMessages]=useState<Message[]>([])
  const [staff,setStaff]=useState<Staff[]>([])
  const [open,setOpen]=useState(false)
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const refresh=useCallback(async()=>{if(!organisation)return;const [m,s]=await Promise.all([listWorkspaceRows<Message>("messages",organisation.id,false),listWorkspaceRows<Staff>("staff_profiles",organisation.id,false)]);setMessages(m.rows);setStaff(s.rows);setLoading(false);if(m.error||s.error)toast.error(m.error||s.error||"Could not load messages")},[organisation])
  useEffect(()=>{void refresh()},[refresh])
  async function send(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!organisation||!user)return;const form=new FormData(event.currentTarget);const recipient=String(form.get("recipient_user_id")??"");if(!recipient||recipient==="none"){toast.error("Choose a recipient");return}setSaving(true);try{await insertWorkspaceRow("messages",organisation.id,{sender_user_id:user.id,recipient_user_id:recipient,subject:String(form.get("subject")??"").trim()||null,body:String(form.get("body")??"").trim()});toast.success("Message sent");setOpen(false);await refresh()}catch(error){toast.error(error instanceof Error?error.message:"Could not send message")}finally{setSaving(false)}}
  async function markRead(message:Message){if(!organisation)return;try{await updateWorkspaceRow("messages",organisation.id,message.id,{read_at:new Date().toISOString()});await refresh()}catch(error){toast.error(error instanceof Error?error.message:"Could not update message")}}
  const personName=(id:string)=>staff.find(person=>person.user_id===id)?.display_name??"Workspace member"
  const unread=messages.filter(message=>message.recipient_user_id===user?.id&&!message.read_at).length
  return <Layout><div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-cyan-700">ORBIT</p><h1 className="text-3xl font-bold tracking-tight">Communication</h1><p className="text-muted-foreground">Private messages between members of your organisation.</p></div><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4"/>New message</Button></DialogTrigger><DialogContent><form onSubmit={send} className="space-y-4"><DialogHeader><DialogTitle>Write a message</DialogTitle><DialogDescription>Messages are only visible to the sender and recipient.</DialogDescription></DialogHeader><div className="space-y-2"><Label>Recipient</Label><Select name="recipient_user_id" required><SelectTrigger><SelectValue placeholder="Select a team member"/></SelectTrigger><SelectContent>{staff.filter(person=>person.user_id&&person.user_id!==user?.id).map(person=><SelectItem key={person.user_id!} value={person.user_id!}>{person.display_name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="message-subject">Subject</Label><Input id="message-subject" name="subject" maxLength={240}/></div><div className="space-y-2"><Label htmlFor="message-body">Message</Label><Textarea id="message-body" name="body" rows={5} required maxLength={10000}/></div><DialogFooter><Button type="submit" disabled={saving}>{saving?"Sending…":<><Send className="mr-2 h-4 w-4"/>Send message</>}</Button></DialogFooter></form></DialogContent></Dialog></div>
    <div className="grid gap-4 sm:grid-cols-3"><Card><CardHeader className="pb-2"><CardDescription>Messages shown</CardDescription><CardTitle className="text-2xl">{messages.length}</CardTitle></CardHeader></Card><Card><CardHeader className="pb-2"><CardDescription>Unread for you</CardDescription><CardTitle className="text-2xl">{unread}</CardTitle></CardHeader></Card><Card><CardHeader className="pb-2"><CardDescription>Team members</CardDescription><CardTitle className="text-2xl">{staff.filter(person=>person.user_id).length}</CardTitle></CardHeader></Card></div>
    {loading?<p className="text-sm text-muted-foreground">Loading messages…</p>:messages.length===0?<Card><CardContent className="flex flex-col items-center py-14 text-center"><MessageSquare className="mb-4 h-8 w-8 text-cyan-700"/><h2 className="font-semibold">No messages yet</h2><p className="mt-1 text-sm text-muted-foreground">Messages will appear here when you send or receive one.</p></CardContent></Card>:<div className="space-y-3">{messages.map(message=>{const received=message.recipient_user_id===user?.id;return <Card key={message.id} className={received&&!message.read_at?"border-cyan-600/40 bg-cyan-50/40":""}><CardHeader><div className="flex flex-wrap items-start justify-between gap-2"><div><CardTitle className="text-base">{message.subject||"Message"}</CardTitle><CardDescription className="mt-1">{received?`From ${personName(message.sender_user_id)}`:`To ${personName(message.recipient_user_id??"")}`} · {new Date(message.created_at).toLocaleString()}</CardDescription></div>{received&&!message.read_at&&<Button variant="outline" size="sm" onClick={()=>void markRead(message)}><Mail className="mr-2 h-4 w-4"/>Mark read</Button>}</div></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p></CardContent></Card>})}</div>}
  </div></Layout>
}
