package com.farmer.notebook.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.farmer.notebook.common.exception.BusinessException;
import com.farmer.notebook.mapper.NotebookMapper;
import com.farmer.notebook.model.entity.Notebook;
import com.farmer.notebook.service.NotebookService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 笔记本Service实现类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Service
public class NotebookServiceImpl extends ServiceImpl<NotebookMapper, Notebook> implements NotebookService {
    
    @Override
    public IPage<Notebook> getUserNotebooks(Page<Notebook> page, Long userId, String type) {
        LambdaQueryWrapper<Notebook> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Notebook::getUserId, userId);
        
        if (StringUtils.hasText(type)) {
            wrapper.eq(Notebook::getType, type);
        }
        
        wrapper.orderByDesc(Notebook::getCreateTime);
        return page(page, wrapper);
    }
    
    @Override
    public boolean createNotebook(Notebook notebook) {
        return save(notebook);
    }
    
    @Override
    public boolean updateNotebook(Notebook notebook) {
        // 验证笔记本是否存在且属于当前用户
        Notebook existNotebook = getById(notebook.getId());
        if (existNotebook == null) {
            throw new BusinessException("笔记本不存在");
        }
        
        if (!existNotebook.getUserId().equals(notebook.getUserId())) {
            throw new BusinessException("无权限修改此笔记本");
        }
        
        return updateById(notebook);
    }
    
    @Override
    public boolean deleteNotebook(Long id, Long userId) {
        // 验证笔记本是否存在且属于当前用户
        Notebook notebook = getById(id);
        if (notebook == null) {
            throw new BusinessException("笔记本不存在");
        }
        
        if (!notebook.getUserId().equals(userId)) {
            throw new BusinessException("无权限删除此笔记本");
        }
        
        return removeById(id);
    }
} 