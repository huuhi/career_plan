"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { 
  BriefcaseIcon, 
  SearchIcon, 
  ArrowUpIcon, 
  TrendingUpIcon, 
  BarChartIcon,
  PlusCircleIcon,
  AlertCircleIcon
} from "lucide-react"
import { jobApi } from "@/services/api"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// 定义职业类型
interface Job {
  id: number
  title: string
  salary: string
  description: string
  outlook: string
  type: string
}

export default function JobLibraryPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [pageNum, setPageNum] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeCategory, setActiveCategory] = useState("0")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastJobElementRef = useRef<HTMLDivElement | null>(null)
  
  // 添加新职业对话框相关状态
  const [showAddJobDialog, setShowAddJobDialog] = useState(false)
  const [newJobName, setNewJobName] = useState("")
  const [newJobDescription, setNewJobDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // 职业分类
  const categories = [
    { id: "0", name: "全部职位" },
    { id: "1", name: "农业类" },
    { id: "2", name: "工业类" },
    { id: "3", name: "服务业类" },
    { id: "4", name: "专业技术类" },
    { id: "5", name: "管理类" },
    { id: "6", name: "艺术与娱乐类" },
    { id: "7", name: "其他" },
  ]

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 监听滚动位置，显示/隐藏回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 修改 filterByCategory 函数，先更新类别，然后再请求数据
  const filterByCategory = (category: string) => {
    setActiveCategory(category)
    setSearchTerm("")
    setPageNum(1)
    setJobs([]) // 清空当前职业列表
    setHasMore(true)

    // 使用新的类别ID直接请求数据
    fetchJobsByCategory(category, 1)
  }

  // 添加新的函数，专门用于按类别获取职业数据
  const fetchJobsByCategory = async (categoryId: string, page: number) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      let response

      if (categoryId !== "0") {
        response = await jobApi.getJobsByType(categoryId, page, 20)
      } else {
        response = await jobApi.getJobPage(page, 20)
      }

      if (response.data.success) {
        setJobs(response.data.data)
        setTotalJobs(response.data.total)
        setHasMore(response.data.data.length > 0 && response.data.data.length < response.data.total)
      } else {
        toast.error("获取职业数据失败", {
          description: response.data.errorMsg || "请稍后重试",
        })
      }
    } catch (error: any) {
      console.error("获取职业数据出错:", error)
      toast.error("获取职业数据失败", {
        description: "网络错误，请稍后重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 修改 fetchJobs 函数，将类别筛选逻辑移到 fetchJobsByCategory
  const fetchJobs = async (page: number) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      let response

      if (searchTerm) {
        response = await jobApi.searchJobs(searchTerm, page, 20)
      } else {
        response = await jobApi.getJobPage(page, 20)
      }

      if (response.data.success) {
        if (page === 1) {
          setJobs(response.data.data)
        } else {
          setJobs((prev) => [...prev, ...response.data.data])
        }
        setTotalJobs(response.data.total)
        setHasMore(response.data.data.length > 0 && jobs.length + response.data.data.length < response.data.total)
      } else {
        toast.error("获取职业数据失败", {
          description: response.data.errorMsg || "请稍后重试",
        })
      }
    } catch (error: any) {
      console.error("获取职业数据出错:", error)
      toast.error("获取职业数据失败", {
        description: "网络错误，请稍后重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 查看职业详情
  const viewJobDetail = (jobId: number) => {
    // 保存当前滚动位置
    const scrollPosition = window.scrollY.toString()
    localStorage.setItem("jobLibraryScrollPosition", scrollPosition)
    router.push(`/job-library/${jobId}`)
  }

  // 初始化数据
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (isAuthenticated) {
      fetchJobs(1)
    }
  }, [isAuthenticated, loading, router])

  // 添加下拉刷新功能
  useEffect(() => {
    let startY = 0
    let isRefreshing = false

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].pageY
    }

    const handleTouchMove = async (e: TouchEvent) => {
      const currentY = e.touches[0].pageY
      const scrollTop = window.scrollY
      
      // 只有在页面顶部且下拉时才触发刷新
      if (scrollTop <= 0 && currentY - startY > 50 && !isRefreshing) {
        isRefreshing = true
        // 重置数据并重新获取
        toast.info("刷新中...")
        setPageNum(1)
        setJobs([])
        setHasMore(true)
        await fetchJobs(1)
        isRefreshing = false
        startY = 0
      }
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [fetchJobs])

  // 修改滚动位置恢复逻辑
  useEffect(() => {
    const savedScrollPosition = localStorage.getItem("jobLibraryScrollPosition")
    if (savedScrollPosition) {
      // 等待页面内容加载完成后再恢复滚动位置
      const timer = setInterval(() => {
        if (jobs.length > 0) {
          window.scrollTo(0, parseInt(savedScrollPosition))
          localStorage.removeItem("jobLibraryScrollPosition")
          clearInterval(timer)
        }
      }, 100)

      // 设置超时时间，避免无限等待
      setTimeout(() => clearInterval(timer), 5000)
    }
  }, [jobs])

  // 修改无限滚动的引用
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasMore && !isLoading) {
          const nextPage = pageNum + 1
          setPageNum(nextPage)
          fetchJobs(nextPage)
        }
      },
      { threshold: 0.1 }
    )

    const currentElement = lastJobElementRef.current
    if (currentElement) {
      observerRef.current.observe(currentElement)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoading, pageNum, activeCategory, searchTerm])

  // 处理搜索
  const handleSearch = () => {
    setPageNum(1)
    setJobs([])
    setHasMore(true)
    fetchJobs(1)
  }

  // 提取薪资数字用于可视化
  const extractSalaryValue = (salaryString: string): number => {
    const match = salaryString.match(/(\d+)-(\d+)/)
    if (match) {
      return (Number.parseInt(match[1]) + Number.parseInt(match[2])) / 2
    }
    return 0
  }

  // 主动生成职业信息
  const handleGenerateJob = async () => {
    if (!newJobName.trim()) {
      toast.error("请输入职业名称");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await jobApi.generateJob({
        jobName: newJobName.trim(),
        description: newJobDescription.trim()
      });

      if (response.data.success) {
        // 如果返回data中有id，说明职业已经生成，直接跳转到详情页
        if (response.data.data !== null && response.data.data !== undefined) {
          const jobId = response.data.data;
          toast.success("职业信息已成功生成");
          setShowAddJobDialog(false);
          router.push(`/job-library/${jobId}`);
        } else {
          // 否则通过WebSocket等待消息
          toast.success("职业信息生成请求已提交，请等待处理");
          setShowAddJobDialog(false);
        }
      } else {
        toast.error("生成职业信息失败", {
          description: response.data.errorMsg || "请稍后重试"
        });
      }
    } catch (error: any) {
      console.error("生成职业信息出错:", error);
      toast.error("生成职业信息失败", {
        description: "网络错误，请稍后重试"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <BriefcaseIcon className="mr-2 h-7 w-7" />
            职业库
          </h1>
          <p className="text-muted-foreground">探索各行业职业详情与发展前景，助您做出明智的职业选择</p>
        </div>

        <div className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="搜索职业名称或描述..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>搜索</Button>
            <Button 
              onClick={() => setShowAddJobDialog(true)}
              variant="outline"
              className="flex items-center gap-1"
            >
              <PlusCircleIcon className="h-4 w-4" />
              添加职业
            </Button>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            共 {totalJobs} 个职业，当前显示 {jobs.length} 个结果
          </div>
        </div>

        {/* 分类标签 */}
        <Tabs defaultValue="0" className="mb-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                onClick={() => filterByCategory(category.id)}
                className={activeCategory === category.id ? "bg-primary/10" : ""}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => {
            // 计算薪资可视化
            const salaryValue = extractSalaryValue(job.salary)
            const salaryPercentage = Math.min(100, Math.max(20, (salaryValue / 50) * 100))

            return (
              <div
                key={job.id}
                ref={index === jobs.length - 1 ? lastJobElementRef : null}
              >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                  <CardContent className="flex-1 pt-6">
                    <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                    <p className="text-sm text-primary font-medium mb-3">{job.salary}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

                    {/* 薪资可视化 */}
                    <div className="mt-3 mb-4">
                      <div className="text-sm text-gray-500 mb-1 flex items-center">
                        <BarChartIcon className="h-4 w-4 mr-1" />
                        <span>薪资水平</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-300 to-blue-600 h-2 rounded-full"
                          style={{ width: `${salaryPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-secondary/50 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUpIcon className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">发展前景</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{job.outlook}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => viewJobDetail(job.id)} className="w-full">
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )
          })}
        </div>

        {isLoading && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {!hasMore && jobs.length > 0 && (
          <div className="mt-8 text-center text-muted-foreground">已加载全部职业数据</div>
        )}

        {jobs.length === 0 && !isLoading && (
          <div className="mt-8 text-center text-muted-foreground">没有找到符合条件的职业，请尝试其他搜索条件</div>
        )}

        {showScrollTop && (
          <Button className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0 shadow-lg" onClick={scrollToTop}>
            <ArrowUpIcon className="h-6 w-6" />
          </Button>
        )}
      </main>

      {/* 添加职业对话框 */}
      <Dialog open={showAddJobDialog} onOpenChange={setShowAddJobDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加新职业</DialogTitle>
            <DialogDescription>
              输入职业信息，系统将自动生成详细的职业介绍
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="jobName">职业名称 <span className="text-red-500">*</span></Label>
              <Input
                id="jobName"
                placeholder="如：区块链工程师、Godot游戏开发..."
                value={newJobName}
                onChange={(e) => setNewJobName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobDescription">补充描述（可选，最多200字）</Label>
              <Textarea
                id="jobDescription"
                placeholder="如：该职业的主要工作内容、特点、学历要求等..."
                rows={3}
                value={newJobDescription}
                onChange={(e) => {
                  // 限制最多200个字符
                  if (e.target.value.length <= 200) {
                    setNewJobDescription(e.target.value);
                  }
                }}
                maxLength={200}
              />
              <div className="text-xs text-muted-foreground text-right">
                {newJobDescription.length}/200
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
              <AlertCircleIcon className="h-4 w-4" />
              <span>生成过程需要一些时间，请耐心等待</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddJobDialog(false)}>
              取消
            </Button>
            <Button onClick={handleGenerateJob} disabled={isGenerating || !newJobName.trim()}>
              {isGenerating ? "生成中..." : "生成职业信息"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
