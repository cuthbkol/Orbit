"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Package,
  MessageSquare,
  Target,
  FileText,
  Megaphone,
  User,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Team", href: "/team", icon: Users },
  { name: "Assets", href: "/assets", icon: Package },
  { name: "Communication", href: "/communication", icon: MessageSquare },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
  { name: "Profile", href: "/profile", icon: User },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
        )}
        style={{ backgroundColor: "#10243A" }}
      >
        <div className="flex h-full flex-col">
          {/* Toggle Button */}
          <div className="flex items-center justify-end p-2 border-b border-white/20">
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 text-white hover:bg-white/20">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-2 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                const linkContent = (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/20 hover:text-white",
                      isActive ? "bg-white/30 text-white" : "text-white/90",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )

                if (collapsed) {
                  return (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return linkContent
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  )
}
