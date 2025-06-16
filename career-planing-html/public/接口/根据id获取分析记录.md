---
title: 职业测试
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 职业测试

Base URLs:

# Authentication

# 答题分析相关接口

## GET 根据id获取分析

GET /BASE_URL/analyzeQuestion/report/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |none|
|token|header|string| 是 |none|

> 返回示例

```json
{
  "success": true,
  "errorMsg": null,
  "data": {
    "id": null,
    "description": "✨ 根据你的回答，你是一个注重能力培养、善于规划学习任务，并且喜欢通过多样化方式探索职业方向的人。",
    "whyRecommend": "🎯 基于你的兴趣、技能和对未来工作的期望，我们为您精选了以下专业方向",
    "detailList": null,
    "dataList": [
      {
        "id": 130,
        "type": "哲学",
        "title": "心理学",
        "degreeType": "🎓 本科",
        "matchScore": 87,
        "description": "🧠 本专业旨在培养学生掌握心理学基本理论和研究方法，能够运用心理学知识解决实际问题，培养具有批判性...",
        "studyDuration": "⏳ 4年"
      },
      {
        "id": 159,
        "type": "艺术学",
        "title": "数字媒体技术(艺术与科技)",
        "degreeType": "🎓 本科",
        "matchScore": 89,
        "description": "本专业融合艺术与技术，培养学生在数字媒体创作、游戏开发、动画制作等方面的能力。",
        "studyDuration": "⏳ 4年"
      },
      {
        "id": 132,
        "type": "教育学",
        "title": "社会工作",
        "degreeType": "🎓 本科",
        "matchScore": 84,
        "description": "🤝 本专业培养具备社会工作理论与实践能力，能够从事社会服务、社区治理与政策研究的专业人才。",
        "studyDuration": "⏳ 4年"
      },
      {
        "id": 160,
        "type": "艺术学",
        "title": "音乐表演(音乐学)",
        "degreeType": "🎓 本科",
        "matchScore": 86,
        "description": "本专业培养具有较高音乐表演能力和音乐理论素养的艺术类人才。",
        "studyDuration": "⏳ 4年"
      },
      {
        "id": 93,
        "type": "管理学",
        "title": "工商管理",
        "degreeType": "🎓 本科",
        "matchScore": 85,
        "description": "📚 本专业培养具备现代企业管理理论和实践能力的复合型人才，涵盖战略规划、市场营销、人力资源等多个方...",
        "studyDuration": "⏳ 4年"
      }
    ]
  },
  "total": null,
  "code": 1
}
```

```json
{
  "success": true,
  "errorMsg": null,
  "data": {
    "id": null,
    "description": "根据你的回答，你是一个擅长团队管理、注重经验与直觉判断，并且适应固定周期评估的工作环境的管理者。🌟",
    "whyRecommend": "基于你的兴趣、技能和市场趋势，我们为您精选了以下职业。🎯",
    "detailList": null,
    "dataList": [
      {
        "id": 217,
        "type": "管理类",
        "title": "项目经理",
        "salary": "年薪 20-40万 💰",
        "outlook": "在全球经济复苏的大背景下，企业对项目管理的需求持续增长。根据PMI发布的《职业脉搏调查》，全球范围内...",
        "matchScore": 95,
        "description": "项目经理负责制定项目计划、协调资源、监督执行并确保项目按时交付。他们需要与团队成员、客户和其他利益相..."
      },
      {
        "id": 244,
        "type": "管理类",
        "title": "人力资源经理",
        "salary": "年薪 15-25万 💰",
        "outlook": "随着企业对人才的重视程度不断提高，人力资源经理的需求持续增长。特别是在互联网和高科技行业中，人力资源...",
        "matchScore": 88,
        "description": "人力资源经理的主要职责是负责企业的人力资源管理工作，包括招聘、培训、绩效考核、员工关系等。人力资源经..."
      },
      {
        "id": 276,
        "type": "服务业类",
        "title": "销售经理",
        "salary": "年薪 20-50万 💰",
        "outlook": "采用人才缺口量化法：预计到2025年，高端销售管理岗位缺口将达到20万以上，特别是在金融、科技和医疗...",
        "matchScore": 85,
        "description": "销售经理负责带领团队完成销售目标，开发新客户并维护现有客户关系。他们需要具备优秀的沟通技巧和团队领导..."
      },
      {
        "id": 219,
        "type": "服务业类",
        "title": "运营经理",
        "salary": "年薪 20-35万 💰",
        "outlook": "随着市场竞争的加剧，企业对运营经理的需求不断增加。特别是在互联网和零售行业，运营经理的角色变得尤为重...",
        "matchScore": 82,
        "description": "运营经理负责企业的整体运营管理工作，包括市场推广、客户服务、供应链管理等。他们需要制定详细的运营策略..."
      }
    ]
  },
  "total": null,
  "code": 1
}
```

```json
{
  "success": false,
  "errorMsg": "此数据不存在或者还在解析！",
  "data": null,
  "total": null,
  "code": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 数据模型

