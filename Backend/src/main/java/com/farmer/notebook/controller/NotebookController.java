package com.farmer.notebook.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.farmer.notebook.common.Result;
import com.farmer.notebook.model.entity.Notebook;
import com.farmer.notebook.service.NotebookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 笔记本控制器
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Slf4j
@RestController
@RequestMapping("/notebook")
public class NotebookController {
    
    @Autowired
    private NotebookService notebookService;
    
    /**
     * 分页查询用户的笔记本
     * 
     * @param current 当前页
     * @param size 每页大小
     * @param type 笔记本类型
     * @param userId 用户ID
     * @return 分页结果
     */
    @GetMapping("/list")
    public Result<IPage<Notebook>> list(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String type,
            @RequestParam Long userId) {
        
        Page<Notebook> page = new Page<>(current, size);
        IPage<Notebook> result = notebookService.getUserNotebooks(page, userId, type);
        
        return Result.success(result);
    }
    
    /**
     * 根据ID查询笔记本
     * 
     * @param id 笔记本ID
     * @return 笔记本信息
     */
    @GetMapping("/{id}")
    public Result<Notebook> getById(@PathVariable Long id) {
        Notebook notebook = notebookService.getById(id);
        return Result.success(notebook);
    }
    
    /**
     * 创建笔记本
     * 
     * @param notebook 笔记本信息
     * @return 创建结果
     */
    @PostMapping
    public Result<Boolean> create(@Valid @RequestBody Notebook notebook) {
        boolean result = notebookService.createNotebook(notebook);
        return Result.success("创建成功", result);
    }
    
    /**
     * 更新笔记本
     * 
     * @param notebook 笔记本信息
     * @return 更新结果
     */
    @PutMapping
    public Result<Boolean> update(@Valid @RequestBody Notebook notebook) {
        boolean result = notebookService.updateNotebook(notebook);
        return Result.success("更新成功", result);
    }
    
    /**
     * 删除笔记本
     * 
     * @param id 笔记本ID
     * @param userId 用户ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id, @RequestParam Long userId) {
        boolean result = notebookService.deleteNotebook(id, userId);
        return Result.success("删除成功", result);
    }
} 