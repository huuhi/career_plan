import * as echarts from 'echarts';

// 在客户端环境中将echarts挂载到window对象
if (typeof window !== 'undefined') {
  window.echarts = echarts;
}

export default echarts;