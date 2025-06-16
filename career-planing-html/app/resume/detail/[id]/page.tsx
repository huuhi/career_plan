"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { resumeApi } from "@/services/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, FileText, Briefcase, GraduationCap, Award, BookOpen, Code, Globe, Star } from "lucide-react"
import { MarkdownPreview } from "@/components/markdown-preview"

export default function ResumeAnalysisPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const params = useParams()

  const [resume, setResume] = useState<any>(null)
  const [analysis, setAnalysis] = useState<string>("")
  const [loadingResume, setLoadingResume] = useState(true)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [activeTab, setActiveTab] = useState("analysis")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated && params.id) {
      fetchResume()
    }
  }, [isAuthenticated, loading, params.id, router])

  const fetchResume = async () => {
    try {
      setLoadingResume(true)
      const response = await resumeApi.get(params.id as string)

      if (response.data.success && response.data.data) {
        setResume(response.data.data)

        // If there's already structured data, use it
        if (response.data.data.structuredData) {
          setAnalysis(response.data.data.structuredData)
        }
      } else {
        throw new Error(response.data.errorMsg || "获取简历失败")
      }
    } catch (error: any) {
      toast.error("获取简历失败", {
        description: error.message || "请稍后重试",
      })
    } finally {
      setLoadingResume(false)
    }
  }

  // Update the streaming data parsing function to correctly parse JSON data
  const handleStreamData = (data: string) => {
    try {
      // Check if the data starts with "data:" prefix
      if (data.startsWith("data:")) {
        // Extract the JSON part after "data:"
        const jsonStr = data.substring(5)
        try {
          // Parse the JSON data
          const jsonData = JSON.parse(jsonStr)
          // Check if the data has a "data" property ($.data path)
          if (jsonData && jsonData.data) {
            // Return the actual content
            return jsonData.data
          }
          return jsonData // Return the parsed JSON if no "data" property
        } catch (e) {
          // If JSON parsing fails, return the raw string after "data:"
          return jsonStr
        }
      }
      // If no "data:" prefix, return the original string
      return data
    } catch (error) {
      console.error("Error parsing stream data:", error)
      return data // Return original data on error
    }
  }

  // Replace the generateAnalysis function with this improved version for true streaming
  const generateAnalysis = async () => {
    try {
      setLoadingAnalysis(true)
      setAnalysis("") // Clear existing analysis when starting a new one

      // Use the streaming API with a callback for each chunk
      await resumeApi.send(params.id as string, (chunk) => {
        // Parse the JSON data format: data:{"data":"content"}
        try {
          const parsedChunk = handleStreamData(chunk)
          setAnalysis((prevAnalysis) => prevAnalysis + parsedChunk)
        } catch (e) {
          // If JSON parsing fails, just append the raw chunk
          console.error("Error parsing chunk:", e)
          setAnalysis((prevAnalysis) => prevAnalysis + chunk)
        }
      })

      toast.success("分析完成", {
        description: "简历分析已生成",
      })
    } catch (error: any) {
      toast.error("分析失败", {
        description: error.message || "请稍后重试",
      })
    } finally {
      setLoadingAnalysis(false)
    }
  }

  // Replace the formatAnalysisText function with this improved version
  const formatAnalysisText = (text: string) => {
    // 如果文本已经是完整的markdown格式，直接返回
    if (text.includes('##') || text.includes('-')) {
      return text
    }

    // 尝试解析JSON格式的数据
    try {
      const lines = text.split('\n')
      const formattedLines = lines.map(line => {
        if (line.startsWith('data:')) {
          try {
            const jsonData = JSON.parse(line.substring(5))
            return jsonData.data || ''
          } catch {
            return line.substring(5)
          }
        }
        return line
      })
      return formattedLines.join('')
    } catch {
      return text
    }
  }

  if (loading || loadingResume) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="mb-8 flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-64" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-64 w-full md:col-span-1" />
            <Skeleton className="h-64 w-full md:col-span-2" />
          </div>
        </main>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">简历不存在</h1>
          <p className="text-muted-foreground mb-6">请返回简历管理页面</p>
          <Button onClick={() => router.push("/resume")}>返回简历管理</Button>
        </main>
      </div>
    )
  }

  const { resumeData } = resume

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/resume")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回简历管理
          </Button>
          <h1 className="text-3xl font-bold mb-2">{resume.resumeName}</h1>
          <p className="text-muted-foreground">查看简历分析结果和推荐</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* 左侧：简历信息 */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                简历信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">姓名</h3>
                <p className="text-sm text-muted-foreground">{resumeData.basics.name}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">职位</h3>
                <p className="text-sm text-muted-foreground">{resumeData.basics.label}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">联系方式</h3>
                <p className="text-sm text-muted-foreground">{resumeData.basics.email}</p>
                <p className="text-sm text-muted-foreground">{resumeData.basics.phone}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">个人简介</h3>
                <p className="text-sm text-muted-foreground">{resumeData.basics.summary}</p>
              </div>

              {/* 显示更多简历信息 */}
              <Tabs defaultValue="work" className="mt-4">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="work">工作</TabsTrigger>
                  <TabsTrigger value="education">教育</TabsTrigger>
                  <TabsTrigger value="skills">技能</TabsTrigger>
                  <TabsTrigger value="more">更多</TabsTrigger>
                </TabsList>

                <TabsContent value="work" className="space-y-3 mt-2">
                  {resumeData.work && resumeData.work.length > 0 ? (
                    resumeData.work.map((work: any, index: number) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-sm">{work.name}</h4>
                          <span className="text-xs text-muted-foreground">{work.position}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {work.startDate} - {work.endDate || "至今"}
                        </div>
                        <p className="text-xs mt-1">{work.summary}</p>
                        {work.highlights && work.highlights.length > 0 && (
                          <div className="mt-2">
                            <h5 className="text-xs font-medium">工作亮点:</h5>
                            <ul className="text-xs list-disc list-inside">
                              {work.highlights.map((highlight: string, hIndex: number) => (
                                <li key={hIndex}>{highlight}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">无工作经历</p>
                  )}
                </TabsContent>

                <TabsContent value="education" className="space-y-3 mt-2">
                  {resumeData.education && resumeData.education.length > 0 ? (
                    resumeData.education.map((edu: any, index: number) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-sm">{edu.institution}</h4>
                          <span className="text-xs text-muted-foreground">{edu.studyType}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {edu.startDate} - {edu.endDate || "至今"} • {edu.area}
                        </div>
                        {edu.score && <p className="text-xs mt-1">成绩: {edu.score}</p>}
                        {edu.courses && edu.courses.length > 0 && (
                          <div className="mt-2">
                            <h5 className="text-xs font-medium">主修课程:</h5>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {edu.courses.map((course: string, cIndex: number) => (
                                <span key={cIndex} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                  {course}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">无教育经历</p>
                  )}
                </TabsContent>

                <TabsContent value="skills" className="space-y-3 mt-2">
                  {resumeData.skills && resumeData.skills.length > 0 ? (
                    resumeData.skills.map((skill: any, index: number) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-sm">{skill.name}</h4>
                          <span className="text-xs text-muted-foreground">{skill.level}</span>
                        </div>
                        {skill.keywords && skill.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {skill.keywords.map((keyword: string, kIndex: number) => (
                              <span key={kIndex} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">无技能信息</p>
                  )}
                </TabsContent>

                <TabsContent value="more" className="space-y-3 mt-2">
                  {/* 语言能力 */}
                  {resumeData.languages && resumeData.languages.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <Globe className="h-3 w-3 mr-1" /> 语言能力
                      </h4>
                      <div className="space-y-1">
                        {resumeData.languages.map((lang: any, index: number) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span>{lang.language}</span>
                            <span className="text-muted-foreground">{lang.fluency}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 项目经历 */}
                  {resumeData.projects && resumeData.projects.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <Code className="h-3 w-3 mr-1" /> 项目经历
                      </h4>
                      <div className="space-y-2">
                        {resumeData.projects.map((project: any, index: number) => (
                          <div key={index} className="text-xs border rounded-md p-2">
                            <div className="font-medium">{project.name}</div>
                            <div className="text-muted-foreground mt-0.5">
                              {project.startDate} - {project.endDate || "至今"}
                            </div>
                            <p className="mt-1">{project.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 获奖情况 */}
                  {resumeData.awards && resumeData.awards.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <Award className="h-3 w-3 mr-1" /> 获奖情况
                      </h4>
                      <div className="space-y-2">
                        {resumeData.awards.map((award: any, index: number) => (
                          <div key={index} className="text-xs border rounded-md p-2">
                            <div className="font-medium">{award.title}</div>
                            <div className="text-muted-foreground mt-0.5">
                              {award.date} • {award.awarder}
                            </div>
                            <p className="mt-1">{award.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 证书 */}
                  {resumeData.certificates && resumeData.certificates.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <Star className="h-3 w-3 mr-1" /> 证书
                      </h4>
                      <div className="space-y-2">
                        {resumeData.certificates.map((cert: any, index: number) => (
                          <div key={index} className="text-xs border rounded-md p-2">
                            <div className="font-medium">{cert.name}</div>
                            <div className="text-muted-foreground mt-0.5">
                              {cert.date} • {cert.issuer}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!resumeData.languages?.length &&
                    !resumeData.projects?.length &&
                    !resumeData.awards?.length &&
                    !resumeData.certificates?.length && <p className="text-sm text-muted-foreground">无更多信息</p>}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push(`/resume/edit/${params.id}`)} className="w-full">
                编辑简历
              </Button>
            </CardFooter>
          </Card>

          {/* 右侧：分析结果和推荐 */}
          <div className="md:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="analysis">简历分析</TabsTrigger>
                <TabsTrigger value="jobs">职业推荐</TabsTrigger>
                <TabsTrigger value="courses">学习推荐</TabsTrigger>
              </TabsList>

              {/* Replace the existing analysis tab content with this updated version */}
              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>简历分析</CardTitle>
                    <CardDescription>基于您的简历内容的专业分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysis ? (
                      <div className="space-y-4">
                        <MarkdownPreview content={formatAnalysisText(analysis)} />
                        <div className="flex justify-between items-center mt-6 pt-4 border-t">
                          <p className="text-xs text-muted-foreground">重新分析将会覆盖当前分析结果，无法恢复</p>
                          <Button onClick={generateAnalysis} disabled={loadingAnalysis} variant="outline" size="sm">
                            {loadingAnalysis ? "分析中..." : "重新分析"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">尚未生成分析结果</p>
                        <Button onClick={generateAnalysis} disabled={loadingAnalysis}>
                          {loadingAnalysis ? "分析中..." : "生成分析"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      职业推荐
                    </CardTitle>
                    <CardDescription>根据您的技能和经验推荐的职业方向</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg">高级前端工程师</h3>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">匹配度 95%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          负责Web应用的前端架构设计和开发，优化用户体验和性能。
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            React
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            Vue.js
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            JavaScript
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            性能优化
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>薪资范围: ¥30-50万/年</span>
                          <span>需求趋势: 上升</span>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg">全栈开发工程师</h3>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">匹配度 92%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          同时负责前端和后端开发，构建完整的Web应用和服务。
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            Node.js
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            React
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            Python
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            数据库
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>薪资范围: ¥35-55万/年</span>
                          <span>需求趋势: 上升</span>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg">技术架构师</h3>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">匹配度 88%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">负责系统架构设计，技术选型和团队技术指导。</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            系统设计
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            微服务
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            云架构
                          </span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            技术管理
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>薪资范围: ¥50-80万/年</span>
                          <span>需求趋势: 稳定</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      学习推荐
                    </CardTitle>
                    <CardDescription>根据您的职业发展方向推荐的学习资源</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">技术提升路径</h3>
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-md">
                                <GraduationCap className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">高级前端工程化实践</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  学习现代前端工程化体系，包括构建工具、CI/CD、性能优化等。
                                </p>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">课程时长: 30小时</span>
                                  <span className="text-primary">推荐指数: ★★★★★</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-md">
                                <GraduationCap className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">微服务架构与实践</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  深入学习微服务架构设计原则、服务拆分、通信和部署策略。
                                </p>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">课程时长: 40小时</span>
                                  <span className="text-primary">推荐指数: ★★★★☆</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-md">
                                <GraduationCap className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">云原生应用开发</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  学习容器化、Kubernetes、服务网格等云原生技术栈。
                                </p>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">课程时长: 35小时</span>
                                  <span className="text-primary">推荐指数: ★★★★☆</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">软技能提升</h3>
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-md">
                                <Award className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">技术团队管理与领导力</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  学习如何有效管理技术团队，提升领导力和沟通能力。
                                </p>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">课程时长: 20小时</span>
                                  <span className="text-primary">推荐指数: ★★★★★</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-md">
                                <Award className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">项目管理与敏捷实践</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  学习敏捷开发方法论和项目管理技巧，提高团队协作效率。
                                </p>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">课程时长: 25小时</span>
                                  <span className="text-primary">推荐指数: ★★★★☆</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
