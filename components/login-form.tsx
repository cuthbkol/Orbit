"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrbitMark } from "@/components/orbit-mark"
import { useAuth } from "@/components/auth-provider"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [organisationName, setOrganisationName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { login, signUp, resetPassword, isConfigured } = useAuth()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)
    try {
      if (isSignUp) {
        const signedIn = await signUp(email, password, fullName, organisationName)
        if (!signedIn) setMessage("Check your email to confirm your account. Your workspace will be ready after confirmation.")
      } else {
        await login(email, password)
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't complete that request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    setError(null)
    setMessage(null)
    if (!email) { setError("Enter your email address first."); return }
    setIsLoading(true)
    try {
      await resetPassword(email)
      setMessage("If an account exists for that email, a password reset link has been sent.")
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't send the reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M0,300 Q250,200 500,300 T1000,300 M0,500 Q250,400 500,500 T1000,500" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <div className="text-center mb-6 z-10 text-white">
        <OrbitMark className="h-16 w-16 mx-auto mb-3" />
        <div className="text-3xl font-bold tracking-[0.2em]">ORBIT</div>
        <div className="text-sm text-cyan-200 mt-1">All Things Connected.</div>
      </div>
      <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-md border-slate-700/50 floating-shadow z-10">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-white">{isSignUp ? "Create your workspace" : "Welcome back"}</CardTitle>
          <CardDescription className="text-gray-300">{isSignUp ? "Set up your organisation on ORBIT." : "Sign in to your organisational workspace."}</CardDescription>
        </CardHeader>
        <CardContent>
          {!isConfigured && <p role="status" className="mb-4 rounded-md border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">Authentication is not connected yet. Add the Supabase settings from the deployment guide to enable sign-in.</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && <>
              <div className="space-y-2"><Label htmlFor="fullName" className="text-gray-200">Your name</Label><Input id="fullName" autoComplete="name" value={fullName} onChange={event => setFullName(event.target.value)} required className="bg-slate-700/50 border-slate-600 text-white" /></div>
              <div className="space-y-2"><Label htmlFor="organisationName" className="text-gray-200">Organisation name</Label><Input id="organisationName" autoComplete="organization" value={organisationName} onChange={event => setOrganisationName(event.target.value)} required minLength={2} maxLength={160} className="bg-slate-700/50 border-slate-600 text-white" /></div>
            </>}
            <div className="space-y-2"><Label htmlFor="email" className="text-gray-200">Email</Label><Input id="email" type="email" autoComplete="email" placeholder="you@organisation.com" value={email} onChange={event => setEmail(event.target.value)} required className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400" /></div>
            <div className="space-y-2"><Label htmlFor="password" className="text-gray-200">Password</Label><div className="relative"><Input id="password" type={showPassword ? "text" : "password"} autoComplete={isSignUp ? "new-password" : "current-password"} value={password} onChange={event => setPassword(event.target.value)} minLength={8} required className="bg-slate-700/50 border-slate-600 text-white pr-10" /><Button type="button" variant="ghost" size="icon" aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div></div>
            {!isSignUp && <div className="text-right"><button type="button" onClick={handlePasswordReset} disabled={isLoading} className="text-sm text-cyan-300 hover:text-cyan-200">Forgot password?</button></div>}
            {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
            {message && <p role="status" className="text-sm text-emerald-300">{message}</p>}
            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3" disabled={isLoading || !isConfigured}>{isLoading ? "Please wait…" : isSignUp ? "Create workspace" : "Sign in"}</Button>
          </form>
          <div className="mt-5 text-center text-sm text-gray-300">{isSignUp ? "Already have a workspace?" : "New to ORBIT?"} <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null) }} className="font-medium text-cyan-300 hover:text-cyan-200">{isSignUp ? "Sign in" : "Create one"}</button></div>
          <div className="mt-4 text-center text-xs text-gray-400">Integrated Organisational Management Platform</div>
        </CardContent>
      </Card>
    </main>
  )
}
