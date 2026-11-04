"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, TrendingUp, Code, MessageCircle, ClipboardList } from "lucide-react"

const teamMembers = [
  {
    id: "KG001",
    name: "Cuthbert Magawa",
    email: "cmagawa@kolidegraphics.com",
    contact: "+265 882 788 033",
    sex: "Male",
    joined: "December 2024",
    contract: "Fulltime",
    role: "Project Lead",
    avatar: "/new-profile.png",
    departments: ["Business Development"],
  },
  {
    id: "KG004",
    name: "Sarah Samani",
    email: "ssamani@kolidegraphics.com",
    contact: "+265 882 788 033",
    sex: "Female",
    joined: "February 2025",
    contract: "Fulltime",
    role: "HR & Finance",
    avatar: "/placeholder.svg?height=120&width=120",
    departments: ["Procurement"],
  },
  {
    id: "KG003",
    name: "Isaac John",
    email: "ijohn@kolidegraphics.com",
    contact: "+265 882 788 033",
    sex: "Male",
    joined: "February 2025",
    contract: "Fulltime",
    role: "Systems Developer",
    avatar: "/placeholder.svg?height=120&width=120",
    departments: ["Systems Development"],
  },
  {
    id: "KG002",
    name: "Linda Banda",
    email: "lbanda@kolidegraphics.com",
    contact: "+265 882 788 033",
    sex: "Female",
    joined: "February 2025",
    contract: "Part-time",
    role: "Graphic Designer",
    avatar: "/placeholder.svg?height=120&width=120",
    departments: ["Systems Development", "Communications"],
  },
  {
    id: "KG005",
    name: "Peter Longwe",
    email: "plongwe@kolidegraphics.com",
    contact: "+265 882 788 033",
    sex: "Male",
    joined: "March 2025",
    contract: "Fulltime",
    role: "Systems Developer",
    avatar: "/placeholder.svg?height=120&width=120",
    departments: ["Systems Development"],
  },
  {
    id: "KG006",
    name: "Mary Yuni",
    email: "myuni@kolidegraphics.com",
    contact: "+265 882 788 033",
    sex: "Female",
    joined: "March 2025",
    contract: "Fulltime",
    role: "Communications Officer",
    avatar: "/placeholder.svg?height=120&width=120",
    departments: ["Communications", "Procurement"],
  },
]

const departments = [
  {
    id: "all",
    name: "Kolide Team",
    icon: Users,
    description: "All team members",
    head: null,
    members: teamMembers,
  },
  {
    id: "business",
    name: "Business Developer",
    icon: TrendingUp,
    description: "Business Development Department",
    head: "Business Development Officer",
    members: teamMembers.filter((member) => member.departments.includes("Business Development")),
  },
  {
    id: "systems",
    name: "Systems Developer",
    icon: Code,
    description: "Systems Development Department",
    head: "Systems Development Head",
    members: teamMembers.filter((member) => member.departments.includes("Systems Development")),
  },
  {
    id: "communications",
    name: "Communications",
    icon: MessageCircle,
    description: "Communications Department",
    head: "Communications Officer",
    members: teamMembers.filter((member) => member.departments.includes("Communications")),
  },
  {
    id: "procurement",
    name: "Procurement",
    icon: ClipboardList,
    description: "Procurement Department",
    head: "Finance",
    members: teamMembers.filter((member) => member.departments.includes("Procurement")),
  },
]

export function TeamManagement() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const currentDepartment = departments.find((dept) => dept.id === selectedDepartment)
  const displayMembers = currentDepartment?.members || teamMembers

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">Staff Members</p>
        </div>

        <div className="flex gap-6">
          {/* Team Members Grid */}
          <div className="flex-1">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayMembers.map((member) => (
                <Card key={member.id} className="floating-shadow relative overflow-hidden">
                  <CardContent className="p-6 text-center relative z-10">
                    {/* Profile Picture */}
                    <div className="relative mb-4">
                      <Avatar className="h-20 w-20 mx-auto border-4 border-white shadow-lg">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-lg font-semibold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{member.name}</h3>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[#5484B4] font-medium">ID No.:</span>
                        <span className="text-gray-700">{member.id}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#5484B4] font-medium">Email:</span>
                        <span className="text-gray-700 text-xs">{member.email}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#5484B4] font-medium">Contact:</span>
                        <span className="text-gray-700">{member.contact}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#5484B4] font-medium">Sex:</span>
                        <span className="text-gray-700">{member.sex}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#5484B4] font-medium">Joined:</span>
                        <span className="text-gray-700">{member.joined}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#5484B4] font-medium">Contract:</span>
                        <span className="text-gray-700">{member.contract}</span>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="mt-4">
                      <div className="bg-[#5484B4] text-white px-0 py-3 text-sm font-medium w-[calc(100%+3rem)] text-center -mx-6 -mb-6">
                        {member.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Department Navigation */}
          <div className="w-64 space-y-3">
            {departments.map((department) => {
              const Icon = department.icon
              const isActive = selectedDepartment === department.id

              return (
                <Button
                  key={department.id}
                  variant="ghost"
                  className={`w-full justify-start h-12 px-4 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                  onClick={() => setSelectedDepartment(department.id)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{department.name}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Department Info */}
        {selectedDepartment !== "all" && currentDepartment && (
          <Card className="floating-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <currentDepartment.icon className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold">{currentDepartment.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentDepartment.description}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Department Head:</p>
                  <p className="text-gray-900">{currentDepartment.head}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members:</p>
                  <p className="text-gray-900">{currentDepartment.members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
