<template>
  <div class="layout-container">
    <Header @toggle-sidebar="toggleSidebar" />
    <Sidebar :collapsed="sidebarCollapsed" />
    <main class="layout-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'

// 响应式数据
const sidebarCollapsed = ref(false)

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-main {
  margin-left: var(--sidebar-width);
  margin-top: var(--header-height);
  padding: 24px;
  min-height: calc(100vh - var(--header-height));
  transition: margin-left 0.3s ease;
  background-color: var(--bg-color);
}

.layout-main.sidebar-collapsed {
  margin-left: var(--sidebar-collapsed-width);
}

/* 响应式设计 */
@media (max-width: 1199px) {
  .layout-main {
    margin-left: var(--sidebar-collapsed-width);
  }
  
  .layout-main.sidebar-collapsed {
    margin-left: var(--sidebar-collapsed-width);
  }
}

@media (max-width: 767px) {
  .layout-main {
    margin-left: 0;
    padding: 16px;
  }
  
  .layout-main.sidebar-collapsed {
    margin-left: 0;
  }
}
</style> 