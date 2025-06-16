"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Menu, MoonIcon, SunIcon, UserIcon } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { userApi } from "@/services/api"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  const { isAuthenticated, logout, user } = useAuth()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [userAvatar, setUserAvatar] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  
  // 获取用户头像
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData()
    }
  }, [isAuthenticated, user])
  
  const fetchUserData = async () => {
    try {
      const response = await userApi.getUserData()
      if (response.data.success) {
        const userData = response.data.data
        if (userData.avatar) {
          setUserAvatar(userData.avatar)
        }
      } else if (user?.userImage) {
        // 如果API获取失败，尝试使用JWT中存储的头像
        setUserAvatar(user.userImage)
      }
    } catch (error) {
      console.error("获取用户信息失败:", error)
      // 使用JWT中的用户头像作为备选
      if (user?.userImage) {
        setUserAvatar(user.userImage)
      }
    }
  }

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={`text-sm font-medium transition-colors ${
          pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => setIsOpen(false)}
      >
        首页
      </Link>
      <Link
        href="/dashboard"
        className={`text-sm font-medium transition-colors ${
          pathname.startsWith("/dashboard")
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => setIsOpen(false)}
      >
        职业测评
      </Link>
      <Link
        href="/resume"
        className={`text-sm font-medium transition-colors ${
          pathname.startsWith("/resume") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => setIsOpen(false)}
      >
        简历分析
      </Link>
      <Link
        href="/interview"
        className={`text-sm font-medium transition-colors ${
          pathname.startsWith("/interview") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => setIsOpen(false)}
      >
        模拟面试
      </Link>
      <Link
        href="/learning-path"
        className={`text-sm font-medium transition-colors ${
          pathname.startsWith("/learning-path")
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => setIsOpen(false)}
      >
        学习路径
      </Link>
    </>
  )

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">职探-大学生AI职业规划系统</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          {isAuthenticated && <NavLinks />}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">打开菜单</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>导航菜单</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-4">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 p-0">
                  {userAvatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatar} alt={user?.username || "用户头像"} />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                  <span className="sr-only">用户菜单</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.username || "用户"}</span>
                    <span className="text-xs text-muted-foreground">个人中心</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">个人资料</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/history">历史记录</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">登录</Button>
              </Link>
              <Link href="/register">
                <Button>注册</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
