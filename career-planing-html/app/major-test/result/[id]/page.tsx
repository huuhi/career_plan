"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analysisApi, majorApi, reviewApi, learnPathApi } from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { GraduationCap, Loader2, Flag, Send, Trash2, BarChart3, PieChart, AreaChart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';

interface Review {
  id: number
  content: string
  username: string
  isMe?: boolean
}

// 解析学制，提取年数
const parseStudyDuration = (durationStr: string): number => {
  if (!durationStr) return 0;
  
  // 匹配"⏳ 4年"这样的格式
  const matches = durationStr.match(/(\d+)/);
  if (matches && matches.length >= 2) {
    return parseInt(matches[1]);
  }
  
  return 0;
};

export default function MajorTestResultPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const params = useParams()

  const [result, setResult] = useState<any>(null)
  const [loadingResult, setLoadingResult] = useState(true)
  const [selectedMajor, setSelectedMajor] = useState<any>(null)
  const [loadingMajorDetails, setLoadingMajorDetails] = useState(false)
  const [generatingPath, setGeneratingPath] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [commentInput, setCommentInput] = useState("")
  const [sendingComment, setSendingComment] = useState(false)
  const commentInputRef = useRef<HTMLInputElement>(null)

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

  // Function to generate learning path based on major ID
  const generateLearningPath = async (majorId: string) => {
    if (checkCooldown()) {
      toast.error("请稍后再试", {
        description: `还需要等待 ${Math.ceil(cooldownTime / 1000)} 秒`,
      })
      return
    }

    try {
      setGeneratingPath(true)
      localStorage.setItem('lastLearningPathClick', Date.now().toString())
      const response = await learnPathApi.generateMajorPath(majorId)

      if (response.data.success) {
        toast.success("学习路径生成请求已提交", {
          description: "系统正在为您生成学习路径，完成后将通知您",
        })
      } else {
        throw new Error(response.data.errorMsg || "生成学习路径失败")
      }
    } catch (error: any) {
      toast.error("生成学习路径失败", {
        description: error.message || "请稍后重试",
      })
    } finally {
      setGeneratingPath(false)
    }
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated && params.id) {
      fetchResult()

      // Check if there's a majorId in the URL query
      const searchParams = new URLSearchParams(window.location.search)
      const majorId = searchParams.get("majorId")
      if (majorId) {
        fetchMajorDetails(majorId)
      }
    }
  }, [isAuthenticated, loading, params.id, router])

  const fetchResult = async () => {
    try {
      setLoadingResult(true)
      const response = await analysisApi.getReport(params.id as string)

      if (response.data.success && response.data.data) {
        setResult(response.data.data)

        // If there are major results, fetch the first major details
        if (response.data.data.dataList && response.data.data.dataList.length > 0) {
          fetchMajorDetails(response.data.data.dataList[0].id)
        }
      } else {
        throw new Error(response.data.errorMsg || "获取结果失败")
      }
    } catch (error: any) {
      toast.error("获取结果失败", {
        description: error.message || "请稍后重试",
      })
    } finally {
      setLoadingResult(false)
    }
  }

  const fetchMajorDetails = async (majorId: string) => {
    try {
      setLoadingMajorDetails(true)
      const response = await majorApi.getMajor(majorId)

      if (response.data.success && response.data.data) {
        setSelectedMajor(response.data.data)
        fetchMajorReviews(majorId)
      } else {
        throw new Error(response.data.errorMsg || "获取专业详情失败")
      }
    } catch (error: any) {
      toast.error("获取专业详情失败", {
        description: error.message || "请稍后重试",
      })
    } finally {
      setLoadingMajorDetails(false)
    }
  }

  const fetchMajorReviews = async (majorId: string) => {
    setLoadingReviews(true)
    try {
      const response = await reviewApi.getMajorReviews(majorId)
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

  const handleSendComment = async () => {
    if (!commentInput.trim() || !selectedMajor) return

    setSendingComment(true)
    try {
      const response = await reviewApi.sendReview({
        majorsId: selectedMajor.id,
        content: commentInput.trim(),
      })

      if (response.data.success) {
        toast.success("评论发送成功")
        setCommentInput("")
        // 重新获取评论列表
        fetchMajorReviews(selectedMajor.id)
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
        if (selectedMajor) {
          fetchMajorReviews(selectedMajor.id)
        }
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

  if (loading || loadingResult) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
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

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">结果不存在或正在分析中</h1>
          <p className="text-muted-foreground mb-6">请稍后再试或返回重新测评</p>
          <Button onClick={() => router.push("/major-test")}>重新测评</Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">专业测评结果</h1>
          <p className="text-muted-foreground">根据您的回答，我们为您推荐以下专业方向</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>个人特质分析</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{result.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>专业匹配分析</CardTitle>
                <CardDescription>专业匹配度对比</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="bar">
                  <TabsList className="mb-4">
                    <TabsTrigger value="bar" className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      条形图
                    </TabsTrigger>
                    <TabsTrigger value="scatter" className="flex items-center">
                      <AreaChart className="h-4 w-4 mr-2" />
                      气泡图
                    </TabsTrigger>
                    <TabsTrigger value="pie" className="flex items-center">
                      <PieChart className="h-4 w-4 mr-2" />
                      饼图
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bar" className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={result.dataList.map((major: any) => ({
                          name: major.title,
                          匹配度: major.matchScore,
                          学制: parseStudyDuration(major.studyDuration),
                          专业: major.title,
                          id: major.id,
                          专业类型: major.type
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                        barCategoryGap={15}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis label={{ value: '匹配度 (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip 
                          formatter={(value, name, props) => {
                            if (name === "匹配度") return [`${value}%`, name];
                            if (name === "学制") return [`${value}年`, name];
                            return [value, name];
                          }}
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border p-2 rounded shadow-sm">
                                  <p className="font-medium">{label}</p>
                                  <p className="text-sm text-muted-foreground">{payload[0].payload.专业类型}</p>
                                  <p className="text-violet-500">匹配度: {payload[0].value}%</p>
                                  <p className="text-blue-500">学制: {payload[0].payload.学制}年</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="匹配度" 
                          fill="#8884d8" 
                          onClick={(data) => fetchMajorDetails(data.id)}
                          cursor="pointer"
                        >
                          {result.dataList.map((major: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`hsl(${240 + index * 25}, 70%, 60%)`} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  <TabsContent value="scatter" className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid />
                        <XAxis 
                          type="category" 
                          dataKey="name" 
                          name="专业" 
                          angle={-45} 
                          textAnchor="end" 
                          height={80}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="匹配度" 
                          name="匹配度" 
                          unit="%" 
                          label={{ value: '匹配度 (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <ZAxis 
                          type="number" 
                          dataKey="学制" 
                          range={[50, 400]} 
                          name="学制" 
                          unit="年"
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          formatter={(value, name) => {
                            if (name === "匹配度") return [`${value}%`, name];
                            if (name === "学制") return [`${value}年`, name];
                            return [value, name];
                          }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border p-2 rounded shadow-sm">
                                  <p className="font-medium">{payload[0].payload.name}</p>
                                  <p className="text-sm text-muted-foreground">{payload[0].payload.专业类型}</p>
                                  <p className="text-violet-500">匹配度: {payload[0].payload.匹配度}%</p>
                                  <p className="text-blue-500">学制: {payload[0].payload.学制}年</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                        <Scatter 
                          name="专业匹配度" 
                          data={result.dataList.map((major: any) => ({
                            name: major.title,
                            匹配度: major.matchScore,
                            学制: parseStudyDuration(major.studyDuration),
                            id: major.id,
                            专业类型: major.type
                          }))}
                          fill="#8884d8"
                          onClick={(data) => fetchMajorDetails(data.id)}
                          cursor="pointer"
                        >
                          {result.dataList.map((major: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`hsl(${240 + index * 25}, 70%, 60%)`} 
                            />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  <TabsContent value="pie" className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart width={400} height={300}>
                        <Pie
                          data={result.dataList.map((major: any) => ({
                            name: major.title,
                            value: major.matchScore,
                            id: major.id,
                            专业类型: major.type
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, value }) => `${name}: ${value}%`}
                          onClick={(data) => fetchMajorDetails(data.id)}
                          cursor="pointer"
                        >
                          {result.dataList.map((major: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`hsl(${240 + index * 25}, 70%, 60%)`} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, '匹配度']}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border p-2 rounded shadow-sm">
                                  <p className="font-medium">{payload[0].name}</p>
                                  <p className="text-sm text-muted-foreground">{payload[0].payload.专业类型}</p>
                                  <p className="text-violet-500">匹配度: {payload[0].value}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  点击图表中的数据可以查看对应专业的详细信息
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>推荐专业</CardTitle>
                <CardDescription>{result.whyRecommend}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.dataList.map((major: any) => (
                    <div
                      key={major.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMajor?.id === major.id ? "border-primary bg-primary/5" : "hover:bg-secondary"
                      }`}
                      onClick={() => fetchMajorDetails(major.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{major.title}</h3>
                        <span className="text-sm text-primary font-medium">{major.matchScore}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{major.description}</p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="text-muted-foreground">{major.degreeType}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{major.studyDuration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedMajor ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>{selectedMajor.title}</CardTitle>
                  <CardDescription>{selectedMajor.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="overview">概览</TabsTrigger>
                      <TabsTrigger value="courses">核心课程</TabsTrigger>
                      <TabsTrigger value="comments">评论</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">学制</h4>
                        <p className="text-sm text-muted-foreground">{selectedMajor.studyDuration}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">学位类型</h4>
                        <p className="text-sm text-muted-foreground">{selectedMajor.degreeType}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">培养目标</h4>
                        <p className="text-sm text-muted-foreground">{selectedMajor.trainingObjectives}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">专业特色</h4>
                        <p className="text-sm text-muted-foreground">{selectedMajor.professionalFeatures}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">适合人群</h4>
                        <p className="text-sm text-muted-foreground">{selectedMajor.recommendedFor}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">就业前景</h4>
                        <p className="text-sm text-muted-foreground">{selectedMajor.careerProspects}</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="courses" className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">核心课程</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMajor.coreCourses?.map((course: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">实践训练</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMajor.practicalTraining?.map((training: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                            >
                              {training}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="comments" className="space-y-4">
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
                        <Button
                          size="icon"
                          onClick={handleSendComment}
                          disabled={!commentInput.trim() || sendingComment}
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">发送</span>
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">请选择一个专业查看详情</p>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center">
          <div className="flex flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/major-test")} variant="outline">
              重新测评
            </Button>

            <Button
              onClick={() => (selectedMajor ? generateLearningPath(selectedMajor.id) : null)}
              disabled={!selectedMajor || generatingPath || cooldownTime > 0}
              className="flex items-center"
            >
              {generatingPath ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : cooldownTime > 0 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4" />
                  冷却中 ({Math.ceil(cooldownTime / 1000)}s)
                </>
              ) : (
                <>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  生成学习路径
                </>
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center max-w-md mt-6">
            点击"生成学习路径"按钮，系统将为您生成个性化的学习计划，帮助您更好地学习所选专业所需的知识和技能。
          </p>
        </div>
      </main>
    </div>
  )
}
