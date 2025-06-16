"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ECharts } from "@/components/ui/echarts"
import { mockDashboardData } from "@/services/dashboard"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, Users, GraduationCap, BookOpen, BarChart } from "lucide-react"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockDashboardData)
  
  // 刷新数据
  const refreshData = async () => {
    setLoading(true)
    // 这里可以调用真实API，目前使用模拟数据
    setTimeout(() => {
      setData(mockDashboardData)
      setLoading(false)
    }, 1000)
  }
  
  useEffect(() => {
    refreshData()
  }, [])
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">智慧大屏</CardTitle>
            <CardDescription>系统数据可视化分析</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData} 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新数据
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <BarChart className="h-4 w-4 mr-2" />
              总览
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              用户分析
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <TrendingUp className="h-4 w-4 mr-2" />
              职业趋势
            </TabsTrigger>
            <TabsTrigger value="majors">
              <GraduationCap className="h-4 w-4 mr-2" />
              专业分布
            </TabsTrigger>
            <TabsTrigger value="learning">
              <BookOpen className="h-4 w-4 mr-2" />
              学习路径
            </TabsTrigger>
          </TabsList>
          
          {/* 总览面板 */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <StatCard 
                title="总用户数" 
                value={data.userStats.totalUsers} 
                description="平台注册用户总数" 
                trend={`+${data.userStats.newUsersToday} 今日`}
                trendUp={true}
              />
              <StatCard 
                title="活跃用户" 
                value={data.userStats.activeUsers} 
                description="近7天活跃用户数" 
                trend={`${data.userStats.activeUsers / data.userStats.totalUsers * 100}% 活跃率`}
                trendUp={true}
              />
              <StatCard 
                title="学习路径" 
                value={data.learningPathStats.pathCompletion.reduce((sum, item) => sum + item.value, 0)} 
                description="创建的学习路径总数" 
                trend={`${data.learningPathStats.pathCompletion[0].value}% 完成率`}
                trendUp={true}
              />
              <StatCard 
                title="系统使用量" 
                value={data.systemUsage.usageData.reduce((sum, item) => sum + item, 0)} 
                description="本周功能使用次数" 
                trend="+12% 环比上周"
                trendUp={true}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">职业趋势概览</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ECharts 
                    option={{
                      tooltip: {
                        trigger: 'axis',
                      },
                      legend: {
                        data: data.jobTrends.series.map(item => item.name)
                      },
                      xAxis: {
                        type: 'category',
                        data: data.jobTrends.categories
                      },
                      yAxis: {
                        type: 'value'
                      },
                      series: data.jobTrends.series.map(item => ({
                        name: item.name,
                        type: 'bar',
                        data: item.data
                      }))
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">专业分布概览</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ECharts 
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: data.majorDistribution.majorTypes.map(item => item.name)
                      },
                      series: [
                        {
                          name: '专业类型',
                          type: 'pie',
                          radius: ['40%', '70%'],
                          avoidLabelOverlap: false,
                          itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                          },
                          label: {
                            show: false,
                            position: 'center'
                          },
                          emphasis: {
                            label: {
                              show: true,
                              fontSize: '18',
                              fontWeight: 'bold'
                            }
                          },
                          labelLine: {
                            show: false
                          },
                          data: data.majorDistribution.majorTypes.map(item => ({
                            value: item.value,
                            name: item.name
                          }))
                        }
                      ]
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">系统功能使用情况</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ECharts 
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'shadow'
                      }
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: [
                      {
                        type: 'category',
                        data: data.systemUsage.features,
                        axisTick: {
                          alignWithLabel: true
                        }
                      }
                    ],
                    yAxis: [
                      {
                        type: 'value'
                      }
                    ],
                    series: [
                      {
                        name: '使用次数',
                        type: 'bar',
                        barWidth: '60%',
                        data: data.systemUsage.usageData
                      }
                    ]
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 用户分析面板 */}
          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">用户增长趋势</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ECharts 
                    option={{
                      tooltip: {
                        trigger: 'axis'
                      },
                      xAxis: {
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
                      },
                      yAxis: {
                        type: 'value'
                      },
                      series: [
                        {
                          name: '新增用户',
                          type: 'line',
                          smooth: true,
                          data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                          name: '活跃用户',
                          type: 'line',
                          smooth: true,
                          data: [220, 182, 191, 234, 290, 330, 310]
                        }
                      ]
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">用户技能分布</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ECharts 
                    option={{
                      tooltip: {
                        trigger: 'item'
                      },
                      radar: {
                        indicator: data.userOverview.skillRadar.map(item => ({
                          name: item.name,
                          max: 100
                        }))
                      },
                      series: [
                        {
                          name: '技能分布',
                          type: 'radar',
                          data: [
                            {
                              value: data.userOverview.skillRadar.map(item => item.value),
                              name: '平均技能水平'
                            }
                          ]
                        }
                      ]
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* 职业趋势面板 */}
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">职业薪资与需求趋势</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ECharts 
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'cross',
                        crossStyle: {
                          color: '#999'
                        }
                      }
                    },
                    legend: {
                      data: ['平均薪资(万/年)', '需求增长率(%)']
                    },
                    xAxis: [
                      {
                        type: 'category',
                        data: data.jobTrends.categories,
                        axisPointer: {
                          type: 'shadow'
                        }
                      }
                    ],
                    yAxis: [
                      {
                        type: 'value',
                        name: '薪资',
                        min: 0,
                        max: 40,
                        interval: 10,
                        axisLabel: {
                          formatter: '{value} 万'
                        }
                      },
                      {
                        type: 'value',
                        name: '增长率',
                        min: 0,
                        max: 40,
                        interval: 10,
                        axisLabel: {
                          formatter: '{value} %'
                        }
                      }
                    ],
                    series: [
                      {
                        name: '平均薪资(万/年)',
                        type: 'bar',
                        data: data.jobTrends.series[0].data
                      },
                      {
                        name: '需求增长率(%)',
                        type: 'line',
                        yAxisIndex: 1,
                        data: data.jobTrends.series[1].data
                      }
                    ]
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 专业分布面板 */}
          <TabsContent value="majors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">专业类型分布</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ECharts 
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: data.majorDistribution.majorTypes.map(item => item.name)
                      },
                      series: [
                        {
                          name: '专业类型',
                          type: 'pie',
                          radius: '50%',
                          data: data.majorDistribution.majorTypes.map(item => ({
                            value: item.value,
                            name: item.name
                          })),
                          emphasis: {
                            itemStyle: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                          }
                        }
                      ]
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">学位类型分布</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ECharts 
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: data.majorDistribution.degreeTypes.map(item => item.name)
                      },
                      series: [
                        {
                          name: '学位类型',
                          type: 'pie',
                          radius: '50%',
                          data: data.majorDistribution.degreeTypes.map(item => ({
                            value: item.value,
                            name: item.name
                          })),
                          emphasis: {
                            itemStyle: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                          }
                        }
                      ]
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* 学习路径面板 */}
          <TabsContent value="learning" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">学习路径完成情况</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ECharts 
                    option={{
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                      },
                      legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: data.learningPathStats.pathCompletion.map(item => item.name)
                      },
                      series: [
                        {
                          name: '完成情况',
                          type: 'pie',
                          radius: ['40%', '70%'],
                          avoidLabelOverlap: false,
                          itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                          },
                          label: {
                            show: false,
                            position: 'center'
                          },
                          emphasis: {
                            label: {
                              show: true,
                              fontSize: '18',
                              fontWeight: 'bold'
                            }
                          },
                          labelLine: {
                            show: false
                          },
                          data: data.learningPathStats.pathCompletion.map(item => ({
                            value: item.value,
                            name: item.name
                          }))
                        }
                      ]
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">技能类别完成度</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ECharts 
                    option={{
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        }
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                      },
                      xAxis: [
                        {
                          type: 'category',
                          data: data.learningPathStats.skillCategories,
                          axisTick: {
                            alignWithLabel: true
                          }
                        }
                      ],
                      yAxis: [
                        {
                          type: 'value',
                          max: 100,
                          axisLabel: {
                            formatter: '{value}%'
                          }
                        }
                      ],
                      series: [
                        {
                          name: '完成度',
                          type: 'bar',
                          barWidth: '60%',
                          data: data.learningPathStats.skillCompletion
                        }
                      ]
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// 统计卡片组件
function StatCard({ title, value, description, trend, trendUp = true }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <div className={`flex items-center mt-2 text-xs ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trendUp ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
          )}
          {trend}
        </div>
      </CardContent>
    </Card>
  )
}