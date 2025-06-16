import api from './api'

// 智慧大屏数据服务
export const dashboardApi = {
  // 获取用户统计数据
  getUserStats: () => api.get('/dashboard/user-stats'),
  
  // 获取职业趋势数据
  getJobTrends: (period = 'month') => api.get(`/dashboard/job-trends?period=${period}`),
  
  // 获取专业分布数据
  getMajorDistribution: () => api.get('/dashboard/major-distribution'),
  
  // 获取学习路径完成情况
  getLearningPathStats: () => api.get('/dashboard/learning-path-stats'),
  
  // 获取系统使用情况
  getSystemUsage: (period = 'week') => api.get(`/dashboard/system-usage?period=${period}`),
  
  // 获取当前用户的数据概览
  getUserOverview: () => api.get('/dashboard/user-overview'),
}

// 模拟数据（在后端API完成前使用）
export const mockDashboardData = {
  // 用户统计数据
  userStats: {
    totalUsers: 1250,
    activeUsers: 780,
    newUsersToday: 45,
    userGrowthRate: 12.5
  },
  
  // 职业趋势数据
  jobTrends: {
    categories: ['软件开发', '数据分析', '人工智能', '产品经理', '市场营销'],
    series: [
      {
        name: '平均薪资(万/年)',
        data: [28, 25, 32, 22, 18]
      },
      {
        name: '需求增长率(%)',
        data: [15, 22, 30, 10, 8]
      }
    ],
    timeData: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06']
  },
  
  // 专业分布数据
  majorDistribution: {
    degreeTypes: [
      { name: '本科', value: 65 },
      { name: '硕士', value: 25 },
      { name: '专科', value: 10 }
    ],
    majorTypes: [
      { name: '工学', value: 40 },
      { name: '理学', value: 20 },
      { name: '文学', value: 15 },
      { name: '经济学', value: 15 },
      { name: '其他', value: 10 }
    ]
  },
  
  // 学习路径完成情况
  learningPathStats: {
    pathCompletion: [
      { name: '已完成', value: 35 },
      { name: '进行中', value: 45 },
      { name: '未开始', value: 20 }
    ],
    skillCategories: ['编程技能', '数据分析', '沟通能力', '项目管理', '设计能力'],
    skillCompletion: [75, 60, 85, 40, 55]
  },
  
  // 系统使用情况
  systemUsage: {
    features: ['职业测试', '专业测试', '简历分析', '学习路径', '模拟面试'],
    usageData: [120, 85, 95, 110, 75]
  },
  
  // 用户概览数据
  userOverview: {
    completedTests: 2,
    learningPaths: 3,
    resumeCount: 1,
    interviewCount: 5,
    skillRadar: [
      { name: '技术能力', value: 80 },
      { name: '沟通能力', value: 65 },
      { name: '领导能力', value: 50 },
      { name: '创新能力', value: 75 },
      { name: '团队协作', value: 85 }
    ]
  }
}