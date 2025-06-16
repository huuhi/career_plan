"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileTextIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  BookOpenIcon,
  AwardIcon,
  ClockIcon,
  LightbulbIcon,
  TrendingUpIcon,
  BookIcon,
  BarChartIcon,
  UsersIcon,
  HeartIcon,
  SearchIcon,
  DatabaseIcon,
  BookmarkIcon,
  UserIcon,
  PieChartIcon, // 添加图表图标
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { userApi } from "@/services/api"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// 删除 Dashboard 组件的导入
// import { Dashboard } from "@/components/dashboard/dashboard"

export default function HomePage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const [userAvatar, setUserAvatar] = useState<string>("")
  
  // 获取用户头像
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData()
    }
  }, [isAuthenticated, user])
  
  const fetchUserData = async () => {
    try {
      const response = await userApi.getUserData()
      if (response.data.success) {
        const userData = response.data.data
        if (userData.avatar) {
          setUserAvatar(userData.avatar)
        }
      } else if (user?.userImage) {
        // 如果API获取失败，尝试使用JWT中存储的头像
        setUserAvatar(user.userImage)
      }
    } catch (error) {
      console.error("获取用户信息失败:", error)
      // 使用JWT中的用户头像作为备选
      if (user?.userImage) {
        setUserAvatar(user.userImage)
      }
    }
  }

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8 flex items-center gap-4">
          {/* <div className="flex-shrink-0">
            {userAvatar ? (
              <Avatar className="h-12 w-12">
                <AvatarImage src={userAvatar} alt={user?.username || "用户头像"} />
                <AvatarFallback>
                  <UserIcon className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div> */}
          <div>
            <h1 className="text-3xl font-bold mb-2">欢迎回来，{user?.username || "用户"}</h1>
            <p className="text-muted-foreground">开始您的职业规划之旅</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左侧：主要功能卡片 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-8">
              {/* 删除智慧大屏部分 */}
              {/* <div>
                <Dashboard />
              </div> */}
              
              {/* 核心服务 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">核心服务</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileTextIcon className="h-5 w-5 text-primary" />
                        简历分析
                      </CardTitle>
                      <CardDescription>上传您的简历，获取专业分析和建议</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        我们的AI将分析您的简历，提供优势分析、缺点分析、面试建议等全方位评估。
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => router.push("/resume")} className="w-full">
                        开始分析
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BriefcaseIcon className="h-5 w-5 text-primary" />
                        职业测评
                      </CardTitle>
                      <CardDescription>立即测试，了解适合您的职业方向</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        通过回答一系列问题，我们将为您推荐最适合的职业方向，帮助您做出明智的职业选择。
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => router.push("/career-test")} className="w-full">
                        开始测评
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCapIcon className="h-5 w-5 text-primary" />
                        专业测评
                      </CardTitle>
                      <CardDescription>发现最适合您的专业方向——深度分析，匹配潜能</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        根据您的兴趣、能力和性格特点，我们将为您推荐最匹配的专业方向，助您规划学业道路。
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => router.push("/major-test")} className="w-full">
                        开始测评
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              {/* 职业与专业库 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">职业与专业库</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BriefcaseIcon className="h-5 w-5 text-primary" />
                        职业库
                      </CardTitle>
                      <CardDescription>探索各行业职业详情与发展前景</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        浏览全面的职业信息库，了解不同职业的工作内容、薪资水平、发展前景和所需技能。
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                          软件工程师
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                          数据分析师
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded-full">
                          产品经理
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-full">
                          更多职业...
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => router.push("/job-library")} className="w-full">
                        <SearchIcon className="mr-2 h-4 w-4" />
                        浏览职业库
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCapIcon className="h-5 w-5 text-primary" />
                        专业库
                      </CardTitle>
                      <CardDescription>了解各专业详情与就业方向</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        探索高校专业信息库，获取专业培养目标、核心课程、就业前景等全面信息。
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-full">
                          计算机科学
                        </span>
                        <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded-full">
                          电气工程
                        </span>
                        <span className="text-xs bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 px-2 py-1 rounded-full">
                          金融学
                        </span>
                        <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 px-2 py-1 rounded-full">
                          更多专业...
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => router.push("/major-library")} className="w-full">
                        <SearchIcon className="mr-2 h-4 w-4" />
                        浏览专业库
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              {/* 学习资源 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">学习资源</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookIcon className="h-5 w-5 text-primary" />
                        职业规划指南
                      </CardTitle>
                      <CardDescription>探索不同行业和职业路径的详细指南</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border rounded-md p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <h4 className="font-medium">技术行业职业路径</h4>
                        <p className="text-sm text-muted-foreground mt-1">从初级开发到CTO的职业发展路线图</p>
                      </div>
                      <div className="border rounded-md p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <h4 className="font-medium">金融行业职业规划</h4>
                        <p className="text-sm text-muted-foreground mt-1">银行、投资与金融科技的职业选择</p>
                      </div>
                      <div className="border rounded-md p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <h4 className="font-medium">医疗健康领域发展指南</h4>
                        <p className="text-sm text-muted-foreground mt-1">医疗行业的多元职业机会</p>
                      </div>
                      <div className="border rounded-md p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                      <h4 className="font-medium">教育行业职业发展</h4>
                      <p className="text-sm text-muted-foreground mt-1">从教师到教育管理者的成长路径</p>
                    </div>
                    </CardContent>
                    {/* <CardFooter>
                      <Button variant="outline" className="w-full">
                        查看全部指南
                      </Button>
                    </CardFooter> */}
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpenIcon className="h-5 w-5 text-primary" />
                        学习资源库
                      </CardTitle>
                      <CardDescription>提升职业技能的精选学习资源</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border rounded-md p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <h4 className="font-medium">数据分析入门</h4>
                        <p className="text-sm text-muted-foreground mt-1">掌握数据分析基础技能的课程和资源</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                            Python
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full ml-2">
                            Excel
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded-full ml-2">
                            SQL
                          </span>
                        </div>
                      </div>
                      <div className="border rounded-md p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <h4 className="font-medium">商务沟通技巧</h4>
                        <p className="text-sm text-muted-foreground mt-1">提升职场沟通能力的课程和练习</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-full">
                            演讲
                          </span>
                          <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-full ml-2">
                            谈判
                          </span>
                          <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded-full ml-2">
                            写作
                          </span>
                        </div>
                      </div>
                      <div className="border rounded-md p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <h4 className="font-medium">项目管理精要</h4>
                        <p className="text-sm text-muted-foreground mt-1">项目管理方法论与实践技巧</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 px-2 py-1 rounded-full">
                            敏捷
                          </span>
                          <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 px-2 py-1 rounded-full ml-2">
                            Scrum
                          </span>
                          <span className="text-xs bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300 px-2 py-1 rounded-full ml-2">
                            看板
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    {/* <CardFooter>
                      <Button variant="outline" className="w-full">
                        浏览资源库
                      </Button>
                    </CardFooter> */}
                  </Card>
                </div>
              </div>

              {/* 职业洞察 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">职业洞察</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>行业趋势与洞察</CardTitle>
                    <CardDescription>了解最新的职业市场动态和行业发展趋势</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="border rounded-md p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChartIcon className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">2023年薪资趋势报告</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          各行业薪资水平分析与未来薪资预测，帮助您了解市场行情。
                        </p>
                      </div>
                      <div className="border rounded-md p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUpIcon className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">新兴职业分析</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          AI时代催生的新职业与机会，探索未来就业市场的新方向。
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">热门行业需求技能</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>人工智能/机器学习</span>
                          </div>
                          <span className="text-sm font-medium">高需求</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>数据分析与可视化</span>
                          </div>
                          <span className="text-sm font-medium">高需求</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>云计算与DevOps</span>
                          </div>
                          <span className="text-sm font-medium">中高需求</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span>网络安全</span>
                          </div>
                          <span className="text-sm font-medium">中高需求</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>产品管理</span>
                          </div>
                          <span className="text-sm font-medium">中等需求</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {/* <CardFooter>
                    <Button variant="outline" className="w-full">
                      查看更多洞察
                    </Button>
                  </CardFooter> */}
                </Card>
              </div>
            </div>
          </div>

          {/* 右侧：辅助信息 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LightbulbIcon className="h-5 w-5 mr-2 text-primary" />
                  职业发展建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <p className="text-sm">
                      <span className="font-medium">建立专业网络：</span>
                      积极参与行业活动和社区，建立有价值的职业人脉。
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <p className="text-sm">
                      <span className="font-medium">持续学习：</span>
                      每周至少花5小时学习新技能，保持竞争力。
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <p className="text-sm">
                      <span className="font-medium">寻找导师：</span>
                      向行业专家学习，获取宝贵的职业建议和指导。
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <p className="text-sm">
                      <span className="font-medium">展示成果：</span>
                      建立个人品牌，展示您的专业成果和技能。
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <p className="text-sm">
                      <span className="font-medium">设定目标：</span>
                      制定明确的短期和长期职业目标，定期评估进展。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-primary" />
                  职业规划时间表
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
                  <div className="relative">
                    <div className="absolute left-[-22px] top-1 h-3 w-3 rounded-full bg-primary"></div>
                    <h4 className="text-sm font-medium">短期目标（3-6个月）</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      完成技能评估，确定需要提升的关键能力，开始有针对性的学习。
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute left-[-22px] top-1 h-3 w-3 rounded-full bg-primary"></div>
                    <h4 className="text-sm font-medium">中期目标（6-12个月）</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      获取相关认证或完成项目，扩展专业网络，参与行业活动。
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute left-[-22px] top-1 h-3 w-3 rounded-full bg-primary"></div>
                    <h4 className="text-sm font-medium">长期目标（1-3年）</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      实现职位晋升或转型，成为所在领域的专家，指导他人成长。
                    </p>
                  </div>
                </div>
              </CardContent>
              {/* <CardFooter>
                <Button variant="outline" className="w-full">
                  创建个人规划
                </Button>
              </CardFooter> */}
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-base">
                  <AwardIcon className="h-5 w-5 mr-2 text-primary" />
                  热门认证推荐
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 border rounded-md hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                      <UsersIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">PMP认证</h4>
                      <p className="text-xs text-muted-foreground">项目管理专业人士认证</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 border rounded-md hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300">
                      <BarChartIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">数据分析师认证</h4>
                      <p className="text-xs text-muted-foreground">数据分析与可视化专业认证</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 border rounded-md hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                      <HeartIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">人力资源管理师</h4>
                      <p className="text-xs text-muted-foreground">人力资源专业认证</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 快速访问卡片 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-base">
                  <BookmarkIcon className="h-5 w-5 mr-2 text-primary" />
                  快速访问
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/learning-path")}
                  >
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    我的学习路径
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/profile")}>
                    <UsersIcon className="h-4 w-4 mr-2" />
                    个人中心
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/job-library")}
                  >
                    <DatabaseIcon className="h-4 w-4 mr-2" />
                    职业库
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
    

              )}
