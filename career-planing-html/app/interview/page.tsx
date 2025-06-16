"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { interviewApi } from "@/services/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  PlusIcon, 
  MessageSquare, 
  MenuIcon,
  ChevronLeftIcon,
} from "lucide-react"
import { InterviewSidebar } from "@/components/interview-sidebar"
import { InterviewChat } from "@/components/interview-chat"
import { NewInterviewDialog } from "@/components/new-interview-dialog"
import { parseInterviewStreamData } from "@/lib/utils"

interface InterviewRecord {
  memoryId: number
  title: string
  createdAt?: string
}

interface Message {
  role: "assistant" | "user"
  content: string
  // timestamp?: Date
}

export default function InterviewPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  
  const [interviews, setInterviews] = useState<InterviewRecord[]>([])
  const [loadingInterviews, setLoadingInterviews] = useState(true)
  const [currentInterview, setCurrentInterview] = useState<InterviewRecord | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNewInterviewDialog, setShowNewInterviewDialog] = useState(false)
  
  // 响应式布局 - 在小屏幕上自动收起侧边栏
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }
    
    // 初始检查
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated) {
      fetchInterviews()
    }
  }, [isAuthenticated, loading, router])

  // 监听URL参数变化，处理直接访问带有id参数的URL
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated && !loading) {
      const url = new URL(window.location.href);
      const memoryId = url.searchParams.get("id");
      
      // 只在组件首次加载或URL路径变化时处理
      if (memoryId && (!currentInterview || currentInterview.memoryId.toString() !== memoryId)) {
        console.log("URL中检测到面试ID:", memoryId);
        // 先查找当前interviews列表中是否有该面试
        const interview = interviews.find(i => i.memoryId.toString() === memoryId);
        
        if (interview) {
          // 已找到面试记录，直接加载
          setCurrentInterview(interview);
          fetchInterviewDetail(parseInt(memoryId));
        } else if (interviews.length > 0) {
          // 没找到对应记录但已加载面试列表，可能是新创建的面试
          const tempInterview = { memoryId: parseInt(memoryId), title: "新面试" };
          setCurrentInterview(tempInterview);
          fetchInterviewDetail(parseInt(memoryId));
        }
        // 如果interviews为空，会在fetchInterviews完成后处理
      }
    }
  }, [isAuthenticated, loading, interviews.length]);

  const fetchInterviews = async () => {
    try {
      setLoadingInterviews(true)
      const response = await interviewApi.getUserInterviews()

      if (response.data.success && response.data.data) {
        setInterviews(response.data.data)
        
        // 如果有查询参数id，则自动选择该面试
        const url = new URL(window.location.href)
        const memoryId = url.searchParams.get("id")
        
        if (memoryId && response.data.data.length > 0) {
          const interview = response.data.data.find(
            (item: InterviewRecord) => item.memoryId.toString() === memoryId
          )
          
          if (interview) {
            setCurrentInterview(interview)
            fetchInterviewDetail(parseInt(memoryId))
          } else {
            // 如果没有找到，选择第一个面试
            setCurrentInterview(response.data.data[0])
            fetchInterviewDetail(response.data.data[0].memoryId)
          }
        } else if (response.data.data.length > 0) {
          // 默认选择第一个面试
          setCurrentInterview(response.data.data[0])
          fetchInterviewDetail(response.data.data[0].memoryId)
        }
      } else {
        throw new Error(response.data.errorMsg || "获取面试记录失败")
      }
    } catch (error: any) {
      toast.error("获取面试记录失败", {
        description: error.message || "请稍后重试"
      })
    } finally {
      setLoadingInterviews(false)
    }
  }

  const fetchInterviewDetail = async (memoryId: number) => {
    try {
      setLoadingMessages(true)
      setMessages([]) // 清空现有消息，避免显示上一次的记录
      // toast.info("正在加载聊天记录...")
      
      const response = await interviewApi.getDetail(memoryId.toString())
      console.log("Interview detail response:", response.data)

      if (response.data.success && response.data.data) {
        // 将对话记录转换为消息格式
        const interviewDetail = response.data.data
        const convertedMessages: Message[] = []

        // 处理一组QA对话记录，response.data.data是一个数组
        if (Array.isArray(interviewDetail)) {
          // 按照顺序处理对话记录
          for (const item of interviewDetail) {
            // 添加用户消息
            if (item.user) {
              convertedMessages.push({
                role: "user",
                content: item.user,
                // timestamp: new Date()
              })
            }
            
            // 添加AI消息
            if (item.assistant) {
              convertedMessages.push({
                role: "assistant",
                content: item.assistant,
                // timestamp: new Date()
              })
            }
          }
        } 
        // 处理旧的API返回格式
        else if (interviewDetail.qa && interviewDetail.qa.length > 0) {
          interviewDetail.qa.forEach((item: any) => {
            // 添加AI消息
            if (item.question) {
              convertedMessages.push({
                role: "assistant",
                content: item.question,
                // timestamp: new Date(item.timestamp)
              })
            }
            
            // 添加用户消息
            if (item.answer) {
              convertedMessages.push({
                role: "user",
                content: item.answer,
                // timestamp: new Date(item.timestamp)
              })
            }
          })
        }
        
        setMessages(convertedMessages)
        
        if (convertedMessages.length === 0) {
          toast.info("没有找到对话记录，您可以开始新的对话")
        }
        // } else {
        //   // toast.success(`成功加载了 ${convertedMessages.length} 条消息`)
        // }
      } else {
        throw new Error(response.data.errorMsg || "获取面试详情失败")
      }
    } catch (error: any) {
      toast.error("获取面试详情失败", {
        description: error.message || "请稍后重试"
      })
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!currentInterview) return

    // 先添加用户消息到UI
    const userMessage: Message = {
      role: "user",
      content,
      // timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setSendingMessage(true)

    try {
      // 创建初始AI消息，内容为空
      setMessages(prev => {
        return [
          ...prev,
          {
            role: "assistant", 
            content: "", 
            // timestamp: new Date()
          }
        ]
      });
      
      // 用于存储已处理的内容，防止重复
      let processedContent = "";
      
      // 发送消息到API
      await interviewApi.streamInterview(currentInterview.memoryId, content, (chunk: string) => {
        // 使用lib/utils中的parseInterviewStreamData函数处理流数据
        const parsedContent = parseInterviewStreamData(chunk);
        
        console.log("收到数据块:", chunk);
        console.log("解析后内容:", parsedContent);

        if (parsedContent.trim()) {
          // 立即更新UI，不等待额外的数据块
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            
            if (lastMessage && lastMessage.role === "assistant") {
              // 检查新内容是否已经包含在现有内容中，以避免重复
              if (!lastMessage.content.includes(parsedContent)) {
                // 使用函数形式的状态更新确保基于最新状态更新
                const updatedContent = lastMessage.content + parsedContent;
                lastMessage.content = updatedContent;
                processedContent = updatedContent; // 更新已处理内容
              }
              
              // 强制刷新消息，确保React检测到变化
              return [...newMessages];
            }
            
            return newMessages;
          });
        }
      });
    } catch (error: any) {
      toast.error("发送消息失败", {
        description: error.message || "请稍后重试"
      })
    } finally {
      setSendingMessage(false)
    }
  }

  const handleSelectInterview = (interview: InterviewRecord) => {
    console.log("Selecting interview:", interview.memoryId);
    setCurrentInterview(interview);
    fetchInterviewDetail(interview.memoryId);
    
    // 在移动设备上，选择面试后收起侧边栏
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true)
    }
    
    // 更新URL，但不刷新页面
    const url = new URL(window.location.href)
    url.searchParams.set("id", interview.memoryId.toString())
    window.history.pushState({}, "", url.toString())
  }

  const handleNewInterviewSuccess = (memoryId: number) => {
    console.log("新面试创建成功，memoryId:", memoryId);
    
    // 立即设置当前面试为新创建的面试
    const newInterview = { memoryId, title: "新的面试" };
    setCurrentInterview(newInterview);
    
    // 清空消息并显示加载状态
    setMessages([]);
    setLoadingMessages(true);
    
    // 更新URL，但不刷新页面
    const url = new URL(window.location.href);
    url.searchParams.set("id", memoryId.toString());
    window.history.pushState({}, "", url.toString());
    
    toast.success("开始新的面试", { description: "正在初始化面试..." });
    
    // 立即创建一个空的AI消息，准备接收流式响应
    setMessages([{
      role: "assistant",
      content: "",
      // timestamp: new Date()
    }]);
    
    // 用于存储已处理的内容，防止重复
    let processedContent = "";
    
    // 监听面试初始化流式响应
    interviewApi.startWithIdStream(memoryId.toString(), (chunk: string) => {
      console.log("收到初始化流数据:", chunk);
      const parsedContent = parseInterviewStreamData(chunk);
      console.log("解析后内容:", parsedContent);
      
      if (parsedContent.trim()) {
        // 更新AI消息内容
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0 && newMessages[0].role === "assistant") {
            // 检查新内容是否已经包含在现有内容中，以避免重复
            if (!newMessages[0].content.includes(parsedContent) && 
                !processedContent.includes(parsedContent)) {
              const updatedContent = newMessages[0].content + parsedContent;
              newMessages[0].content = updatedContent;
              processedContent = updatedContent; // 更新已处理内容
            }
            return [...newMessages];
          }
          return newMessages;
        });
      }
    }).then(() => {
      setLoadingMessages(false);
      // 刷新面试列表以获取最新的面试记录
      fetchInterviews();
    }).catch(error => {
      console.error("面试初始化失败:", error);
      toast.error("面试初始化失败", {
        description: error.message || "请稍后重试"
      });
      setLoadingMessages(false);
    });
  };

  const handleNewInterview = () => {
    setShowNewInterviewDialog(true)
  }

  // 刷新面试列表
  const refreshInterviews = () => {
    fetchInterviews();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <Skeleton className="h-full w-16 md:w-72" />
          <Skeleton className="h-full flex-1" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        {/* 侧边栏切换按钮 - 仅在收起时显示 */}
        {sidebarCollapsed && (
          <button
            className="absolute left-0 top-4 z-20 md:hidden bg-primary text-primary-foreground p-2 rounded-r-md"
            onClick={() => setSidebarCollapsed(false)}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        )}
        
        {/* 侧边栏 */}
        <aside 
          className={`h-[calc(100vh-4rem)] absolute md:relative z-10 transition-all duration-300 ${
            sidebarCollapsed 
              ? "-translate-x-full md:translate-x-0 md:w-[60px]" 
              : "translate-x-0 w-72"
          }`}
        >
          <InterviewSidebar
            interviews={interviews}
            currentMemoryId={currentInterview?.memoryId}
            onNewInterview={handleNewInterview}
            onSelectInterview={handleSelectInterview}
            loading={loadingInterviews}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onInterviewsUpdated={refreshInterviews}
          />
        </aside>

        {/* 聊天区域 */}
        <main className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-4rem)] bg-background">
          {/* 聊天头部 */}
          <div className="border-b flex items-center justify-between p-3 bg-background shrink-0">
            <div className="flex items-center gap-2">
              {/* 侧边栏切换按钮 - 在展开时显示 */}
              {!sidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSidebarCollapsed(true)}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
              )}
              
              {currentInterview ? (
                <h3 className="font-medium truncate">{currentInterview.title}</h3>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">选择或开始一个面试</span>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={handleNewInterview}
            >
              <PlusIcon className="h-3.5 w-3.5" />
              新面试
            </Button>
          </div>

          {/* 聊天内容 */}
          {currentInterview ? (
            <div className="flex-1 overflow-hidden flex">
              <InterviewChat
                messages={messages}
                onSend={handleSendMessage}
                isLoading={loadingMessages || sendingMessage}
                inputValue={inputValue}
                setInputValue={setInputValue}
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">开始您的模拟面试</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                选择左侧已有的面试记录或开始一个新的面试，获取专业的面试指导和反馈
              </p>
              <Button onClick={handleNewInterview}>
                开始模拟面试
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* 新面试对话框 */}
      <NewInterviewDialog
        open={showNewInterviewDialog}
        onOpenChange={setShowNewInterviewDialog}
        onSuccess={handleNewInterviewSuccess}
      />
    </div>
  )
}