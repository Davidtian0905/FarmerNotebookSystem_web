package com.farmer.notebook.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 笔记本实体类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("notebook")
public class Notebook extends BaseEntity {
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 笔记本标题
     */
    private String title;
    
    /**
     * 笔记本内容
     */
    private String content;
    
    /**
     * 笔记本类型（DIARY：日记，NOTE：笔记，PLAN：计划）
     */
    private String type;
    
    /**
     * 标签
     */
    private String tags;
    
    /**
     * 状态（0：草稿，1：已发布）
     */
    private Integer status;
    
    /**
     * 排序
     */
    private Integer sort;
} 