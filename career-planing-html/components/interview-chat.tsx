import { useRef, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon, RefreshCw, ArrowDownIcon } from "lucide-react"
import { format } from "date-fns"

interface Message {
  role: "assistant" | "user"
  content: string
  timestamp?: Date
}

interface InterviewChatProps {
  messages: Message[]
  onSend: (message: string) => void
  isLoading?: boolean
  inputValue: string
  setInputValue: (value: string) => void
  onRegenerate?: () => void
  className?: string
}

export function InterviewChat({
  messages,
  onSend,
  isLoading = false,
  inputValue,
  setInputValue,
  onRegenerate,
  className,
}: InterviewChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [textareaHeight, setTextareaHeight] = useState<number>(40)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSend(inputValue)
      setInputValue("")
      // 重置textarea高度
      setTextareaHeight(40)
      // 重新启用自动滚动
      setShouldAutoScroll(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // 处理textarea的高度自适应
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 限制最多2000个字符
    if (e.target.value.length <= 2000) {
      setInputValue(e.target.value)
      
      // 自适应高度
      const MAX_HEIGHT = 400 // 或 240，根据你喜欢的高度
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px"
        const scrollHeight = textareaRef.current.scrollHeight
        setTextareaHeight(scrollHeight <= MAX_HEIGHT ? scrollHeight : MAX_HEIGHT)
      }
    }
  }

  // 监听消息容器滚动事件，判断用户是否手动滚动
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // 检查是否滚动到底部附近（允许有20px误差）
      const isAtBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 20;
      
      // 只有当用户滚动到底部时，才启用自动滚动
      setShouldAutoScroll(isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 手动滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      setShouldAutoScroll(true);
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 自动滚动到最新消息
  useEffect(() => {
    // 只有当应该自动滚动时才执行滚动
    if (shouldAutoScroll && messagesEndRef.current) {
      // 使用requestAnimationFrame确保DOM更新后再滚动
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
    
    // 每次消息更新时，聚焦输入框
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus()
    }
  }, [messages, isLoading, shouldAutoScroll])

  // 在组件挂载时滚动到底部
  useEffect(() => {
    // 使用requestAnimationFrame确保DOM更新后再滚动
    requestAnimationFrame(() => {
      if (messagesEndRef.current && messageContainerRef.current) {
        messagesEndRef.current.scrollIntoView();
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    });
  }, [])

  // 添加时间标记
  const messagesWithTime = messages.map(message => {
    if (!message.timestamp) {
      return {
        ...message,
        // timestamp: new Date()
      }
    }
    return message
  })

  // 获取当天的消息分组（通常面试是一次性的，这里简化处理）
  const messageGroups = [messagesWithTime]

  // 预处理Markdown内容，确保换行符正确转换
  const preprocessMarkdown = (content: string) => {
    // 替换\n为实际换行，确保Markdown能正确解析
    return content.replace(/\\n/g, '\n').replace(/\\t/g, '  ').trim();
  }

  // 去除重复内容
  const removeDuplicateSentences = (text: string): string => {
    if (!text || text.length < 50) return text;
    
    // 尝试找到重复的句子
    const sentences = text.split(/(?<=[.!?])\s+/);
    const uniqueSentences: string[] = [];
    const seen = new Set<string>();
    
    for (const sentence of sentences) {
      const normalized = sentence.trim().toLowerCase();
      if (normalized.length > 5 && !seen.has(normalized)) {
        uniqueSentences.push(sentence);
        seen.add(normalized);
      }
    }
    
    return uniqueSentences.join(' ');
  }

  return (
    <div className={cn("flex flex-col h-full max-h-full", className)}>
      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-3" 
        style={{ scrollBehavior: "smooth" }}
      >
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            {/* <div className="flex justify-center">
              <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                {format(new Date(), "yyyy年MM月dd日")}
              </div>
            </div>
             */}
            {group.map((message, index) => (
              <div
                key={index}
                className={cn("flex", {
                  "justify-end": message.role === "user",
                  "justify-start": message.role === "assistant",
                })}
              >
                <div
                  className={cn("flex gap-1.5 max-w-[90%]", {
                    "flex-row-reverse": message.role === "user",
                  })}
                >
                  <Avatar className={cn("h-7 w-7 mt-0.5 shrink-0", message.role === "user" ? "bg-primary" : "bg-secondary")}>
                    <AvatarFallback className="text-xs">
                      {message.role === "user" ? "我" : "AI"}
                    </AvatarFallback>
                    <AvatarImage
                      src={message.role === "user" ? "/images/user-avatar.jpg" : "/images/ai-avatar.jpg"}
                      alt={message.role === "user" ? "User" : "AI Assistant"}
                    />
                  </Avatar>

                  <div className="flex flex-col gap-0.5">
                    <div className={cn("flex items-end gap-1", {
                      "flex-row-reverse": message.role === "user",
                    })}>
                      <Card 
                        className={cn(
                          "rounded-2xl", 
                          message.role === "user" 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-muted rounded-tl-none"
                        )}
                      >
                        <CardContent className="p-2.5">
                          {message.role === "assistant" ? (
                            <div className="prose dark:prose-invert max-w-none prose-p:my-1.5 prose-pre:my-0 prose-ul:my-1.5 prose-li:my-0 prose-headings:my-2 text-sm">
                              <ReactMarkdown>
                                {preprocessMarkdown(removeDuplicateSentences(message.content))}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className={cn("text-[10px] text-muted-foreground px-1", {
                      "text-right": message.role === "user"
                    })}>
                      {message.timestamp && format(message.timestamp, "HH:mm")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* {isLoading && (
          <div className="flex justify-start mt-1">
            <div className="flex gap-1.5 max-w-[90%]">
              <Avatar className="h-7 w-7 mt-0.5 bg-secondary shrink-0">
                <AvatarFallback className="text-xs">AI</AvatarFallback>
                <AvatarImage src="/images/ai-avatar.png" alt="AI Assistant" />
              </Avatar>
              
              <div className="flex flex-col gap-0.5">
                <Card className="bg-muted rounded-2xl rounded-tl-none">
                  <CardContent className="p-2.5">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:100ms]" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:200ms]" />
                    </div>
                  </CardContent>
                </Card>
                <div className="text-[10px] text-muted-foreground px-1">
                  AI思考中...
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* 这个空的div用于滚动定位 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 显示滚动按钮，当有新消息但用户未看到时 */}
      {!shouldAutoScroll && messages.length > 0 && (
        <div className="absolute bottom-16 right-4 z-10">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full shadow-md flex items-center gap-1.5 h-8 px-2.5 py-1 text-xs"
            onClick={scrollToBottom}
          >
            <ArrowDownIcon className="h-3 w-3" />
            查看最新消息
          </Button>
        </div>
      )}

      {messages.length > 1 && onRegenerate && (
        <div className="px-3 py-0.5 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            className="gap-1 text-xs text-muted-foreground rounded-full h-6 px-2"
            disabled={isLoading}
          >
            <RefreshCw className="h-2.5 w-2.5" />
            重新生成回答
          </Button>
        </div>
      )}

      <div className="border-t p-2 bg-background mt-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              placeholder="输入您的回答..."
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              className="resize-none min-h-[36px] rounded-xl border-muted-foreground/20 focus-visible:ring-offset-0 focus-visible:ring-1 text-sm"
              style={{ height: `${textareaHeight}px` }}
              disabled={isLoading}
              maxLength={2000}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full h-9 w-9 shrink-0"
              disabled={!inputValue.trim() || isLoading}
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-right text-muted-foreground pr-12">
            {inputValue.length}/2000
          </div>
        </form>
      </div>
    </div>
  )
} 