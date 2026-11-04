"use client"

import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Calendar, Award, Edit, Save } from "lucide-react"

const userProfile = {
  name: "Cuthbert Magawa",
  email: "cuthbert.magawa@company.com",
  phone: "+265 (0) 123-4567",
  location: "Blantyre, Malawi",
  department: "Project Lead",
  joinDate: "2022-03-15",
  avatar: "CM",
  bio: "Experienced project leader with 8+ years in technology management. Passionate about driving innovation and building high-performing teams across Malawi's growing tech sector.",
  skills: ["Project Management", "Team Leadership", "Strategic Planning", "Agile/Scrum", "Risk Management"],
  performance: {
    overall: 92,
    tasksCompleted: 156,
    tasksOnTime: 142,
    teamSatisfaction: 4.8,
  },
}

const recentTasks = [
  { id: 1, title: "Q4 Strategic Planning", status: "Completed", dueDate: "2024-01-10", priority: "High" },
  { id: 2, title: "Team Performance Review", status: "In Progress", dueDate: "2024-01-20", priority: "Medium" },
  { id: 3, title: "Budget Allocation Meeting", status: "Pending", dueDate: "2024-01-25", priority: "High" },
  { id: 4, title: "Department Restructure Plan", status: "In Progress", dueDate: "2024-02-01", priority: "Medium" },
]

const achievements = [
  { title: "Project Excellence Award", date: "2023-12", description: "Outstanding leadership in Q4 initiatives" },
  { title: "Team Builder", date: "2023-09", description: "Successfully onboarded 5 new team members" },
  { title: "Innovation Champion", date: "2023-06", description: "Led implementation of new project management system" },
]

export function UserProfile() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and view your performance metrics.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src="/new-profile.png" alt="Cuthbert Magawa" />
                <AvatarFallback className="text-2xl">{userProfile.avatar}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{userProfile.name}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mb-2">
                  {userProfile.department}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {userProfile.joinDate}</span>
                </div>
              </div>

              <Button className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userProfile.performance.overall}%</div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userProfile.performance.tasksCompleted}</div>
                    <div className="text-sm text-muted-foreground">Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">91%</div>
                    <div className="text-sm text-muted-foreground">On-Time Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userProfile.performance.teamSatisfaction}</div>
                    <div className="text-sm text-muted-foreground">Team Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="tasks" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tasks">My Tasks</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Tasks</CardTitle>
                    <CardDescription>Your latest task assignments and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="space-y-1">
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={task.priority === "High" ? "destructive" : "default"}>
                              {task.priority}
                            </Badge>
                            <Badge
                              variant={
                                task.status === "Completed"
                                  ? "default"
                                  : task.status === "In Progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                    <CardDescription>Your professional skills and competencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userProfile.skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{skill}</span>
                            <span className="text-sm text-muted-foreground">
                              {85 + Math.floor(Math.random() * 15)}%
                            </span>
                          </div>
                          <Progress value={85 + Math.floor(Math.random() * 15)} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements & Recognition</CardTitle>
                    <CardDescription>Your accomplishments and awards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          <Award className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-medium">{achievement.title}</p>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Cuthbert" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Magawa" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={userProfile.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue={userProfile.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" defaultValue={userProfile.bio} />
                    </div>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  )
}
