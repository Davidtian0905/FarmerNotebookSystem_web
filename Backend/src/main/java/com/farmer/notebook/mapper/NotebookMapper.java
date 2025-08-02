package com.farmer.notebook.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.farmer.notebook.model.entity.Notebook;
import org.apache.ibatis.annotations.Mapper;

/**
 * 笔记本Mapper接口
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Mapper
public interface NotebookMapper extends BaseMapper<Notebook> {
} 