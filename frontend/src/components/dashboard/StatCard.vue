<template>
  <div class="stat-card card" :class="cardClass">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center mb-2">
          <div class="stat-icon mr-3" :style="{ backgroundColor: iconBgColor }">
            <i :class="icon" class="text-white"></i>
          </div>
          <div class="flex-1">
            <div class="flex items-center">
              <h3 class="stat-title flex-1">{{ title }}</h3>
              <div class="stat-value ml-20">{{ formatValue(value) }}</div>
            </div>
            <div v-if="trend" class="stat-trend" :class="trendClass">
              <i :class="trendIcon"></i>
              <span>{{ subtitle }} {{ trend }}%</span>
            </div>
            <div v-else class="stat-subtitle">{{ subtitle }}</div>
          </div>
        </div>
      </div>
      <div v-if="showChart" class="stat-chart">
        <canvas ref="chartCanvas" width="80" height="40"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
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
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconBgColor: {
    type: String,
    default: '#10B981'
  },
  trend: {
    type: Number,
    default: null
  },
  showChart: {
    type: Boolean,
    default: false
  },
  chartData: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: 'default' // default, success, warning, danger
  }
})

const chartCanvas = ref(null)
let chartInstance = null

// 计算卡片样式类
const cardClass = computed(() => {
  const baseClass = 'transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg'
  const typeClass = {
    default: 'border-l-4 border-l-gray-400',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-yellow-500',
    danger: 'border-l-4 border-l-red-500'
  }
  return `${baseClass} ${typeClass[props.type]}`
})

// 计算趋势样式类
const trendClass = computed(() => {
  if (!props.trend) return ''
  return props.trend >= 0 ? 'text-green-600' : 'text-red-600'
})

// 计算趋势图标
const trendIcon = computed(() => {
  if (!props.trend) return ''
  return props.trend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
})

// 格式化数值
const formatValue = (value) => {
  if (typeof value === 'number') {
    return `¥${value.toLocaleString()}`
  }
  return value
}

// 初始化图表
const initChart = () => {
  if (!props.showChart || !chartCanvas.value || !props.chartData.length) return

  const ctx = chartCanvas.value.getContext('2d')
  
  // 销毁现有图表
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.chartData.map((_, index) => index + 1),
      datasets: [{
        data: props.chartData,
        borderColor: props.iconBgColor,
        backgroundColor: `${props.iconBgColor}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      },
      elements: {
        point: {
          radius: 0
        }
      }
    }
  })
}

// 监听数据变化
watch(() => props.chartData, () => {
  if (props.showChart) {
    nextTick(() => {
      initChart()
    })
  }
}, { deep: true })

onMounted(() => {
  if (props.showChart) {
    initChart()
  }
})
</script>

<style scoped>
.stat-card {
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
}

.stat-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
}

.stat-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.ml-20 {
  margin-left: 20px; /* 提供更大的间距 */
}

.stat-trend {
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.stat-trend.positive {
  color: var(--success-color);
}

.stat-trend.negative {
  color: var(--error-color);
}

.stat-chart {
  width: 80px;
  height: 40px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stat-card {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}
</style> 