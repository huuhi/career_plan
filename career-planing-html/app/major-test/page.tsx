"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { majorQuestions, getRandomQuestions } from "@/data/questions"
import { analysisApi } from "@/services/api"
import { toast } from "sonner"

export default function MajorTestPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (isAuthenticated) {
      // 获取10个随机问题
      setQuestions(getRandomQuestions(majorQuestions))
    }
  }, [isAuthenticated, loading, router])

  const handleAnswer = (value: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    const selectedOption = currentQuestion.options.find((option: any) => option.value === value)

    const answer = {
      question: currentQuestion.question,
      answer: selectedOption.label,
      score: selectedOption.score,
    }

    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answer
    setAnswers(newAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (answers.length < questions.length) {
      toast.error("请完成所有问题", {
        description: "您需要回答所有问题才能提交测评",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await analysisApi.analyzeProfession(answers)

      if (response.data.success) {
        // 无论是否立即获得结果，都跳转到首页并显示提交成功的通知
        toast.success("测评提交成功", {
          description: "我们的AI系统正在深度分析您的结果，分析完成后将通过消息通知您",
          duration: 3000,
        })

        // 返回首页
        router.push("/")
      } else {
        throw new Error(response.data.errorMsg || "提交失败")
      }
    } catch (error: any) {
      toast.error("提交失败", {
        description: error.message || "请稍后重试",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>加载中...</p>
        </main>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">专业测评</h1>
          <p className="text-muted-foreground">回答以下问题，我们将为您推荐最适合的专业方向</p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                问题 {currentQuestionIndex + 1}/{questions.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <CardTitle className="mt-4">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={answers[currentQuestionIndex]?.answer || ""} className="space-y-4">
              {currentQuestion.options.map((option: any) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-secondary transition-colors"
                  onClick={() => handleAnswer(option.value)}
                >
                  <RadioGroupItem
                    value={option.label}
                    id={option.value}
                    checked={answers[currentQuestionIndex]?.answer === option.label}
                  />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              上一题
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting || !answers[currentQuestionIndex]}>
                {isSubmitting ? "提交中..." : "提交"}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                disabled={!answers[currentQuestionIndex]}
              >
                下一题
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
