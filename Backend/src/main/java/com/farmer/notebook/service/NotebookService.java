package com.farmer.notebook.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.farmer.notebook.model.entity.Notebook;

/**
 * 笔记本Service接口
 * 
 * @author farmer
 * @since 2024-01-01
 */
public interface NotebookService extends IService<Notebook> {
    
    /**
     * 分页查询用户的笔记本
     * 
     * @param page 分页参数
     * @param userId 用户ID
     * @param type 笔记本类型
     * @return 分页结果
     */
    IPage<Notebook> getUserNotebooks(Page<Notebook> page, Long userId, String type);
    
    /**
     * 创建笔记本
     * 
     * @param notebook 笔记本信息
     * @return 是否成功
     */
    boolean createNotebook(Notebook notebook);
    
    /**
     * 更新笔记本
     * 
     * @param notebook 笔记本信息
     * @return 是否成功
     */
    boolean updateNotebook(Notebook notebook);
    
    /**
     * 删除笔记本
     * 
     * @param id 笔记本ID
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean deleteNotebook(Long id, Long userId);
} 