import type React from "react"
import { Inter, Roboto } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"
import { WebSocketNotifications } from "@/components/websocket-notifications"

// 添加这个导入
import "@/lib/echarts-init"

// 使用系统字体堆栈模拟SF Pro
const systemFont = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={systemFont.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
            <WebSocketNotifications />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"

export const metadata = {
  generator: "v0.dev",
}

import "./globals.css"
