"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import websocketService from "@/services/websocket"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type NotificationData = {
  id: number | string
  type: "major" | "job" | "learningPath" | "majorGeneration" | "jobGeneration"
  message?: string
}

// 用于跟踪已处理的通知
const processedNotifications = new Set<string>()

export function WebSocketNotifications() {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [notificationData, setNotificationData] = useState<NotificationData | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Handle major recommendation notifications
    const handleMajorRecommendation = (data: { id: number | string }) => {
      if (!data.id) return
      
      // 创建唯一标识符
      const notificationId = `major-${data.id}`
      
      // 检查此通知是否已处理
      if (processedNotifications.has(notificationId)) {
        console.log("已处理过的专业推荐通知，忽略:", data.id)
        return
      }
      
      // 标记为已处理
      processedNotifications.add(notificationId)
      console.log("显示专业推荐通知，ID:", data.id)
      
      setNotificationData({ id: data.id, type: "major" })
      setShowDialog(true)
    }

    // Handle job recommendation notifications
    const handleJobRecommendation = (data: { id: number | string }) => {
      if (!data.id) return
      
      // 创建唯一标识符
      const notificationId = `job-${data.id}`
      
      // 检查此通知是否已处理
      if (processedNotifications.has(notificationId)) {
        console.log("已处理过的职业推荐通知，忽略:", data.id)
        return
      }
      
      // 标记为已处理
      processedNotifications.add(notificationId)
      console.log("显示职业推荐通知，ID:", data.id)
      
      setNotificationData({ id: data.id, type: "job" })
      setShowDialog(true)
    }

    // Handle learning path generation success notifications
    const handleLearningPathSuccess = (data: { id: number | string }) => {
      if (!data.id) return
      
      // 创建唯一标识符
      const notificationId = `path-${data.id}`
      
      // 检查此通知是否已处理
      if (processedNotifications.has(notificationId)) {
        console.log("已处理过的学习路径通知，忽略:", data.id)
        return
      }
      
      // 标记为已处理
      processedNotifications.add(notificationId)
      console.log("显示学习路径通知，ID:", data.id)
      
      setNotificationData({ id: data.id, type: "learningPath" })
      setShowDialog(true)
    }

    // 处理专业生成完成通知
    const handleMajorGeneration = (data: { id: number | string }) => {
      if (!data.id) return
      
      // 创建唯一标识符
      const notificationId = `major-generation-${data.id}`
      
      // 检查此通知是否已处理
      if (processedNotifications.has(notificationId)) {
        console.log("已处理过的专业生成通知，忽略:", data.id)
        return
      }
      
      // 标记为已处理
      processedNotifications.add(notificationId)
      console.log("显示专业生成通知，ID:", data.id)
      
      setNotificationData({ id: data.id, type: "majorGeneration" })
      setShowDialog(true)
    }

    // 处理职业生成完成通知
    const handleJobGeneration = (data: { id: number | string }) => {
      if (!data.id) return
      
      // 创建唯一标识符
      const notificationId = `job-generation-${data.id}`
      
      // 检查此通知是否已处理
      if (processedNotifications.has(notificationId)) {
        console.log("已处理过的职业生成通知，忽略:", data.id)
        return
      }
      
      // 标记为已处理
      processedNotifications.add(notificationId)
      console.log("显示职业生成通知，ID:", data.id)
      
      setNotificationData({ id: data.id, type: "jobGeneration" })
      setShowDialog(true)
    }

    // Handle failure notifications
    const handleFailure = (data: { message: string }) => {
      console.log("显示失败通知:", data.message)
      toast.error("操作失败", {
        description: data.message || "请稍后重试或联系客服",
      })
    }

    // Register notification handlers
    websocketService.registerNotificationHandler("1", handleMajorRecommendation)
    websocketService.registerNotificationHandler("2", handleJobRecommendation)
    websocketService.registerNotificationHandler("3", handleLearningPathSuccess)
    websocketService.registerNotificationHandler("4", handleMajorGeneration)
    websocketService.registerNotificationHandler("5", handleJobGeneration)
    websocketService.registerNotificationHandler("0", handleFailure)

    // Clean up handlers when component unmounts
    return () => {
      websocketService.unregisterNotificationHandler("1", handleMajorRecommendation)
      websocketService.unregisterNotificationHandler("2", handleJobRecommendation)
      websocketService.unregisterNotificationHandler("3", handleLearningPathSuccess)
      websocketService.unregisterNotificationHandler("4", handleMajorGeneration)
      websocketService.unregisterNotificationHandler("5", handleJobGeneration)
      websocketService.unregisterNotificationHandler("0", handleFailure)
    }
  }, [router])

  // Fixed: Simplified backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click is directly on the backdrop element
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  const handleView = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent event from bubbling up to the backdrop
    e.stopPropagation()

    if (!notificationData) return

    const routes = {
      major: `/major-test/result/${notificationData.id}`,
      job: `/career-test/result/${notificationData.id}`,
      learningPath: `/learning-path/${notificationData.id}`,
      majorGeneration: `/major-library/${notificationData.id}`,
      jobGeneration: `/job-library/${notificationData.id}`,
    }

    router.push(routes[notificationData.type])
    setShowDialog(false)
  }

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent event from bubbling up to the backdrop if called from button click
    if (e) e.stopPropagation()

    if (!notificationData) return

    const messages = {
      major: "您可以在历史记录中查看专业测评结果",
      job: "您可以在历史记录中查看职业测评结果",
      learningPath: "您可以在学习路径中查看生成的路径",
      majorGeneration: "您可以在专业库中查看生成的专业详情",
      jobGeneration: "您可以在职业库中查看生成的职业详情",
    }

    toast.info(messages[notificationData.type])
    setShowDialog(false)
  }

  const titles = {
    major: "专业推荐分析完成",
    job: "职业推荐分析完成",
    learningPath: "学习路径生成完成",
    majorGeneration: "专业信息生成完成",
    jobGeneration: "职业信息生成完成",
  }

  const descriptions = {
    major: "您的专业测评结果已生成，是否立即查看？",
    job: "您的职业测评结果已生成，是否立即查看？",
    learningPath: "您的个性化学习路径已生成，是否立即查看？",
    majorGeneration: "您请求的专业详细信息已生成，是否立即查看？",
    jobGeneration: "您请求的职业详细信息已生成，是否立即查看？",
  }

  if (!showDialog || !notificationData) return null

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-black/50 z-50",
        "transition-opacity duration-200",
        showDialog ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={cn(
          "relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg p-6",
          "transition-all duration-200",
          showDialog ? "translate-y-0 scale-100" : "translate-y-4 scale-95",
        )}
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-full p-3 shadow-lg">
          <div className="bg-primary/10 rounded-full p-2">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="text-center pt-4 mb-2">
          <h2 className="text-lg font-semibold">{titles[notificationData.type]}</h2>
          <p className="text-sm text-gray-500 mt-1">{descriptions[notificationData.type]}</p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            稍后查看
          </button>
          <button
            onClick={handleView}
            className="flex-1 px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            立即查看
          </button>
        </div>
      </div>
    </div>
  )
}
