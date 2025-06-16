// 统一管理API服务
import axios from "axios"

// 解析流式数据
function parseStreamData(chunk: string): string {
  // 尝试解析data:{"data":"..."} 格式
  try {
    if (chunk.startsWith("data:")) {
      const jsonStr = chunk.substring(5);
      const jsonData = JSON.parse(jsonStr);
      return jsonData.data || "";
    } 
  } catch (error) {
    console.error("解析流式数据失败:", error);
  }
  
  // 如果解析失败或不是data:格式，返回原始数据
  return chunk;
}

// 统一管理BASE_URL
// 
//https://116.205.241.217
//https://www.syyyh.chat
const BASE_URL = "https://www.syyyh.chat"

// 创建axios实例
const api = axios.create({
  baseURL: BASE_URL,
})

// 请求拦截器添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器处理API错误
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 更健壮的错误处理
    if (error.response) {
      // 请求已发出，但服务器返回状态码不在 2xx 范围内
      console.error(
        "API Error:", 
        error.response.status, 
        error.response.data || "无错误详情"
      )

      // 如果状态码是401，重定向到登录页面
      if (error.response.status === 401) {
        // 清除存储的token
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        // 重定向到登录页面
        window.location.href = "/login"
        return Promise.reject(new Error("登录已过期，请重新登录"))
      } 
      
      // 处理服务器错误
      if (error.response.status >= 500) {
        return Promise.reject(new Error("服务器处理请求时出现了问题，请稍后重试"))
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error("Network Error: 请求未收到响应", error.request)
      return Promise.reject(new Error("网络异常，请检查网络连接"))
    } else {
      // 设置请求时发生了错误
      console.error("Request Error:", error.message)
    }

    // 网络错误或服务器错误，直接返回
    return Promise.reject(error)
  },
)

// 用户相关API
export const userApi = {
  register: (data: { username: string; phone: string; password: string }) => api.post("/user/register", data),
  login: (data: { phone: string; password: string }) => api.post("/user/login", data),
  // 添加修改密码的API
  updatePassword: (data: { oldPassword: string; newPassword: string }) => api.put("/user/updatePassword", data),
  // 添加更新用户信息的API
  updateSummary: (data: { summary: string, id: number, avatar?: string }) => api.put("/user/updateSummary", data),
  // 获取用户基本信息
  getUserData: () => api.get("/user/getUserData"),
}
//测试连接接口
export const testApi = {
  testConnection: () => api.get("/test")
}


// 简历相关API
export const resumeApi = {
  // 更新resumeApi.send方法以更好地处理流式数据
  send: async (resumeId: string, onChunk: (chunk: string) => void) => {
    return new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem("token")

        // 创建自定义fetch请求以处理流式响应
        fetch(`${BASE_URL}/resume/send/${resumeId}`, {
          method: "POST",
          headers: {
            token: token || "",
            Accept: "text/event-stream",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            if (!response.body) {
              throw new Error("Response body is not available")
            }

            // 设置响应体流的读取器
            const reader = response.body.getReader()

            // 处理流
            const decoder = new TextDecoder()
            let buffer = ""

            function processStream() {
              reader
                .read()
                .then(({ done, value }) => {
                  if (done) {
                    resolve(true)
                    return
                  }

                  // 解码块并添加到缓冲区
                  const text = decoder.decode(value, { stream: true })
                  buffer += text

                  // 处理缓冲区中的每一行
                  const lines = buffer.split("\n")
                  buffer = lines.pop() || "" // 保留缓冲区中最后一个不完整的行

                  for (const line of lines) {
                    if (line.trim()) {
                      onChunk(line)
                    }
                  }

                  // 继续处理流
                  processStream()
                })
                .catch((error) => {
                  console.error("Error reading stream:", error)
                  reject(error)
                })
            }

            processStream()
          })
          .catch((error) => {
            console.error("Fetch error:", error)
            reject(error)
          })
      } catch (error) {
        console.error("Error setting up stream:", error)
        reject(error)
      }
    })
  },

  get: (resumeId?: string) => (resumeId ? api.get(`/resume/get/${resumeId}`) : api.get("/resume/get")),
  update: (data: any) => api.put("/resume/update", data),
  save: (data: any) => api.post("/resume/save", data),
  setDefault: (id: string) => {
    const formData = new FormData()
    formData.append("id", id)
    return api.put("/resume/setDefault", formData)
  },
  // 添加删除简历的API
  deleteResume: (id: string) => api.delete(`/resume/del/${id}`),
}

