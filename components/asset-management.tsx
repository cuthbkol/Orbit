"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Monitor,
  Smartphone,
  Printer,
  Car,
  Wrench,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Scissors,
  Zap,
  Layers,
} from "lucide-react"

const assets = [
  {
    id: "AST-001",
    name: 'MacBook Pro 16"',
    type: "Computer",
    category: "IT Equipment",
    status: "Active",
    condition: "Excellent",
    assignedTo: { name: "Thandiwe Banda", avatar: "TB", department: "Business Development" },
    purchaseDate: "2023-08-15",
    value: "MWK 1,249,500",
    location: "Office Floor 2",
    serialNumber: "MBP2023001",
    warranty: "2025-08-15",
  },
  {
    id: "AST-002",
    name: 'Dell UltraSharp 27" Monitor',
    type: "Monitor",
    category: "IT Equipment",
    status: "Active",
    condition: "Good",
    assignedTo: { name: "Chisomo Phiri", avatar: "CP", department: "Systems Development" },
    purchaseDate: "2023-06-20",
    value: "MWK 199,500",
    location: "Office Floor 3",
    serialNumber: "DU27001",
    warranty: "2026-06-20",
  },
  {
    id: "AST-003",
    name: "iPhone 15 Pro",
    type: "Mobile Device",
    category: "IT Equipment",
    status: "Active",
    condition: "Excellent",
    assignedTo: { name: "Grace Mwale", avatar: "GM", department: "HR & Finance" },
    purchaseDate: "2023-10-01",
    value: "MWK 499,500",
    location: "Mobile",
    serialNumber: "IP15001",
    warranty: "2024-10-01",
  },
  {
    id: "AST-004",
    name: "HP LaserJet Pro",
    type: "Printer",
    category: "Office Equipment",
    status: "Maintenance",
    condition: "Fair",
    assignedTo: null,
    purchaseDate: "2022-03-10",
    value: "MWK 149,500",
    location: "Office Floor 1",
    serialNumber: "HP2022001",
    warranty: "2024-03-10",
  },
  {
    id: "AST-005",
    name: "Conference Room Table",
    type: "Furniture",
    category: "Office Furniture",
    status: "Active",
    condition: "Good",
    assignedTo: null,
    purchaseDate: "2023-01-15",
    value: "MWK 600,000",
    location: "Conference Room A",
    serialNumber: "CRT2023001",
    warranty: "2028-01-15",
  },
  {
    id: "AST-006",
    name: "Company Vehicle - Toyota Camry",
    type: "Vehicle",
    category: "Transportation",
    status: "Active",
    condition: "Good",
    assignedTo: { name: "Kondwani Nyirenda", avatar: "KN", department: "Procurement" },
    purchaseDate: "2022-11-20",
    value: "MWK 14,000,000",
    location: "Parking Lot",
    serialNumber: "TC2022001",
    warranty: "2025-11-20",
  },
  {
    id: "AST-007",
    name: "Large Format Printer",
    type: "Large Format Printer",
    category: "Graphics Equipment",
    status: "Active",
    condition: "Excellent",
    assignedTo: { name: "Mphatso Kachingwe", avatar: "MK", department: "Communications" },
    purchaseDate: "2023-09-10",
    value: "MWK 2,500,000",
    location: "Graphics Studio",
    serialNumber: "LFP2023001",
    warranty: "2026-09-10",
  },
  {
    id: "AST-008",
    name: "Vinyl Cutter / Plotter",
    type: "Vinyl Cutter",
    category: "Graphics Equipment",
    status: "Active",
    condition: "Good",
    assignedTo: { name: "Thandiwe Banda", avatar: "TB", department: "Business Development" },
    purchaseDate: "2023-07-22",
    value: "MWK 750,000",
    location: "Graphics Studio",
    serialNumber: "VCP2023001",
    warranty: "2025-07-22",
  },
  {
    id: "AST-009",
    name: "Heat Press Machine",
    type: "Heat Press",
    category: "Graphics Equipment",
    status: "Active",
    condition: "Excellent",
    assignedTo: { name: "Chisomo Phiri", avatar: "CP", department: "Systems Development" },
    purchaseDate: "2023-11-05",
    value: "MWK 450,000",
    location: "Graphics Studio",
    serialNumber: "HPM2023001",
    warranty: "2025-11-05",
  },
  {
    id: "AST-010",
    name: "UV Printer",
    type: "UV Printer",
    category: "Graphics Equipment",
    status: "Active",
    condition: "Excellent",
    assignedTo: { name: "Grace Mwale", avatar: "GM", department: "HR & Finance" },
    purchaseDate: "2023-12-01",
    value: "MWK 3,200,000",
    location: "Graphics Studio",
    serialNumber: "UVP2023001",
    warranty: "2026-12-01",
  },
  {
    id: "AST-011",
    name: "Laminator",
    type: "Laminator",
    category: "Graphics Equipment",
    status: "Active",
    condition: "Good",
    assignedTo: { name: "Kondwani Nyirenda", avatar: "KN", department: "Procurement" },
    purchaseDate: "2023-08-30",
    value: "MWK 180,000",
    location: "Graphics Studio",
    serialNumber: "LAM2023001",
    warranty: "2025-08-30",
  },
]

