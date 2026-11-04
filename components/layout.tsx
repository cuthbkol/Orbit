"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/components/auth-provider"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null // This will be handled by AuthProvider redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={cn("flex-1 transition-all duration-300 ease-in-out", sidebarCollapsed ? "ml-16" : "ml-64")}>
          <div className="min-h-[calc(100vh-4rem)] p-6" style={{ backgroundColor: "#F5F8FB" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
