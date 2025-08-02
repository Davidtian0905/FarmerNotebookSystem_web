<template>
  <div class="quick-action" @click="handleClick">
    <div class="action-icon" :style="{ backgroundColor: iconBgColor }">
      <i :class="icon" class="text-white"></i>
    </div>
    <div class="action-content">
      <h3 class="action-title">{{ title }}</h3>
      <p class="action-description">{{ description }}</p>
    </div>
    <div class="action-arrow">
      <i class="fas fa-chevron-right"></i>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  iconBgColor: {
    type: String,
    default: '#10B981'
  },
  route: {
    type: String,
    default: ''
  },
  action: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', {
    title: props.title,
    route: props.route,
    action: props.action
  })
  
  if (props.action) {
    props.action()
  }
}
</script>

<style scoped>
.quick-action {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.quick-action:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 16px;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
  min-width: 0;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.action-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.action-arrow {
  color: var(--text-muted);
  font-size: 14px;
  margin-left: 8px;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quick-action {
    padding: 12px;
  }
  
  .action-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin-right: 12px;
  }
  
  .action-title {
    font-size: 14px;
  }
  
  .action-description {
    font-size: 12px;
  }
}
</style> 