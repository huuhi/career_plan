"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { userApi } from "@/services/api"
import websocketService from "@/services/websocket"
import { WebSocketNotifications } from "@/components/websocket-notifications"
import { toast } from "sonner"
interface User {
  userId?: string
  username?: string
  userImage?: string
  summary?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (phone: string, password: string) => Promise<void>
  register: (username: string, phone: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  setIsAuthenticated: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setUser(user)
        setIsAuthenticated(true)
        // 连接 WebSocket
        if (user.userId) {
          console.log("Connecting WebSocket for user:", user.userId)
          websocketService.connect(user.userId.toString())
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (phone: string, password: string) => {
    try {
      const response = await userApi.login({ phone, password })
      if (response.data.success) {
        const jwtToken = response.data.data
        localStorage.setItem("token", jwtToken)

        // 解析JWT获取用户信息
        const base64Url = jwtToken.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        )

        const userData = JSON.parse(jsonPayload)
        const userInfo = {
          userId: userData.userId,
          username: userData.username,
          userImage: userData.userImage || "",
          summary: userData.summary || ""
        }

        setUser(userInfo)
        localStorage.setItem("user", JSON.stringify(userInfo))
        setToken(jwtToken)
        setIsAuthenticated(true)

        // 连接 WebSocket
        if (userInfo.userId) {
          console.log("Connecting WebSocket for user:", userInfo.userId)
          websocketService.connect(userInfo.userId.toString())
        }
        return true
      }else{
        toast.error("登陆失败",{
          description: response.data.errorMsg || "登录失败，请稍后重试",
        })
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (username: string, phone: string, password: string) => {
    try {
      setLoading(true)
      const response = await userApi.register({ username, phone, password })

      // 检查API返回的success字段
      if (response.data.success) {
        const jwtToken = response.data.data
        localStorage.setItem("token", jwtToken)

        // 解析JWT获取用户信息
        const base64Url = jwtToken.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        )

        const userData = JSON.parse(jsonPayload)
        const userInfo = {
          userId: userData.userId,
          username: userData.username,
          userImage: userData.userImage || "",
          summary: userData.summary || ""
        }

        setUser(userInfo)

        localStorage.setItem("user", JSON.stringify(userInfo))

        setToken(jwtToken)
        setIsAuthenticated(true)

        // 连接WebSocket
        console.log("Connecting to WebSocket after register with userId:", userData.userId)
        websocketService.connect(userData.userId)

        router.push("/dashboard")
      } else {
        // API返回了错误信息，直接抛出
        throw new Error(response.data.errorMsg || "注册失败")
      }
    } catch (error) {
      // 向上抛出错误
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    // 断开 WebSocket 连接
    websocketService.disconnect()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        loading,
        setIsAuthenticated,
      }}
    >
      {!loading && isAuthenticated && <WebSocketNotifications key="websocket-notifications" />}
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}