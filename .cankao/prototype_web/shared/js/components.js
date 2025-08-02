// 茶农手账系统 - Web版组件交互逻辑

// 表格组件
const TableComponent = {
  // 初始化表格
  init(tableId, options = {}) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // 设置表格属性
    table.setAttribute('data-page', options.page || 1);
    table.setAttribute('data-page-size', options.pageSize || 10);
    table.setAttribute('data-total', options.total || 0);
    
    // 初始化排序
    this.initSort(table);
    
    // 初始化分页
    this.initPagination(table);
    
    // 初始化筛选
    this.initFilter(table);
    
    // 初始化选择
    this.initSelection(table);
    
    return table;
  },
  
  // 初始化排序
  initSort(table) {
    const headers = table.querySelectorAll('th[data-sort]');
    headers.forEach(header => {
      header.style.cursor = 'pointer';
      header.innerHTML += '<i class="fas fa-sort ml-1"></i>';
      
      header.addEventListener('click', () => {
        const sortField = header.getAttribute('data-sort');
        const currentOrder = header.getAttribute('data-order') || 'none';
        
        // 重置所有表头
        headers.forEach(h => {
          h.setAttribute('data-order', 'none');
          h.querySelector('i').className = 'fas fa-sort ml-1';
        });
        
        // 设置当前表头排序状态
        let newOrder = 'asc';
        if (currentOrder === 'asc') {
          newOrder = 'desc';
          header.querySelector('i').className = 'fas fa-sort-down ml-1';
        } else if (currentOrder === 'desc') {
          newOrder = 'none';
          header.querySelector('i').className = 'fas fa-sort ml-1';
        } else {
          header.querySelector('i').className = 'fas fa-sort-up ml-1';
        }
        
        header.setAttribute('data-order', newOrder);
        
        // 触发排序事件
        const sortEvent = new CustomEvent('table:sort', {
          detail: {
            field: sortField,
            order: newOrder
          }
        });
        table.dispatchEvent(sortEvent);
      });
    });
  },
  
  // 初始化分页
  initPagination(table) {
    const paginationContainer = document.querySelector(`[data-pagination-for="${table.id}"]`);
    if (!paginationContainer) return;
    
    const page = parseInt(table.getAttribute('data-page'));
    const pageSize = parseInt(table.getAttribute('data-page-size'));
    const total = parseInt(table.getAttribute('data-total'));
    const totalPages = Math.ceil(total / pageSize);
    
    // 创建分页HTML
    let paginationHTML = `
      <div class="pagination">
        <button class="pagination-btn" data-action="prev" ${page <= 1 ? 'disabled' : ''}>
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="pagination-info">第 ${page} 页，共 ${totalPages} 页</span>
        <button class="pagination-btn" data-action="next" ${page >= totalPages ? 'disabled' : ''}>
          <i class="fas fa-chevron-right"></i>
        </button>
        <select class="pagination-size">
          <option value="10" ${pageSize === 10 ? 'selected' : ''}>10条/页</option>
          <option value="20" ${pageSize === 20 ? 'selected' : ''}>20条/页</option>
          <option value="50" ${pageSize === 50 ? 'selected' : ''}>50条/页</option>
          <option value="100" ${pageSize === 100 ? 'selected' : ''}>100条/页</option>
        </select>
      </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // 添加事件监听
    const prevBtn = paginationContainer.querySelector('[data-action="prev"]');
    const nextBtn = paginationContainer.querySelector('[data-action="next"]');
    const pageSizeSelect = paginationContainer.querySelector('.pagination-size');
    
    prevBtn.addEventListener('click', () => {
      if (page > 1) {
        table.setAttribute('data-page', page - 1);
        const pageChangeEvent = new CustomEvent('table:pageChange', {
          detail: {
            page: page - 1,
            pageSize: pageSize
          }
        });
        table.dispatchEvent(pageChangeEvent);
      }
    });
    
    nextBtn.addEventListener('click', () => {
      if (page < totalPages) {
        table.setAttribute('data-page', page + 1);
        const pageChangeEvent = new CustomEvent('table:pageChange', {
          detail: {
            page: page + 1,
            pageSize: pageSize
          }
        });
        table.dispatchEvent(pageChangeEvent);
      }
    });
    
    pageSizeSelect.addEventListener('change', () => {
      const newPageSize = parseInt(pageSizeSelect.value);
      table.setAttribute('data-page-size', newPageSize);
      table.setAttribute('data-page', 1);
      const pageSizeChangeEvent = new CustomEvent('table:pageSizeChange', {
        detail: {
          page: 1,
          pageSize: newPageSize
        }
      });
      table.dispatchEvent(pageSizeChangeEvent);
    });
  },
  
  // 初始化筛选
  initFilter(table) {
    const filterForm = document.querySelector(`[data-filter-for="${table.id}"]`);
    if (!filterForm) return;
    
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(filterForm);
      const filters = {};
      
      for (const [key, value] of formData.entries()) {
        if (value) {
          filters[key] = value;
        }
      }
      
      // 重置分页
      table.setAttribute('data-page', 1);
      
      // 触发筛选事件
      const filterEvent = new CustomEvent('table:filter', {
        detail: {
          filters: filters
        }
      });
      table.dispatchEvent(filterEvent);
    });
    
    // 重置按钮
    const resetBtn = filterForm.querySelector('[type="reset"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        setTimeout(() => {
          const resetEvent = new CustomEvent('table:resetFilter');
          table.dispatchEvent(resetEvent);
        }, 0);
      });
    }
  },
  
  // 初始化选择
  initSelection(table) {
    const selectAll = table.querySelector('th input[type="checkbox"]');
    if (!selectAll) return;
    
    selectAll.addEventListener('change', () => {
      const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
      });
      
      // 触发选择事件
      const selectionEvent = new CustomEvent('table:selection', {
        detail: {
          selectedAll: selectAll.checked,
          selectedIds: Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value)
        }
      });
      table.dispatchEvent(selectionEvent);
    });
    
    // 单个选择
    table.addEventListener('change', (e) => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox' && e.target.closest('tbody')) {
        const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        // 更新全选状态
        if (selectAll) {
          selectAll.checked = checkedCount === checkboxes.length;
          selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        }
        
        // 触发选择事件
        const selectionEvent = new CustomEvent('table:selection', {
          detail: {
            selectedAll: checkedCount === checkboxes.length,
            selectedIds: Array.from(checkboxes)
              .filter(cb => cb.checked)
              .map(cb => cb.value)
          }
        });
        table.dispatchEvent(selectionEvent);
      }
    });
  },
  
  // 更新表格数据
  updateData(tableId, data, options = {}) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    // 更新表格属性
    if (options.total !== undefined) {
      table.setAttribute('data-total', options.total);
    }
    if (options.page !== undefined) {
      table.setAttribute('data-page', options.page);
    }
    if (options.pageSize !== undefined) {
      table.setAttribute('data-page-size', options.pageSize);
    }
    
    // 更新分页
    this.initPagination(table);
    
    // 清空表格
    tbody.innerHTML = '';
    
    // 添加数据
    if (data && data.length > 0) {
      data.forEach(item => {
        const row = this.createRow(table, item);
        tbody.appendChild(row);
      });
    } else {
      // 无数据提示
      const emptyRow = document.createElement('tr');
      const colSpan = table.querySelectorAll('th').length;
      emptyRow.innerHTML = `<td colspan="${colSpan}" class="text-center py-4 text-gray-500">暂无数据</td>`;
      tbody.appendChild(emptyRow);
    }
  },
  
  // 创建行
  createRow(table, data) {
    const row = document.createElement('tr');
    
    // 获取列配置
    const columns = Array.from(table.querySelectorAll('th')).map(th => {
      return {
        field: th.getAttribute('data-field'),
        render: th.getAttribute('data-render')
      };
    });
    
    // 创建单元格
    columns.forEach(column => {
      const cell = document.createElement('td');
      
      if (column.field === 'selection') {
        // 选择框
        cell.innerHTML = `<input type="checkbox" value="${data.id || ''}">`;
      } else if (column.field === 'actions') {
        // 操作按钮
        cell.innerHTML = `
          <div class="flex space-x-2">
            <button class="btn-icon text-blue-500" data-action="view" data-id="${data.id}">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon text-green-500" data-action="edit" data-id="${data.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon text-red-500" data-action="delete" data-id="${data.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
      } else if (column.field) {
        // 普通数据
        let value = data[column.field];
        
        // 自定义渲染
        if (column.render) {
          switch (column.render) {
            case 'date':
              value = Utils.formatDate(value);
              break;
            case 'datetime':
              value = Utils.formatDate(value, 'YYYY-MM-DD HH:mm');
              break;
            case 'currency':
              value = Utils.formatCurrency(value);
              break;
            case 'status':
              value = `<span class="status-badge status-${value}">${this.getStatusText(value)}</span>`;
              break;
          }
        }
        
        cell.innerHTML = value !== undefined ? value : '';
      }
      
      row.appendChild(cell);
    });
    
    return row;
  },
  
  // 获取状态文本
  getStatusText(status) {
    const statusMap = {
      active: '活跃',
      inactive: '停用',
      pending: '待处理',
      completed: '已完成',
      processing: '处理中',
      success: '成功',
      error: '失败',
      warning: '警告'
    };
    return statusMap[status] || status;
  }
};

