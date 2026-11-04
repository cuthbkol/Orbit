"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, CheckCircle, Clock, AlertTriangle, Users, Target, TrendingUp, Plus } from "lucide-react"
import { Layout } from "@/components/layout"

const taskStats = {
  total: 156,
  completed: 89,
  inProgress: 45,
  overdue: 22,
}

const departmentData = [
  { name: "Business Development", tasks: 34, completion: 78 },
  { name: "Systems Development", tasks: 52, completion: 85 },
  { name: "Communications", tasks: 28, completion: 92 },
  { name: "Procurement", tasks: 19, completion: 68 },
  { name: "HR & Finance", tasks: 23, completion: 74 },
]

const recentTasks = [
  {
    id: 1,
    title: "Q4 Marketing Campaign",
    assignee: "Thandiwe Banda",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Database Migration",
    assignee: "Chisomo Phiri",
    status: "Completed",
    priority: "High",
    dueDate: "2024-01-10",
  },
  {
    id: 3,
    title: "Employee Onboarding",
    assignee: "Grace Mwale",
    status: "Pending",
    priority: "Medium",
    dueDate: "2024-01-20",
  },
  {
    id: 4,
    title: "Asset Inventory",
    assignee: "Kondwani Nyirenda",
    status: "Overdue",
    priority: "Low",
    dueDate: "2024-01-08",
  },
]

export function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening in your organization.</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="floating-button">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task and assign it to team members.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input id="title" placeholder="Enter task title..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Task description..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Business Development</SelectItem>
                        <SelectItem value="systems">Systems Development</SelectItem>
                        <SelectItem value="communications">Communications</SelectItem>
                        <SelectItem value="procurement">Procurement</SelectItem>
                        <SelectItem value="hr">HR & Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cuthbert">Cuthbert Magawa</SelectItem>
                      <SelectItem value="sarah">Sarah Samani</SelectItem>
                      <SelectItem value="isaac">Isaac John</SelectItem>
                      <SelectItem value="linda">Linda Banda</SelectItem>
                      <SelectItem value="peter">Peter Longwe</SelectItem>
                      <SelectItem value="mary">Mary Yuni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setIsCreateDialogOpen(false)}>
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="floating-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <BarChart3 className="h-6 w-6 text-muted-foreground" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.total}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="floating-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-6 w-6 text-green-600" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((taskStats.completed / taskStats.total) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="floating-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-6 w-6 text-blue-600" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Active assignments</p>
            </CardContent>
          </Card>

          <Card className="floating-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-6 w-6 text-red-600" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.overdue}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Department Performance */}
          <Card className="floating-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Department Performance
              </CardTitle>
              <CardDescription>Task completion rates by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{dept.name}</span>
                    <span className="text-muted-foreground">
                      {dept.tasks} tasks • {dept.completion}%
                    </span>
                  </div>
                  <Progress value={dept.completion} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card className="floating-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recent Tasks
              </CardTitle>
              <CardDescription>Latest task updates and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border floating-shadow"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Assigned to {task.assignee} • Due {task.dueDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          task.priority === "High"
                            ? "destructive"
                            : task.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                      <Badge
                        variant={
                          task.status === "Completed"
                            ? "default"
                            : task.status === "In Progress"
                              ? "secondary"
                              : task.status === "Overdue"
                                ? "destructive"
                                : "outline"
                        }
                        className="text-xs"
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Goals */}
        <Card className="floating-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Company Goals - Q1 2024
            </CardTitle>
            <CardDescription>Track progress towards organizational objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Revenue Growth</span>
                  <span className="text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground">Target: MWK 800M ARR</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Customer Satisfaction</span>
                  <span className="text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <p className="text-xs text-muted-foreground">Target: 90% CSAT</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Product Development</span>
                  <span className="text-muted-foreground">68%</span>
                </div>
                <Progress value={68} className="h-2" />
                <p className="text-xs text-muted-foreground">Target: 5 new features</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
