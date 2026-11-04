"use client"

import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Users, CheckCircle, Clock, TrendingUp, Target } from "lucide-react"

const departments = [
  {
    id: 1,
    name: "Business Development",
    description: "Driving growth through strategic partnerships and market expansion",
    head: { name: "Thandiwe Banda", avatar: "TB", email: "thandiwe.banda@company.com" },
    members: 8,
    activeTasks: 12,
    completedTasks: 34,
    performance: 78,
    goals: [
      { name: "Q1 Revenue Target", progress: 85, target: "MWK 200M" },
      { name: "New Client Acquisition", progress: 60, target: "15 clients" },
    ],
    recentActivity: [
      "Completed Q4 marketing campaign strategy",
      "Signed partnership agreement with TechCorp Malawi",
      "Launched new product demo series",
    ],
  },
  {
    id: 2,
    name: "Systems Development",
    description: "Building and maintaining robust technical infrastructure",
    head: { name: "Chisomo Phiri", avatar: "CP", email: "chisomo.phiri@company.com" },
    members: 12,
    activeTasks: 18,
    completedTasks: 52,
    performance: 85,
    goals: [
      { name: "System Migration", progress: 90, target: "100%" },
      { name: "Performance Optimization", progress: 75, target: "50ms response" },
    ],
    recentActivity: [
      "Completed database migration to PostgreSQL",
      "Deployed new API endpoints",
      "Fixed critical security vulnerabilities",
    ],
  },
  {
    id: 3,
    name: "Communications",
    description: "Managing internal and external communications strategy",
    head: { name: "Mphatso Kachingwe", avatar: "MK", email: "mphatso.kachingwe@company.com" },
    members: 6,
    activeTasks: 9,
    completedTasks: 28,
    performance: 92,
    goals: [
      { name: "Brand Awareness", progress: 88, target: "10K followers" },
      { name: "Content Production", progress: 95, target: "50 articles" },
    ],
    recentActivity: [
      "Published quarterly company newsletter",
      "Launched social media campaign",
      "Updated brand guidelines",
    ],
  },
  {
    id: 4,
    name: "Procurement",
    description: "Managing vendor relationships and supply chain operations",
    head: { name: "Kondwani Nyirenda", avatar: "KN", email: "kondwani.nyirenda@company.com" },
    members: 4,
    activeTasks: 7,
    completedTasks: 19,
    performance: 68,
    goals: [
      { name: "Cost Reduction", progress: 45, target: "15%" },
      { name: "Vendor Optimization", progress: 70, target: "5 vendors" },
    ],
    recentActivity: [
      "Negotiated new supplier contracts",
      "Completed office asset inventory",
      "Implemented new procurement software",
    ],
  },
  {
    id: 5,
    name: "HR & Finance",
    description: "Supporting employee development and financial operations",
    head: { name: "Grace Mwale", avatar: "GM", email: "grace.mwale@company.com" },
    members: 5,
    activeTasks: 11,
    completedTasks: 23,
    performance: 74,
    goals: [
      { name: "Employee Satisfaction", progress: 82, target: "90%" },
      { name: "Budget Compliance", progress: 95, target: "100%" },
    ],
    recentActivity: [
      "Completed annual performance reviews",
      "Launched employee wellness program",
      "Updated financial reporting system",
    ],
  },
]

export function DepartmentManagement() {
  const totalMembers = departments.reduce((sum, dept) => sum + dept.members, 0)
  const totalActiveTasks = departments.reduce((sum, dept) => sum + dept.activeTasks, 0)
  const totalCompletedTasks = departments.reduce((sum, dept) => sum + dept.completedTasks, 0)
  const avgPerformance = Math.round(departments.reduce((sum, dept) => sum + dept.performance, 0) / departments.length)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Management</h1>
          <p className="text-muted-foreground">Overview of all departments, their performance, and key metrics.</p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
              <Building2 className="h-6 w-6 text-muted-foreground" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-6 w-6 text-muted-foreground" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Clock className="h-6 w-6 text-blue-600" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActiveTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-6 w-6 text-green-600" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPerformance}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Department Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {departments.map((department) => (
            <Card key={department.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {department.name}
                    </CardTitle>
                    <CardDescription>{department.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {department.performance}% Performance
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Department Head */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>{department.head.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{department.head.name}</p>
                    <p className="text-sm text-muted-foreground">Department Head</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{department.members}</div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{department.activeTasks}</div>
                    <div className="text-xs text-muted-foreground">Active Tasks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{department.completedTasks}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>

                {/* Goals */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Department Goals
                  </h4>
                  {department.goals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{goal.name}</span>
                        <span className="text-muted-foreground">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: {goal.target}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recent Activity</h4>
                  <div className="space-y-1">
                    {department.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                        <span className="text-muted-foreground">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
