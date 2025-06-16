"use client"

import "@/lib/echarts-init"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ECharts } from "@/components/ui/echarts"
import { mockDashboardData } from "@/services/dashboard"
import { Button } from "@/components/ui/button"
import { RefreshCw, Home, PieChart } from "lucide-react"
import * as echarts from 'echarts'
import { Header } from "@/components/header"

// 添加中国各省职业分布模拟数据
const chinaJobsData = [
  { name: '北京', value: 9800, jobs: '软件开发,人工智能,金融' },
  { name: '天津', value: 5800, jobs: '制造业,物流,教育' },
  { name: '河北', value: 4200, jobs: '制造业,农业,建筑' },
  { name: '山西', value: 3800, jobs: '煤炭,旅游,教育' },
  { name: '内蒙古', value: 3500, jobs: '畜牧业,采矿,旅游' },
  { name: '辽宁', value: 5200, jobs: '重工业,港口物流,IT' },
  { name: '吉林', value: 4100, jobs: '汽车制造,农业,教育' },
  { name: '黑龙江', value: 3900, jobs: '石油,农业,旅游' },
  { name: '上海', value: 9500, jobs: '金融,IT,贸易' },
  { name: '江苏', value: 8200, jobs: '电子制造,教育,IT' },
  { name: '浙江', value: 8000, jobs: '电商,制造业,金融' },
  { name: '安徽', value: 4800, jobs: '制造业,农业,教育' },
  { name: '福建', value: 6200, jobs: '外贸,制造业,旅游' },
  { name: '江西', value: 4500, jobs: '制造业,农业,旅游' },
  { name: '山东', value: 7200, jobs: '农业,制造业,旅游' },
  { name: '河南', value: 5500, jobs: '农业,制造业,物流' },
  { name: '湖北', value: 5800, jobs: '汽车制造,教育,IT' },
  { name: '湖南', value: 5600, jobs: '制造业,农业,文创' },
  { name: '广东', value: 9200, jobs: '电子制造,IT,贸易' },
  { name: '广西', value: 4600, jobs: '旅游,农业,物流' },
  { name: '海南', value: 4200, jobs: '旅游,农业,服务业' },
  { name: '重庆', value: 6100, jobs: '汽车制造,IT,物流' },
  { name: '四川', value: 6500, jobs: '旅游,电子,服务业' },
  { name: '贵州', value: 3800, jobs: '旅游,大数据,农业' },
  { name: '云南', value: 4300, jobs: '旅游,农业,生物医药' },
  { name: '西藏', value: 2800, jobs: '旅游,手工业,服务业' },
  { name: '陕西', value: 5100, jobs: '航空航天,教育,旅游' },
  { name: '甘肃', value: 3600, jobs: '农业,能源,旅游' },
  { name: '青海', value: 3200, jobs: '畜牧业,旅游,新能源' },
  { name: '宁夏', value: 3300, jobs: '能源,农业,旅游' },
  { name: '新疆', value: 3700, jobs: '农业,能源,旅游' },
  { name: '台湾', value: 6800, jobs: '电子制造,IT,服务业' },
  { name: '香港', value: 8500, jobs: '金融,贸易,服务业' },
  { name: '澳门', value: 7200, jobs: '旅游,博彩,服务业' }
];

// 简化的专业关系数据
const majorRelationData = [
  { source: '计算机', target: '软件工程', value: 30 },
  { source: '计算机', target: '人工智能', value: 25 },
  { source: '软件工程', target: '前端开发', value: 15 },
  { source: '软件工程', target: '后端开发', value: 18 },
  { source: '人工智能', target: '机器学习', value: 12 },
  { source: '电子工程', target: '通信工程', value: 15 }
];

