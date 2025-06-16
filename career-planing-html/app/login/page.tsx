"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// 修改 import 语句，使用 sonner 的 toast
import { toast } from "sonner"
// 删除 useToast 导入
// import { useToast } from "@/hooks/use-toast"
import { GraduationCapIcon } from "lucide-react"

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth()
  // 修改 LoginPage 函数内部
  // 删除这一行
  // const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 修改 handleSubmit 函数中的 toast 调用
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login(formData.phone, formData.password)
    } catch (error: any) {
      // 使用 sonner 的 toast.error 方法
      toast.error("登录失败", {
        description: error.message || "登录失败，请稍后重试",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <GraduationCapIcon className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">职业规划平台</h1>
        <p className="text-muted-foreground mt-2">登录您的账户开始职业规划之旅</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">登录</CardTitle>
          <CardDescription className="text-center">输入您的手机号和密码登录账户</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                placeholder="请输入手机号"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            还没有账户？{" "}
            <Link href="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
