package com.farmer.notebook.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.farmer.notebook.model.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户Mapper接口
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
} 