// 简化的职业薪资数据
const jobSalaryData = [
  { name: '软件工程师', salary: 25, demand: 85 },
  { name: '数据分析师', salary: 22, demand: 75 },
  { name: '人工智能专家', salary: 35, demand: 65 },
  { name: '产品经理', salary: 28, demand: 70 },
  { name: '前端开发', salary: 20, demand: 80 },
  { name: '后端开发', salary: 26, demand: 82 }
];

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [dataLoading, setDataLoading] = useState(false)
  const [data, setData] = useState(mockDashboardData)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isAtHome, setIsAtHome] = useState(false)
  
  // 检查用户是否已登录
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])
  
  // 加载中国地图数据
  useEffect(() => {
    const loadMap = async () => {
      try {
        console.log('开始加载地图数据...');
        const response = await fetch('https://file.geojson.cn/china/1.6.2/china.json');
        console.log('获取到响应:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        
        const topoJson = await response.json();
        console.log('地图数据加载成功，数据结构:', Object.keys(topoJson));
        
        console.log('开始注册地图数据...');
        if (topoJson.objects && topoJson.objects.china) {
          console.log('检测到TopoJSON格式，尝试解析...');
          echarts.registerMap('china', topoJson);
        } else {
          console.log('使用原始数据格式注册...');
          echarts.registerMap('china', topoJson);
        }
        
        setMapLoaded(true);
        console.log('地图数据注册成功!');
      } catch (error) {
        console.error('加载中国地图数据失败:', error);
      }
    };
    
    loadMap();
  }, []);
  
  // 刷新数据
  const refreshData = async () => {
    setDataLoading(true)
    setTimeout(() => {
      setData(mockDashboardData)
      setDataLoading(false)
    }, 1000)
  }
  
  useEffect(() => {
    refreshData()
  }, [])
  
  // 修改导航按钮处理函数
  const handleNavigation = () => {
    if (isAtHome) {
      setIsAtHome(false)
      router.push('/dashboard')
    } else {
      setIsAtHome(true)
      router.push('/dashboard')
    }
  }
  
  // 如果正在加载或未认证，显示加载状态
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="h-screen bg-background relative dashboard-background overflow-hidden flex flex-col">
      <Header/>
      
      {/* 图表区域 - 修复高度问题，确保所有图表都在一个屏幕内显示 */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="grid grid-cols-12 gap-4" style={{ height: 'calc(100vh - 5rem)' }}>
          {/* 左列 - 3个图表 */}

{/* 左列 - 3个图表 */}
<div className="col-span-3 flex flex-col gap-4" style={{ height: 'calc(100vh - 5rem)' }}>
  {/* 热门职业增长预测 - 混合计算机和非计算机职业，修复溢出问题 */}
  <Card className="flex-1 transparent-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
    <CardHeader className="pb-1 px-3 pt-3">
      <CardTitle className="text-xl font-semibold text-center text-white">热门职业增长预测</CardTitle>
    </CardHeader>
    <CardContent className="p-2 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
      <ECharts 
        option={{
          tooltip: {
                      trigger: 'axis',
                      axisPointer: { type: 'shadow' },
                      textStyle: { fontSize: 10 }
                    },
          legend: {
            data: ['2024年增长率', '2025年预测增长率'],
            textStyle: { fontSize: 14, color: '#fff' },
            top: 5,
            itemWidth: 15,
            itemHeight: 12
          },
          grid: {
            left: '10%',
            right: '10%',
            top: '25%',
            bottom: '20%', // 进一步增加底部空间，防止溢出
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisLabel: { fontSize: 12, color: '#eee' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
            max: 30
          },
          yAxis: {
            type: 'category',
            // 混合计算机和非计算机职业
            data: ['人工智能', '医疗健康', '软件开发', '新能源', '数据分析', '金融科技'],
            axisLabel: { 
              fontSize: 12, 
              color: '#eee',
              margin: 12 // 增加标签边距
            },
            splitLine: { show: false }
          },
          series: [
            {
              name: '2024年增长率',
              type: 'bar',
              data: [20, 16, 18, 22, 15, 17],
              label: {
                show: true,
                position: 'right',
                fontSize: 12,
                formatter: '{c}%',
                color: '#fff'
              },
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#4ecdc4' },
                  { offset: 1, color: '#45b7d1' }
                ])
              }
            },
            {
              name: '2025年预测增长率',
              type: 'bar',
              data: [26, 21, 24, 28, 22, 23],
              label: {
                show: true,
                position: 'right',
                fontSize: 12,
                formatter: '{c}%',
                color: '#fff'
              },
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#ff6b6b' },
                  { offset: 1, color: '#ff9ff3' }
                ])
              }
            }
          ]
        }}
      />
    </CardContent>
  </Card>            
            
   {/* 热门职业薪资对比 */}
   <Card className="flex-1 transparent-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
    <CardHeader className="pb-1 px-3 pt-3">
      <CardTitle className="text-xl font-semibold text-center text-white">热门职业薪资分布</CardTitle>
    </CardHeader>
    <CardContent className="p-2 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
      <ECharts 
        option={{
          tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}万/年 ({d}%)',
                    textStyle: { fontSize: 10 }
                  },
          legend: {
            type: 'scroll',
            orient: 'horizontal',
            top: '85%', // 将图例放在图表的85%位置
            left: 'center',
            itemWidth: 15,
            itemHeight: 10,
            textStyle: { 
              fontSize: 12,
              color: '#fff'
            },
            pageTextStyle: {
              color: '#fff'
            },
            pageIconColor: '#fff',
            pageIconInactiveColor: 'rgba(255,255,255,0.3)'
          },
          grid: {
            top: 0,
            bottom: '20%' // 确保底部有足够空间
          },
          series: [{
            name: '职业薪资',
            type: 'pie',
            radius: ['25%', '55%'], // 进一步减小饼图半径
            center: ['50%', '40%'], // 将饼图中心点上移
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 6,
              borderColor: 'rgba(0,0,0,0.1)',
              borderWidth: 1
            },
            label: {
              show: true,
              position: 'outside', // 恢复外部标签
              formatter: '{b}\n{c}万',
              fontSize: 10, // 减小字体大小
              color: '#fff',
              distanceToLabelLine: 5 // 减小标签与线的距离
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: true, // 恢复标签线
              length: 8, // 减小第一段线长
              length2: 6, // 减小第二段线长
              smooth: true,
              lineStyle: {
                width: 1 // 减小线宽
              }
            },
            // 更全面的职业数据，包含各行各业
            data: [
              { 
                value: 35, 
                name: 'AI工程师',
                itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#ff6b6b' },
                  { offset: 1, color: '#ff9ff3' }
                ])}
              },
              { 
                value: 28, 
                name: '金融分析师',
                itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4ecdc4' },
                  { offset: 1, color: '#45b7d1' }
                ])}
              },
              { 
                value: 25, 
                name: '软件工程师',
                itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#feca57' },
                  { offset: 1, color: '#ff9f43' }
                ])}
              },
              { 
                value: 22, 
                name: '医疗专家',
                itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#6c5ce7' },
                  { offset: 1, color: '#a29bfe' }
                ])}
              },
              { 
                value: 20, 
                name: '教育培训师',
                itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#00b894' },
                  { offset: 1, color: '#55efc4' }
                ])}
              },
              { 
                value: 18, 
                name: '市场营销',
                itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#e84393' },
                  { offset: 1, color: '#fd79a8' }
                ])}
              },
              { 
                value: 24, 
                name: '新能源工程师',
                itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#0984e3' },
                  { offset: 1, color: '#74b9ff' }
                ])}
              },
              { 
                value: 19, 
                name: '旅游服务',
                itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#d63031' },
                  { offset: 1, color: '#fab1a0' }
                ])}
              }
            ]
          }]
        }}
      />
    </CardContent>
  </Card>
    
           {/* 专业就业方向分布 */}
           <Card className="flex-1 transparent-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardHeader className="pb-1 px-3 pt-3">
                <CardTitle className="text-xl font-semibold text-center text-white">专业就业方向分布</CardTitle>
              </CardHeader>
              <CardContent className="p-2 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
                <ECharts 
                  option={{
                    tooltip: {
                      trigger: 'item',
                      triggerOn: 'mousemove',
                      formatter: function(params) {
                        if (params.dataType === 'edge') {
                          return `${params.data.source} → ${params.data.target}: ${params.data.value}%`;
                        } else {
                          return params.name;
                        }
                      },
                      textStyle: { fontSize: 10 }
                    },
                    series: [{
                      type: 'sankey',
                      left: '5%',  // 减小左边距
                      right: '20%', // 减小右边距
                      top: '2%',   // 减小顶部边距
                      bottom: '28%', // 减小底部边距
                      nodeWidth: 15, // 减小节点宽度
                      nodeGap: 5,    // 减小节点间距
                      nodeAlign: 'left',
                      layoutIterations: 32,
                      emphasis: {
                        focus: 'adjacency'
                      },
                      label: {
                        fontSize: 9,  // 减小字体大小
                        color: '#fff',
                        position: 'right'
                      },
                      lineStyle: {
                        color: 'gradient',
                        curveness: 0.5,
                        opacity: 0.6
                      },
                      itemStyle: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                      },
                      data: [
                        // 多样化的专业节点
                        { name: '计算机科学', itemStyle: { color: '#4ecdc4' } },
                        { name: '医学', itemStyle: { color: '#ff6b6b' } },
                        { name: '经济学', itemStyle: { color: '#feca57' } },
                        { name: '教育学', itemStyle: { color: '#6c5ce7' } },
                        { name: '工程学', itemStyle: { color: '#00b894' } },
                        { name: '艺术设计', itemStyle: { color: '#0984e3' } },
                        { name: '法学', itemStyle: { color: '#e84393' } },
                        { name: '心理学', itemStyle: { color: '#d63031' } },
                        { name: '生物科学', itemStyle: { color: '#00cec9' } },
                        { name: '环境科学', itemStyle: { color: '#fdcb6e' } },
                        
                        // 多样化的就业方向节点
                        { name: '软件开发', itemStyle: { color: '#a29bfe' } },
                        { name: '临床医生', itemStyle: { color: '#fab1a0' } },
                        { name: '金融分析', itemStyle: { color: '#55efc4' } },
                        { name: '教师', itemStyle: { color: '#74b9ff' } },
                        { name: '机械工程', itemStyle: { color: '#ff7675' } },
                        { name: '平面设计', itemStyle: { color: '#fdcb6e' } },
                        { name: '律师', itemStyle: { color: '#e17055' } },
                        { name: '心理咨询', itemStyle: { color: '#00b894' } },
                        { name: '医药研发', itemStyle: { color: '#0984e3' } },
                        { name: '环保工程', itemStyle: { color: '#6c5ce7' } },
                        { name: '数据分析', itemStyle: { color: '#ffeaa7' } },
                        { name: '医疗管理', itemStyle: { color: '#ff9ff3' } },
                        { name: '投资顾问', itemStyle: { color: '#badc58' } },
                        { name: '教育管理', itemStyle: { color: '#dff9fb' } },
                        { name: '土木工程', itemStyle: { color: '#f368e0' } },
                        { name: 'UI设计', itemStyle: { color: '#ff9f43' } },
                        { name: '法律顾问', itemStyle: { color: '#10ac84' } },
                        { name: '人力资源', itemStyle: { color: '#0abde3' } },
                        { name: '生物技术', itemStyle: { color: '#ee5253' } },
                        { name: '环境评估', itemStyle: { color: '#01a3a4' } }
                      ],
                      links: [
                        // 计算机科学专业流向
                        { source: '计算机科学', target: '软件开发', value: 40 },
                        { source: '计算机科学', target: '数据分析', value: 30 },
                        
                        // 医学专业流向
                        { source: '医学', target: '临床医生', value: 45 },
                        { source: '医学', target: '医疗管理', value: 25 },
                        { source: '医学', target: '医药研发', value: 20 },
                        
                        // 经济学专业流向
                        { source: '经济学', target: '金融分析', value: 35 },
                        { source: '经济学', target: '投资顾问', value: 30 },
                        { source: '经济学', target: '数据分析', value: 15 },
                        
                        // 教育学专业流向
                        { source: '教育学', target: '教师', value: 50 },
                        { source: '教育学', target: '教育管理', value: 30 },
                        
                        // 工程学专业流向
                        { source: '工程学', target: '机械工程', value: 35 },
                        { source: '工程学', target: '土木工程', value: 30 },
                        { source: '工程学', target: '环保工程', value: 15 },
                        
                        // 艺术设计专业流向
                        { source: '艺术设计', target: '平面设计', value: 40 },
                        { source: '艺术设计', target: 'UI设计', value: 35 },
                        
                        // 法学专业流向
                        { source: '法学', target: '律师', value: 45 },
                        { source: '法学', target: '法律顾问', value: 35 },
                        
                        // 心理学专业流向
                        { source: '心理学', target: '心理咨询', value: 40 },
                        { source: '心理学', target: '人力资源', value: 25 },
                        { source: '心理学', target: '教师', value: 15 },
                        
                        // 生物科学专业流向
                        { source: '生物科学', target: '生物技术', value: 35 },
                        { source: '生物科学', target: '医药研发', value: 30 },
                        
                        // 环境科学专业流向
                        { source: '环境科学', target: '环境评估', value: 40 },
                        { source: '环境科学', target: '环保工程', value: 35 }
                      ]
                    }]
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* 中间列 - 地图和雷达图 */}
          <div className="col-span-6 flex flex-col gap-4" style={{ height: 'calc(100vh - 5rem)' }}>
            {/* 中国地图 - 占2/3高度 - 修改为蓝色调 */}
            <Card className="flex-[2] transparent-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"> 
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-semibold text-center text-white">全国职业分布热力图</CardTitle>
                <CardDescription className="text-lg text-center text-white">各省份就业热度</CardDescription>
              </CardHeader>
              <CardContent className="p-2" style={{ height: 'calc(100% - 70px)' }}>
                {mapLoaded && (
                  <ECharts 
                    option={{
                      tooltip: {
                          trigger: 'item',
                          formatter: (params) => {
                            const data = params.data || {};
                            return `${params.name}<br/>就业热度: ${data.value || 0}<br/>主要职业: ${data.jobs || '暂无数据'}`;
                          },
                          textStyle: { fontSize: 10 }
                        },
                      visualMap: {
                        min: 2000,
                        max: 10000,
                        text: ['高', '低'],
                        realtime: false,
                        calculable: true,
                        inRange: {
                          color: ['#e8f4f8', '#FFDADA', '#FFB6B6', '#FF7878', '#FF3C3C', '#FF0000']
                        },
                        textStyle: { fontSize: 15 },
                        left: 'left',
                        top: 'bottom'
                      },
                      series: [{
                        name: '职业分布',
                        type: 'map',
                        map: 'china',
                        roam: true,
                        emphasis: {
                          label: { show: true, fontSize: 15 },
                          itemStyle: { areaColor: '#1e88e5' }
                        },
                        select: {
                          itemStyle: {
                            //取消点击后颜色改变
                            areaColor: "yellow" // 修改这里的颜色值来改变点击后的颜色
                          }
                        },
                        data: chinaJobsData,
                        label: { fontSize: 14 }
                      }]
                    }}
                  />
                )}
              </CardContent>
            </Card>
            
            {/* 用户技能雷达图 - 占1/3高度 */}
            <Card className="flex-1 transparent-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardHeader className="pb-1 px-3 pt-3">
                <CardTitle className="text-xl font-semibold text-center text-white">职业能力需求分析</CardTitle>
              </CardHeader>
              <CardContent className="p-2 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
                <ECharts 
                  option={{
                    tooltip: {
                      trigger: 'item',
                      textStyle: { fontSize: 10 },
                      formatter: function(params) {
                        const value = params.value;
                        return `${params.seriesName}: ${params.name}<br/>
                              技术能力: ${value[1]}<br/>
                              沟通能力: ${value[2]}<br/>
                              团队协作: ${value[3]}<br/>
                              创新思维: ${value[4]}<br/>
                              解决问题: ${value[5]}<br/>
                              领导力: ${value[6]}<br/>
                              学习能力: ${value[7]}`;
                      }
                    },
                    color: ['#FF6B6B', '#4ECDC4', '#FFD166', '#6C5CE7', '#00B894', '#0984E3', '#E84393', '#FD79A8', '#A29BFE', '#55EFC4', '#FAB1A0', '#74B9FF'],
                    parallelAxis: [
                      { 
                        dim: 0, 
                        name: '职业', 
                        type: 'category', 
                        data: ['软件工程师', '医生', '教师', '金融分析师', '建筑师', '律师', '市场营销', '艺术设计师', '记者', '厨师', '农业技术员', '物流管理员'], 
                        axisLabel: { color: '#fff', fontSize: 10, rotate: 15 } 
                      },
                      { dim: 1, name: '技术能力', min: 0, max: 100, nameLocation: 'end', axisLabel: { color: '#fff', fontSize: 10 } },
                      { dim: 2, name: '沟通能力', min: 0, max: 100, nameLocation: 'end', axisLabel: { color: '#fff', fontSize: 10 } },
                      { dim: 3, name: '团队协作', min: 0, max: 100, nameLocation: 'end', axisLabel: { color: '#fff', fontSize: 10 } },
                      { dim: 4, name: '创新思维', min: 0, max: 100, nameLocation: 'end', axisLabel: { color: '#fff', fontSize: 10 } },
                      { dim: 5, name: '解决问题', min: 0, max: 100, nameLocation: 'end', axisLabel: { color: '#fff', fontSize: 10 } },
                      { dim: 6, name: '领导力', min: 0, max: 100, nameLocation: 'end', axisLabel: { color: '#fff', fontSize: 10 } },
                      { dim: 7, name: '学习能力', min: 0, max: 100, nameLocation: 'end', axisLabel: { color: '#fff', fontSize: 10 } }
                    ],
                    parallel: {
                      left: '5%',
                      right: '13%',
                      top: '11%',
                      bottom: '25%',
                      parallelAxisDefault: {
                        type: 'value',
                        nameGap: 15,
                        nameTextStyle: { color: '#fff', fontSize: 11 },
                        axisLine: { lineStyle: { color: '#aaa' } },
                        axisTick: { lineStyle: { color: '#aaa' } },
                        splitLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.1)' } }
                      }
                    },
                    series: [
                      {
                        name: '职业能力需求',
                        type: 'parallel',
                        lineStyle: {
                          width: 2.5,
                          opacity: 0.7
                        },
                        emphasis: {
                          lineStyle: {
                            width: 4,
                            shadowBlur: 8,
                            shadowColor: 'rgba(255,255,255,0.5)'
                          }
                        },
                        data: [
                          ['软件工程师', 90, 45, 65, 75, 85, 35, 88],
                          ['医生', 75, 90, 65, 40, 95, 60, 85],
                          ['教师', 55, 95, 85, 70, 75, 65, 80],
                          ['金融分析师', 80, 75, 60, 70, 90, 50, 85],
                          ['建筑师', 85, 60, 70, 90, 75, 45, 65],
                          ['律师', 60, 95, 40, 65, 95, 75, 80],
                          ['市场营销', 45, 95, 85, 80, 65, 70, 75],
                          ['艺术设计师', 75, 60, 40, 98, 55, 30, 75],
                          ['记者', 50, 95, 55, 75, 80, 40, 85],
                          ['厨师', 85, 65, 75, 80, 70, 55, 60],
                          ['农业技术员', 80, 40, 65, 55, 75, 50, 70],
                          ['物流管理员', 65, 75, 90, 45, 80, 85, 60]
                        ]
                      }
                    ]
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* 右列 - 3个图表 */}
          <div className="col-span-3 flex flex-col gap-4" style={{ height: 'calc(100vh - 5rem)' }}>
  {/* 人才评估维度分析 - 替换原招聘流程转化率 */}
  <Card className="flex-1 transparent-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
  <CardHeader className="pb-1 px-3 pt-3">
    <CardTitle className="text-xl font-semibold text-center text-white">人才评估维度分析</CardTitle>
  </CardHeader>
  <CardContent className="p-2 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
    <ECharts 
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          textStyle: { fontSize: 10 }
        },
        legend: {
          data: ['应届生', '3年经验', '5年经验'],
          textStyle: { fontSize: 14, color: '#fff' },
          top: 5,
          itemWidth: 15,
          itemHeight: 12
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '20%',
          bottom: '25%', // 增加底部空间，为x轴标签留出足够空间
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['专业技能', '学习能力', '团队协作', '沟通表达', '抗压能力'],
          axisLabel: { 
            fontSize: 10, 
            color: '#eee',
            interval: 0,
            rotate: 0,
            margin: 10, // 增加标签与轴线的距离
            align: 'center', // 确保标签居中对齐
            verticalAlign: 'middle' // 垂直居中
          },
          axisTick: { 
            show: true,
            alignWithLabel: true // 刻度与标签对齐
          },
          axisLine: {
            lineStyle: { color: 'rgba(255,255,255,0.3)' }
          }
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLabel: { fontSize: 12, color: '#eee' },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
        },
        series: [
          {
            name: '应届生',
            type: 'bar',
            barWidth: '20%',
            data: [65, 85, 70, 75, 80],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#4ecdc4' },
                { offset: 1, color: '#45b7d1' }
              ])
            },
            label: {
              show: true,
              position: 'top',
              fontSize: 12,
              color: '#fff'
            }
          },
          {
            name: '3年经验',
            type: 'bar',
            barWidth: '20%',
            data: [80, 75, 85, 80, 75],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ff6b6b' },
                { offset: 1, color: '#ff9ff3' }
              ])
            },
            label: {
              show: true,
              position: 'top',
              fontSize: 12,
              color: '#fff'
            }
          },
          {
            name: '5年经验',
            type: 'bar',
            barWidth: '20%',
            data: [90, 70, 80, 85, 70],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#feca57' },
                { offset: 1, color: '#ff9f43' }
              ])
            },
            label: {
              show: true,
              position: 'top',
              fontSize: 12,
              color: '#fff'
            }
          }
        ]
      }}
    />
  </CardContent>
