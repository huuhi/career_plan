"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analysisApi } from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"
import { BriefcaseIcon, GraduationCapIcon } from "lucide-react"

export default function HistoryPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [jobAnalysisHistory, setJobAnalysisHistory] = useState<any[]>([])
  const [majorAnalysisHistory, setMajorAnalysisHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated) {
      fetchAnalysisHistory()
    }
  }, [isAuthenticated, loading, router])

  const fetchAnalysisHistory = async () => {
    try {
      setLoadingHistory(true)

      // 获取职业分析历史
      const jobResponse = await analysisApi.getJobAnalysis()
      if (jobResponse.data.success && jobResponse.data.data) {
        setJobAnalysisHistory(jobResponse.data.data)
      }

      // 获取专业分析历史
      const majorResponse = await analysisApi.getMajorAnalysis()
      if (majorResponse.data.success && majorResponse.data.data) {
        setMajorAnalysisHistory(majorResponse.data.data)
      }
    } catch (error) {
      console.error("获取历史记录失败:", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  if (loading || loadingHistory) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          <Skeleton className="h-[600px] w-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">历史记录</h1>
          <p className="text-muted-foreground">查看您的测评历史记录和分析结果</p>
        </div>

        <Tabs defaultValue="job" className="space-y-6">
          <TabsList className="w-full max-w-md mx-auto">
            <TabsTrigger value="job" className="flex-1">
              <BriefcaseIcon className="h-4 w-4 mr-2" />
              职业测评记录
            </TabsTrigger>
            <TabsTrigger value="major" className="flex-1">
              <GraduationCapIcon className="h-4 w-4 mr-2" />
              专业测评记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="job">
            {jobAnalysisHistory.length > 0 ? (
              <div className="space-y-6">
                {jobAnalysisHistory.map((analysis, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>职业测评结果 #{index + 1}</CardTitle>
                      <CardDescription>{analysis.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">推荐职业</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {analysis.dataList &&
                            analysis.dataList.map((job: any, jobIndex: number) => (
                              <div
                                key={jobIndex}
                                className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                                onClick={() => router.push(`/career-test/result/${analysis.id}?jobId=${job.id}`)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium">{job.title}</h4>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {job.matchScore}%
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                  <span>{job.salary}</span>
                                  <span>•</span>
                                  <span>{job.outlook}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-4">
                          <Button onClick={() => router.push(`/career-test/result/${analysis.id}`)}>
                            查看详细结果
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BriefcaseIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">暂无职业测评记录</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-md">
                    完成职业测评后，您可以在这里查看所有历史记录和分析结果
                  </p>
                  <Button onClick={() => router.push("/career-test")}>开始职业测评</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="major">
            {majorAnalysisHistory.length > 0 ? (
              <div className="space-y-6">
                {majorAnalysisHistory.map((analysis, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>专业测评结果 #{index + 1}</CardTitle>
                      <CardDescription>{analysis.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">推荐专业</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {analysis.dataList &&
                            analysis.dataList.map((major: any, majorIndex: number) => (
                              <div
                                key={majorIndex}
                                className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                                onClick={() => router.push(`/major-test/result/${analysis.id}?majorId=${major.id}`)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium">{major.title}</h4>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {major.matchScore}%
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{major.description}</p>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                  <span>{major.degreeType}</span>
                                  <span>•</span>
                                  <span>{major.studyDuration}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-4">
                          <Button onClick={() => router.push(`/major-test/result/${analysis.id}`)}>查看详细结果</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <GraduationCapIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">暂无专业测评记录</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-md">
                    完成专业测评后，您可以在这里查看所有历史记录和分析结果
                  </p>
                  <Button onClick={() => router.push("/major-test")}>开始专业测评</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
