<template>
  <div class="customers-page">
    <van-nav-bar title="客户管理" left-arrow @click-left="goBack" />
    
    <div class="customers-content">
      <van-empty description="客户管理功能开发中..." />
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
.customers-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.customers-content {
  padding: 20px;
}
</style>
