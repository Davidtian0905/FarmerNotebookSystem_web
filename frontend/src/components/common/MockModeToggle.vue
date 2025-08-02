<template>
  <div v-if="isDevelopment" class="mock-mode-toggle">
    <van-switch
      v-model="mockMode"
      size="small"
      @change="toggleMockMode"
    />
    <span class="mock-label">Mock模式</span>
    <van-tag 
      v-if="mockMode" 
      type="warning" 
      size="small"
      class="mock-tag"
    >
      测试数据
    </van-tag>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import { getMockModeStatus, toggleMockMode as toggleMock } from '@/mock'

const isDevelopment = process.env.NODE_ENV === 'development'
const mockMode = ref(false)

onMounted(() => {
  if (isDevelopment) {
    mockMode.value = getMockModeStatus()
  }
})

const toggleMockMode = () => {
  const newMode = toggleMock()
  mockMode.value = newMode
  
  showToast({
    message: newMode ? '已启用Mock模式' : '已关闭Mock模式',
    type: 'success',
    duration: 1500
  })
  
  // 刷新页面以应用新的模式
  setTimeout(() => {
    window.location.reload()
  }, 1500)
}
</script>

<style scoped>
.mock-mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 193, 7, 0.3);
  margin: 8px 0;
}

.mock-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.mock-tag {
  margin-left: 4px;
}
</style> 