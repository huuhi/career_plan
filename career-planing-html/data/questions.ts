// Career assessment questions
export const careerQuestions = [
  {
    id: 1,
    question: "你更喜欢与人沟通，还是独自工作？",
    options: [
      { value: "与人沟通", label: "我喜欢与人沟通", score: 1 },
      { value: "独自工作", label: "我喜欢独自工作", score: 2 },
    ],
  },
  {
    id: 2,
    question: "你更擅长逻辑分析，还是创意设计？",
    options: [
      { value: "逻辑分析", label: "我擅长逻辑分析", score: 3 },
      { value: "创意设计", label: "我擅长创意设计", score: 4 },
    ],
  },
  {
    id: 3,
    question: "你愿意在办公室工作，还是远程办公？",
    options: [
      { value: "办公室", label: "我喜欢在办公室工作", score: 5 },
      { value: "远程", label: "我更喜欢远程办公", score: 6 },
    ],
  },
  {
    id: 4,
    question: "你对新技术学习感兴趣吗？",
    options: [
      { value: "非常感兴趣", label: "非常感兴趣", score: 7 },
      { value: "一般", label: "一般感兴趣", score: 8 },
      { value: "不感兴趣", label: "不太感兴趣", score: 9 },
    ],
  },
  {
    id: 5,
    question: "你是否喜欢团队合作？",
    options: [
      { value: "喜欢", label: "非常喜欢", score: 10 },
      { value: "一般", label: "一般，看具体情况", score: 11 },
      { value: "不喜欢", label: "不太喜欢", score: 12 },
    ],
  },
  {
    id: 6,
    question: "你倾向于高薪但高压的工作，还是平衡型工作？",
    options: [
      { value: "高薪高压", label: "我选择高薪但高压的工作", score: 13 },
      { value: "平衡", label: "我选择工作生活平衡", score: 14 },
    ],
  },
  {
    id: 7,
    question: "你更喜欢结构化的工作流程，还是灵活自由的方式？",
    options: [
      { value: "结构化", label: "我喜欢结构化流程", score: 15 },
      { value: "灵活", label: "我喜欢灵活自由的方式", score: 16 },
    ],
  },
  {
    id: 8,
    question: "你是否愿意频繁出差？",
    options: [
      { value: "愿意", label: "愿意", score: 17 },
      { value: "不愿意", label: "不愿意", score: 18 },
    ],
  },
  {
    id: 9,
    question: "你对管理岗位有兴趣吗？",
    options: [
      { value: "有兴趣", label: "有管理意愿", score: 19 },
      { value: "没兴趣", label: "目前没有管理意愿", score: 20 },
    ],
  },
  {
    id: 10,
    question: "你更看重职业发展还是薪资待遇？",
    options: [
      { value: "职业发展", label: "更看重职业发展", score: 21 },
      { value: "薪资待遇", label: "更看重薪资待遇", score: 22 },
    ],
  },
  {
    id: 11,
    question: "你更喜欢短期目标明确的任务，还是长期战略型项目？",
    options: [
      { value: "短期", label: "喜欢短期见效的工作", score: 23 },
      { value: "长期", label: "擅长长期战略规划", score: 24 },
    ],
  },
  {
    id: 12,
    question: "面对工作冲突时，你通常如何处理？",
    options: [
      { value: "主动沟通", label: "主动协调解决", score: 25 },
      { value: "上级介入", label: "寻求上级调解", score: 26 },
      { value: "避免冲突", label: "尽量避免正面冲突", score: 27 },
    ],
  },
  {
    id: 13,
    question: "你更享受数据驱动的工作，还是直觉判断型工作？",
    options: [
      { value: "数据驱动", label: "依赖数据和事实", score: 28 },
      { value: "直觉判断", label: "依靠经验和直觉", score: 29 },
    ],
  },
  {
    id: 14,
    question: "你如何看待加班文化？",
    options: [
      { value: "接受", label: "必要时可以接受", score: 30 },
      { value: "反对", label: "反对无效加班", score: 31 },
      { value: "中立", label: "视具体情况而定", score: 32 },
    ],
  },
  {
    id: 15,
    question: "你更喜欢专业化发展，还是多领域涉猎？",
    options: [
      { value: "专业化", label: "深耕单一领域", score: 33 },
      { value: "多领域", label: "跨学科发展", score: 34 },
    ],
  },
  {
    id: 16,
    question: "面对工作压力，你的主要缓解方式是？",
    options: [
      { value: "运动", label: "体育锻炼", score: 35 },
      { value: "社交", label: "朋友聚会", score: 36 },
      { value: "独处", label: "独自放松", score: 37 },
    ],
  },
  {
    id: 17,
    question: "你更倾向于稳定的大公司，还是创业型小公司？",
    options: [
      { value: "大公司", label: "偏好成熟企业", score: 38 },
      { value: "创业公司", label: "喜欢创业环境", score: 39 },
    ],
  },
  {
    id: 18,
    question: "你如何看待职场中的竞争关系？",
    options: [
      { value: "积极", label: "良性竞争促进成长", score: 40 },
      { value: "消极", label: "可能影响合作", score: 41 },
      { value: "中立", label: "正常现象", score: 42 },
    ],
  },
  {
    id: 19,
    question: "你更擅长细节执行，还是宏观规划？",
    options: [
      { value: "细节", label: "擅长细致操作", score: 43 },
      { value: "宏观", label: "善于整体规划", score: 44 },
    ],
  },
  {
    id: 20,
    question: "你更看重公司文化还是个人发展空间？",
    options: [
      { value: "公司文化", label: "文化匹配更重要", score: 45 },
      { value: "发展空间", label: "成长机会更重要", score: 46 },
    ],
  },
  {
    id: 21,
    question: "你更倾向于哪种学习方式？",
    options: [
      { value: "实践操作", label: "动手实践", score: 47 },
      { value: "理论学习", label: "系统学习理论", score: 48 },
      { value: "观察模仿", label: "观察他人做法", score: 49 },
      { value: "混合学习", label: "多种方式结合", score: 50 },
    ],
  },
  {
    id: 22,
    question: "面对突发工作变更，你的第一反应是？",
    options: [
      { value: "冷静分析", label: "快速制定应对方案", score: 51 },
      { value: "寻求支持", label: "联系同事协作解决", score: 52 },
      { value: "情绪波动", label: "需要时间适应变化", score: 53 },
    ],
  },
  {
    id: 23,
    question: "你希望工作给你带来最主要的收获是？",
    options: [
      { value: "物质回报", label: "薪资和福利", score: 54 },
      { value: "能力成长", label: "技能提升", score: 55 },
      { value: "社会地位", label: "职业声望", score: 56 },
      { value: "人际关系", label: "优质人脉", score: 57 },
      { value: "自我实现", label: "成就感", score: 58 },
    ],
  },
  {
    id: 24,
    question: "你更擅长以下哪种沟通形式？",
    options: [
      { value: "书面沟通", label: "邮件/报告", score: 59 },
      { value: "口头表达", label: "演讲/会议", score: 60 },
      { value: "可视化呈现", label: "图表/演示", score: 61 },
      { value: "非语言沟通", label: "肢体语言", score: 62 },
    ],
  },
  {
    id: 25,
    question: "你如何看待工作中的规章制度？",
    options: [
      { value: "严格遵守", label: "规则很重要", score: 63 },
      { value: "灵活处理", label: "视情况调整", score: 64 },
      { value: "创新突破", label: "必要时打破常规", score: 65 },
    ],
  },
  {
    id: 26,
    question: "你更享受工作过程中的哪个阶段？",
    options: [
      { value: "策划阶段", label: "构思创意", score: 66 },
      { value: "执行阶段", label: "具体实施", score: 67 },
      { value: "收尾阶段", label: "完成交付", score: 68 },
      { value: "复盘阶段", label: "总结优化", score: 69 },
    ],
  },
  {
    id: 27,
    question: "你更倾向于哪种决策风格？",
    options: [
      { value: "快速决策", label: "当机立断", score: 70 },
      { value: "谨慎决策", label: "多方论证", score: 71 },
      { value: "民主决策", label: "团队共识", score: 72 },
      { value: "直觉决策", label: "凭感觉选择", score: 73 },
    ],
  },
  {
    id: 28,
    question: "你更愿意在什么规模团队中工作？",
    options: [
      { value: "小型团队", label: "3-5人精干团队", score: 74 },
      { value: "中型团队", label: "10人左右部门", score: 75 },
      { value: "大型团队", label: "跨部门协作", score: 76 },
      { value: "独立工作", label: "单兵作战", score: 77 },
    ],
  },
  {
    id: 29,
    question: "你更看重领导的哪种特质？",
    options: [
      { value: "专业能力", label: "业务水平过硬", score: 78 },
      { value: "管理艺术", label: "团队管理能力", score: 79 },
      { value: "人格魅力", label: "个人影响力", score: 80 },
      { value: "发展眼光", label: "战略视野", score: 81 },
    ],
  },
  {
    id: 30,
    question: "你更倾向于哪种工作节奏？",
    options: [
      { value: "匀速平稳", label: "稳定可预测", score: 82 },
      { value: "间歇冲刺", label: "忙闲交替", score: 83 },
      { value: "持续高压", label: "高强度挑战", score: 84 },
    ],
  },
  {
    id: 31,
    question: "你更关注工作的哪个方面？",
    options: [
      { value: "社会价值", label: "对社会的影响", score: 85 },
      { value: "个人成长", label: "能力提升空间", score: 86 },
      { value: "经济回报", label: "收入水平", score: 87 },
      { value: "工作环境", label: "同事关系/氛围", score: 88 },
    ],
  },
  {
    id: 32,
    question: "你更擅长处理哪种类型的信息？",
    options: [
      { value: "数字信息", label: "财务/数据分析", score: 89 },
      { value: "文字信息", label: "文档/报告", score: 90 },
      { value: "图像信息", label: "设计/视觉", score: 91 },
      { value: "抽象概念", label: "理论/模型", score: 92 },
    ],
  },
  {
    id: 33,
    question: "你更倾向于哪种创新方式？",
    options: [
      { value: "颠覆式创新", label: "突破性改变", score: 93 },
      { value: "渐进式改进", label: "持续优化", score: 94 },
      { value: "组合式创新", label: "跨界整合", score: 95 },
    ],
  },
  {
    id: 34,
    question: "你更愿意在什么行业工作？",
    options: [
      { value: "传统行业", label: "制造/金融等", score: 96 },
      { value: "科技行业", label: "互联网/AI等", score: 97 },
      { value: "新兴行业", label: "新能源/生物科技", score: 98 },
      { value: "创意行业", label: "广告/艺术", score: 99 },
      { value: "公共服务", label: "政府/NGO", score: 100 },
    ],
  },
  {
    id: 35,
    question: "你更看重公司的哪些福利？",
    options: [
      { value: "健康保障", label: "医疗保险", score: 101 },
      { value: "学习发展", label: "培训预算", score: 102 },
      { value: "弹性制度", label: "灵活工作时间", score: 103 },
      { value: "股权激励", label: "长期回报", score: 104 },
    ],
  },
  {
    id: 36,
    question: "你更倾向于哪种职业发展路径？",
    options: [
      { value: "专家路线", label: "技术/专业深耕", score: 105 },
      { value: "管理路线", label: "团队管理", score: 106 },
      { value: "创业路线", label: "自主创业", score: 107 },
      { value: "自由职业", label: "项目制工作", score: 108 },
    ],
  },
  {
    id: 37,
    question: "你更适应哪种工作环境？",
    options: [
      { value: "安静独立", label: "专注型环境", score: 109 },
      { value: "开放协作", label: "互动型空间", score: 110 },
      { value: "混合模式", label: "灵活切换", score: 111 },
    ],
  },
  {
    id: 38,
    question: "你更倾向于哪种任务分配方式？",
    options: [
      { value: "明确指派", label: "清晰的任务说明", score: 112 },
      { value: "自主选择", label: "自由领取任务", score: 113 },
      { value: "挑战性任务", label: "有难度的项目", score: 114 },
    ],
  },
  {
    id: 39,
    question: "你如何看待工作与生活的边界？",
    options: [
      { value: "严格区分", label: "工作生活完全分开", score: 115 },
      { value: "适度融合", label: "允许一定交叉", score: 116 },
      { value: "高度融合", label: "工作即生活", score: 117 },
    ],
  },
  {
    id: 40,
    question: "你更看重企业哪些价值观？",
    options: [
      { value: "创新", label: "鼓励突破", score: 118 },
      { value: "诚信", label: "正直透明", score: 119 },
      { value: "协作", label: "团队精神", score: 120 },
      { value: "客户至上", label: "服务意识", score: 121 },
      { value: "可持续发展", label: "长期主义", score: 122 },
    ],
  },
  {
    id: 41,
    question: "你更倾向于哪种工作反馈频率？",
    options: [
      { value: "实时反馈", label: "及时沟通", score: 123 },
      { value: "定期反馈", label: "固定周期评估", score: 124 },
      { value: "项目制反馈", label: "按项目节点", score: 125 },
    ],
  },
  {
    id: 42,
    question: "你更擅长处理什么类型的工作关系？",
    options: [
      { value: "上下级关系", label: "纵向管理", score: 126 },
      { value: "跨部门关系", label: "横向协作", score: 127 },
      { value: "客户关系", label: "对外沟通", score: 128 },
    ],
  },
  {
    id: 43,
    question: "你更倾向于哪种工作动机？",
    options: [
      { value: "成就驱动", label: "挑战自我", score: 129 },
      { value: "成长驱动", label: "学习新技能", score: 130 },
      { value: "关系驱动", label: "人际互动", score: 131 },
      { value: "安全驱动", label: "稳定性", score: 132 },
    ],
  },
  {
    id: 44,
    question: "你更适应哪种工作强度？",
    options: [
      { value: "朝九晚五", label: "规律作息", score: 133 },
      { value: "弹性工作", label: "自主安排时间", score: 134 },
      { value: "项目冲刺", label: "阶段性忙碌", score: 135 },
      { value: "全天候", label: "随时响应", score: 136 },
    ],
  },
  {
    id: 45,
    question: "你更倾向于哪种问题解决方式？",
    options: [
      { value: "独立解决", label: "自己研究", score: 137 },
      { value: "团队协作", label: "集思广益", score: 138 },
      { value: "专家咨询", label: "请教专业人士", score: 139 },
    ],
  },
  {
    id: 46,
    question: "你更看重企业哪方面的稳定性？",
    options: [
      { value: "财务健康", label: "盈利状况", score: 140 },
      { value: "战略方向", label: "业务规划", score: 141 },
      { value: "管理团队", label: "领导层", score: 142 },
      { value: "市场地位", label: "行业排名", score: 143 },
    ],
  },
  {
    id: 47,
    question: "你更倾向于哪种会议形式？",
    options: [
      { value: "线下会议", label: "面对面交流", score: 144 },
      { value: "视频会议", label: "线上高效沟通", score: 145 },
      { value: "异步沟通", label: "文档协作", score: 146 },
    ],
  },
  {
    id: 48,
    question: "你更愿意承担什么类型的风险？",
    options: [
      { value: "职业转型", label: "跨领域发展", score: 147 },
      { value: "创业风险", label: "商业冒险", score: 148 },
      { value: "技术风险", label: "尝试新技术", score: 149 },
      { value: "低风险", label: "稳健选择", score: 150 },
    ],
  },
  {
    id: 49,
    question: "你更倾向于哪种时间管理方式？",
    options: [
      { value: "严格计划", label: "详细日程表", score: 151 },
      { value: "优先级管理", label: "要事第一", score: 152 },
      { value: "灵活调整", label: "随机应变", score: 153 },
    ],
  },
  {
    id: 50,
    question: "你更看重同事的哪些特质？",
    options: [
      { value: "专业能力", label: "业务水平", score: 154 },
      { value: "合作精神", label: "团队意识", score: 155 },
      { value: "沟通能力", label: "表达清晰", score: 156 },
      { value: "责任心", label: "靠谱可信赖", score: 157 },
      { value: "创新思维", label: "独特见解", score: 158 },
    ],
  },
]

