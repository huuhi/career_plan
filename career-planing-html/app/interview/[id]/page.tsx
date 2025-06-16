"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface InterviewDetailPageProps {
  params: {
    id: string
  }
}

export default function InterviewDetailPage({ params }: InterviewDetailPageProps) {
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    if (id) {
      // 重定向到主页并传递id作为查询参数
      router.replace(`/interview?id=${id}`)
    } else {
      router.replace('/interview')
    }
  }, [id, router])

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-muted-foreground">正在加载面试...</p>
      </div>
    </div>
  )
} 