import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 解析面试流式数据
 * @param chunk 流式数据块
 * @returns 解析后的内容
 */
export function parseInterviewStreamData(chunk: string): string {
  // 新格式：data:内容
  if (chunk.startsWith("data:")) {
    return chunk.slice(5).trim();
  }
  return chunk.trim();
}

/**
 * 格式化面试文本，处理换行符
 * @param text 面试文本内容
 * @returns 处理后的文本
 */
export function formatInterviewText(text: string): string {
  // 替换转义的换行符为实际换行
  return text.replace(/\\n/g, '\n');
}

// 将多个流式数据块组合成完整的面试响应
export function combineInterviewChunks(chunks: string[]): string {
  return chunks
    .map(chunk => parseInterviewStreamData(chunk))
    .join('')
}