// 图表组件
const ChartComponent = {
  // 初始化图表
  init(chartId, type, data, options = {}) {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return;
    
    // 检查Chart.js是否加载
    if (!window.Chart) {
      console.error('Chart.js未加载');
      return;
    }
    
    // 图表配置
    const config = {
      type: type,
      data: data,
      options: this.getChartOptions(type, options)
    };
    
    // 创建图表
    const chart = new Chart(chartElement, config);
    return chart;
  },
  
  // 获取图表配置
  getChartOptions(type, customOptions = {}) {
    // 基础配置
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    };
    
    // 根据图表类型添加特定配置
    let typeOptions = {};
    
    switch (type) {
      case 'line':
        typeOptions = {
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            }
          },
          elements: {
            line: {
              tension: 0.4
            },
            point: {
              radius: 4,
              hoverRadius: 6
            }
          }
        };
        break;
        
      case 'bar':
        typeOptions = {
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            }
          }
        };
        break;
        
      case 'pie':
      case 'doughnut':
        typeOptions = {
          cutout: type === 'doughnut' ? '70%' : 0,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        };
        break;
    }
    
    // 合并配置
    return { ...baseOptions, ...typeOptions, ...customOptions };
  },
  
  // 更新图表数据
  updateData(chart, newData) {
    if (!chart) return;
    
    chart.data = { ...chart.data, ...newData };
    chart.update();
  }
};

// 导出组件
window.TableComponent = TableComponent;
window.ChartComponent = ChartComponent;
