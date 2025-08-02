<template>
  <div class="suppliers-page">
    <van-nav-bar title="供应商管理" left-arrow @click-left="goBack" />
    
    <div class="suppliers-content">
      <van-empty description="供应商管理功能开发中..." />
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
.suppliers-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.suppliers-content {
  padding: 20px;
}
</style>
