"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Circle,
  BookOpen,
  Award,
  Brain,
  Lightbulb,
  BookMarked,
  Clock,
  FileText,
  Pencil,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { learnPathApi } from "@/services/api"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import confetti from 'canvas-confetti'

interface ResourceDTO {
  course: string
  web: string
  book: string
}

interface Skill {
  id: number
  stepName: string
  stepOrder: number
  currentProgress: number
  status: string
  note: string | null
  scheduledTime: string
  preKnowledge: string
  importance: string
  resourceDTO: ResourceDTO
  completeHarvest: string
}

interface LearningPath {
  jobId: number | null
  majorsId: number | null
  goalName: string
  whyRecommend: string
  adviceAndAttention: string
  completeHarvest: string
  skills: Skill[]
}

interface Chapter {
  id: number
  skillId: number
  name: string
  status: number // 0:未学 1:学习中 2:已完成
  note: string | null
  description: string
  chapterOrder: number
}

interface Node {
  id: number
  chapterId: number
  name: string
  status: number // 0:未学 1:已完成
  note: string | null
  description: string
  noduleOrder: number
}

interface ProgressItem {
  name: string
  progress: number
}

interface ProgressData {
  name: string
  progress: number
}

export default function LearningPathDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { toast: uiToast } = useToast()

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSkill, setActiveSkill] = useState<number | null>(null)
  const [chapters, setChapters] = useState<Record<number, Chapter[]>>({})
  const [nodes, setNodes] = useState<Record<number, Node[]>>({})
  const [loadingChapters, setLoadingChapters] = useState(false)
  const [loadingNodes, setLoadingNodes] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null)
  const [skillProgress, setSkillProgress] = useState<ProgressData[]>([])
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [activeNode, setActiveNode] = useState<Node | null>(null)
  const [noteContent, setNoteContent] = useState("")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // 获取学习路径数据
  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setLoading(true)
        // 确保 id 是有效的数字
        if (!id || id === 'undefined') {
          throw new Error('无效的学习路径ID')
        }
        const response = await learnPathApi.getPath(id as string)

        if (response.data.success && response.data.data) {
          setLearningPath(response.data.data)

          // 设置第一个技能为活跃技能
          if (response.data.data.skills && response.data.data.skills.length > 0) {
            setActiveSkill(response.data.data.skills[0].id)
          }

          // 计算总体进度
          if (response.data.data.skills && response.data.data.skills.length > 0) {
            const totalSkills = response.data.data.skills.length
            const completedSkills = response.data.data.skills.filter((skill: Skill) => skill.status === "已完成").length
            setOverallProgress(Math.round((completedSkills / totalSkills) * 100))
          }
        } else {
          throw new Error(response.data.errorMsg || "获取学习路径失败")
        }
      } catch (error: any) {
        console.error("Failed to fetch learning path:", error)
        uiToast({
          title: "获取学习路径失败",
          description: error.message || "请稍后重试",
          variant: "destructive",
        })
        // 如果是无效ID，重定向到学习路径列表
        if (error.message === '无效的学习路径ID') {
          router.push('/learning-path')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLearningPath()
  }, [id, uiToast, router])

  // 获取章节数据
  useEffect(() => {
    if (activeSkill) {
      const fetchChapters = async () => {
        try {
          setLoadingChapters(true)
          const response = await learnPathApi.getChapters(activeSkill)

          if (response.data.success && response.data.data) {
            setChapters((prev) => ({
              ...prev,
              [activeSkill]: response.data.data,
            }))

            // 如果有章节，默认展开第一个
            if (response.data.data.length > 0) {
              setExpandedChapter(response.data.data[0].id)
            }
          } else {
            throw new Error(response.data.errorMsg || "获取章节失败")
          }
        } catch (error) {
          console.error("Failed to fetch chapters:", error)
        } finally {
          setLoadingChapters(false)
        }
      }

      if (!chapters[activeSkill]) {
        fetchChapters()
      }
    }
  }, [activeSkill, chapters])

  // 获取节点数据
  useEffect(() => {
    if (expandedChapter) {
      const fetchNodes = async () => {
        try {
          setLoadingNodes(true)
          const response = await learnPathApi.getNodes(expandedChapter)

          if (response.data.success && response.data.data) {
            const fetchedNodes = response.data.data

            setNodes((prev) => ({
              ...prev,
              [expandedChapter]: fetchedNodes,
            }))

            // 检查章节是否所有节点都已完成，并更新章节状态
            updateChapterStatus(expandedChapter, fetchedNodes)
          } else {
            throw new Error(response.data.errorMsg || "获取学习节点失败")
          }
        } catch (error) {
          console.error("Failed to fetch nodes:", error)
        } finally {
          setLoadingNodes(false)
        }
      }

      if (!nodes[expandedChapter]) {
        fetchNodes()
      }
    }
  }, [expandedChapter, nodes])

  // 更新章节状态
  const updateChapterStatus = (chapterId: number, nodesList: Node[]) => {
    if (!activeSkill) return

    // 检查是否所有节点都已完成
    const allNodesCompleted = nodesList.length > 0 && nodesList.every((node) => node.status === 1)
    const anyNodeCompleted = nodesList.some((node) => node.status === 1)

    // 更新章节状态
    setChapters((prev) => {
      const updatedChapters = { ...prev }
      if (updatedChapters[activeSkill]) {
        updatedChapters[activeSkill] = updatedChapters[activeSkill].map((chapter) => {
          if (chapter.id === chapterId) {
            // 如果所有节点完成，章节状态设为2(已完成)
            // 如果部分节点完成，章节状态设为1(学习中)
            // 如果没有节点完成，章节状态设为0(未学)
            const newStatus = allNodesCompleted ? 2 : anyNodeCompleted ? 1 : 0
            return { ...chapter, status: newStatus }
          }
          return chapter
        })
      }
      return updatedChapters
    })
  }

  // 获取进度数据
  useEffect(() => {
    if (learningPath && learningPath.skills.length > 0) {
      const fetchProgress = async () => {
        try {
          setLoadingProgress(true)
          const skillIds = learningPath.skills.map((skill) => skill.id).join(",")
          const response = await learnPathApi.getCurrentProgress(id as string, skillIds)

          if (response.data.success && response.data.data) {
            setSkillProgress(response.data.data)

            // 更新总体进度
            const overallData = response.data.data.find((item: ProgressItem) => item.name === "整体进度")
            if (overallData) {
              setOverallProgress(overallData.progress)
            }
          }
        } catch (error) {
          console.error("Failed to fetch progress:", error)
        } finally {
          setLoadingProgress(false)
        }
      }

      fetchProgress()
    }
  }, [id, learningPath])

  // 更新节点状态
  const toggleNodeCompletion = async (nodeId: number, currentStatus: number, chapterId: number) => {
    try {
      if (!activeSkill || !id) return

      // 状态切换：0(未学) -> 1(已完成)
      const newStatus = currentStatus === 0 ? 1 : 0

      // 找到节点所属的章节
      let nodeChapterId: number | null = null
      Object.keys(nodes).forEach((chapterId) => {
        const chapterNodes = nodes[Number(chapterId)]
        if (chapterNodes.some((node) => node.id === nodeId)) {
          nodeChapterId = Number(chapterId)
        }
      })

      // 先更新本地状态，实现即时反馈
      setNodes((prev) => {
        const updatedNodes = { ...prev }

        // 找到并更新节点状态
        Object.keys(updatedNodes).forEach((chapterId) => {
          updatedNodes[Number(chapterId)] = updatedNodes[Number(chapterId)].map((node) => {
            if (node.id === nodeId) {
              return { ...node, status: newStatus }
            }
            return node
          })
        })

        return updatedNodes
      })

      // 如果找到章节，更新章节状态
      if (nodeChapterId && nodes[nodeChapterId]) {
        const updatedNodes = nodes[nodeChapterId].map((node) =>
          node.id === nodeId ? { ...node, status: newStatus } : node,
        )
        updateChapterStatus(nodeChapterId, updatedNodes)
      }

      // 显示即时反馈的提示
      uiToast({
        title: newStatus === 1 ? "已标记为完成" : "已标记为未完成",
        description: "正在更新学习进度...",
      })

      // 调用更新API，添加chapterId参数
      await learnPathApi.updateNodeStatus(nodeId.toString(), id as string, activeSkill.toString(), chapterId.toString())

      // 如果是标记为完成，触发烟花效果
      if (newStatus === 1) {
        // 创建烟花效果
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min
        }

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now()

          if (timeLeft <= 0) {
            return clearInterval(interval)
          }

          const particleCount = 50 * (timeLeft / duration)

          // 随机位置发射烟花
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
          })
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
          })
        }, 250)
      }

      // 更新进度数据
      if (learningPath && learningPath.skills.length > 0) {
        const skillIds = learningPath.skills.map((skill) => skill.id).join(",")
        try {
          const progressResponse = await learnPathApi.getCurrentProgress(id as string, skillIds)

          if (progressResponse.data.success && progressResponse.data.data) {
            setSkillProgress(progressResponse.data.data)

            // 更新总体进度
            const overallData = progressResponse.data.data.find((item: ProgressItem) => item.name === "整体进度")
            if (overallData) {
              setOverallProgress(overallData.progress)
            }
          }
        } catch (progressError) {
          console.error("Failed to update progress data:", progressError)
        }
      }

      // 更新成功提示
      uiToast({
        title: newStatus === 1 ? "已标记为完成" : "已标记为未完成",
        description: "学习进度已更新",
      })
    } catch (error) {
      console.error("Failed to update node status:", error)

      // 如果API调用失败，回滚本地状态
      setNodes((prev) => {
        const updatedNodes = { ...prev }

        // 找到并恢复节点状态
        Object.keys(updatedNodes).forEach((chapterId) => {
          updatedNodes[Number(chapterId)] = updatedNodes[Number(chapterId)].map((node) => {
            if (node.id === nodeId) {
              return { ...node, status: currentStatus }
            }
            return node
          })
        })

        return updatedNodes
      })

      // 找到节点所属的章节，恢复章节状态
      let nodeChapterId: number | null = null
      Object.keys(nodes).forEach((chapterId) => {
        const chapterNodes = nodes[Number(chapterId)]
        if (chapterNodes.some((node) => node.id === nodeId)) {
          nodeChapterId = Number(chapterId)
        }
      })

      if (nodeChapterId && nodes[nodeChapterId]) {
        updateChapterStatus(nodeChapterId, nodes[nodeChapterId])
      }

      uiToast({
        title: "更新失败",
        description: "无法更新学习状态，请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 打开笔记对话框
  const openNoteDialog = (node: Node) => {
    setActiveNode(node)
    setNoteContent(node.note || "")
    setIsNoteDialogOpen(true)
  }

  // 保存笔记
  const saveNote = async () => {
    if (!activeNode) return

    try {
      await learnPathApi.writeNodeNote({
        id: activeNode.id,
        note: noteContent,
      })

      // 更新本地状态
      setNodes((prev) => {
        const updatedNodes = { ...prev }

        // 找到并更新节点笔记
        Object.keys(updatedNodes).forEach((chapterId) => {
          updatedNodes[Number(chapterId)] = updatedNodes[Number(chapterId)].map((node) => {
            if (node.id === activeNode.id) {
              return { ...node, note: noteContent }
            }
            return node
          })
        })

        return updatedNodes
      })

      setIsNoteDialogOpen(false)
      uiToast({
        title: "笔记已保存",
        description: "您的学习笔记已成功保存",
      })
    } catch (error) {
      console.error("Failed to save note:", error)
      uiToast({
        title: "保存失败",
        description: "无法保存笔记，请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 获取技能完成进度
  const getSkillProgress = (skillId: number): number => {
    const skillData = skillProgress.find(
      (item) => item.name === learningPath?.skills.find((s) => s.id === skillId)?.stepName,
    )
    return skillData ? skillData.progress : 0
  }

  // 获取重要性对应的颜色
  const getImportanceColor = (importance: string): string => {
    switch (importance) {
      case "核心":
        return "bg-red-500"
      case "重要":
        return "bg-amber-500"
      case "扩展":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
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

  if (!learningPath) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">学习路径不存在</h1>
          <p className="text-muted-foreground mb-6">请返回查看其他学习路径</p>
          <Button onClick={() => router.push("/learning-path")}>返回学习路径列表</Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{learningPath.goalName}</h1>
            <p className="text-muted-foreground mb-4 whitespace-pre-line">{learningPath.whyRecommend}</p>

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <Badge variant="outline" className="px-3 py-1 text-sm flex items-center gap-2 w-fit">
                <BookOpen className="h-4 w-4" />
                {learningPath.jobId ? "职业路径" : "专业路径"}
              </Badge>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">总体进度:</span>
                <Progress value={overallProgress} className="w-40 h-2" />
                <span className="text-sm">{overallProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> 学习技能
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2">
                  <BookMarked className="h-4 w-4" /> 学习资源
                </TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="mt-4">
                <div className="space-y-6">
                  {learningPath.skills.map((skill, index) => (
                    <Card
                      key={skill.id}
                      className={`border-l-4 ${activeSkill === skill.id ? "ring-1 ring-primary" : ""}`}
                      style={{
                        borderLeftColor: getImportanceColor(skill.importance).replace("bg-", "#").replace("-500", ""),
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getImportanceColor(skill.importance)}`}
                              >
                                {index + 1}
                              </div>
                              {skill.stepName}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="font-normal">
                                {skill.importance}
                              </Badge>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {skill.scheduledTime}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{getSkillProgress(skill.id)}%</span>
                              <Progress value={getSkillProgress(skill.id)} className="w-20 h-2" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{skill.status}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">前置知识</h4>
                            <p className="text-sm text-muted-foreground">{skill.preKnowledge}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-1">学习收获</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{skill.completeHarvest}</p>
                          </div>

                          {activeSkill === skill.id ? (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">学习章节</h4>
                              {loadingChapters ? (
                                <div className="space-y-2">
                                  <Skeleton className="h-10 w-full" />
                                  <Skeleton className="h-10 w-full" />
                                  <Skeleton className="h-10 w-full" />
                                </div>
                              ) : chapters[skill.id]?.length > 0 ? (
                                <Accordion
                                  type="single"
                                  collapsible
                                  value={expandedChapter?.toString()}
                                  onValueChange={(value) => setExpandedChapter(value ? Number.parseInt(value) : null)}
                                >
                                  {chapters[skill.id].map((chapter) => (
                                    <AccordionItem key={chapter.id} value={chapter.id.toString()}>
                                      <AccordionTrigger className="hover:bg-secondary/50 px-3 rounded-md">
                                        <div className="flex items-center gap-2">
                                          {chapter.status === 2 ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                          ) : chapter.status === 1 ? (
                                            <div className="h-4 w-4 rounded-full border-2 border-amber-500 flex items-center justify-center">
                                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                            </div>
                                          ) : (
                                            <Circle className="h-4 w-4 text-gray-300" />
                                          )}
                                          <span>{chapter.name}</span>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="pl-6">
                                        <div className="text-sm text-muted-foreground mb-3">{chapter.description}</div>

                                        {loadingNodes && expandedChapter === chapter.id ? (
                                          <div className="space-y-2 pl-4">
                                            <Skeleton className="h-6 w-full" />
                                            <Skeleton className="h-6 w-full" />
                                          </div>
                                        ) : nodes[chapter.id]?.length > 0 ? (
                                          <ul className="space-y-3 pl-4">
                                            {nodes[chapter.id].map((node) => (
                                              <li key={node.id} className="flex items-start gap-3">
                                                <button
                                                  onClick={() => toggleNodeCompletion(node.id, node.status, chapter.id)}
                                                  className="mt-1 focus:outline-none"
                                                  aria-label={node.status === 1 ? "标记为未完成" : "标记为已完成"}
                                                >
                                                  {node.status === 1 ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                  ) : (
                                                    <Circle className="h-5 w-5 text-gray-300" />
                                                  )}
                                                </button>
                                                <div className="flex-1">
                                                  <div className="flex items-start justify-between">
                                                    <h4
                                                      className={`font-medium ${node.status === 1 ? "text-green-600" : ""}`}
                                                    >
                                                      {node.name}
                                                    </h4>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        openNoteDialog(node)
                                                      }}
                                                      className="h-6 w-6 p-0"
                                                    >
                                                      <Pencil className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                  <p className="text-sm text-muted-foreground">{node.description}</p>
                                                  {node.note && (
                                                    <div className="mt-2 p-2 bg-secondary/50 rounded-md text-sm">
                                                      <p className="font-medium text-xs mb-1">我的笔记:</p>
                                                      <p className="text-muted-foreground">{node.note}</p>
                                                    </div>
                                                  )}
                                                </div>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="text-sm text-muted-foreground pl-4">暂无学习节点</p>
                                        )}
                                      </AccordionContent>
                                    </AccordionItem>
                                  ))}
                                </Accordion>
                              ) : (
                                <p className="text-sm text-muted-foreground">暂无学习章节</p>
                              )}
                            </div>
                          ) : (
                            <Button variant="outline" className="w-full mt-2" onClick={() => setActiveSkill(skill.id)}>
                              查看详情
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>学习资源</CardTitle>
                    <CardDescription>每个技能的推荐学习资源</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {learningPath.skills.map((skill) => (
                        <div key={skill.id} className="border rounded-lg p-4">
                          <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getImportanceColor(skill.importance)}`}></div>
                            {skill.stepName}
                          </h3>

                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <FileText className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <h4 className="font-medium text-sm">推荐课程</h4>
                                <p className="text-sm text-muted-foreground">{skill.resourceDTO.course}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <h4 className="font-medium text-sm">推荐书籍</h4>
                                <p className="text-sm text-muted-foreground">{skill.resourceDTO.book}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Globe className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <h4 className="font-medium text-sm">在线资源</h4>
                                <p className="text-sm text-muted-foreground">{skill.resourceDTO.web}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  学习建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{learningPath.adviceAndAttention}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-500" />
                  完成收获
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{learningPath.completeHarvest}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  学习进度可视化
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 总体进度环形图 */}
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* 背景圆环 */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                        {/* 进度圆环 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="10"
                          strokeDasharray={`${(2 * Math.PI * 45 * overallProgress) / 100} ${(2 * Math.PI * 45 * (100 - overallProgress)) / 100}`}
                          strokeDashoffset={2 * Math.PI * 45 * 0.25}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{overallProgress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* 技能进度条 */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">技能进度</h4>
                    {loadingProgress ? (
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ) : (
                      skillProgress
                        .filter((item) => item.name !== "整体进度")
                        .map((item, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{item.name}</span>
                              <span>{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-2" />
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </CardContent>
              {/* <CardFooter>
                <Button className="w-full">导出学习报告</Button>
              </CardFooter> */}
            </Card>
          </div>
        </div>
      </main>

      {/* 笔记对话框 */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeNode?.name} - 添加笔记</DialogTitle>
            <DialogDescription>记录您对这个学习节点的理解、问题或想法</DialogDescription>
          </DialogHeader>
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="在这里输入您的笔记..."
            className="min-h-[150px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveNote}>保存笔记</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
