<template>
  <div class="records-page">
    <van-nav-bar title="记录管理" left-arrow @click-left="goBack" />
    
    <div class="records-content">
      <van-empty description="记录管理功能开发中..." />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.records-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.records-content {
  padding: 20px;
}
</style>
