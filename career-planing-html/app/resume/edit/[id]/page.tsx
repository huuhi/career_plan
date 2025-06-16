"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { resumeApi } from "@/services/api"
// Import toast from sonner instead of using useToast hook
import { toast } from "sonner"
// Remove the useToast import and usage
// const { toast } = useToast()
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, TrashIcon, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditResumePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const params = useParams()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingResume, setLoadingResume] = useState(true)
  const [resumeData, setResumeData] = useState({
    resumeId: "",
    resumeName: "",
    basics: {
      name: "",
      label: "",
      image: "",
      email: "",
      phone: "",
      url: "",
      summary: "",
      location: {
        address: "",
        postalCode: "",
        city: "",
        countryCode: "",
        region: "",
      },
      profiles: [
        {
          network: "",
          username: "",
          url: "",
        },
      ],
    },
    work: [
      {
        name: "",
        position: "",
        startDate: "",
        endDate: "",
        summary: "",
        highlights: [""],
      },
    ],
    education: [
      {
        institution: "",
        area: "",
        studyType: "",
        startDate: "",
        endDate: "",
        score: "",
        courses: [""],
      },
    ],
    skills: [
      {
        name: "",
        level: "",
        keywords: [""],
      },
    ],
    languages: [
      {
        language: "",
        fluency: "",
      },
    ],
    projects: [
      {
        name: "",
        startDate: "",
        endDate: "",
        description: "",
        highlights: [""],
      },
    ],
    awards: [
      {
        title: "",
        date: "",
        awarder: "",
        summary: "",
      },
    ],
    certificates: [
      {
        name: "",
        date: "",
        issuer: "",
        url: "",
      },
    ],
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated && params.id) {
      fetchResume()
    }
  }, [isAuthenticated, loading, params.id, router])

  // Fix the fetchResume function to use sonner toast
  const fetchResume = async () => {
    try {
      setLoadingResume(true)
      const response = await resumeApi.get(params.id as string)

      if (response.data.success && response.data.data) {
        const { id, resumeName, resumeData: fetchedResumeData } = response.data.data

        setResumeData({
          resumeId: id,
          resumeName,
          ...fetchedResumeData,
        })
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

  const handleBasicsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setResumeData({
        ...resumeData,
        basics: {
          ...resumeData.basics,
          [parent]: {
            ...resumeData.basics[parent as keyof typeof resumeData.basics],
            [child]: value,
          },
        },
      })
    } else {
      setResumeData({
        ...resumeData,
        basics: {
          ...resumeData.basics,
          [name]: value,
        },
      })
    }
  }

  const handleArrayChange = (section: string, index: number, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      [section]: resumeData[section as keyof typeof resumeData].map((item: any, i: number) => {
        if (i === index) {
          return {
            ...item,
            [field]: value,
          }
        }
        return item
      }),
    })
  }

  const handleArrayItemChange = (section: string, index: number, field: string, itemIndex: number, value: string) => {
    setResumeData({
      ...resumeData,
      [section]: resumeData[section as keyof typeof resumeData].map((item: any, i: number) => {
        if (i === index) {
          const updatedField = [...item[field]]
          updatedField[itemIndex] = value
          return {
            ...item,
            [field]: updatedField,
          }
        }
        return item
      }),
    })
  }

  const addArrayItem = (section: string) => {
    const sectionData = resumeData[section as keyof typeof resumeData] as any[]
    const newItem = { ...sectionData[0] }

    // Reset all values to empty strings
    Object.keys(newItem).forEach((key) => {
      if (Array.isArray(newItem[key])) {
        newItem[key] = newItem[key].map(() => "")
      } else {
        newItem[key] = ""
      }
    })

    setResumeData({
      ...resumeData,
      [section]: [...sectionData, newItem],
    })
  }

  const removeArrayItem = (section: string, index: number) => {
    const sectionData = resumeData[section as keyof typeof resumeData] as any[]
    if (sectionData.length <= 1) return

    setResumeData({
      ...resumeData,
      [section]: sectionData.filter((_, i) => i !== index),
    })
  }

  const addArraySubItem = (section: string, index: number, field: string) => {
    setResumeData({
      ...resumeData,
      [section]: resumeData[section as keyof typeof resumeData].map((item: any, i: number) => {
        if (i === index) {
          return {
            ...item,
            [field]: [...item[field], ""],
          }
        }
        return item
      }),
    })
  }

  const removeArraySubItem = (section: string, index: number, field: string, itemIndex: number) => {
    setResumeData({
      ...resumeData,
      [section]: resumeData[section as keyof typeof resumeData].map((item: any, i: number) => {
        if (i === index && item[field].length > 1) {
          return {
            ...item,
            [field]: item[field].filter((_: any, j: number) => j !== itemIndex),
          }
        }
        return item
      }),
    })
  }

  // Fix the handleSubmit function to properly structure the data and fix toast notifications
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Validate required fields
      if (!resumeData.resumeName) {
        toast.error("请填写简历名称", {
          description: "简历名称不能为空",
        })
        return
      }

      if (!resumeData.basics.name) {
        toast.error("请填写姓名", {
          description: "姓名不能为空",
        })
        return
      }

      // Add validation for work experience
      if (!resumeData.work[0].name || !resumeData.work[0].position) {
        toast.error("请填写工作经历", {
          description: "公司名称和职位为必填项",
        })
        return
      }

      // Add validation for education
      if (!resumeData.education[0].institution || !resumeData.education[0].area) {
        toast.error("请填写教育经历", {
          description: "学校名称和专业为必填项",
        })
        return
      }

      // Prepare data for update with the correct structure
      const updateData = {
        resumeId: resumeData.resumeId,
        resumeName: resumeData.resumeName,
        resumeData: {
          basics: resumeData.basics,
          work: resumeData.work,
          education: resumeData.education,
          skills: resumeData.skills,
          languages: resumeData.languages,
          projects: resumeData.projects,
          awards: resumeData.awards,
          certificates: resumeData.certificates,
        },
      }

      const response = await resumeApi.update(updateData)

      if (response.data.success) {
        toast.success("简历更新成功", {
          description: "您的简历已成功更新",
        })
        router.push("/resume")
      } else {
        throw new Error(response.data.errorMsg || "更新失败")
      }
    } catch (error: any) {
      toast.error("更新失败", {
        description: error.message || "请稍后重试",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || loadingResume) {
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
          <Button variant="ghost" onClick={() => router.push("/resume")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回简历管理
          </Button>
          <h1 className="text-3xl font-bold mb-2">编辑简历</h1>
          <p className="text-muted-foreground">更新您的简历信息</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>简历信息</CardTitle>
            <CardDescription>编辑您的个人信息和工作经历</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resumeName">简历名称</Label>
                <Input
                  id="resumeName"
                  value={resumeData.resumeName}
                  onChange={(e) => setResumeData({ ...resumeData, resumeName: e.target.value })}
                  placeholder="例如：软件工程师简历"
                  required
                />
              </div>

              <Tabs defaultValue="basics">
                <TabsList className="grid grid-cols-4 md:grid-cols-8">
                  <TabsTrigger value="basics">基本信息</TabsTrigger>
                  <TabsTrigger value="work">工作经历</TabsTrigger>
                  <TabsTrigger value="education">教育经历</TabsTrigger>
                  <TabsTrigger value="skills">技能</TabsTrigger>
                  <TabsTrigger value="languages">语言</TabsTrigger>
                  <TabsTrigger value="projects">项目经历</TabsTrigger>
                  <TabsTrigger value="awards">获奖情况</TabsTrigger>
                  <TabsTrigger value="certificates">证书</TabsTrigger>
                </TabsList>

                <TabsContent value="basics" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        姓名 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={resumeData.basics.name}
                        onChange={handleBasicsChange}
                        placeholder="例如：张三"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="label">
                        职位 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="label"
                        name="label"
                        value={resumeData.basics.label}
                        onChange={handleBasicsChange}
                        placeholder="例如：高级软件工程师"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        邮箱 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={resumeData.basics.email}
                        onChange={handleBasicsChange}
                        placeholder="例如：example@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        电话 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={resumeData.basics.phone}
                        onChange={handleBasicsChange}
                        placeholder="例如：+86 138 1234 5678"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="summary">
                        个人简介 <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        value={resumeData.basics.summary}
                        onChange={handleBasicsChange}
                        placeholder="简要介绍您的专业背景和技能"
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>地址信息</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="address">详细地址</Label>
                        <Input
                          id="address"
                          name="location.address"
                          value={resumeData.basics.location.address}
                          onChange={handleBasicsChange}
                          placeholder="例如：北京市海淀区中关村"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">城市</Label>
                        <Input
                          id="city"
                          name="location.city"
                          value={resumeData.basics.location.city}
                          onChange={handleBasicsChange}
                          placeholder="例如：北京"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="work" className="space-y-6 mt-4">
                  {resumeData.work.map((item, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">工作经历 #{index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("work", index)}
                          disabled={resumeData.work.length <= 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>
                              公司名称 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={item.name}
                              onChange={(e) => handleArrayChange("work", index, "name", e.target.value)}
                              placeholder="例如：字节跳动"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>
                              职位 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={item.position}
                              onChange={(e) => handleArrayChange("work", index, "position", e.target.value)}
                              placeholder="例如：高级软件工程师"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>
                              开始日期 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="date"
                              value={item.startDate}
                              onChange={(e) => handleArrayChange("work", index, "startDate", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>结束日期</Label>
                            <Input
                              type="date"
                              value={item.endDate}
                              onChange={(e) => handleArrayChange("work", index, "endDate", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>
                              工作描述 <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              value={item.summary}
                              onChange={(e) => handleArrayChange("work", index, "summary", e.target.value)}
                              placeholder="简要描述您的工作职责"
                              rows={3}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>工作亮点</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addArraySubItem("work", index, "highlights")}
                              className="h-8 px-2"
                            >
                              <PlusIcon className="h-4 w-4 mr-1" />
                              添加
                            </Button>
                          </div>

                          {item.highlights.map((highlight, hIndex) => (
                            <div key={hIndex} className="flex gap-2">
                              <Input
                                value={highlight}
                                onChange={(e) =>
                                  handleArrayItemChange("work", index, "highlights", hIndex, e.target.value)
                                }
                                placeholder="例如：领导团队开发了高并发的视频推荐系统"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeArraySubItem("work", index, "highlights", hIndex)}
                                disabled={item.highlights.length <= 1}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button variant="outline" onClick={() => addArrayItem("work")} className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    添加工作经历
                  </Button>
                </TabsContent>

                <TabsContent value="education" className="space-y-6 mt-4">
                  {resumeData.education.map((item, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">教育经历 #{index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("education", index)}
                          disabled={resumeData.education.length <= 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>
                              学校名称 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={item.institution}
                              onChange={(e) => handleArrayChange("education", index, "institution", e.target.value)}
                              placeholder="例如：清华大学"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>
                              专业 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={item.area}
                              onChange={(e) => handleArrayChange("education", index, "area", e.target.value)}
                              placeholder="例如：计算机科学与技术"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>
                              学位类型 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={item.studyType}
                              onChange={(e) => handleArrayChange("education", index, "studyType", e.target.value)}
                              placeholder="例如：工学学士"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>成绩</Label>
                            <Input
                              value={item.score}
                              onChange={(e) => handleArrayChange("education", index, "score", e.target.value)}
                              placeholder="例如：GPA 3.8/4.0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>
                              开始日期 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="date"
                              value={item.startDate}
                              onChange={(e) => handleArrayChange("education", index, "startDate", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>结束日期</Label>
                            <Input
                              type="date"
                              value={item.endDate}
                              onChange={(e) => handleArrayChange("education", index, "endDate", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>主修课程</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addArraySubItem("education", index, "courses")}
                              className="h-8 px-2"
                            >
                              <PlusIcon className="h-4 w-4 mr-1" />
                              添加
                            </Button>
                          </div>

                          {item.courses.map((course, cIndex) => (
                            <div key={cIndex} className="flex gap-2">
                              <Input
                                value={course}
                                onChange={(e) =>
                                  handleArrayItemChange("education", index, "courses", cIndex, e.target.value)
                                }
                                placeholder="例如：数据结构与算法"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeArraySubItem("education", index, "courses", cIndex)}
                                disabled={item.courses.length <= 1}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button variant="outline" onClick={() => addArrayItem("education")} className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    添加教育经历
                  </Button>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6 mt-4">
                  {resumeData.skills.map((skill, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">技能 #{index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("skills", index)}
                          disabled={resumeData.skills.length <= 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>熟练掌握的语言</Label>
                            <Input
                              value={skill.name}
                              onChange={(e) => handleArrayChange("skills", index, "name", e.target.value)}
                              placeholder="例如JavaScript"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>掌握等级</Label>
                            <Input
                              value={skill.level}
                              onChange={(e) => handleArrayChange("skills", index, "level", e.target.value)}
                              placeholder="例如专家"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>掌握的知识</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addArraySubItem("skills", index, "keywords")}
                              className="h-8 px-2"
                            >
                              <PlusIcon className="h-4 w-4 mr-1" />
                              添加
                            </Button>
                          </div>

                          {skill.keywords.map((keyword, kIndex) => (
                            <div key={kIndex} className="flex gap-2">
                              <Input
                                value={keyword}
                                onChange={(e) =>
                                  handleArrayItemChange("skills", index, "keywords", kIndex, e.target.value)
                                }
                                placeholder="例如Node.js"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeArraySubItem("skills", index, "keywords", kIndex)}
                                disabled={skill.keywords.length <= 1}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button variant="outline" onClick={() => addArrayItem("skills")} className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    添加技能
                  </Button>
                </TabsContent>

                <TabsContent value="languages" className="space-y-6 mt-4">
                  {resumeData.languages.map((lang, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">语言 #{index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("languages", index)}
                          disabled={resumeData.languages.length <= 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>掌握的语言</Label>
                            <Input
                              value={lang.language}
                              onChange={(e) => handleArrayChange("languages", index, "language", e.target.value)}
                              placeholder="例如中文"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>掌握程度</Label>
                            <Input
                              value={lang.fluency}
                              onChange={(e) => handleArrayChange("languages", index, "fluency", e.target.value)}
                              placeholder="例如流利"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button variant="outline" onClick={() => addArrayItem("languages")} className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    添加语言
                  </Button>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6 mt-4">
                  {resumeData.projects.map((project, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">项目经历 #{index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("projects", index)}
                          disabled={resumeData.projects.length <= 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2 md:col-span-2">
                            <Label>项目名称</Label>
                            <Input
                              value={project.name}
                              onChange={(e) => handleArrayChange("projects", index, "name", e.target.value)}
                              placeholder="例如xxx管理系统"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>项目开始时间</Label>
                            <Input
                              type="date"
                              value={project.startDate}
                              onChange={(e) => handleArrayChange("projects", index, "startDate", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>项目结束时间</Label>
                            <Input
                              type="date"
                              value={project.endDate}
                              onChange={(e) => handleArrayChange("projects", index, "endDate", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>项目技术</Label>
                            <Textarea
                              value={project.description}
                              onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)}
                              placeholder="请输入项目运用技术"
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>项目成就</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addArraySubItem("projects", index, "highlights")}
                              className="h-8 px-2"
                            >
                              <PlusIcon className="h-4 w-4 mr-1" />
                              添加
                            </Button>
                          </div>

                          {project.highlights.map((highlight, hIndex) => (
                            <div key={hIndex} className="flex gap-2">
                              <Input
                                value={highlight}
                                onChange={(e) =>
                                  handleArrayItemChange("projects", index, "highlights", hIndex, e.target.value)
                                }
                                placeholder="请输入项目成就"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeArraySubItem("projects", index, "highlights", hIndex)}
                                disabled={project.highlights.length <= 1}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button variant="outline" onClick={() => addArrayItem("projects")} className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    添加项目经历
                  </Button>
                </TabsContent>

                <TabsContent value="awards" className="space-y-6 mt-4">
                  {resumeData.awards.map((award, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">获奖情况 #{index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("awards", index)}
                          disabled={resumeData.awards.length <= 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2 md:col-span-2">
                            <Label>获奖名称</Label>
                            <Input
                              value={award.title}
                              onChange={(e) => handleArrayChange("awards", index, "title", e.target.value)}
                              placeholder="请输入获奖名称"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>获奖时间</Label>
                            <Input
                              type="date"
                              value={award.date}
                              onChange={(e) => handleArrayChange("awards", index, "date", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>颁证单位</Label>
                            <Input
                              value={award.awarder}
                              onChange={(e) => handleArrayChange("awards", index, "awarder", e.target.value)}
                              placeholder="请输入颁证机构名称"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button variant="outline" onClick={() => addArrayItem("awards")} className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    添加获奖情况
                  </Button>
                </TabsContent>

                <TabsContent value="certificates" className="space-y-6 mt-4">
                  {resumeData.certificates.map((certificate, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">证书 #{index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem("certificates", index)}
                          disabled={resumeData.certificates.length <= 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2 md:col-span-2">
                            <Label>证书名称</Label>
                            <Input
                              value={certificate.name}
                              onChange={(e) => handleArrayChange("certificates", index, "name", e.target.value)}
                              placeholder="请输入证书名称"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>颁发时间</Label>
                            <Input
                              type="date"
                              value={certificate.date}
                              onChange={(e) => handleArrayChange("certificates", index, "date", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>颁发机构</Label>
                            <Input
                              value={certificate.issuer}
                              onChange={(e) => handleArrayChange("certificates", index, "issuer", e.target.value)}
                              placeholder="请输入颁证机构名称"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>证书链接</Label>
                            <Input
                              value={certificate.url}
                              onChange={(e) => handleArrayChange("certificates", index, "url", e.target.value)}
                              placeholder="请输入证书链接"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button variant="outline" onClick={() => addArrayItem("certificates")} className="w-full">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    添加证书
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/resume")}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存简历"}
          </Button>
        </div>
      </main>
    </div>
  )
}
