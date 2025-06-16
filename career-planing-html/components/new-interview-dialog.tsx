import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BriefcaseIcon, FileTextIcon, Search, ChevronRight } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { resumeApi, jobApi, interviewApi } from "@/services/api"
import { parseInterviewStreamData } from "@/lib/utils"

interface Resume {
  id: number
  resumeName: string
}

interface NewInterviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (memoryId: number) => void
}

export function NewInterviewDialog({ open, onOpenChange, onSuccess }: NewInterviewDialogProps) {
  const router = useRouter()
  
  const [resumes, setResumes] = useState<Resume[]>([])
  const [jobNames, setJobNames] = useState<string[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [selectedJobName, setSelectedJobName] = useState<string>("")
  const [customJobName, setCustomJobName] = useState<string>("")
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [startingInterview, setStartingInterview] = useState(false)
  const [jobSearchTerm, setJobSearchTerm] = useState("")

  // 加载数据
  useEffect(() => {
    if (open) {
      fetchResumes()
      fetchJobNames()
    }
  }, [open])

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true)
      const response = await resumeApi.get()

      if (response.data.success && response.data.data) {
        setResumes(response.data.data)
        
        // 如果有默认简历，自动选择
        const defaultResume = response.data.data.find((r: any) => r.isDefault === true)
        if (defaultResume) {
          setSelectedResumeId(defaultResume.id)
        } else if (response.data.data.length > 0) {
          // 否则选择第一个简历
          setSelectedResumeId(response.data.data[0].id)
        }
      } else {
        throw new Error(response.data.errorMsg || "获取简历失败")
      }
    } catch (error: any) {
      toast.error("获取简历失败", {
        description: error.message || "请稍后重试"
      })
    } finally {
      setLoadingResumes(false)
    }
  }

  const fetchJobNames = async () => {
    try {
      setLoadingJobs(true)
      const response = await jobApi.getJobTitle("")

      if (response.data.success && response.data.data) {
        setJobNames(response.data.data)
      } else {
        throw new Error(response.data.errorMsg || "获取职位名称失败")
      }
    } catch (error: any) {
      toast.error("获取职位名称失败", {
        description: error.message || "请稍后重试"
      })
    } finally {
      setLoadingJobs(false)
    }
  }

  const handleStartInterview = async () => {
    if ((!selectedJobName && !customJobName) || !selectedResumeId) {
      toast.error("请填写必要信息", {
        description: "请选择职位和简历"
      })
      return
    }

    // 使用自定义职位名称，如果有的话
    const finalJobName = customJobName || selectedJobName

    if (!finalJobName) {
      toast.error("职位名称不能为空")
      return
    }

    try {
      setStartingInterview(true)
      
      // 先创建新面试获取memoryId
      const response = await interviewApi.startNew({ 
        jobName: finalJobName, 
        resumeId: selectedResumeId 
      });
      
      if (response.data.success && response.data.data) {
        const memoryId = Number(response.data.data);
        console.log("新面试创建成功，memoryId:", memoryId);
        
        // 立即关闭对话框
        onOpenChange(false);
        
        // 如果有成功回调，立即调用
        if (onSuccess) {
          onSuccess(memoryId);
        }
      } else {
        throw new Error(response.data.errorMsg || "创建面试失败");
      }
    } catch (error: any) {
      toast.error("开始面试失败", {
        description: error.message || "请稍后重试"
      })
    } finally {
      setStartingInterview(false)
    }
  }

  // 重置状态
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // 延迟重置状态，确保动画结束
      setTimeout(() => {
        setSelectedJobName("")
        setCustomJobName("")
        setJobSearchTerm("")
      }, 300)
    }
    onOpenChange(newOpen)
  }

  // 过滤职位名称
  const filteredJobNames = jobSearchTerm 
    ? jobNames.filter(name => name.toLowerCase().includes(jobSearchTerm.toLowerCase()))
    : jobNames

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] w-full">
        <DialogHeader>
          <DialogTitle>开始新的模拟面试</DialogTitle>
          <DialogDescription>
            选择目标职位和您的简历，开始AI模拟面试
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {loadingResumes ? (
            <Skeleton className="h-32 w-full" />
          ) : resumes.length === 0 ? (
            <div className="text-center py-4 space-y-2">
              <FileTextIcon className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-medium">没有简历</p>
              <p className="text-xs text-muted-foreground">请先创建一份简历，再开始模拟面试</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2"
                onClick={() => {
                  onOpenChange(false)
                  router.push("/resume")
                }}
              >
                创建简历
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="resume-select">选择简历</Label>
                <Select 
                  value={selectedResumeId?.toString()} 
                  onValueChange={(value) => setSelectedResumeId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择简历" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id.toString()}>
                        {resume.resumeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {loadingJobs ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="space-y-2">
              <Label>选择面试职位</Label>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索职位..."
                  className="pl-9"
                  value={jobSearchTerm}
                  onChange={(e) => setJobSearchTerm(e.target.value)}
                />
              </div>

              <div className="bg-muted/40 rounded-md max-h-36 overflow-y-auto">
                {filteredJobNames.map((jobName) => (
                  <div
                    key={jobName}
                    className={`px-3 py-1.5 cursor-pointer flex items-center justify-between text-sm ${
                      selectedJobName === jobName
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => {
                      setSelectedJobName(jobName)
                      setCustomJobName("")
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <BriefcaseIcon className="h-3.5 w-3.5" />
                      <span className="truncate">{jobName}</span>
                    </div>
                    {selectedJobName === jobName && (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-1 mt-3">
                <Label htmlFor="custom-job">或输入自定义职位</Label>
                <Input
                  id="custom-job"
                  placeholder="输入职位名称..."
                  value={customJobName}
                  onChange={(e) => {
                    setCustomJobName(e.target.value)
                    setSelectedJobName("")
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:mt-0 w-full sm:w-auto"
          >
            取消
          </Button>
          <Button 
            onClick={handleStartInterview} 
            disabled={loadingResumes || loadingJobs || startingInterview || (!selectedResumeId) || (!selectedJobName && !customJobName)}
            className="w-full sm:w-auto"
          >
            {startingInterview ? "正在开始..." : "开始面试"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 