"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Megaphone,
  Calendar,
  FileText,
  DollarSign,
  Mic,
  Check,
  ArrowRight,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react"

const announcements = [
  {
    id: 1,
    type: "event",
    title: "Malawi International Trade Fair 2024",
    description:
      "Join us at the upcoming trade fair to showcase our latest products and services. Booth setup starts May 15th.",
    date: "2024-05-20",
    priority: "high",
    category: "Expo",
    icon: Calendar,
  },
  {
    id: 2,
    type: "deadline",
    title: "Q1 Financial Reports Due",
    description: "All department heads must submit their quarterly financial reports by end of business day.",
    date: "2024-01-31",
    priority: "urgent",
    category: "Deadline",
    icon: Clock,
  },
  {
    id: 3,
    type: "rfq",
    title: "Government IT Infrastructure RFQ",
    description: "New RFQ opportunity for government IT infrastructure project. Proposal deadline is February 10th.",
    date: "2024-02-10",
    priority: "medium",
    category: "RFQ",
    icon: FileText,
  },
  {
    id: 4,
    type: "event",
    title: "Tech Innovation Summit Lilongwe",
    description: "Annual technology summit featuring latest innovations in fintech and digital solutions.",
    date: "2024-03-15",
    priority: "medium",
    category: "Conference",
    icon: Users,
  },
  {
    id: 5,
    type: "proposal",
    title: "Banking Software Modernization Bid",
    description: "Major opportunity to bid on banking software modernization project for local financial institution.",
    date: "2024-02-28",
    priority: "high",
    category: "Proposal",
    icon: DollarSign,
  },
]

const recentMessages = [
  {
    id: 1,
    sender: "Isaac John",
    message: "I believe it's quite doable",
    time: "2 min ago",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "unread",
    icon: null,
  },
  {
    id: 2,
    sender: "Sarah Samani",
    message: "Voice Message",
    time: "5 min ago",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "voice",
    icon: Mic,
  },
  {
    id: 3,
    sender: "Linda Banda",
    message: "I need a quick design",
    time: "12 min ago",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "completed",
    icon: Check,
  },
  {
    id: 4,
    sender: "Peter Longwe",
    message: "I'll take it up to Sarah",
    time: "1 hour ago",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "forwarded",
    icon: ArrowRight,
  },
  {
    id: 5,
    sender: "Mary Yuni",
    message: "Go ahead",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "completed",
    icon: Check,
  },
]

export function Communication() {
  const [selectedTab, setSelectedTab] = useState("announcements")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "unread":
        return <div className="w-3 h-3 bg-blue-500 rounded-full" />
      case "voice":
        return <Mic className="w-4 h-4 text-blue-600" />
      case "completed":
        return <Check className="w-4 h-4 text-green-600" />
      case "forwarded":
        return <ArrowRight className="w-4 h-4 text-gray-600" />
      default:
        return null
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication</h1>
          <p className="text-muted-foreground">Stay updated with announcements and team messages.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              </TabsList>

              <TabsContent value="announcements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Megaphone className="h-5 w-5" />
                      General Announcements
                    </CardTitle>
                    <CardDescription>Important updates, events, deadlines, and business opportunities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {announcements.map((announcement) => {
                      const Icon = announcement.icon
                      return (
                        <div
                          key={announcement.id}
                          className="flex items-start gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-lg">{announcement.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant={getPriorityColor(announcement.priority) as any}>
                                  {announcement.priority}
                                </Badge>
                                <Badge variant="outline">{announcement.category}</Badge>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{announcement.description}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {announcement.date}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {announcements
                      .filter((item) => item.type === "event")
                      .map((event) => {
                        const Icon = event.icon
                        return (
                          <div key={event.id} className="flex items-center gap-4 p-4 rounded-lg border">
                            <Icon className="w-6 h-6 text-blue-600" />
                            <div className="flex-1">
                              <h3 className="font-semibold">{event.title}</h3>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                              <p className="text-sm text-muted-foreground mt-1">Date: {event.date}</p>
                            </div>
                          </div>
                        )
                      })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deadlines" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Important Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {announcements
                      .filter((item) => item.type === "deadline")
                      .map((deadline) => (
                        <div
                          key={deadline.id}
                          className="flex items-center gap-4 p-4 rounded-lg border border-red-200 bg-red-50"
                        >
                          <Clock className="w-6 h-6 text-red-600" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-red-900">{deadline.title}</h3>
                            <p className="text-sm text-red-700">{deadline.description}</p>
                            <p className="text-sm text-red-600 mt-1 font-medium">Deadline: {deadline.date}</p>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Business Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {announcements
                      .filter((item) => item.type === "rfq" || item.type === "proposal")
                      .map((opportunity) => {
                        const Icon = opportunity.icon
                        return (
                          <div
                            key={opportunity.id}
                            className="flex items-center gap-4 p-4 rounded-lg border border-green-200 bg-green-50"
                          >
                            <Icon className="w-6 h-6 text-green-600" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-green-900">{opportunity.title}</h3>
                              <p className="text-sm text-green-700">{opportunity.description}</p>
                              <p className="text-sm text-green-600 mt-1 font-medium">Deadline: {opportunity.date}</p>
                            </div>
                          </div>
                        )
                      })}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Messages Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Recent Messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 p-0">
                <div className="space-y-0">
                  {recentMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        index !== recentMessages.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                        <AvatarFallback>
                          {message.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-gray-900 truncate">{message.sender}</p>
                          {getMessageIcon(message.type)}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-gray-900">
                    Load more
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
