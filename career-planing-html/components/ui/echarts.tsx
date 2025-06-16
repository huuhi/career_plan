"use client"

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface EChartsProps {
  option: echarts.EChartsOption
  className?: string
  style?: React.CSSProperties
  theme?: 'light' | 'dark' | 'auto'
  onEvents?: Record<string, Function>
}

export function ECharts({ 
  option, 
  className, 
  style, 
  theme = 'auto',
  onEvents
}: EChartsProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const { theme: systemTheme } = useTheme()
  
  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return
    
    // 如果已经有实例，先销毁
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }
    
    // 确定使用的主题
    const currentTheme = theme === 'auto' 
      ? (systemTheme === 'dark' ? 'dark' : 'light') 
      : theme
    
    // 创建新实例
    const chart = echarts.init(chartRef.current, currentTheme)
    chartInstance.current = chart
    
    // 设置图表配置
    chart.setOption(option)
    
    // 添加事件监听
    if (onEvents) {
      Object.entries(onEvents).forEach(([eventName, callback]) => {
        chart.on(eventName, callback as any)
      })
    }
    
    // 响应窗口大小变化
    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
      chartInstance.current = null
    }
  }, [option, theme, systemTheme, onEvents])
  
  // 主题变化时更新图表
  useEffect(() => {
    if (!chartInstance.current || !chartRef.current) return;
    
    const currentTheme = theme === 'auto' 
      ? (systemTheme === 'dark' ? 'dark' : 'light') 
      : theme;
    
    // 不要在这里dispose和重新创建实例，只更新主题
    try {
      // 获取当前配置
      const currentOption = chartInstance.current.getOption();
      
      // 销毁当前实例
      chartInstance.current.dispose();
      
      // 使用新主题创建实例
      const chart = echarts.init(chartRef.current, currentTheme);
      chartInstance.current = chart;
      
      // 应用之前的配置
      chart.setOption(currentOption);
      
      // 重新添加事件监听
      if (onEvents) {
        Object.entries(onEvents).forEach(([eventName, callback]) => {
          chart.on(eventName, callback as any);
        });
      }
    } catch (error) {
      console.error('更新图表主题时出错:', error);
    }
  }, [systemTheme]);
  
  return (
    <div 
      ref={chartRef} 
      className={cn("w-full h-full min-h-[300px]", className)} 
      style={style}
    />
  )
}