const assetStats = {
  total: assets.length,
  active: assets.filter((a) => a.status === "Active").length,
  maintenance: assets.filter((a) => a.status === "Maintenance").length,
  retired: assets.filter((a) => a.status === "Retired").length,
}

export function AssetManagement() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "computers") return matchesSearch && asset.type === "Computer"
    if (selectedTab === "mobile") return matchesSearch && asset.type === "Mobile Device"
    if (selectedTab === "furniture") return matchesSearch && asset.type === "Furniture"
    if (selectedTab === "vehicles") return matchesSearch && asset.type === "Vehicle"
    if (selectedTab === "graphics") return matchesSearch && asset.category === "Graphics Equipment"

    return matchesSearch
  })

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "Computer":
        return <Monitor className="h-5 w-5" />
      case "Mobile Device":
        return <Smartphone className="h-5 w-5" />
      case "Printer":
        return <Printer className="h-5 w-5" />
      case "Large Format Printer":
        return <Printer className="h-5 w-5" />
      case "UV Printer":
        return <Printer className="h-5 w-5" />
      case "Vehicle":
        return <Car className="h-5 w-5" />
      case "Furniture":
        return <Package className="h-5 w-5" />
      case "Vinyl Cutter":
        return <Scissors className="h-5 w-5" />
      case "Heat Press":
        return <Zap className="h-5 w-5" />
      case "Laminator":
        return <Layers className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Maintenance":
        return <Wrench className="h-4 w-4 text-yellow-600" />
      case "Retired":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Maintenance":
        return "secondary"
      case "Retired":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "default"
      case "Good":
        return "secondary"
      case "Fair":
        return "outline"
      case "Poor":
        return "destructive"
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
            <h1 className="text-3xl font-bold tracking-tight">Asset Management</h1>
            <p className="text-muted-foreground">Track and manage all company assets and equipment.</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>Register a new asset in the system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="assetName">Asset Name</Label>
                  <Input id="assetName" placeholder="Enter asset name..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assetType">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer">Computer</SelectItem>
                        <SelectItem value="mobile">Mobile Device</SelectItem>
                        <SelectItem value="printer">Printer</SelectItem>
                        <SelectItem value="large-format-printer">Large Format Printer</SelectItem>
                        <SelectItem value="vinyl-cutter">Vinyl Cutter</SelectItem>
                        <SelectItem value="heat-press">Heat Press</SelectItem>
                        <SelectItem value="uv-printer">UV Printer</SelectItem>
                        <SelectItem value="laminator">Laminator</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">IT Equipment</SelectItem>
                        <SelectItem value="office">Office Equipment</SelectItem>
                        <SelectItem value="graphics">Graphics Equipment</SelectItem>
                        <SelectItem value="furniture">Office Furniture</SelectItem>
                        <SelectItem value="transport">Transportation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="value">Purchase Value</Label>
                    <Input id="value" placeholder="MWK 0.00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input id="purchaseDate" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input id="serialNumber" placeholder="Enter serial number..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter location..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setIsCreateDialogOpen(false)}>
                  Add Asset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Package className="h-6 w-6 text-muted-foreground" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assetStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-6 w-6 text-green-600" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assetStats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <Wrench className="h-6 w-6 text-yellow-600" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assetStats.maintenance}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-6 w-6 text-muted-foreground" strokeWidth={2.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">MWK 23.6M</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Asset Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="computers">Computers</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="graphics">Graphics Equipment</TabsTrigger>
            <TabsTrigger value="furniture">Furniture</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab}>
            <Card>
              <CardHeader>
                <CardTitle>Asset Inventory</CardTitle>
                <CardDescription>Complete list of company assets and their current status.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getAssetIcon(asset.type)}
                            <div>
                              <div className="font-medium">{asset.name}</div>
                              <div className="text-sm text-muted-foreground">{asset.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{asset.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(asset.status)}
                            <Badge variant={getStatusColor(asset.status) as any}>{asset.status}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getConditionColor(asset.condition) as any}>{asset.condition}</Badge>
                        </TableCell>
                        <TableCell>
                          {asset.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                                <AvatarFallback className="text-xs">{asset.assignedTo.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{asset.assignedTo.name}</div>
                                <div className="text-xs text-muted-foreground">{asset.assignedTo.department}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{asset.location}</TableCell>
                        <TableCell className="font-medium">{asset.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
