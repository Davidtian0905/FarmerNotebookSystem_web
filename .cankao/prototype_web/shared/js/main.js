// 茶农手账系统 - Web版通用JavaScript功能

// 全局配置
const AppConfig = {
  apiBaseUrl: '/api',
  version: '1.0.0',
  title: '茶农手账系统',
  theme: {
    primaryColor: '#10B981',
    sidebarWidth: 240,
    sidebarCollapsedWidth: 64
  }
};

// 工具函数
const Utils = {
  // 格式化金额
  formatCurrency(amount, currency = '¥') {
    if (typeof amount !== 'number') return currency + '0.00';
    return currency + amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  // 格式化日期
  formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    
    switch (format) {
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'MM-DD':
        return `${month}-${day}`;
      case 'YYYY-MM-DD HH:mm':
        return `${year}-${month}-${day} ${hour}:${minute}`;
      case 'HH:mm':
        return `${hour}:${minute}`;
      default:
        return `${year}-${month}-${day}`;
    }
  },

  // 防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // 节流函数
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // 生成随机ID
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  },

  // 深拷贝
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  },

  // 获取URL参数
  getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  // 设置localStorage
  setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('设置localStorage失败:', e);
    }
  },

  // 获取localStorage
  getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('获取localStorage失败:', e);
      return defaultValue;
    }
  },

  // 移除localStorage
  removeStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('移除localStorage失败:', e);
    }
  }
};

// 消息提示组件
const Message = {
  show(content, type = 'info', duration = 3000) {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `
      <div class="message-content">
        <i class="fas fa-${this.getIcon(type)}"></i>
        <span>${content}</span>
      </div>
    `;
    
    // 添加样式
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: messageSlideIn 0.3s ease;
      background-color: ${this.getColor(type)};
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.style.animation = 'messageSlideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(messageEl);
      }, 300);
    }, duration);
  },

  getIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || icons.info;
  },

  getColor(type) {
    const colors = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6'
    };
    return colors[type] || colors.info;
  },

  success(content, duration) {
    this.show(content, 'success', duration);
  },

  error(content, duration) {
    this.show(content, 'error', duration);
  },

  warning(content, duration) {
    this.show(content, 'warning', duration);
  },

  info(content, duration) {
    this.show(content, 'info', duration);
  }
};

// 加载状态管理
const Loading = {
  show(target = document.body) {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-overlay';
    loadingEl.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <div class="loading-text">加载中...</div>
      </div>
    `;
    
    loadingEl.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    
    target.style.position = 'relative';
    target.appendChild(loadingEl);
    return loadingEl;
  },

  hide(loadingEl) {
    if (loadingEl && loadingEl.parentNode) {
      loadingEl.parentNode.removeChild(loadingEl);
    }
  }
};

// 模态框管理
const Modal = {
  show(content, options = {}) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: ${options.width || '500px'}">
        <div class="modal-header">
          <h3 class="modal-title">${options.title || '提示'}</h3>
          <button class="modal-close" onclick="Modal.hide(this.closest('.modal-overlay'))">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${options.footer !== false ? `
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="Modal.hide(this.closest('.modal-overlay'))">取消</button>
            <button class="btn btn-primary" onclick="Modal.confirm(this.closest('.modal-overlay'))">确定</button>
          </div>
        ` : ''}
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    
    document.body.appendChild(modal);
    
    // 点击遮罩关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hide(modal);
      }
    });
    
    return modal;
  },

  hide(modal) {
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  },

  confirm(modal) {
    // 可以在这里添加确认逻辑
    this.hide(modal);
  }
};

// 侧边栏管理
const Sidebar = {
  toggle() {
    const sidebar = document.querySelector('.layout-sidebar');
    const main = document.querySelector('.layout-main');
    
    if (sidebar && main) {
      sidebar.classList.toggle('collapsed');
      main.classList.toggle('sidebar-collapsed');
      
      // 保存状态
      const isCollapsed = sidebar.classList.contains('collapsed');
      Utils.setStorage('sidebar-collapsed', isCollapsed);
    }
  },

  init() {
    // 恢复侧边栏状态
    const isCollapsed = Utils.getStorage('sidebar-collapsed', false);
    if (isCollapsed) {
      const sidebar = document.querySelector('.layout-sidebar');
      const main = document.querySelector('.layout-main');
      if (sidebar && main) {
        sidebar.classList.add('collapsed');
        main.classList.add('sidebar-collapsed');
      }
    }
  }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化侧边栏
  Sidebar.init();
  
  // 添加消息提示样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes messageSlideIn {
      from { opacity: 0; transform: translate(-50%, -20px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes messageSlideOut {
      from { opacity: 1; transform: translate(-50%, 0); }
      to { opacity: 0; transform: translate(-50%, -20px); }
    }
    .message-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .loading-spinner {
      text-align: center;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #10B981;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      padding: 20px 24px 16px;
      border-bottom: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: #6B7280;
      padding: 4px;
    }
    .modal-body {
      padding: 20px 24px;
    }
    .modal-footer {
      padding: 16px 24px 20px;
      border-top: 1px solid #E5E7EB;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `;
  document.head.appendChild(style);
});

// 导出全局对象
window.AppConfig = AppConfig;
window.Utils = Utils;
window.Message = Message;
window.Loading = Loading;
window.Modal = Modal;
window.Sidebar = Sidebar;
