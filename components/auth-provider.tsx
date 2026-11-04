"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client"

interface AuthContextType {
  user: User | null
  organisation: { id: string; name: string; slug: string } | null
  role: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isConfigured: boolean
  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, organisationName: string) => Promise<boolean>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [organisation, setOrganisation] = useState<AuthContextType["organisation"]>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) { setIsLoading(false); return }
    const syncUser = async (nextUser: User | null) => {
      setUser(nextUser)
      setOrganisation(null)
      setRole(null)
      if (nextUser) {
        const { data: membership } = await supabase.from("organisation_memberships").select("organisation_id, role").eq("user_id", nextUser.id).eq("status", "active").limit(1).maybeSingle()
        if (membership) {
          setRole(membership.role)
          const { data: org } = await supabase.from("organisations").select("id, name, slug").eq("id", membership.organisation_id).maybeSingle()
          if (org) setOrganisation(org)
        }
      }
      setIsLoading(false)
    }
    void supabase.auth.getUser().then(({ data }) => syncUser(data.user)).catch(() => setIsLoading(false))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextType>(() => ({
    user,
    organisation,
    role,
    isAuthenticated: Boolean(user),
    isLoading,
    isConfigured: isSupabaseConfigured(),
    async login(email, password) {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) throw new Error("ORBIT sign-in is not configured yet. Add the Supabase environment settings to continue.")
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.replace("/")
      router.refresh()
    },
    async signUp(email, password, fullName, organisationName) {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) throw new Error("ORBIT registration is not configured yet. Add the Supabase environment settings to continue.")
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim(), organisation_name: organisationName.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      if (data.session) { router.replace("/"); router.refresh(); return true }
      return false
    },
    async resetPassword(email) {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) throw new Error("Password reset is not configured yet.")
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` })
      if (error) throw error
    },
    async updatePassword(password) {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) throw new Error("Password management is not configured yet.")
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      router.replace("/")
      router.refresh()
    },
    async logout() {
      const supabase = getSupabaseBrowserClient()
      if (supabase) await supabase.auth.signOut()
      setUser(null)
      router.replace("/login")
      router.refresh()
    },
  }), [user, organisation, role, isLoading, router])

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" aria-label="Loading" /></div>
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
