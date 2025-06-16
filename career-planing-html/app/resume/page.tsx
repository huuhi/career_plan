"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon, FileTextIcon } from "lucide-react"
import { resumeApi } from "@/services/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import ReactMarkdown from 'react-markdown'
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

// 自定义样式组件
const MarkdownPreview = ({ content }: { content: string }) => {
  return (
    <div className="markdown-preview text-sm text-muted-foreground">
      <ReactMarkdown
        components={{
          // 自定义标题样式
          h2: ({ children }) => <h2 className="text-base font-semibold mb-1">{children}</h2>,
          // 自定义列表样式
          ul: ({ children }) => <ul className="list-none pl-0 space-y-1">{children}</ul>,
          li: ({ children }) => (
            <li className="flex items-start gap-1">
              <span className="shrink-0">•</span>
              <span>{children}</span>
            </li>
          ),
          // 自定义段落样式
          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
          // 自定义强调样式
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          // 自定义 emoji 样式
          em: ({ children }) => <em className="not-italic">{children}</em>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default function ResumePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [resumes, setResumes] = useState<any[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated) {
      fetchResumes()
    }
  }, [isAuthenticated, loading, router])

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true)
      const response = await resumeApi.get()

      if (response.data.success && response.data.data) {
        setResumes(response.data.data)
      } else {
        throw new Error(response.data.errorMsg || "获取简历失败")
      }
    } catch (error: any) {
      toast.error("获取简历失败", {
        description: error.message || "请稍后重试",
      })
    } finally {
      setLoadingResumes(false)
    }
  }

  // Add a function to set a resume as default
  const setDefaultResume = async (id: string) => {
    try {
      const response = await resumeApi.setDefault(id)

      if (response.data.success) {
        toast.success("设置成功", {
          description: "已将该简历设为默认简历",
        })
        // Refresh the resume list to update UI
        fetchResumes()
      } else {
        throw new Error(response.data.errorMsg || "设置默认简历失败")
      }
    } catch (error: any) {
      toast.error("设置失败", {
        description: error.message || "请稍后重试",
      })
    }
  }

  const handleDeleteResume = (id: string) => {
    setResumeToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!resumeToDelete) return

    try {
      const response = await resumeApi.deleteResume(resumeToDelete)
      if (response.data.success) {
        toast.success("简历已删除")
        // 重新获取简历列表
        fetchResumes()
      } else {
        throw new Error(response.data.errorMsg || "删除失败")
      }
    } catch (error: any) {
      toast.error("删除失败", {
        description: error.message || "请稍后重试",
      })
    } finally {
      setDeleteDialogOpen(false)
      setResumeToDelete(null)
    }
  }

  if (loading || loadingResumes) {
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
          <h1 className="text-3xl font-bold mb-2">简历管理</h1>
          <p className="text-muted-foreground">管理您的简历并获取专业分析</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow flex flex-col justify-center items-center h-[320px] border-dashed">
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="mb-4 p-3 rounded-full bg-primary/10">
                <PlusIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">创建新简历</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">创建一份新的简历并获取专业分析</p>
              <Button onClick={() => router.push("/resume/new/create")}>开始创建</Button>
            </CardContent>
          </Card>

          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className={`hover:shadow-md transition-shadow h-[320px] flex flex-col justify-between ${
                resume.isDefault ? "border-primary" : ""
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5 text-primary" />
                    {resume.resumeName || `简历 ${resume.id}`}
                    {resume.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">默认</span>
                    )}
                  </CardTitle>
                </div>
                <CardDescription>{resume.resumeData?.basics?.name || ""}</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                {resume.resumeData?.basics?.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                    {resume.resumeData.basics.summary}
                  </p>
                )}
                {resume.structuredData && (
                  <div className="line-clamp-3">
                    <MarkdownPreview content={resume.structuredData} />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <div className="flex gap-2 w-full">
                  <Button variant="outline" onClick={() => router.push(`/resume/detail/${resume.id}`)} className="flex-1">
                    查看分析
                  </Button>
                  <Button onClick={() => router.push(`/resume/edit/${resume.id}`)} className="flex-1">编辑</Button>
                </div>
                <div className="flex gap-2 w-full">
                  {!resume.isDefault && (
                    <Button variant="ghost" onClick={() => setDefaultResume(resume.id)} className="flex-1">
                      设为默认
                    </Button>
                  )}
                  <Button variant="destructive" onClick={() => handleDeleteResume(resume.id)} className="flex-1">
                    删除
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {resumes.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">您还没有创建任何简历</p>
            <Button onClick={() => router.push("/resume/new/create")}>创建第一份简历</Button>
          </div>
        )}
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这份简历吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
