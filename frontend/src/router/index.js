import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: {
      title: '忘记密码'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '仪表板',
      requiresAuth: true
    }
  },
  {
    path: '/assets',
    name: 'AssetsOverview',
    component: () => import('@/views/AssetsOverview.vue'),
    meta: {
      title: '资产总览',
      requiresAuth: true
    }
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('@/views/Records.vue'),
    meta: {
      title: '流水记录',
      requiresAuth: true
    }
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: () => import('@/views/Warehouse.vue'),
    meta: {
      title: '入库出库',
      requiresAuth: true
    }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('@/views/Inventory.vue'),
    meta: {
      title: '库存管理',
      requiresAuth: true
    }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('@/views/Customers.vue'),
    meta: {
      title: '客户管理',
      requiresAuth: true
    }
  },
  {
    path: '/suppliers',
    name: 'Suppliers',
    component: () => import('@/views/Suppliers.vue'),
    meta: {
      title: '供应商管理',
      requiresAuth: true
    }
  },
  {
    path: '/data',
    name: 'Data',
    component: () => import('@/views/Data.vue'),
    meta: {
      title: '数据管理',
      requiresAuth: true
    }
  },
  {
    path: '/vip',
    name: 'Vip',
    component: () => import('@/views/Vip.vue'),
    meta: {
      title: 'VIP功能',
      requiresAuth: true
    }
  },
  {
    path: '/test-mock',
    name: 'DashboardTestMock',
    component: () => import('@/views/DashboardTestMock.vue'),
    meta: {
      title: 'Mock数据测试',
      requiresAuth: false
    }
  },
  {
    path: '/assets-test-mock',
    name: 'AssetsTestMock',
    component: () => import('@/views/AssetsTestMock.vue'),
    meta: {
      title: '资产总览Mock测试',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  try {
    // 设置页面标题
    document.title = to.meta.title || '茶农手账系统'

    console.log('路由跳转:', { from: from.path, to: to.path, toName: to.name })

    // 检查是否需要登录
    if (to.meta.requiresAuth) {
      const token = localStorage.getItem('token')
      console.log('检查需要认证的页面:', to.path, 'token存在:', !!token)
      if (!token) {
        // 保存原始路径，登录后跳转
        localStorage.setItem('redirectPath', to.fullPath)
        console.log('未登录，重定向到登录页面')
        next('/login')
        return
      }
    }

    // 如果已登录用户访问登录页面，重定向到仪表板
    if (to.path === '/login' || to.path === '/register') {
      const token = localStorage.getItem('token')
      console.log('访问登录/注册页面:', to.path, 'token存在:', !!token)
      if (token) {
        console.log('已登录，重定向到仪表板')
        next('/dashboard')
        return
      }
    }

    console.log('正常跳转到:', to.path)
    next()
  } catch (error) {
    console.error('路由守卫错误:', error)
    next()
  }
})

// 路由后置守卫
router.afterEach(to => {
  // 滚动到顶部
  window.scrollTo(0, 0)

  // 记录页面访问
  console.log(`页面访问: ${to.path}`)
})

export default router
