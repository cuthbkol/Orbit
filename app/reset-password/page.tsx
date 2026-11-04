"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try { await updatePassword(password); router.replace("/") }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update the password.") }
    finally { setIsLoading(false) }
  }

  return <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4"><Card className="w-full max-w-md"><CardHeader><CardTitle>Choose a new password</CardTitle><CardDescription>Use at least eight characters.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={event => setPassword(event.target.value)} /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="w-full" disabled={isLoading}>{isLoading ? "Updating…" : "Update password"}</Button></form></CardContent></Card></main>
}
