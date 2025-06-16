"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { jobApi, learnPathApi, reviewApi } from "@/services/api"
import {
  ArrowLeft,
  BriefcaseIcon,
  DollarSignIcon,
  BookOpenIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  BarChartIcon,
  GraduationCapIcon,
  MessageSquare,
  Flag,
  Send,
  Trash2,
} from "lucide-react"

interface JobDetail {
  id: number
  title: string
  description: string
  outlook: string
  salary: string
  skills: string[]
  personalityTraits: string[]
  dailyTasks: string
  careerGrowth: string
  automationRisk: string
  riskExplanation: string
}

interface Review {
  id: number
  content: string
  username: string
  isMe?: boolean
}

export default function JobDetailPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPath, setIsGeneratingPath] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [commentInput, setCommentInput] = useState("")
  const [sendingComment, setSendingComment] = useState(false)
  const commentInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (isAuthenticated && params.id) {
      fetchJobDetail()
      fetchJobReviews()
    }
  }, [isAuthenticated, loading, params.id, router])

  const fetchJobDetail = async () => {
    setIsLoading(true)
    try {
      const response = await jobApi.getJob(params.id as string)
      if (response.data.success) {
        setJob(response.data.data)
      } else {
        toast.error("获取职业详情失败", {
          description: response.data.errorMsg || "请稍后重试",
        })
        router.push("/job-library")
      }
    } catch (error) {
      console.error("获取职业详情出错:", error)
      toast.error("获取职业详情失败", {
        description: "网络错误，请稍后重试",
      })
      router.push("/job-library")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchJobReviews = async () => {
    setLoadingReviews(true)
    try {
      const response = await reviewApi.getJobReviews(params.id as string)
      if (response.data.success) {
        setReviews(response.data.data || [])
      } else {
        console.error("获取评论失败:", response.data.errorMsg)
      }
    } catch (error) {
      console.error("获取评论出错:", error)
    } finally {
      setLoadingReviews(false)
    }
  }

  // 检查冷却时间
  const checkCooldown = () => {
    const lastClickTime = localStorage.getItem('lastLearningPathClick')
    if (lastClickTime) {
      const timeDiff = Date.now() - parseInt(lastClickTime)
      const remainingTime = Math.max(0, 72000 - timeDiff) // 72秒 = 1.2分钟
      if (remainingTime > 0) {
        setCooldownTime(remainingTime)
        return true
      }
    }
    return false
  }

  // 更新冷却时间显示
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1000) {
            clearInterval(timer)
            return 0
          }
          return prev - 1000
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldownTime])

  const generateLearningPath = async () => {
    if (!job) return

    if (checkCooldown()) {
      toast.error("请稍后再试", {
        description: `还需要等待 ${Math.ceil(cooldownTime / 1000)} 秒`,
      })
      return
    }

    setIsGeneratingPath(true)
    try {
      localStorage.setItem('lastLearningPathClick', Date.now().toString())
      const response = await learnPathApi.generateJobPath(job.id.toString())
      if (response.data.success) {
        toast.success("学习路径生成请求已提交", {
          description: "✨ AI正基于您的个人资料生成定制化学习路径\n精准匹配您的技能和目标，生成后通知",
        })
      } else {
        toast.error("生成学习路径失败", {
          description: response.data.errorMsg || "请稍后重试",
        })
      }
    } catch (error) {
      console.error("生成学习路径出错:", error)
      toast.error("生成学习路径失败", {
        description: "网络错误，请稍后重试",
      })
    } finally {
      setIsGeneratingPath(false)
    }
  }

  const handleSendComment = async () => {
    if (!commentInput.trim() || !job) return

    setSendingComment(true)
    try {
      const response = await reviewApi.sendReview({
        jobId: job.id,
        content: commentInput.trim(),
      })

      if (response.data.success) {
        toast.success("评论发送成功")
        setCommentInput("")
        // 重新获取评论列表
        fetchJobReviews()
        // 聚焦输入框
        if (commentInputRef.current) {
          commentInputRef.current.focus()
        }
      } else {
        toast.error("评论发送失败", {
          description: response.data.errorMsg || "请稍后重试",
        })
      }
    } catch (error) {
      console.error("发送评论出错:", error)
      toast.error("评论发送失败", {
        description: "网络错误，请稍后重试",
      })
    } finally {
      setSendingComment(false)
    }
  }

  const handleReportReview = async (reviewId: number) => {
    try {
      const response = await reviewApi.reportReview(reviewId.toString())
      if (response.data.success) {
        toast.success("举报成功", {
          description: "感谢您的反馈，我们会尽快处理",
        })
      } else {
        toast.error("举报失败", {
          description: response.data.errorMsg || "请稍后重试",
        })
      }
    } catch (error) {
      console.error("举报评论出错:", error)
      toast.error("举报失败", {
        description: "网络错误，请稍后重试",
      })
    }
  }

  const deleteReview = async (reviewId: number) => {
    try {
      const response = await reviewApi.deleteReview(reviewId.toString())
      if (response.data.success) {
        toast.success("评论删除成功")
        // 重新获取评论列表
        fetchJobReviews()
      } else {
        toast.error("删除评论失败", {
          description: response.data.errorMsg || "请稍后重试",
        })
      }
    } catch (error) {
      console.error("删除评论出错:", error)
      toast.error("删除评论失败", {
        description: "网络错误，请稍后重试",
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回职业库
          </Button>
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">职业信息不存在</h1>
          <p className="text-muted-foreground mb-6">请返回职业库浏览其他职业</p>
          <Button onClick={() => router.push("/job-library")}>返回职业库</Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Button variant="ghost" onClick={() => router.push("/job-library")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回职业库
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <BriefcaseIcon className="mr-3 h-7 w-7 text-primary" />
            {job.title}
          </h1>
          <p className="text-lg text-muted-foreground">{job.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSignIcon className="mr-2 h-5 w-5 text-primary" />
                  薪资与前景
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">薪资范围</h3>
                  <p className="text-lg font-semibold text-primary">{job.salary}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">发展前景</h3>
                  <p>{job.outlook}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">职业发展路径</h3>
                  <p>{job.careerGrowth}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpenIcon className="mr-2 h-5 w-5 text-primary" />
                  工作内容
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">日常工作</h3>
                    <div className="space-y-2">
                      {job.dailyTasks.split("\n").map((task, index) => (
                        <div key={index} className="flex items-start">
                          <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <p>{task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChartIcon className="mr-2 h-5 w-5 text-primary" />
                  AI 自动化风险
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <h3 className="font-medium">风险等级：</h3>
                  <Badge variant={job.automationRisk.includes("低") ? "outline" : "destructive"} className="ml-2">
                    {job.automationRisk}
                  </Badge>
                </div>
                <p>{job.riskExplanation}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircleIcon className="mr-2 h-5 w-5 text-primary" />
                  所需技能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircleIcon className="mr-2 h-5 w-5 text-primary" />
                  适合的性格特质
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.personalityTraits.map((trait, index) => (
                    <Badge key={index} variant="outline">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  用户评论
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingReviews ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{review.username}</h4>
                          <div className="flex items-center space-x-1">
                            {review.isMe && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => deleteReview(review.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                <span className="sr-only">删除</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleReportReview(review.id)}
                            >
                              <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="sr-only">举报</span>
                            </Button>
                          </div>
                        </div>
                        <p className="mt-1 text-sm">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">暂无评论，来发表第一条评论吧</p>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Input
                    ref={commentInputRef}
                    placeholder="写下你的评论..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendComment()
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendComment} disabled={!commentInput.trim() || sendingComment}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">发送</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCapIcon className="mr-2 h-5 w-5 text-primary" />
                  个性化学习路径
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>根据您的简历和该职业要求，生成一份个性化学习路径，帮助您系统性地提升相关技能。</p>
                <Button onClick={generateLearningPath} disabled={isGeneratingPath || cooldownTime > 0} className="w-full">
                  {isGeneratingPath ? (
                    "生成中..."
                  ) : cooldownTime > 0 ? (
                    `冷却中 (${Math.ceil(cooldownTime / 1000)}s)`
                  ) : (
                    "生成学习路径"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
