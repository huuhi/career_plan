import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-medium">页面不存在</h2>
          <p className="text-muted-foreground">您访问的页面不存在或已被移除</p>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
