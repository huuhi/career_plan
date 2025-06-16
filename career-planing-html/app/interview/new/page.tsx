"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NewInterviewPage() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到主面试页面，让用户使用弹窗创建新面试
    router.replace("/interview")
  }, [router])

  return null
} 