// Major assessment questions
export const majorQuestions = [
  {
    id: 71,
    question: "你更擅长以下哪种学习场景？",
    options: [
      { value: "课堂听讲", label: "老师讲解时效率高", score: 156 },
      { value: "自习做题", label: "自己练习时收获大", score: 157 },
      { value: "小组讨论", label: "和同学交流时理解更深", score: 158 },
      { value: "实践操作", label: "动手实验或实训", score: 159 },
    ],
  },
  {
    id: 72,
    question: "面对不擅长的科目，你会：",
    options: [
      { value: "重点突破", label: "制定补习计划", score: 160 },
      { value: "扬长避短", label: "加强优势科目", score: 161 },
      { value: "寻求帮助", label: "找老师/家教", score: 162 },
      { value: "调整心态", label: "接受不完美", score: 163 },
    ],
  },
  {
    id: 73,
    question: "你更希望学校提供哪些支持？",
    options: [
      { value: "升学指导", label: "选科/志愿填报", score: 164 },
      { value: "职业体验", label: "企业参观/实习", score: 165 },
      { value: "技能证书", label: "考培支持", score: 166 },
      { value: "心理辅导", label: "压力管理", score: 167 },
    ],
  },
  {
    id: 74,
    question: "你更倾向哪种升学路径？",
    options: [
      { value: "普通高考", label: "学术型大学", score: 168 },
      { value: "职教高考", label: "应用型本科/高职", score: 169 },
      { value: "海外留学", label: "国外院校", score: 170 },
      { value: "直接就业", label: "先工作再提升", score: 171 },
    ],
  },
  {
    id: 75,
    question: "你更关注未来职业的哪些方面？",
    options: [
      { value: "收入水平", label: "薪资待遇", score: 172 },
      { value: "发展空间", label: "晋升机会", score: 173 },
      { value: "工作稳定性", label: "铁饭碗", score: 174 },
      { value: "兴趣匹配", label: "做喜欢的事", score: 175 },
    ],
  },
  {
    id: 76,
    question: "你更愿意通过什么方式探索职业？",
    options: [
      { value: "实习体验", label: "实际工作尝试", score: 176 },
      { value: "职业测评", label: "测试工具评估", score: 177 },
      { value: "家人建议", label: "参考长辈经验", score: 178 },
      { value: "行业讲座", label: "听从业者分享", score: 179 },
    ],
  },
  {
    id: 77,
    question: "你更擅长以下哪种任务？",
    options: [
      { value: "记忆类", label: "背诵/知识点整理", score: 180 },
      { value: "逻辑类", label: "数学/推理题", score: 181 },
      { value: "创意类", label: "设计/写作", score: 182 },
      { value: "操作类", label: "动手制作/实验", score: 183 },
    ],
  },
  {
    id: 78,
    question: "你每天课后自主学习的时长大约是？",
    options: [
      { value: "1小时以内", label: "较少", score: 184 },
      { value: "1-2小时", label: "适中", score: 185 },
      { value: "2-3小时", label: "较多", score: 186 },
      { value: "3小时以上", label: "高强度", score: 187 },
    ],
  },
  {
    id: 79,
    question: "你更倾向哪种专业选择依据？",
    options: [
      { value: "兴趣导向", label: "自己喜欢", score: 188 },
      { value: "就业导向", label: "好找工作", score: 189 },
      { value: "能力匹配", label: "自己擅长", score: 190 },
      { value: "家庭建议", label: "父母推荐", score: 191 },
    ],
  },
  {
    id: 80,
    question: "你如何应对考试压力？",
    options: [
      { value: "提前复习", label: "充分准备", score: 192 },
      { value: "放松调节", label: "运动/音乐", score: 193 },
      { value: "心理暗示", label: "自我鼓励", score: 194 },
      { value: "顺其自然", label: "不过度焦虑", score: 195 },
    ],
  },
  {
    id: 81,
    question: "你更愿意参加哪种校园活动？",
    options: [
      { value: "学科竞赛", label: "奥赛/技能大赛", score: 196 },
      { value: "社团活动", label: "兴趣社团", score: 197 },
      { value: "志愿服务", label: "社会实践", score: 198 },
      { value: "文体比赛", label: "运动会/艺术节", score: 199 },
    ],
  },
  {
    id: 82,
    question: "你更看重学校的哪些条件？",
    options: [
      { value: "师资力量", label: "老师水平", score: 200 },
      { value: "硬件设施", label: "设备/场地", score: 201 },
      { value: "升学率", label: "名校录取数据", score: 202 },
      { value: "校园氛围", label: "同学关系", score: 203 },
    ],
  },
  {
    id: 83,
    question: "你未来更想从事哪类工作？",
    options: [
      { value: "技术型", label: "工程师/技师", score: 204 },
      { value: "服务型", label: "医疗/教育", score: 205 },
      { value: "创意型", label: "设计/艺术", score: 206 },
      { value: "管理型", label: "创业/行政", score: 207 },
    ],
  },
  {
    id: 84,
    question: "你更依赖哪种学习工具？",
    options: [
      { value: "传统教材", label: "课本/笔记", score: 208 },
      { value: "数字设备", label: "平板/学习APP", score: 209 },
      { value: "实操工具", label: "实验器材/实训设备", score: 210 },
      { value: "人际资源", label: "老师/同学帮助", score: 211 },
    ],
  },
  {
    id: 85,
    question: "你更倾向在什么环境下学习？",
    options: [
      { value: "图书馆", label: "绝对安静", score: 212 },
      { value: "教室", label: "适度学习氛围", score: 213 },
      { value: "家里", label: "舒适自由", score: 214 },
      { value: "户外", label: "自然环境中", score: 215 },
    ],
  },
  {
    id: 86,
    question: "你未来的学历目标是？",
    options: [
      { value: "博士/硕士", label: "研究生及以上", score: 216 },
      { value: "本科", label: "普通本科", score: 217 },
      { value: "高职/大专", label: "应用型专科", score: 218 },
      { value: "中职/技校", label: "中等职业教育", score: 219 },
      { value: "其他", label: "尚未明确", score: 220 },
    ],
  },
  {
    id: 87,
    question: "你希望何时开始职业发展？",
    options: [
      { value: "在校期间", label: "边读书边实习", score: 221 },
      { value: "毕业立即", label: "一毕业就工作", score: 222 },
      { value: "继续深造", label: "升学后再就业", score: 223 },
      { value: "灵活调整", label: "根据机会决定", score: 224 },
    ],
  },
  {
    id: 88,
    question: "你更信任哪种职业信息渠道？",
    options: [
      { value: "官方数据", label: "政府/学校统计", score: 225 },
      { value: "亲身实践", label: "实习/兼职体验", score: 226 },
      { value: "师长建议", label: "老师/家长推荐", score: 227 },
      { value: "网络评价", label: "社交媒体/论坛", score: 228 },
    ],
  },
  {
    id: 89,
    question: "你更倾向以下哪种学习困境解决方式？",
    options: [
      { value: "自主钻研", label: "自己查资料", score: 229 },
      { value: "工具辅助", label: "用学习APP/AI", score: 230 },
      { value: "同伴互助", label: "学习小组讨论", score: 231 },
      { value: "权威指导", label: "直接问老师", score: 232 },
    ],
  },
  {
    id: 90,
    question: "你对职业技能证书的看法是？",
    options: [
      { value: "必要", label: "多多益善", score: 233 },
      { value: "精选", label: "考核心证书", score: 234 },
      { value: "替代", label: "用实际作品代替", score: 235 },
      { value: "无用", label: "更看重经验", score: 236 },
    ],
  },
  {
    id: 91,
    question: "你更擅长处理哪种类型的学习内容？",
    options: [
      { value: "抽象理论", label: "数学/哲学概念", score: 237 },
      { value: "具象操作", label: "实验/手工步骤", score: 238 },
      { value: "社会分析", label: "历史/经济现象", score: 239 },
      { value: "情感表达", label: "文学/艺术创作", score: 240 },
    ],
  },
  {
    id: 92,
    question: "你更看重学校的哪些资源？",
    options: [
      { value: "师资", label: "优秀教师", score: 241 },
      { value: "设备", label: "实训/实验室", score: 242 },
      { value: "校友", label: "就业网络", score: 243 },
      { value: "课程", label: "特色专业", score: 244 },
    ],
  },
  {
    id: 93,
    question: "你更倾向如何证明自己的能力？",
    options: [
      { value: "考试成绩", label: "分数/排名", score: 245 },
      { value: "实践成果", label: "作品/项目", score: 246 },
      { value: "社会认可", label: "证书/奖项", score: 247 },
      { value: "师长评价", label: "推荐信/评语", score: 248 },
    ],
  },
  {
    id: 94,
    question: "你对未来工作地点的倾向是？",
    options: [
      { value: "大城市", label: "一线城市", score: 249 },
      { value: "家乡", label: "就近就业", score: 250 },
      { value: "海外", label: "国外发展", score: 251 },
      { value: "远程", label: "地点不限", score: 252 },
    ],
  },
  {
    id: 95,
    question: "你更关注专业的哪些方面？",
    options: [
      { value: "兴趣", label: "符合爱好", score: 253 },
      { value: "就业率", label: "好找工作", score: 254 },
      { value: "收入", label: "毕业薪资", score: 255 },
      { value: "发展", label: "行业前景", score: 256 },
    ],
  },
  {
    id: 96,
    question: "你更倾向哪种课外提升方式？",
    options: [
      { value: "网课", label: "在线学习", score: 257 },
      { value: "培训班", label: "线下辅导", score: 258 },
      { value: "自学", label: "免费资源", score: 259 },
      { value: "竞赛", label: "比赛实践", score: 260 },
    ],
  },
  {
    id: 97,
    question: "你如何看待学生兼职？",
    options: [
      { value: "必要", label: "积累经验", score: 261 },
      { value: "可选", label: "适度参与", score: 262 },
      { value: "谨慎", label: "不影响学业", score: 263 },
      { value: "反对", label: "专注学习", score: 264 },
    ],
  },
  {
    id: 98,
    question: "你更倾向哪种大学校园生活？",
    options: [
      { value: "学术", label: "研究/实验室", score: 265 },
      { value: "社交", label: "社团/活动", score: 266 },
      { value: "实践", label: "实习/创业", score: 267 },
      { value: "平衡", label: "多元发展", score: 268 },
    ],
  },
  {
    id: 99,
    question: "你更愿意在什么时间做职业规划？",
    options: [
      { value: "早期", label: "初中/高一", score: 269 },
      { value: "中期", label: "高二/高三", score: 270 },
      { value: "后期", label: "大学/职校", score: 271 },
      { value: "随机", label: "遇到问题再考虑", score: 272 },
    ],
  },
  {
    id: 100,
    question: "你更看重未来工作的哪些特质？",
    options: [
      { value: "创造性", label: "发挥创意", score: 273 },
      { value: "稳定性", label: "长期可靠", score: 274 },
      { value: "挑战性", label: "快速成长", score: 275 },
      { value: "公益性", label: "帮助他人", score: 276 },
    ],
  },
  {
    id: 101,
    question: "你更倾向如何分配每日学习时间？",
    options: [
      { value: "固定时段", label: "严格时间表", score: 277 },
      { value: "任务导向", label: "按任务量调整", score: 278 },
      { value: "精力周期", label: "根据状态波动", score: 279 },
      { value: "碎片整合", label: "利用零散时间", score: 280 },
    ],
  },
  {
    id: 102,
    question: "你更愿意通过什么方式了解职业？",
    options: [
      { value: "职业体验日", label: "实地参观", score: 281 },
      { value: "人物访谈", label: "采访从业者", score: 282 },
      { value: "纪录片", label: "观看行业影片", score: 283 },
      { value: "模拟工作", label: "角色扮演游戏", score: 284 },
    ],
  },
  {
    id: 103,
    question: "面对学习焦虑，你通常会：",
    options: [
      { value: "分析源头", label: "理性解决问题", score: 285 },
      { value: "转移注意", label: "运动/娱乐", score: 286 },
      { value: "倾诉宣泄", label: "找朋友聊天", score: 287 },
      { value: "专业求助", label: "心理咨询", score: 288 },
    ],
  },
  {
    id: 104,
    question: "你更看重教育中的哪些元素？",
    options: [
      { value: "知识传授", label: "学科内容", score: 289 },
      { value: "思维训练", label: "方法论培养", score: 290 },
      { value: "人格塑造", label: "价值观教育", score: 291 },
      { value: "社会适应", label: "生存技能", score: 292 },
    ],
  },
  {
    id: 105,
    question: "你更倾向哪种技术工具辅助学习？",
    options: [
      { value: "AI助手", label: "智能问答", score: 293 },
      { value: "知识图谱", label: "思维导图", score: 294 },
      { value: "模拟软件", label: "虚拟实验", score: 295 },
      { value: "传统工具", label: "纸笔记录", score: 296 },
    ],
  },
  {
    id: 106,
    question: "你更愿意参加哪种实践活动？",
    options: [
      { value: "科研项目", label: "学术研究", score: 297 },
      { value: "商业竞赛", label: "创业大赛", score: 298 },
      { value: "社区服务", label: "志愿者", score: 299 },
      { value: "艺术展演", label: "作品展示", score: 300 },
    ],
  },
  {
    id: 107,
    question: "你更关注哪种学科联动？",
    options: [
      { value: "STEM", label: "理工科交叉", score: 301 },
      { value: "人文艺术", label: "文史哲艺术", score: 302 },
      { value: "文理融合", label: "如心理学+生物", score: 303 },
      { value: "技能复合", label: "如编程+设计", score: 304 },
    ],
  },
  {
    id: 108,
    question: "你更倾向哪种考试复习策略？",
    options: [
      { value: "系统梳理", label: "构建知识框架", score: 305 },
      { value: "题海战术", label: "大量练习", score: 306 },
      { value: "重点突破", label: "专攻薄弱点", score: 307 },
      { value: "合作复习", label: "小组互测", score: 308 },
    ],
  },
  {
    id: 109,
    question: "你对未来工作与兴趣的关系看法是？",
    options: [
      { value: "必须结合", label: "工作=兴趣", score: 309 },
      { value: "可以分离", label: "工作≠兴趣", score: 310 },
      { value: "培养兴趣", label: "在工作中发展", score: 311 },
      { value: "动态调整", label: "不同阶段不同", score: 312 },
    ],
  },
  {
    id: 110,
    question: "你更倾向哪种学习反馈形式？",
    options: [
      { value: "即时评分", label: "AI自动批改", score: 313 },
      { value: "详细评语", label: "教师人工反馈", score: 314 },
      { value: "等级评价", label: "ABCD等第", score: 315 },
      { value: "相互评价", label: "班级排名", score: 316 },
    ],
  },
  {
    id: 111,
    question: "你如何看待校园人际关系？",
    options: [
      { value: "核心圈", label: "少数深交朋友", score: 317 },
      { value: "广泛社交", label: "多个社交群体", score: 318 },
      { value: "师生互动", label: "侧重与老师交流", score: 319 },
      { value: "适度参与", label: "保持必要社交", score: 320 },
    ],
  },
  {
    id: 112,
    question: "你更倾向哪种知识获取渠道？",
    options: [
      { value: "学校教育", label: "课堂主渠道", score: 321 },
      { value: "网络课程", label: "MOOC/平台", score: 322 },
      { value: "实践社区", label: "论坛/社群", score: 323 },
      { value: "传统阅读", label: "书籍/报刊", score: 324 },
    ],
  },
  {
    id: 113,
    question: "你更愿意如何展示学习成果？",
    options: [
      { value: "考试答卷", label: "标准化测试", score: 325 },
      { value: "作品集", label: "创意产出", score: 326 },
      { value: "答辩演示", label: "口头报告", score: 327 },
      { value: "过程记录", label: "学习日志", score: 328 },
    ],
  },
  {
    id: 114,
    question: "你对专业与职业关系的看法是？",
    options: [
      { value: "严格对口", label: "学什么做什么", score: 329 },
      { value: "相关即可", label: "大方向匹配", score: 330 },
      { value: "无关紧要", label: "能力重于专业", score: 331 },
      { value: "跨学科优势", label: "复合型发展", score: 332 },
    ],
  },
  {
    id: 115,
    question: "你更适应哪种教学节奏？",
    options: [
      { value: "快速推进", label: "高强度学习", score: 333 },
      { value: "稳步渐进", label: "循序渐进", score: 334 },
      { value: "弹性速度", label: "根据内容调整", score: 335 },
      { value: "自主掌控", label: "按个人进度", score: 336 },
    ],
  },
  {
    id: 116,
    question: "你更倾向哪种校园生活节奏？",
    options: [
      { value: "规律型", label: "固定作息", score: 337 },
      { value: "项目型", label: "按任务波动", score: 338 },
      { value: "社交型", label: "以活动为中心", score: 339 },
      { value: "自由型", label: "完全自主", score: 340 },
    ],
  },
  {
    id: 117,
    question: "你更看重实习的哪些价值？",
    options: [
      { value: "技能提升", label: "硬实力培养", score: 341 },
      { value: "行业认知", label: "了解真实职场", score: 342 },
      { value: "人脉积累", label: "结识业内人士", score: 343 },
      { value: "履历背书", label: "名企经历", score: 344 },
    ],
  },
  {
    id: 118,
    question: "你更倾向如何选择专业方向？",
    options: [
      { value: "能力匹配", label: "扬长避短", score: 345 },
      { value: "兴趣驱动", label: "个人热爱", score: 346 },
      { value: "家庭传承", label: "延续家业/资源", score: 347 },
      { value: "社会需求", label: "就业缺口", score: 348 },
    ],
  },
  {
    id: 119,
    question: "你更关注学习中的哪些体验？",
    options: [
      { value: "成就感", label: "解决问题快感", score: 349 },
      { value: "探索感", label: "发现新知识", score: 350 },
      { value: "掌控感", label: "自主安排进度", score: 351 },
      { value: "连接感", label: "与他人协作", score: 352 },
    ],
  },
  {
    id: 120,
    question: "你更倾向哪种课外学习组织形式？",
    options: [
      { value: "学科竞赛", label: "奥赛/创客大赛", score: 353 },
      { value: "兴趣社团", label: "动漫/音乐社等", score: 354 },
      { value: "学术沙龙", label: "读书会/研讨会", score: 355 },
      { value: "自治项目", label: "学生自组织活动", score: 356 },
    ],
  },
  {
    id: 121,
    question: "你对未来工作模式的期待是？",
    options: [
      { value: "传统坐班", label: "固定办公", score: 357 },
      { value: "混合办公", label: "线上线下结合", score: 358 },
      { value: "完全远程", label: "数字游民", score: 359 },
      { value: "自由职业", label: "接单项目制", score: 360 },
    ],
  },
  {
    id: 122,
    question: "你更倾向哪种知识内化方式？",
    options: [
      { value: "教授他人", label: "费曼学习法", score: 361 },
      { value: "反复练习", label: "刻意训练", score: 362 },
      { value: "场景应用", label: "实际使用", score: 363 },
      { value: "思维整理", label: "笔记/导图", score: 364 },
    ],
  },
  {
    id: 123,
    question: "你更看重教育阶段的哪些收获？",
    options: [
      { value: "学历证书", label: "文凭", score: 365 },
      { value: "能力提升", label: "可迁移技能", score: 366 },
      { value: "人脉资源", label: "同学/师长关系", score: 367 },
      { value: "自我认知", label: "了解自己", score: 368 },
    ],
  },
  {
    id: 124,
    question: "你更倾向哪种师生互动模式？",
    options: [
      { value: "权威型", label: "严格指导", score: 369 },
      { value: "伙伴型", label: "平等讨论", score: 370 },
      { value: "导师型", label: "个性化建议", score: 371 },
      { value: "放任型", label: "自主探索", score: 372 },
    ],
  },
  {
    id: 125,
    question: "你对人工智能辅助学习的看法是？",
    options: [
      { value: "积极拥抱", label: "全面使用AI工具", score: 373 },
      { value: "选择性用", label: "辅助特定环节", score: 374 },
      { value: "谨慎对待", label: "防止依赖", score: 375 },
      { value: "拒绝使用", label: "坚持传统方式", score: 376 },
    ],
  },
  {
    id: 126,
    question: "你更倾向哪种职业发展策略？",
    options: [
      { value: "专精路线", label: "成为领域专家", score: 377 },
      { value: "复合路线", label: "多技能组合", score: 378 },
      { value: "管理路线", label: "转向团队领导", score: 379 },
      { value: "自由路线", label: "不定期转型", score: 380 },
    ],
  },
  {
    id: 127,
    question: "你更愿意如何提升软实力？",
    options: [
      { value: "刻意训练", label: "专项课程", score: 381 },
      { value: "环境浸泡", label: "参与社团/项目", score: 382 },
      { value: "观察模仿", label: "学习榜样", score: 383 },
      { value: "反思总结", label: "日记/复盘", score: 384 },
    ],
  },
  {
    id: 128,
    question: "你对未来工作与生活平衡的期待是？",
    options: [
      { value: "工作优先", label: "事业为重", score: 385 },
      { value: "绝对平衡", label: "严格区分", score: 386 },
      { value: "动态调整", label: "阶段侧重", score: 387 },
      { value: "融合统一", label: "工作即生活", score: 388 },
    ],
  },
  {
    id: 129,
    question: "你更倾向哪种社会角色？",
    options: [
      { value: "专家", label: "技术权威", score: 389 },
      { value: "管理者", label: "组织协调者", score: 390 },
      { value: "创作者", label: "内容生产者", score: 391 },
      { value: "服务者", label: "支持型角色", score: 392 },
    ],
  },
]

// Function to get random questions
export const getRandomQuestions = (questions: any[], count = 10) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