// 问题分析相关API
export const analysisApi = {
  analyzeJob: (data: Array<{ score: number; question: string; answer: string }>) =>
    api.post("/analyzeQuestion/job", data),

  analyzeProfession: (data: Array<{ score: number; question: string; answer: string }>) =>
    api.post("/analyzeQuestion/profession", data),

  getReport: (id: string) => api.get(`/analyzeQuestion/report/${id}`),
  getJobAnalysis: () => api.get("/analyzeQuestion/getJob"),
  getMajorAnalysis: () => api.get("/analyzeQuestion/getMajors"),
}

// 模拟面试相关API
export const interviewApi = {
  // 开始新的模拟面试
  startNew: (data: { jobName: string, resumeId: number }) => 
    api.post("/interview/new", data),
  
  // 继续面试对话
  continueInterview: (data: { answer: string, memoryId: number }) => 
    api.post("/interview/continue", data),
  
  // 使用ID开始模拟面试
  startWithId: (memoryId: string) => 
    api.post(`/interview/new/${memoryId}`),
  
  // 使用ID开始模拟面试并处理流式数据
  startWithIdStream: async (memoryId: string, onChunk: (chunk: string) => void) => {
    return new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem("token");
        
        console.log("开始面试流式请求，memoryId:", memoryId);
        
        // 先尝试获取响应
        const response = await fetch(`${BASE_URL}/interview/new/${memoryId}`, {
          method: "POST",
          headers: {
            token: token || "",
            Accept: "text/event-stream",
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        if (!response.body) {
          throw new Error("Response body is not available");
        }
        
        // 获取读取器
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        // 存储已处理的内容，避免重复
        let processedChunks = new Set();
        
        // 处理流
        while (true) {
          try {
            const { done, value } = await reader.read();
            
            if (done) {
              // 处理缓冲区中剩余的内容
              if (buffer.trim()) {
                onChunk(buffer);
              }
              console.log("面试初始化流结束");
              resolve({ success: true, memoryId });
              break;
            }
            
            // 解码块并添加到缓冲区
            const text = decoder.decode(value, { stream: true });
            buffer += text;
            
            console.log("接收到面试初始化流数据:", buffer);
            
            // 处理缓冲区中的每一行
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // 保留缓冲区中最后一个不完整的行
            
            for (const line of lines) {
              if (line.trim()) {
                console.log("发送面试初始化数据块到UI:", line);
                // 检查内容是否已经处理过
                if (!processedChunks.has(line)) {
                  // 每当有新行时立即回调
                  onChunk(line);
                  // 记录已处理的内容
                  processedChunks.add(line);
                } else {
                  console.log("跳过重复内容:", line);
                }
              }
            }
          } catch (readError) {
            console.error("Error reading stream:", readError);
            reject(readError);
            break;
          }
        }
      } catch (error) {
        console.error("Error setting up stream:", error);
        reject(error);
      }
    });
  },
  
  // 获取详细聊天记录
  getDetail: (memoryId: string) => 
    api.get(`/interview/getDetail/${memoryId}`),
  
  // 获取当前用户的所有聊天记录
  getUserInterviews: () => 
    api.get("/interview/getByUserId"),
  
  // 重命名聊天记录
  rename: (data: { memoryId: number, title: string }) => 
    api.put("/interview/rename", data),
  
  // 删除面试记录
  deleteInterview: (memoryId: string) => 
    api.delete(`/interview/delete/${memoryId}`),

  // 处理流式面试数据
  streamInterview: async (memoryId: number, answer: string, onChunk: (chunk: string) => void) => {
    return new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem("token")
        
        // 创建自定义fetch请求处理流式响应
        fetch(`${BASE_URL}/interview/continue`, {
          method: "POST",
          headers: {
            token: token || "",
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ answer, memoryId }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            // 设置响应体流的读取器
            const reader = response.body?.getReader()
            if (!reader) {
              throw new Error("Failed to get stream reader")
            }

            // 处理流
            const decoder = new TextDecoder()
            let buffer = ""
            // 存储已处理的内容，避免重复
            let processedChunks = new Set();

            function processStream() {
              // 确保reader不是undefined
              if (!reader) {
                reject(new Error("Stream reader is undefined"));
                return;
              }
              
              reader
                .read()
                .then(({ done, value }) => {
                  if (done) {
                    // 处理缓冲区中剩余的内容
                    if (buffer.trim()) {
                      onChunk(buffer);
                    }
                    resolve(true)
                    return
                  }

                  // 解码块并添加到缓冲区
                  const text = decoder.decode(value, { stream: true })
                  buffer += text
                  
                  console.log("接收到流数据:", buffer);

                  // 处理缓冲区中的每一行
                  const lines = buffer.split("\n")
                  buffer = lines.pop() || "" // 保留缓冲区中最后一个不完整的行

                  for (const line of lines) {
                    if (line.trim()) {
                      console.log("发送数据块到UI:", line);
                      // 检查内容是否已经处理过
                      if (!processedChunks.has(line)) {
                        // 每当有新行时立即回调，不等待更多数据
                        onChunk(line)
                        // 记录已处理的内容
                        processedChunks.add(line);
                      } else {
                        console.log("跳过重复内容:", line);
                      }
                    }
                  }

                  // 继续处理流
                  processStream()
                })
                .catch((error) => {
                  console.error("Error reading stream:", error)
                  reject(error)
                })
            }

            processStream()
          })
          .catch((error) => {
            console.error("Fetch error:", error)
            reject(error)
          })
      } catch (error) {
        console.error("Error setting up stream:", error)
        reject(error)
      }
    })
  },

  // 开始新的面试并处理流式数据
  startNewWithStream: async (jobName: string, resumeId: number, onChunk: (chunk: string) => void) => {
    try {
      console.log(`开始创建新面试 - jobName: ${jobName}, resumeId: ${resumeId}`);
      
      // 先创建新的面试并获取memoryId
      const response = await api.post("/interview/new", { jobName, resumeId });
      
      if (response.data.success && response.data.data) {
        const memoryId = response.data.data;
        console.log(`面试创建成功，memoryId: ${memoryId}`);
        
        // 使用memoryId开始面试并获取流式数据
        const token = localStorage.getItem("token");
        
        return new Promise((resolve, reject) => {
          fetch(`${BASE_URL}/interview/new/${memoryId}`, {
            method: "POST",
            headers: {
              token: token || "",
              Accept: "text/event-stream",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              // 设置响应体流的读取器
              const reader = response.body?.getReader();
              if (!reader) {
                throw new Error("Failed to get stream reader");
              }

              // 处理流
              const decoder = new TextDecoder();
              let buffer = "";
              let receivedData = false; // 标记是否收到了任何数据

              function processStream() {
                // 确保reader不是undefined
                if (!reader) {
                  reject(new Error("Stream reader is undefined"));
                  return;
                }
                
                reader
                  .read()
                  .then(({ done, value }) => {
                    if (done) {
                      if (!receivedData) {
                        console.log("流结束但未接收到数据，可能需要重试");
                      }
                      resolve({ success: true, memoryId });
                      return;
                    }

                    receivedData = true;

                    // 解码块并添加到缓冲区
                    const text = decoder.decode(value, { stream: true });
                    buffer += text;
                    
                    console.log("收到流数据:", buffer);

                    // 处理缓冲区中的每一行
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || ""; // 保留缓冲区中最后一个不完整的行

                    for (const line of lines) {
                      if (line.trim()) {
                        console.log("处理行数据:", line);
                        onChunk(line);
                      }
                    }

                    // 继续处理流
                    processStream();
                  })
                  .catch((error) => {
                    console.error("Error reading stream:", error);
                    // 即使流读取出错，也返回memoryId，这样用户仍然可以进入面试
                    resolve({ success: true, memoryId, error: error.message });
                  });
              }

              processStream();
            })
            .catch((error) => {
              console.error("Fetch error:", error);
              // 即使获取流失败，也返回memoryId
              resolve({ success: true, memoryId, error: error.message });
            });
        });
      } else {
        throw new Error(response.data.errorMsg || "创建面试失败");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      throw error;
    }
  }
}

// 职业相关API
export const jobApi = {
  getJob: (id: string) => api.get(`/job/get/${id}`),
  getJobTitle: (title: string) => api.get(`/job/getJobName`,{params:{title}}),
  getJobPage: (pageNum = 1, pageSize = 20) => api.get(`/job/get/page`, { params: { pageNum, pageSize } }),
  searchJobs: (title: string, pageNum = 1, pageSize = 20) =>
    api.get(`/job/search`, { params: { title, pageNum, pageSize } }),
  getJobsByType: (type: string, pageNum = 1, pageSize = 20) =>
    api.get(`/job/getByType`, { params: { type, pageNum, pageSize } }),
  // 添加生成职业详细信息的API方法
  generateJob: (data: { jobName: string, description: string }) => api.post('/job/generateJob', data),
}

// 专业相关API
export const majorApi = {
  getMajor: (id: string) => api.get(`/major/get/${id}`),
  getMajorPage: (pageNum = 1, pageSize = 20) => api.get(`/major/get/page`, { params: { pageNum, pageSize } }),
  searchMajors: (title: string, pageNum = 1, pageSize = 20) =>
    api.get(`/major/search`, { params: { title, pageNum, pageSize } }),
  getMajorsByType: (type: string, pageNum = 1, pageSize = 20) =>
    api.get(`/major/getByType`, { params: { type, pageNum, pageSize } }),
  // 添加生成专业详细信息的API方法
  generateMajors: (data: { majorsName: string, description: string }) => api.post('/major/generateMajors', data),
}

// 评论相关API
export const reviewApi = {
  sendReview: (data: { majorsId?: number; jobId?: number; content: string }) => api.post(`/review/send`, data),
  reportReview: (reviewId: string) => api.put(`/review/report/${reviewId}`),
  getMajorReviews: (majorId: string) => api.get(`/review/getReviewByMajorsId/${majorId}`),
  getJobReviews: (jobId: string) => api.get(`/review/getReviewByJobId/${jobId}`),
  // 添加删除评论的API方法
  deleteReview: (id: string) => api.delete(`/review/del/${id}`),
}

// 学习路径相关API
export const learnPathApi = {
  // 根据职位ID生成学习路径
  generateJobPath: (jobId: string) => api.post(`/learn-path/generate-jobPath?jobId=${jobId}`),

  // 根据专业ID生成学习路径
  generateMajorPath: (majorsId: string) => api.post(`/learn-path/generate-majorPath?majorsId=${majorsId}`),

  // 根据ID获取学习路径
  getPath: (id: string) => api.get(`/learn-path/get/${id}`),

  // 获取所有学习路径
  getAllPaths: () => api.get("/learn-path/getAll"),

  // 删除学习路径
  deletePath: (pathId: string) => api.delete(`/learn-path/${pathId}`),

  // 根据技能ID获取章节
  getChapters: (skillId: number) => api.get(`/chapter/get/${skillId}`),

  // 根据章节ID获取节点
  getNodes: (chapterId: number) => api.get(`/node/get/${chapterId}`),

  // 更新节点状态
  updateNodeStatus: (nodeId: string, pathId: string, skillId: string, chapterId: string) =>
    api.put(`/node/complete?nodeId=${nodeId}&pathId=${pathId}&skillId=${skillId}&chapterId=${chapterId}`),

  // 添加节点笔记
  writeNodeNote: (data: { id: number; note: string }) => api.put("/node/write-note", data),

  // 获取进度
  getCurrentProgress: (pathId: string, skillIds: string) =>
    api.get(`/node/get/currentProgress?pathId=${pathId}&skillIds=${skillIds}`),
}

export default api
