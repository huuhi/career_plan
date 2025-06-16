"use client"

import React, { useRef } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  UserIcon,
  KeyIcon,
  BookOpenIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  FileTextIcon,
  AlertTriangleIcon,
  EditIcon,
} from "lucide-react"
import { resumeApi, learnPathApi, analysisApi, userApi } from "@/services/api"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { isAuthenticated, loading, user, setIsAuthenticated } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    username: "",
    summary: "",
    avatar: "",
    phone: "",
    createAt:""
  

  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [activeProfileSection, setActiveProfileSection] = useState("profile")
  const [resumes, setResumes] = useState<any[]>([])
  const [learningPaths, setLearningPaths] = useState<any[]>([])
  const [jobAnalyses, setJobAnalyses] = useState<any[]>([])
  const [majorAnalyses, setMajorAnalyses] = useState<any[]>([])
  const [loadingResumes, setLoadingResumes] = useState(false)
  const [loadingPaths, setLoadingPaths] = useState(false)
  const [loadingAnalyses, setLoadingAnalyses] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null)
  const [loadingUserData, setLoadingUserData] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (user) {
      // 获取用户详细信息
      fetchUserData()

      // 获取用户简历
      fetchResumes()

      // 获取学习路径
      fetchLearningPaths()

      // 获取职业和专业分析
      fetchAnalyses()
    }
  }, [isAuthenticated, loading, router, user])

  const fetchUserData = async () => {
    try {
      setLoadingUserData(true)
      const response = await userApi.getUserData()
      if (response.data.success) {
        const userData = response.data.data
        setProfileData({
          username: userData.username || "",
          summary: userData.summary || "",
          avatar: userData.avatar || "",
          phone: userData.phone || "",
          createAt: userData.createAt || "",
        })
      }
    } catch (error: any) {
      console.error("获取用户数据失败:", error)
      // 如果获取失败，使用JWT中的基本信息
      if (user) {
        setProfileData({
          username: user.username || "",
          summary: user.summary || "",
          avatar: user.userImage || "",
          phone: "",
          createAt: "未知",
        })
      }
    } finally {
      setLoadingUserData(false)
    }
  }

  // 监听密码修改成功状态
  useEffect(() => {
    if (passwordChangeSuccess) {
      // 清除用户登录信息并更新认证状态
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsAuthenticated(false)

      // 延迟一下再跳转，让用户看到成功提示
      setTimeout(() => {
        router.push("/login")
      }, 500)
    }
  }, [passwordChangeSuccess, router, setIsAuthenticated])

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true)
      const response = await resumeApi.get()
      if (response.data.success) {
        setResumes(response.data.data || [])
      }
    } catch (error:any) {
      console.error("获取简历失败:", error)
      toast.error("获取简历失败:", {
        description: error,
      })
    } finally {
      setLoadingResumes(false)
    }
  }

  const fetchLearningPaths = async () => {
    try {
      setLoadingPaths(true)
      const response = await learnPathApi.getAllPaths()
      if (response.data.success) {
        setLearningPaths(response.data.data || [])
      }
    } catch (error:any) {
      console.error("获取学习路径失败:", error)
      toast.error("获取学习路径失败:", {
        description: error,
      })
    } finally {
      setLoadingPaths(false)
    }
  }

  const fetchAnalyses = async () => {
    try {
      setLoadingAnalyses(true)

      // 获取职业分析
      const jobResponse = await analysisApi.getJobAnalysis()
      if (jobResponse.data.success) {
        setJobAnalyses(jobResponse.data.data || [])
      }

      // 获取专业分析
      const majorResponse = await analysisApi.getMajorAnalysis()
      if (majorResponse.data.success) {
        setMajorAnalyses(majorResponse.data.data || [])
      }
    } catch (error:any) {
      console.error("获取分析记录出错:", error)
      toast.error("获取分析记录失败:", {
        description: error,
      })
    } finally {
      setLoadingAnalyses(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // 清除对应字段的错误
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const validatePasswordForm = () => {
    let isValid = true
    const errors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }

    if (!passwordData.oldPassword) {
      errors.oldPassword = "请输入当前密码"
      isValid = false
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "请输入新密码"
      isValid = false
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "新密码长度不能少于6位"
      isValid = false
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "请确认新密码"
      isValid = false
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "两次输入的密码不一致"
      isValid = false
    }

    setPasswordErrors(errors)
    return isValid
  }

  const handleSaveProfile = async () => {
    // 这个方法不再直接使用，改为使用ProfileCard中的handleSaveProfileWithRefs
    console.log("此方法已弃用，请使用handleSaveProfileWithRefs");
  }

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return
    }
    try {
      setChangingPassword(true)
      const response = await userApi.updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })

      const { success, errorMsg } = response.data;
      if (success) {
        toast.error("密码修改成功，请使用新密码重新登录")
        setPasswordChangeSuccess(true)
      } else {
        toast.error("密码修改失败",{
          description: response.data.errorMsg || "请稍后重试",
        })
      }
    } catch (error: any) {
      // 获取服务器返回的错误信息
      const errorResponse = error.response?.data;
      toast.error("",{
        description: error.message || errorResponse?.errorMsg || "网络请求失败，请稍后重试"
      })
    } finally {
      setChangingPassword(false)
    }
  }

  const setDefaultResume = async (id: string) => {
    try {
      const response = await resumeApi.setDefault(id)
      if (response.data.success) {
        toast.error("默认简历已设置，您的默认简历已成功更新")
        fetchResumes() // 刷新简历列表
      }
    } catch (error) {
      toast.error("无法设置默认简历，请稍后重试")
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
        toast.error("简历已成功删除")
        // 重新获取简历列表
        fetchResumes()
      } else {
        throw new Error(response.data.errorMsg || "删除失败")
      }
    } catch (error: any) {
      toast.error("删除失败，请稍后重试")
    } finally {
      setDeleteDialogOpen(false)
      setResumeToDelete(null)
    }
  }

  // 修改个人资料卡片视图
  const ProfileCard = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const summaryRef = useRef<HTMLTextAreaElement>(null);

    // 格式化注册时间，如果不存在则返回"未知"
    const getFormattedRegisterTime = () => {
      try {
        return "2023年06月12日"; // 由于后端未提供注册时间，暂时使用固定值
      } catch (error) {
        return "未知";
      }
    };

    const handleSaveProfileWithRefs = async () => {
      if (!usernameRef.current || !summaryRef.current) return;
      
      const username = usernameRef.current.value;
      const summary = summaryRef.current.value;
      
      // 验证输入
      if (username.length > 16) {
        toast.error("用户名不能超过16个字符");
        return;
      }
      
      if (summary.length > 200) {
        toast.error("个人简介不能超过200个字符");
        return;
      }
      
      setIsSaving(true);
      try {
        const response = await userApi.updateSummary({
          summary: summary,
          id: Number(user?.userId) || 0,
        });
        
        if (response.data.success) {
          // 先关闭弹窗再更新数据，避免闪烁
          setIsEditDialogOpen(false);
          
          // 延迟更新数据，防止闪烁
          setTimeout(() => {
            toast.success("个人资料已更新");
            
            // 更新本地显示数据
            setProfileData(prev => ({
              ...prev,
              username: username,
              summary: summary,
            }));
            
            // 更新本地存储的用户信息
            const userStr = localStorage.getItem("user");
            if (userStr) {
              const userData = JSON.parse(userStr);
              userData.summary = summary;
              localStorage.setItem("user", JSON.stringify(userData));
            }
          }, 100);
        } else {
          toast.error("更新失败", {
            description: response.data.errorMsg || "请稍后重试"
          });
        }
      } catch (error: any) {
        const errorResponse = error.response?.data;
        toast.error("更新失败", {
          description: error.message || errorResponse?.errorMsg || "网络请求失败，请稍后重试"
        });
      } finally {
        setIsSaving(false);
      }
    };

    return (
    <Card className="md:col-span-3">
      <CardHeader className="border-b bg-muted/40">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>个人资料</CardTitle>
            <CardDescription>您的个人信息</CardDescription>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            // 当对话框打开时，初始化编辑表单数据
            if (open && usernameRef.current && summaryRef.current) {
              usernameRef.current.value = profileData.username;
              summaryRef.current.value = profileData.summary;
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <EditIcon className="h-4 w-4 mr-2" />
                编辑资料
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>编辑个人资料</DialogTitle>
                <DialogDescription>更新您的个人信息</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">用户名 <span className="text-xs text-muted-foreground">(最多16个字符)</span></Label>
                  <Input
                    id="edit-username"
                    name="username"
                    ref={usernameRef}
                    defaultValue={profileData.username}
                    maxLength={16}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="edit-summary">个人简介</Label>
                    <span className="text-xs text-muted-foreground" id="summary-counter">
                      {summaryRef?.current?.value?.length || 0}/200
                    </span>
                  </div>
                  <Textarea
                    id="edit-summary"
                    name="summary"
                    ref={summaryRef}
                    defaultValue={profileData.summary}
                    placeholder="请简短介绍自己，让其他用户更好地了解你"
                    className="resize-none"
                    rows={4}
                    maxLength={200}
                    onChange={() => {
                      const counter = document.getElementById("summary-counter");
                      if (counter && summaryRef.current) {
                        counter.textContent = `${summaryRef.current.value.length}/200`;
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    简短介绍自己，让其他用户更好地了解你
                  </p>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">取消</Button>
                </DialogClose>
                <Button onClick={handleSaveProfileWithRefs} disabled={isSaving}>
                  {isSaving ? "保存中..." : "保存更改"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-40 flex flex-col items-center">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                {profileData.avatar ? (
                  <AvatarImage src={profileData.avatar} alt={profileData.username} />
                ) : user?.userImage ? (
                  <AvatarImage src={user.userImage} alt={user.username} />
                ) : (
                  <AvatarFallback className="bg-primary/10">
                    <UserIcon className="h-14 w-14 text-primary" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed">
                <p className="text-white text-xs text-center px-2">暂不支持头像上传</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">{profileData.username || "未设置用户名"}</h3>
              <p className="text-sm text-muted-foreground mt-1">{profileData.phone || "未设置联系方式"}</p>
            </div>
          </div>
          <div className="flex-1 mt-6 md:mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-primary" />
                  个人简介
                </h3>
                <div className="mt-3 p-4 rounded-lg bg-muted/50 border min-h-[120px]">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {profileData.summary || "暂无个人简介，点击\"编辑资料\"添加简介"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">注册时间</h4>
                  <p>{profileData.createAt}</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">账户状态</h4>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span>正常</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    );
  };

  if (loading || loadingUserData) {
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
          <h1 className="text-3xl font-bold mb-2">个人中心</h1>
          <p className="text-muted-foreground">管理您的账户信息、简历、学习路径和测评记录</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>个人资料</span>
            </TabsTrigger>
            <TabsTrigger value="resumes" className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              <span>我的简历</span>
            </TabsTrigger>
            <TabsTrigger value="paths" className="flex items-center gap-2">
              <BookOpenIcon className="h-4 w-4" />
              <span>学习路径</span>
            </TabsTrigger>
            <TabsTrigger value="analyses" className="flex items-center gap-2">
              <GraduationCapIcon className="h-4 w-4" />
              <span>测评记录</span>
            </TabsTrigger>
          </TabsList>

          {/* 个人资料 */}
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div
                      className={`flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer ${
                        activeProfileSection === "profile"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary transition-colors"
                      }`}
                      onClick={() => setActiveProfileSection("profile")}
                    >
                      <UserIcon className="h-4 w-4" />
                      <span className={activeProfileSection === "profile" ? "font-medium" : ""}>个人资料</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer ${
                        activeProfileSection === "security"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary transition-colors"
                      }`}
                      onClick={() => setActiveProfileSection("security")}
                    >
                      <KeyIcon className="h-4 w-4" />
                      <span className={activeProfileSection === "security" ? "font-medium" : ""}>账户安全</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {activeProfileSection === "profile" ? (
                <ProfileCard />
              ) : (
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>账户安全</CardTitle>
                    <CardDescription>修改您的账户密码</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="oldPassword">当前密码</Label>
                          <Input
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            placeholder="请输入当前密码"
                          />
                          {passwordErrors.oldPassword && (
                            <p className="text-sm text-destructive mt-1">{passwordErrors.oldPassword}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">新密码</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="请输入新密码"
                          />
                          {passwordErrors.newPassword && (
                            <p className="text-sm text-destructive mt-1">{passwordErrors.newPassword}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">确认新密码</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="请再次输入新密码"
                          />
                          {passwordErrors.confirmPassword && (
                            <p className="text-sm text-destructive mt-1">{passwordErrors.confirmPassword}</p>
                          )}
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-amber-800">密码安全提示</h4>
                              <p className="text-xs text-amber-700 mt-1">
                                为了保障您的账户安全，建议使用包含大小写字母、数字和特殊符号的强密码，且不要与其他网站使用相同的密码。
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPasswordData({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                        setPasswordErrors({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }}
                    >
                      取消
                    </Button>
                    <Button onClick={handleChangePassword} disabled={changingPassword}>
                      {changingPassword ? "修改中..." : "修改密码"}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* 我的简历 */}
          <TabsContent value="resumes">
            <Card>
              <CardHeader>
                <CardTitle>我的简历</CardTitle>
                <CardDescription>管理您的所有简历</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingResumes ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : resumes.length > 0 ? (
                  <div className="space-y-4">
                    {resumes.map((resume) => (
                      <div key={resume.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium flex items-center">
                            {resume.resumeName}
                            {resume.isDefault && (
                              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                默认简历
                              </span>
                            )}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          {!resume.isDefault && (
                            <Button size="sm" variant="outline" onClick={() => setDefaultResume(resume.id)}>
                              设为默认
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => router.push(`/resume/edit/${resume.id}`)}>
                            编辑
                          </Button>
                          <Button size="sm" onClick={() => router.push(`/resume/${resume.id}`)}>
                            查看
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteResume(resume.id)}>
                            删除
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">暂无简历</h3>
                    <p className="text-muted-foreground mb-4">创建一份专业简历，展示您的技能和经验</p>
                    <Button onClick={() => router.push("/resume/new/create")}>创建简历</Button>
                  </div>
                )}
              </CardContent>
              {resumes.length > 0 && (
                <CardFooter>
                  <Button onClick={() => router.push("/resume/new/create")}>创建新简历</Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          {/* 学习路径 */}
          <TabsContent value="paths">
            <Card>
              <CardHeader>
                <CardTitle>我的学习路径</CardTitle>
                <CardDescription>查看和管理您的个性化学习计划</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPaths ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : learningPaths.length > 0 ? (
                  <div className="space-y-6">
                    {learningPaths.map((path) => (
                      <div key={path.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-secondary/30 p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-lg">{path.goalName}</h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                path.isActive === 1 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {path.isActive === 1 ? "已完成" : "进行中"}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-muted-foreground mb-4">{path.whyRecommend}</p>
                          <Button onClick={() => router.push(`/learning-path/${path.id}`)}>查看详情</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpenIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">暂无学习路径</h3>
                    <p className="text-muted-foreground mb-4">完成职业或专业测评后，系统将为您生成个性化学习路径</p>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline" onClick={() => router.push("/career-test")}>
                        职业测评
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/major-test")}>
                        专业测评
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 测评记录 */}
          <TabsContent value="analyses">
            <Card>
              <CardHeader>
                <CardTitle>测评记录</CardTitle>
                <CardDescription>查看您的职业和专业测评历史</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAnalyses ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : (
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
                      {jobAnalyses.length > 0 ? (
                        <div className="space-y-6">
                          {jobAnalyses.map((analysis, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <h3 className="font-medium mb-2">职业测评结果 #{index + 1}</h3>
                              <p className="text-sm text-muted-foreground mb-4">{analysis.description}</p>
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
                                {analysis.dataList &&
                                  analysis.dataList.slice(0, 3).map((job: any, jobIndex: number) => (
                                    <div key={jobIndex} className="border rounded-lg p-3">
                                      <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-medium text-sm">{job.title}</h4>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                          {job.matchScore}
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{job.description}</p>
                                    </div>
                                  ))}
                              </div>
                              <Button size="sm" onClick={() => router.push(`/career-test/result/${analysis.id}`)}>
                                查看完整结果
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BriefcaseIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">暂无职业测评记录</h3>
                          <p className="text-muted-foreground mb-4">完成职业测评后，您可以在这里查看所有历史记录</p>
                          <Button onClick={() => router.push("/career-test")}>开始职业测评</Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="major">
                      {majorAnalyses.length > 0 ? (
                        <div className="space-y-6">
                          {majorAnalyses.map((analysis, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <h3 className="font-medium mb-2">专业测评结果 #{index + 1}</h3>
                              <p className="text-sm text-muted-foreground mb-4">{analysis.description}</p>
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
                                {analysis.dataList &&
                                  analysis.dataList.slice(0, 3).map((major: any, majorIndex: number) => (
                                    <div key={majorIndex} className="border rounded-lg p-3">
                                      <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-medium text-sm">{major.title}</h4>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                          {major.matchScore}
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{major.description}</p>
                                    </div>
                                  ))}
                              </div>
                              <Button size="sm" onClick={() => router.push(`/major-test/result/${analysis.id}`)}>
                                查看完整结果
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <GraduationCapIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">暂无专业测评记录</h3>
                          <p className="text-muted-foreground mb-4">完成专业测评后，您可以在这里查看所有历史记录</p>
                          <Button onClick={() => router.push("/major-test")}>开始专业测评</Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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