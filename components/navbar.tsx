"use client"

import { Bell, Search, Settings, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { OrbitMark } from "@/components/orbit-mark"

export function Navbar() {
  const { user, organisation, role, logout } = useAuth()
  const displayName = String(user?.user_metadata?.full_name ?? user?.email ?? "Account")
  const initials = displayName.split(/[\s@]+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join("") || "U"
  const roleName = role?.replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase()) || "Member"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          
          <Link href="/" className="flex items-center gap-2" aria-label="ORBIT home">
            <OrbitMark className="h-8 w-8" />
            <span className="font-bold text-xl tracking-[0.12em]">ORBIT</span>
            <span className="hidden lg:block text-xs text-muted-foreground border-l pl-2">{organisation?.name ?? "Workspace"}</span>
          </Link>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tasks, employees, assets..." className="pl-10" />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Announcements">
            <Link href="/announcements">
            <Bell className="h-5 w-5" />
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 floating-shadow" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="w-fit text-xs mt-1">
                    {roleName}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
