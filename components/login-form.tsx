"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      return
    }

    setIsLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      login(email)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Flowing lines */}
          <path d="M0,300 Q250,200 500,300 T1000,300" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
          <path d="M0,500 Q250,400 500,500 T1000,500" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" />
          <path d="M0,700 Q250,600 500,700 T1000,700" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.1" />
        </svg>
      </div>

      {/* Logo */}
      <div className="text-center mb-6 z-10">
        <img src="/kolide-logo.png" alt="Logo" className="h-20 w-auto object-contain mx-auto" />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-slate-800/80 backdrop-blur-md border-slate-700/50 floating-shadow z-10">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-white">Welcome!</CardTitle>
          <CardDescription className="text-gray-300">Sign in to access your PerformX dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-right">
              <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-200 transform hover:scale-[1.02] floating-button"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-400">
            Demo credentials: any email and password will work
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
