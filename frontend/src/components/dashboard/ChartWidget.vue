<template>
  <div class="chart-widget card">
    <div class="chart-header">
      <div class="chart-title">
        <h3>{{ title }}</h3>
        <p v-if="subtitle" class="chart-subtitle">{{ subtitle }}</p>
      </div>
      <div class="chart-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="chart-container" :style="{ height: height }">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'line', // line, bar, pie, doughnut
    validator: (value) => ['line', 'bar', 'pie', 'doughnut'].includes(value)
  },
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  },
  height: {
    type: String,
    default: '300px'
  }
})

const chartCanvas = ref(null)
let chartInstance = null

// 默认图表配置
const getDefaultOptions = () => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        grid: {
          color: '#f3f4f6'
        }
      }
    }
  }

  // 根据图表类型调整配置
  if (props.type === 'pie' || props.type === 'doughnut') {
    baseOptions.scales = undefined
  }

  return { ...baseOptions, ...props.options }
}

// 初始化图表
const initChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  
  // 销毁现有图表
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: getDefaultOptions()
  })
}

// 更新图表数据
const updateChart = () => {
  if (chartInstance && props.data) {
    chartInstance.data = props.data
    chartInstance.update()
  }
}

// 监听数据变化
watch(() => props.data, () => {
  nextTick(() => {
    if (chartInstance) {
      updateChart()
    } else {
      initChart()
    }
  })
}, { deep: true })

// 监听图表类型变化
watch(() => props.type, () => {
  nextTick(() => {
    initChart()
  })
})

// 监听窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理图表实例
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.chart-widget {
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.chart-title h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.chart-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.chart-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-container {
  position: relative;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-widget {
    padding: 16px;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style> 