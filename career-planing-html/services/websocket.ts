// WebSocket service for handling real-time notifications
class WebSocketService {
  private static instance: WebSocketService | null = null
  private socket: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout = 3000 // Start with 3 seconds
  private userId: string | null = null
  private notificationHandlers: Record<string, Set<(data: any) => void>> = {}
  private isConnecting = false

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  public connect(userId: string): void {
    if (!userId) {
      console.error("Cannot connect WebSocket: userId is required")
      return
    }

    console.log("Attempting to connect WebSocket for user:", userId)

    // 如果已经连接到相同用户，直接返回
    if (this.userId === userId && this.socket?.readyState === WebSocket.OPEN) {
      console.log("Already connected with the same user ID")
      return
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log("Closing existing connection before reconnecting")
      this.socket.close()
    }

    if (this.isConnecting) {
      console.log("WebSocket connection already in progress")
      return
    }

    this.isConnecting = true
    this.userId = userId

    try {
      // https://www.syyyh.chat/
      const wsUrl = `wss://www.syyyh.chat/ws/${userId}`
      console.log("Connecting to WebSocket URL:", wsUrl)

      this.socket = new WebSocket(wsUrl)

      this.socket.onopen = () => {
        console.log("WebSocket connection established successfully")
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.reconnectTimeout = 3000
      }

      this.socket.onmessage = (event) => {
        try {
          console.log("Received WebSocket message:", event.data)
          const data = JSON.parse(event.data)
          console.log("Parsed WebSocket message:", data)
          this.handleNotification(data)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.socket.onclose = (event) => {
        this.isConnecting = false
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`)
        this.attemptReconnect()
      }

      this.socket.onerror = (error) => {
        this.isConnecting = false
        console.error("WebSocket error:", error)
        this.socket?.close()
      }
    } catch (error) {
      this.isConnecting = false
      console.error("Error creating WebSocket:", error)
      this.attemptReconnect()
    }
  }

  private handleNotification(notification: any): void {
    console.log("Handling notification:", notification)
    const { type, id, pathId, message } = notification
    
    if (!type) {
      console.error("Notification type is missing:", notification)
      return
    }

    const typeStr = type.toString()
    console.log("Looking for handlers of type:", typeStr)
    console.log("Available handlers:", Object.keys(this.notificationHandlers))
    
    if (this.notificationHandlers[typeStr]) {
      console.log(`Found ${this.notificationHandlers[typeStr].size} handlers for type ${typeStr}`)
      this.notificationHandlers[typeStr].forEach((handler) => {
        try {
          console.log("Executing handler for type:", typeStr)
          
          // 根据不同的通知类型返回不同的数据
          if (type === 0) {
            // 失败消息包含错误信息
            handler({ message: message || "未知错误" })
          } else if (type === 3) {
            // 学习路径使用pathId
            handler({ id: pathId })
          } else {
            // 其他类型使用id字段
            handler({ id })
          }
        } catch (error) {
          console.error(`Error in notification handler for type ${type}:`, error)
        }
      })
    } else {
      console.log(`No handlers found for notification type: ${typeStr}`)
    }
  }

  public registerNotificationHandler(type: string, handler: (data: any) => void): void {
    console.log(`Registering handler for type: ${type}`)
    if (!this.notificationHandlers[type]) {
      this.notificationHandlers[type] = new Set()
    }
    this.notificationHandlers[type].add(handler)
    console.log(`Current handlers for type ${type}:`, this.notificationHandlers[type].size)
  }

  public unregisterNotificationHandler(type: string, handler: (data: any) => void): void {
    console.log(`Unregistering handler for type: ${type}`)
    if (this.notificationHandlers[type]) {
      this.notificationHandlers[type].delete(handler)
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Maximum reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    const timeout = this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts - 1)
    console.log(`Attempting to reconnect in ${timeout}ms (attempt ${this.reconnectAttempts})`)

    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId)
      }
    }, timeout)
  }

  public disconnect(): void {
    console.log("Disconnecting WebSocket")
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.userId = null
    this.reconnectAttempts = 0
  }
}

// Export a default instance
const websocketService = WebSocketService.getInstance()
export default websocketService
