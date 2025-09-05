<template>
  <aside class="layout-sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <nav class="p-4">
      <ul class="nav-menu">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link" :class="{ 'active': $route.path === '/dashboard' }">
            <i class="nav-icon fas fa-tachometer-alt"></i>
            <span>仪表板</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/assets" class="nav-link" :class="{ 'active': $route.path === '/assets' }">
            <i class="nav-icon fas fa-coins"></i>
            <span>资产总览</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/records" class="nav-link" :class="{ 'active': $route.path === '/records' }">
            <i class="nav-icon fas fa-stream"></i>
            <span>流水记录</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/inbound-records" class="nav-link" :class="{ 'active': $route.path === '/inbound-records' || $route.path === '/inbound-templates' || $route.path === '/inbound-form' }">
            <i class="nav-icon fas fa-arrow-down"></i>
            <span>入库记录</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/outbound-records" class="nav-link" :class="{ 'active': $route.path === '/outbound-records'||$route.path === '/outbound-templates'||$route.path === '/outbound-form' ||$route.path === '/outbound-product-mix'}">
            <i class="nav-icon fas fa-arrow-up"></i>
            <span>出库记录</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/inventory" class="nav-link" :class="{ 'active': $route.path === '/inventory' }">
            <i class="nav-icon fas fa-boxes"></i>
            <span>库存管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/customers" class="nav-link" :class="{ 'active': $route.path === '/customers' }">
            <i class="nav-icon fas fa-users"></i>
            <span>客户管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/suppliers" class="nav-link" :class="{ 'active': $route.path === '/suppliers' }">
            <i class="nav-icon fas fa-truck"></i>
            <span>供应商管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/data" class="nav-link" :class="{ 'active': $route.path === '/data' }">
            <i class="nav-icon fas fa-truck"></i>
            <span>数据管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/vip" class="nav-link" :class="{ 'active': $route.path === '/vip' }">
            <i class="nav-icon fas fa-crown"></i>
            <span>VIP功能</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile" class="nav-link" :class="{ 'active': $route.path === '/profile' }">
            <i class="nav-icon fas fa-user"></i>
            <span>个人中心</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const isCollapsed = ref(false)

// 定义props
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

// 监听props变化
import { watch } from 'vue'

watch(() => props.collapsed, (newVal) => {
  isCollapsed.value = newVal
}, { immediate: true })
</script>

<style scoped>
.layout-sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  background: var(--card-bg);
  border-right: 1px solid var(--border-color);
  z-index: 999;
  overflow-y: auto;
  transition: width 0.3s ease;
}

.sidebar-collapsed {
  width: var(--sidebar-collapsed-width);
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  gap: 12px;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: var(--border-light);
  color: var(--text-primary);
}

.nav-link.active {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.nav-icon {
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-collapsed .nav-link span {
  display: none;
}

.sidebar-collapsed .nav-icon {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1199px) {
  .layout-sidebar {
    width: var(--sidebar-collapsed-width);
  }
  
  .nav-link span {
    display: none;
  }
  
  .nav-icon {
    margin: 0;
  }
}

@media (max-width: 767px) {
  .layout-sidebar {
    transform: translateX(-100%);
  }
}
</style>