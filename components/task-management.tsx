"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Filter, Calendar, User, Clock, AlertTriangle, CheckCircle, MoreHorizontal } from "lucide-react"

const tasks = [
  {
    id: 1,
    title: "Q4 Marketing Campaign Strategy",
    description:
      "Develop comprehensive marketing strategy for Q4 including digital campaigns, content calendar, and budget allocation.",
    status: "In Progress",
    priority: "High",
    assignee: { name: "Thandiwe Banda", avatar: "TB", email: "thandiwe.banda@company.com" },
    department: "Business Development",
    dueDate: "2024-01-15",
    progress: 65,
    subtasks: [
      { id: 1, title: "Market research analysis", completed: true },
      { id: 2, title: "Competitor analysis", completed: true },
      { id: 3, title: "Budget planning", completed: false },
      { id: 4, title: "Campaign timeline", completed: false },
    ],
  },
  {
    id: 2,
    title: "Database Migration to PostgreSQL",
    description: "Migrate existing MySQL database to PostgreSQL with zero downtime and data integrity validation.",
    status: "Completed",
    priority: "High",
    assignee: { name: "Chisomo Phiri", avatar: "CP", email: "chisomo.phiri@company.com" },
    department: "Systems Development",
    dueDate: "2024-01-10",
    progress: 100,
    subtasks: [
      { id: 1, title: "Schema conversion", completed: true },
      { id: 2, title: "Data migration script", completed: true },
      { id: 3, title: "Testing and validation", completed: true },
      { id: 4, title: "Production deployment", completed: true },
    ],
  },
  {
    id: 3,
    title: "Employee Onboarding Process Redesign",
    description:
      "Redesign the employee onboarding process to improve new hire experience and reduce time to productivity.",
    status: "Pending",
    priority: "Medium",
    assignee: { name: "Grace Mwale", avatar: "GM", email: "grace.mwale@company.com" },
    department: "HR & Finance",
    dueDate: "2024-01-20",
    progress: 0,
    subtasks: [
      { id: 1, title: "Current process audit", completed: false },
      { id: 2, title: "Stakeholder interviews", completed: false },
      { id: 3, title: "New process design", completed: false },
      { id: 4, title: "Documentation update", completed: false },
    ],
  },
  {
    id: 4,
    title: "Office Asset Inventory Update",
    description:
      "Complete comprehensive inventory of all office assets including IT equipment, furniture, and supplies.",
    status: "Overdue",
    priority: "Low",
    assignee: { name: "Kondwani Nyirenda", avatar: "KN", email: "kondwani.nyirenda@company.com" },
    department: "Procurement",
    dueDate: "2024-01-08",
    progress: 25,
    subtasks: [
      { id: 1, title: "IT equipment audit", completed: true },
      { id: 2, title: "Furniture inventory", completed: false },
      { id: 3, title: "Supply count", completed: false },
      { id: 4, title: "Database update", completed: false },
    ],
  },
]

export function TaskManagement() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "pending") return matchesSearch && task.status === "Pending"
    if (selectedTab === "progress") return matchesSearch && task.status === "In Progress"
    if (selectedTab === "completed") return matchesSearch && task.status === "Completed"
    if (selectedTab === "overdue") return matchesSearch && task.status === "Overdue"

    return matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "Overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "In Progress":
        return "secondary"
      case "Overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
            <p className="text-muted-foreground">Manage and track all organizational tasks and assignments.</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
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
                      <SelectItem value="thandiwe">Thandiwe Banda</SelectItem>
                      <SelectItem value="chisomo">Chisomo Phiri</SelectItem>
                      <SelectItem value="grace">Grace Mwale</SelectItem>
                      <SelectItem value="kondwani">Kondwani Nyirenda</SelectItem>
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

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Task Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({tasks.filter((t) => t.status === "Pending").length})</TabsTrigger>
            <TabsTrigger value="progress">
              In Progress ({tasks.filter((t) => t.status === "In Progress").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({tasks.filter((t) => t.status === "Completed").length})
            </TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({tasks.filter((t) => t.status === "Overdue").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <CardDescription className="text-sm">{task.description}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Task Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <Badge variant={getStatusColor(task.status) as any}>{task.status}</Badge>
                        </div>
                        <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                        <Badge variant="outline">{task.department}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Due {task.dueDate}
                      </div>
                    </div>

                    {/* Assignee */}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                        <AvatarFallback className="text-xs">{task.assignee.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{task.assignee.name}</span>
                      <span className="text-sm text-muted-foreground">({task.assignee.email})</span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Subtasks */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Subtasks ({task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length})
                      </h4>
                      <div className="space-y-1">
                        {task.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-center gap-2 text-sm">
                            <div
                              className={`h-4 w-4 rounded border-2 flex items-center justify-center ${
                                subtask.completed ? "bg-primary border-primary" : "border-muted-foreground"
                              }`}
                            >
                              {subtask.completed && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
