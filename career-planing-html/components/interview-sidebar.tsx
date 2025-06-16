import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MessageSquare, Plus, HomeIcon, ChevronRight, SearchIcon, ChevronLeftIcon, Edit, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { interviewApi } from "@/services/api"
import { toast } from "sonner"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"

interface InterviewRecord {
  memoryId: number
  title: string
  createdAt?: string
}

interface ContextMenuProps {
  x: number;
  y: number;
  show: boolean;
  interview: InterviewRecord | null;
}

interface InterviewSidebarProps {
  interviews: InterviewRecord[]
  currentMemoryId?: number
  onNewInterview: () => void
  onSelectInterview: (interview: InterviewRecord) => void
  loading?: boolean
  collapsed: boolean
  onToggle: () => void
  onInterviewsUpdated?: () => void
}

export function InterviewSidebar({
  interviews,
  currentMemoryId,
  onNewInterview,
  onSelectInterview,
  loading = false,
  collapsed,
  onToggle,
  onInterviewsUpdated
}: InterviewSidebarProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<InterviewRecord | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    x: 0,
    y: 0,
    show: false,
    interview: null
  })
  
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.show) {
        setContextMenu(prev => ({ ...prev, show: false }));
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.show]);

  const filteredInterviews = searchTerm
    ? interviews.filter(interview => 
        interview.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : interviews

  const handleRename = async () => {
    if (!selectedInterview || !newTitle.trim()) return
    
    try {
      setIsSubmitting(true)
      
      const response = await interviewApi.rename({
        memoryId: selectedInterview.memoryId,
        title: newTitle
      })
      
      if (response.data.success) {
        toast.success("标题已修改")
        
        if (onInterviewsUpdated) {
          onInterviewsUpdated()
        }
        
        setShowRenameDialog(false)
      } else {
        throw new Error(response.data.errorMsg || "修改失败")
      }
    } catch (error: any) {
      toast.error("修改标题失败", {
        description: error.message || "请稍后重试"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDelete = async () => {
    if (!selectedInterview) return
    
    try {
      setIsSubmitting(true)
      
      const response = await interviewApi.deleteInterview(selectedInterview.memoryId.toString())
      
      if (response.data.success) {
        toast.success("面试记录已删除")
        
        if (onInterviewsUpdated) {
          onInterviewsUpdated()
        }
        
        setShowDeleteDialog(false)
      } else {
        throw new Error(response.data.errorMsg || "删除失败")
      }
    } catch (error: any) {
      toast.error("删除面试记录失败", {
        description: error.message || "请稍后重试"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleContextMenu = (e: React.MouseEvent, interview: InterviewRecord) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedInterview(interview);
    setNewTitle(interview.title);
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      show: true,
      interview: interview
    });
  };
  
  const renderContextMenu = () => {
    if (!contextMenu.show) return null;
    
    return (
      <div 
        className="fixed bg-white dark:bg-gray-800 border rounded shadow-lg z-50 py-1"
        style={{
          top: `${contextMenu.y}px`,
          left: `${contextMenu.x}px`,
          minWidth: '160px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-secondary"
          onClick={() => {
            setShowRenameDialog(true);
            setContextMenu(prev => ({ ...prev, show: false }));
          }}
        >
          <Edit className="h-4 w-4" />
          <span>重命名</span>
        </button>
        <div className="border-t my-1"></div>
        <button 
          className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-destructive hover:bg-destructive/10"
          onClick={() => {
            setShowDeleteDialog(true);
            setContextMenu(prev => ({ ...prev, show: false }));
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span>删除</span>
        </button>
      </div>
    );
  };

  return (
    <>
    <div className={cn(
      "border-r h-full flex flex-col bg-background w-full",
      collapsed ? "w-[60px]" : "w-72"
    )}>
      {/* 切换按钮 - 仅在收起时显示 */}
      {collapsed && (
        <div className="p-2 flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle} 
            className="mb-2"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNewInterview}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* 展开时的完整侧边栏 */}
      {!collapsed && (
        <>
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggle}
                className="h-8 w-8"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <h3 className="font-medium">面试记录</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onNewInterview}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-2">
            <div className="relative mb-2">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索面试记录..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mb-2"
              onClick={() => router.push("/interview")}
            >
              <HomeIcon className="mr-2 h-3.5 w-3.5" />
              所有面试记录
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <>
                {filteredInterviews.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    {searchTerm ? "未找到匹配的记录" : "暂无面试记录"}
                  </div>
                ) : (
                  filteredInterviews.map(interview => (
                    <div 
                      key={interview.memoryId}
                      onClick={() => onSelectInterview(interview)}
                      onContextMenu={(e) => handleContextMenu(e, interview)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md hover:bg-secondary transition-colors text-sm group cursor-pointer",
                        interview.memoryId === currentMemoryId ? "bg-secondary" : ""
                      )}
                    >
                      <div className="truncate flex-1">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{interview.title}</span>
                        </span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-muted-foreground shrink-0" />
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
    
    {renderContextMenu()}
    
    <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
      <DialogContent className="sm:max-w-md max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>重命名面试记录</DialogTitle>
          <DialogDescription>
            为您的面试记录输入新的标题
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="输入新标题..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowRenameDialog(false)}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            onClick={handleRename}
            disabled={isSubmitting || !newTitle.trim()}
          >
            {isSubmitting ? "提交中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent className="sm:max-w-md max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>删除面试记录</DialogTitle>
          <DialogDescription>
            您确定要删除"{selectedInterview?.title}"吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(false)}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? "删除中..." : "确认删除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
} 