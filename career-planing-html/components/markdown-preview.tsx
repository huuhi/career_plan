import ReactMarkdown from 'react-markdown'

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="markdown-preview text-foreground"> {/* 移除 text-muted-foreground */}
      <ReactMarkdown
        components={{
          // 标题层级调整
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>,
          
          // 列表样式
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          
          // 段落样式
          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
          
          // 强调样式
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          
          // 代码块样式
          code: ({ children }) => (
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
              {children}
            </code>
          ),
          
          // 链接样式
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-primary underline hover:text-primary/80"
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}