</Card>
            
                 {/* 行业人才需求趋势 */}
                 <Card className="flex-1 transparent-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardHeader className="pb-1 px-3 pt-3">
                <CardTitle className="text-xl font-semibold text-center text-white">行业人才需求趋势</CardTitle>
              </CardHeader>
              <CardContent className="p-2 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
                <ECharts 
                  option={{
                    baseOption: {
                      timeline: {
                        axisType: 'category',
                        autoPlay: true,
                        playInterval: 3000,
                        loop: true,
                        data: ['2023年', '2024年', '2025年预测'],
                        left: '5%',
                        right: '5%',
                        bottom: '5%', // 增加底部边距
                        height: 30, // 减小高度
                        label: {
                          fontSize: 11, // 减小字体
                          color: '#fff'
                        },
                        lineStyle: {
                          color: 'rgba(255,255,255,0.5)'
                        },
                        checkpointStyle: {
                          color: '#ff6b6b',
                          borderColor: 'rgba(255,255,255,0.8)',
                          borderWidth: 2
                        },
                        controlStyle: {
                          color: '#fff',
                          borderColor: '#fff'
                        },
                        emphasis: {
                          label: {
                            color: '#ff6b6b'
                          }
                        }
                      },
                      tooltip: {
                        trigger: 'item',
                        textStyle: { fontSize: 10 }
                      },
                      radar: {
                        center: ['50%', '41%'], // 将雷达图中心向上移动
                        radius: '55%', // 减小雷达图半径
                        indicator: [
                          { name: 'IT/互联网', max: 100 },
                          { name: '金融/经济', max: 100 },
                          { name: '教育/培训', max: 100 },
                          { name: '医疗/健康', max: 100 },
                          { name: '制造/工业', max: 100 },
                          { name: '新能源', max: 100 },
                          { name: '服务业', max: 100 }
                        ],
                        name: {
                          textStyle: {
                            color: '#fff',
                            fontSize: 12, // 减小指示器文字大小
                            padding: [-6, 5]
                          },
                          formatter: function(text) {
                            // 对较长的文字进行换行处理
                            // if (text.includes('/')) {
                            //   return text.replace('/', '/\n');
                            // }
                            return text;
                          }
                        },
                        splitArea: {
                          areaStyle: {
                            color: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)']
                          }
                        },
                        axisLine: {
                          lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                          }
                        },
                        splitLine: {
                          lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                          }
                        }
                      },
                      series: [{
                        type: 'radar',
                        symbol: 'circle',
                        symbolSize: 6, // 减小符号大小
                        areaStyle: {
                          opacity: 0.3
                        },
                        lineStyle: {
                          width: 2 // 减小线宽
                        }
                      }]
                    },
                    options: [
                      {
                        title: {
                          text: '2023年行业人才需求指数',
                          textStyle: {
                            fontSize: 12, // 减小标题字体
                            color: '#fff',
                            fontWeight: 'normal'
                          },
                          left: 'center',
                          top: 0 // 调整标题位置
                        },
                        series: [{
                          name: '2023年需求指数',
                          data: [{
                            value: [85, 70, 65, 75, 80, 60, 70],
                            name: '需求指数',
                            itemStyle: {
                              color: '#4ecdc4'
                            },
                            areaStyle: {
                              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(78, 205, 196, 0.8)' },
                                { offset: 1, color: 'rgba(78, 205, 196, 0.2)' }
                              ])
                            }
                          }]
                        }]
                      },
                      {
                        title: {
                          text: '2024年行业人才需求指数',
                          textStyle: {
                            fontSize: 12,
                            color: '#fff',
                            fontWeight: 'normal'
                          },
                          left: 'center',
                          top: 0
                        },
                        series: [{
                          name: '2024年需求指数',
                          data: [{
                            value: [90, 75, 70, 80, 75, 75, 65],
                            name: '需求指数',
                            itemStyle: {
                              color: '#ff6b6b'
                            },
                            areaStyle: {
                              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(255, 107, 107, 0.8)' },
                                { offset: 1, color: 'rgba(255, 107, 107, 0.2)' }
                              ])
                            }
                          }]
                        }]
                      },
                      {
                        title: {
                          text: '2025年行业人才需求预测',
                          textStyle: {
                            fontSize: 12,
                            color: '#fff',
                            fontWeight: 'normal'
                          },
                          left: 'center',
                          top: 0
                        },
                        series: [{
                          name: '2025年需求预测',
                          data: [{
                            value: [95, 80, 75, 85, 70, 90, 60],
                            name: '需求指数',
                            itemStyle: {
                              color: '#feca57'
                            },
                            areaStyle: {
                              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(254, 202, 87, 0.8)' },
                                { offset: 1, color: 'rgba(254, 202, 87, 0.2)' }
                              ])
                            }
                          }]
                        }]
                      }
                    ]
                  }}
                />
              </CardContent>
            </Card>
            
            {/* 行业发展趋势热力图 - 替换原职业薪资需求分析 */}
            <Card className="flex-1 transparent-card shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardHeader className="pb-1 px-3 pt-3">
                <CardTitle className="text-xl font-semibold text-center text-white">行业发展趋势热力图</CardTitle>
              </CardHeader>
              <CardContent className="p-2 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
                <ECharts 
                  option={{
                    tooltip: {
                      position: 'top',
                      formatter: function (params) {
                        const value = params.value[2];
                        let levelText = '';
                        let levelColor = '';
                        
                        if (value >= 90) {
                          levelText = '极高';
                          levelColor = '#a50026';
                        } else if (value >= 80) {
                          levelText = '很高';
                          levelColor = '#d73027';
                        } else if (value >= 70) {
                          levelText = '高';
                          levelColor = '#f46d43';
                        } else if (value >= 60) {
                          levelText = '中上';
                          levelColor = '#fdae61';
                        } else if (value >= 50) {
                          levelText = '中等';
                          levelColor = '#fee090';
                        } else if (value >= 40) {
                          levelText = '中下';
                          levelColor = '#e0f3f8';
                        } else if (value >= 30) {
                          levelText = '低';
                          levelColor = '#abd9e9';
                        } else if (value >= 20) {
                          levelText = '很低';
                          levelColor = '#74add1';
                        } else {
                          levelText = '极低';
                          levelColor = '#313695';
                        }
                        
                        return `<div style="font-size:14px;color:#fff;font-weight:bold">${params.value[3]}</div>` +
                               `<div style="font-size:13px;color:#eee">行业: ${params.name}</div>` +
                               `<div style="font-size:13px;color:#eee">维度: ${params.value[4]}</div>` +
                               `<div style="font-size:13px;color:#eee">指数: ${value}</div>` +
                               `<div style="font-size:13px;color:${levelColor}">水平: ${levelText}</div>`;
                      },
                      textStyle: { fontSize: 10 }
                    },
                    animation: true,
                    grid: {
                      top: '2%',
                      left: '4%',
                      right: '10%',
                      bottom: '25%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'category',
                      data: ['就业前景', '薪资水平', '发展空间', '社会需求', '技术要求'],
                      splitArea: {
                        show: true
                      },
                      axisLabel: {
                        fontSize: 11,
                        color: '#eee',
                        interval: 0,
                        rotate: 0
                      },
                      axisLine: {
                        show: true,
                        lineStyle: { color: '#aaa' }
                      }
                    },
                    yAxis: {
                      type: 'category',
                      data: [
                        '人工智能', '医疗健康', '金融科技', '教育培训', 
                        '新能源', '文化创意', '先进制造', '现代农业',
                        '电子商务', '生物技术', '法律服务', '旅游服务'
                      ],
                      splitArea: {
                        show: true
                      },
                      axisLabel: {
                        fontSize: 11,
                        color: '#eee',
                        interval: 0
                      },
                      axisLine: {
                        show: true,
                        lineStyle: { color: '#aaa' }
                      }
                    },
                    visualMap: {
                      type: 'continuous',
                      min: 0,
                      max: 100,
                      calculable: true,
                      orient: 'horizontal',
                      left: 'center',
                      bottom: '0%',
                      textStyle: {
                        color: '#fff',
                        fontSize: 11
                      },
                      inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                      }
                    },
                    series: [{
                      name: '行业发展趋势',
                      type: 'heatmap',
                      data: [
                        [0, 0, 95], [1, 0, 90], [2, 0, 98], [3, 0, 92], [4, 0, 88],
                        [0, 1, 85], [1, 1, 80], [2, 1, 75], [3, 1, 90], [4, 1, 70],
                        [0, 2, 80], [1, 2, 88], [2, 2, 75], [3, 2, 65], [4, 2, 75],
                        [0, 3, 75], [1, 3, 60], [2, 3, 70], [3, 3, 85], [4, 3, 50],
                        [0, 4, 90], [1, 4, 75], [2, 4, 95], [3, 4, 80], [4, 4, 70],
                        [0, 5, 70], [1, 5, 65], [2, 5, 80], [3, 5, 75], [4, 5, 65],
                        [0, 6, 85], [1, 6, 80], [2, 6, 75], [3, 6, 70], [4, 6, 85],
                        [0, 7, 60], [1, 7, 50], [2, 7, 65], [3, 7, 55], [4, 7, 45],
                        [0, 8, 75], [1, 8, 70], [2, 8, 80], [3, 8, 85], [4, 8, 60],
                        [0, 9, 80], [1, 9, 75], [2, 9, 90], [3, 9, 65], [4, 9, 85],
                        [0, 10, 65], [1, 10, 85], [2, 10, 60], [3, 10, 70], [4, 10, 75],
                        [0, 11, 55], [1, 11, 45], [2, 11, 60], [3, 11, 75], [4, 11, 30]
                      ],
                      label: {
                        show: true,
                        formatter: function(params) {
                          return params.data[2];
                        },
                        fontSize: 10,
                        color: function(params) {
                          return params.data[2] > 70 ? '#fff' : '#000';
                        }
                      },
                      itemStyle: {
                        emphasis: {
                          shadowBlur: 10,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }
                    }]
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
    </div>
  )
}