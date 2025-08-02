<template>
  <div class="warehouse-page">
    <van-nav-bar title="仓库管理" left-arrow @click-left="goBack" />
    
    <div class="warehouse-content">
      <van-empty description="仓库管理功能开发中..." />
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
.warehouse-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.warehouse-content {
  padding: 20px;
}
</style>
