<template>
  <div v-if="showTestAccounts" class="test-accounts">
    <van-collapse v-model="activeNames">
      <van-collapse-item title="测试账号信息" name="accounts">
        <div class="accounts-list">
          <div class="account-item" v-for="account in testAccounts" :key="account.username">
            <div class="account-info">
              <div class="account-name">
                <van-icon name="user-o" />
                <span>{{ account.nickname }}</span>
                <van-tag :type="account.role === 'admin' ? 'danger' : 'primary'" size="small">
                  {{ account.role === 'admin' ? '管理员' : '茶农' }}
                </van-tag>
              </div>
              <div class="account-details">
                <div class="detail-item">
                  <span class="label">用户名：</span>
                  <span class="value">{{ account.username }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">邮箱：</span>
                  <span class="value">{{ account.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">密码：</span>
                  <span class="value">{{ account.password }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="test-tips">
          <van-icon name="info-o" />
          <span>提示：使用以上任意账号即可登录测试系统</span>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getMockModeStatus } from '@/mock'

const activeNames = ref(['accounts'])

const showTestAccounts = computed(() => {
  return process.env.NODE_ENV === 'development' && getMockModeStatus()
})

const testAccounts = [
  {
    username: 'farmer001',
    email: 'farmer001@example.com',
    password: '123456',
    nickname: '茶农小王',
    role: 'farmer'
  },
  {
    username: 'farmer002',
    email: 'farmer002@example.com',
    password: '123456',
    nickname: '茶农小李',
    role: 'farmer'
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    nickname: '系统管理员',
    role: 'admin'
  }
]
</script>

<style scoped>
.test-accounts {
  margin: 16px 0;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.account-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e9ecef;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
}

.account-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.label {
  color: #666;
  min-width: 60px;
}

.value {
  color: #333;
  font-family: 'Courier New', monospace;
  background: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.test-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(25, 135, 84, 0.1);
  border-radius: 6px;
  color: #198754;
  font-size: 14px;
}
</style> 