"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { 
  GraduationCapIcon, 
  SearchIcon, 
  ArrowUpIcon, 
  ClockIcon, 
  BookOpenIcon, 
  BookIcon, 
  BrainIcon,
  PlusCircleIcon,
  AlertCircleIcon
} from "lucide-react"
import { majorApi } from "@/services/api"
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

// 定义专业类型
interface Major {
  id: number
  title: string
  studyDuration: string
  description: string
  degreeType: string
  type: string
  matchScore?: string | null
}

export default function MajorLibraryPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [majors, setMajors] = useState<Major[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [pageNum, setPageNum] = useState(1)
  const [totalMajors, setTotalMajors] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeCategory, setActiveCategory] = useState("0")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastMajorElementRef = useRef<HTMLDivElement | null>(null)
  
  // 添加新专业对话框相关状态
  const [showAddMajorDialog, setShowAddMajorDialog] = useState(false)
  const [newMajorName, setNewMajorName] = useState("")
  const [newMajorDescription, setNewMajorDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // 专业分类
  const categories = [
    { id: "0", name: "全部专业" },
    { id: "1", name: "哲学" },
    { id: "2", name: "经济学" },
    { id: "3", name: "法学" },
    { id: "4", name: "教育学" },
    { id: "5", name: "文学" },
    { id: "6", name: "历史学" },
    { id: "7", name: "理学" },
    { id: "8", name: "工学" },
    { id: "9", name: "农学" },
    { id: "10", name: "医学" },
    { id: "11", name: "军事学" },
    { id: "12", name: "管理学" },
    { id: "13", name: "艺术学" },
    { id: "14", name: "交叉学科" },
    { id: "15", name: "其他" },
  ]

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

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
      if (scrollTop <= 0 && currentY - startY > 70 && !isRefreshing) {
        isRefreshing = true
        // 重置数据并重新获取
        setPageNum(1)
        setMajors([])
        setHasMore(true)
        await fetchMajors(1)
        isRefreshing = false
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  // 修改滚动位置恢复逻辑
  useEffect(() => {
    const savedScrollPosition = localStorage.getItem("majorLibraryScrollPosition")
    if (savedScrollPosition) {
      // 等待页面内容加载完成后再恢复滚动位置
      const timer = setInterval(() => {
        if (majors.length > 0) {
          window.scrollTo(0, parseInt(savedScrollPosition))
          localStorage.removeItem("majorLibraryScrollPosition")
          clearInterval(timer)
        }
      }, 100)

      // 设置超时时间，避免无限等待
      setTimeout(() => clearInterval(timer), 5000)
    }
  }, [majors])

  // 获取专业数据
  const fetchMajors = async (page: number) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      let response

      if (searchTerm) {
        response = await majorApi.searchMajors(searchTerm, page, 20)
      } else if (activeCategory !== "0") {
        response = await majorApi.getMajorsByType(activeCategory, page, 20)
      } else {
        response = await majorApi.getMajorPage(page, 20)
      }

      if (response.data.success) {
        if (page === 1) {
          setMajors(response.data.data)
        } else {
          setMajors((prev) => [...prev, ...response.data.data])
        }
        setTotalMajors(response.data.total)
        setHasMore(response.data.data.length > 0 && majors.length + response.data.data.length < response.data.total)
      } else {
        toast.error("获取专业数据失败", {
          description: response.data.errorMsg || "请稍后重试",
        })
      }
    } catch (error: any) {
      console.error("获取专业数据出错:", error)
      toast.error("获取专业数据失败", {
        description: "网络错误，请稍后重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 添加按分类获取专业数据的函数
  const fetchMajorsByCategory = async (category: string, page: number) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      let response
      if (category === "0") {
        response = await majorApi.getMajorPage(page, 20)
      } else {
        response = await majorApi.getMajorsByType(category, page, 20)
      }

      if (response.data.success) {
        if (page === 1) {
          setMajors(response.data.data)
        } else {
          setMajors((prev) => [...prev, ...response.data.data])
        }
        setTotalMajors(response.data.total)
        setHasMore(response.data.data.length > 0 && majors.length + response.data.data.length < response.data.total)
      } else {
        toast.error("获取专业数据失败", {
          description: response.data.errorMsg || "请稍后重试",
        })
      }
    } catch (error: any) {
      console.error("按分类获取专业数据出错:", error)
      toast.error("获取专业数据失败", {
        description: "网络错误，请稍后重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 添加无限滚动逻辑
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasMore && !isLoading) {
          const nextPage = pageNum + 1
          setPageNum(nextPage)
          if (activeCategory !== "0") {
            fetchMajorsByCategory(activeCategory, nextPage)
          } else {
            fetchMajors(nextPage)
          }
        }
      },
      { threshold: 0.1 }
    )

    const currentElement = lastMajorElementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [hasMore, isLoading, pageNum, activeCategory, searchTerm])

  // 修改 filterByCategory 函数
  const filterByCategory = (category: string) => {
    setActiveCategory(category)
    setSearchTerm("")
    setPageNum(1)
    setMajors([])
    setHasMore(true)
    fetchMajorsByCategory(category, 1)
  }

  // 修改 handleSearch 函数
  const handleSearch = () => {
    setPageNum(1)
    setMajors([])
    setHasMore(true)
    fetchMajors(1)
  }

  // 查看专业详情
  const viewMajorDetail = (majorId: number) => {
    // 保存当前滚动位置
    const scrollPosition = window.scrollY.toString()
    localStorage.setItem("majorLibraryScrollPosition", scrollPosition)
    router.push(`/major-library/${majorId}`)
  }

  // 获取学位类型的颜色
  const getDegreeTypeColor = (degreeType: string) => {
    if (degreeType.includes("本科")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    if (degreeType.includes("专科")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (degreeType.includes("硕士")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    if (degreeType.includes("博士")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  // 根据专业名称生成标签
  const generateMajorTags = (title: string): { name: string; icon: React.ReactNode }[] => {
    const engineeringTags = [
      { name: "工程实践", icon: <BookOpenIcon className="h-3 w-3" /> },
      { name: "技术应用", icon: <BrainIcon className="h-3 w-3" /> },
      { name: "设计能力", icon: <BookIcon className="h-3 w-3" /> },
    ]
    const scienceTags = [
      { name: "研究方法", icon: <BookOpenIcon className="h-3 w-3" /> },
      { name: "实验技能", icon: <BrainIcon className="h-3 w-3" /> },
      { name: "理论基础", icon: <BookIcon className="h-3 w-3" /> },
    ]
    const economicsTags = [
      { name: "数据分析", icon: <BookOpenIcon className="h w-3" /> },
      { name: "数据分析", icon: <BookOpenIcon className="h-3 w-3" /> },
      { name: "市场洞察", icon: <BrainIcon className="h-3 w-3" /> },
      { name: "管理能力", icon: <BookIcon className="h-3 w-3" /> },
    ]
    const artsTags = [
      { name: "创意表达", icon: <BookOpenIcon className="h-3 w-3" /> },
      { name: "文化理解", icon: <BrainIcon className="h-3 w-3" /> },
      { name: "沟通能力", icon: <BookIcon className="h-3 w-3" /> },
    ]

    if (title.match(/工程|机械|电气|土木|自动化/)) return engineeringTags
    if (title.match(/科学|物理|化学|生物|数学|统计/)) return scienceTags
    if (title.match(/经济|金融|贸易|商业|管理/)) return economicsTags
    if (title.match(/文学|艺术|设计|语言|传媒/)) return artsTags

    return [
      { name: "综合能力", icon: <BookOpenIcon className="h-3 w-3" /> },
      { name: "专业知识", icon: <BrainIcon className="h-3 w-3" /> },
      { name: "实践技能", icon: <BookIcon className="h-3 w-3" /> },
    ]
  }

  // Update the useEffect for initial data loading
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (isAuthenticated) {
      fetchMajors(1)
    }
  }, [isAuthenticated, loading, router])

  // 主动生成专业信息
  const handleGenerateMajor = async () => {
    if (!newMajorName.trim()) {
      toast.error("请输入专业名称");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await majorApi.generateMajors({
        majorsName: newMajorName.trim(),
        description: newMajorDescription.trim()
      });

      if (response.data.success) {
        // 如果返回data中有id，说明专业已经生成，直接跳转到详情页
        if (response.data.data !== null && response.data.data !== undefined) {
          const majorId = response.data.data;
          toast.success("专业信息已成功生成");
          setShowAddMajorDialog(false);
          router.push(`/major-library/${majorId}`);
        } else {
          // 否则通过WebSocket等待消息
          toast.success("专业信息生成请求已提交，请等待处理");
          setShowAddMajorDialog(false);
        }
      } else {
        toast.error("生成专业信息失败", {
          description: response.data.errorMsg || "请稍后重试"
        });
      }
    } catch (error: any) {
      console.error("生成专业信息出错:", error);
      toast.error("生成专业信息失败", {
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
            <GraduationCapIcon className="mr-2 h-7 w-7" />
            专业库
          </h1>
          <p className="text-muted-foreground">探索全面的大学专业详情与就业方向，助您规划学习路径</p>
        </div>

        <div className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="搜索专业名称或描述..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>搜索</Button>
            <Button 
              onClick={() => setShowAddMajorDialog(true)}
              variant="outline"
              className="flex items-center gap-1"
            >
              <PlusCircleIcon className="h-4 w-4" />
              添加专业
            </Button>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            共 {totalMajors} 个专业，当前显示 {majors.length} 个结果
          </div>
        </div>

        {/* 分类标签 */}
        <Tabs value={activeCategory} className="mb-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {categories.slice(0, 8).map((category) => (
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
          <div className="mt-2">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {categories.slice(8).map((category) => (
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
          </div>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {majors.map((major, index) => (
            <div
              key={major.id}
              ref={index === majors.length - 1 ? lastMajorElementRef : null}
            >
              <Card className="h-full flex flex-col">
                <CardContent className="flex-1 pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold line-clamp-1">{major.title}</h2>
                    {major.degreeType && (
                      <Badge className={getDegreeTypeColor(major.degreeType)}>{major.degreeType}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      {major.studyDuration}
                    </div>
                    {major.matchScore && (
                      <div className="flex items-center text-sm text-primary font-medium">
                        <span>匹配度: {major.matchScore}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[4.5em]">{major.description}</p>

                  {/* 专业特点可视化 */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {generateMajorTags(major.title).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="flex items-center gap-1 bg-secondary/50">
                        {tag.icon}
                        <span>{tag.name}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button onClick={() => viewMajorDetail(major.id)} className="w-full">
                    查看详情
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-[200px]" />
            ))}
          </div>
        )}

        {!isLoading && majors.length === 0 && (
          <div className="text-center py-8">
            <GraduationCapIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">暂无专业数据</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "没有找到相关专业，请尝试其他关键词" : "请稍后再试"}
            </p>
          </div>
        )}

        {showScrollTop && (
          <Button className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0 shadow-lg" onClick={scrollToTop}>
            <ArrowUpIcon className="h-6 w-6" />
          </Button>
        )}
      </main>

      {/* 添加专业对话框 */}
      <Dialog open={showAddMajorDialog} onOpenChange={setShowAddMajorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加新专业</DialogTitle>
            <DialogDescription>
              输入专业信息，系统将自动生成详细的专业介绍
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="majorName">专业名称 <span className="text-red-500">*</span></Label>
              <Input
                id="majorName"
                placeholder="如：人工智能、网络空间安全..."
                value={newMajorName}
                onChange={(e) => setNewMajorName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="majorDescription">补充描述（可选，最多200字）</Label>
              <Textarea
                id="majorDescription"
                placeholder="如：大专/本科专业，特定学校的专业，行业背景等..."
                rows={3}
                value={newMajorDescription}
                onChange={(e) => {
                  // 限制最多200个字符
                  if (e.target.value.length <= 200) {
                    setNewMajorDescription(e.target.value);
                  }
                }}
                maxLength={200}
              />
              <div className="text-xs text-muted-foreground text-right">
                {newMajorDescription.length}/200
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
              <AlertCircleIcon className="h-4 w-4" />
              <span>生成过程需要一些时间，请耐心等待</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMajorDialog(false)}>
              取消
            </Button>
            <Button onClick={handleGenerateMajor} disabled={isGenerating || !newMajorName.trim()}>
              {isGenerating ? "生成中..." : "生成专业信息"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
