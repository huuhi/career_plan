"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { learnPathApi } from "@/services/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap, ArrowRight, Trash2, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function LearningPathsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [learningPaths, setLearningPaths] = useState<any[]>([])
  const [loadingPaths, setLoadingPaths] = useState(true)
  const [deletingPathId, setDeletingPathId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated) {
      fetchLearningPaths()
    }
  }, [isAuthenticated, loading, router])

  const fetchLearningPaths = async () => {
    try {
      setLoadingPaths(true)
      const response = await learnPathApi.getAllPaths()

      if (response.data.success && response.data.data) {
        setLearningPaths(response.data.data)
      } else {
        throw new Error(response.data.errorMsg || "获取学习路径失败")
      }
    } catch (error: any) {
      toast.error("获取学习路径失败", {
        description: error.message || "请稍后重试",
      })
      setLearningPaths([])
    } finally {
      setLoadingPaths(false)
    }
  }

  const handleDeletePath = async () => {
    if (!deletingPathId) return

    try {
      setIsDeleting(true)
      await learnPathApi.deletePath(deletingPathId)

      toast.success("学习路径已删除", {
        description: "学习路径已成功删除",
      })

      // 关闭对话框
      setShowDeleteDialog(false)
      setDeletingPathId(null)

      // 短暂延迟后刷新页面，让用户看到成功提示
      setTimeout(() => {
        // 重新获取学习路径数据
        fetchLearningPaths()
      }, 500)
    } catch (error: any) {
      toast.error("删除学习路径失败", {
        description: error.message || "请稍后重试",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading || loadingPaths) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">我的学习路径</h1>
          <p className="text-muted-foreground">查看为您定制的个性化学习路径</p>
        </div>

        {learningPaths.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {learningPaths.map((path) => (
              <Card key={path.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{path.goalName}</CardTitle>
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription className="line-clamp-2">{path.whyRecommend.replace(/🚀\s/, "")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium mb-1">核心技能</h3>
                      <div className="flex flex-wrap gap-1">
                        {path.skills?.slice(0, 3).map((skill: any) => (
                          <span
                            key={skill.id}
                            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                          >
                            {skill.stepName}
                          </span>
                        ))}
                        {path.skills?.length > 3 && (
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                            +{path.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-between"
                        onClick={() => router.push(`/learning-path/${path.id}`)}
                      >
                        <span>查看详情</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setDeletingPathId(path.id.toString())
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">暂无学习路径</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              您还没有生成任何学习路径。可以通过职业测评或专业测评生成个性化学习路径。
            </p>
            <div className="flex gap-4">
              <Button onClick={() => router.push("/career-test")}>职业测评</Button>
              <Button onClick={() => router.push("/major-test")} variant="outline">
                专业测评
              </Button>
            </div>
          </div>
        )}
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除这个学习路径吗？此操作无法撤销，所有相关的学习进度将会丢失。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  handleDeletePath()
                }}
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    删除中...
                  </>
                ) : (
                  "删除"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
