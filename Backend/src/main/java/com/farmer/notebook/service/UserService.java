package com.farmer.notebook.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.farmer.notebook.model.entity.User;

/**
 * 用户Service接口
 * 
 * @author farmer
 * @since 2024-01-01
 */
public interface UserService extends IService<User> {
    
    /**
     * 根据用户名查询用户
     * 
     * @param username 用户名
     * @return 用户信息
     */
    User getByUsername(String username);
    
    /**
     * 用户登录
     * 
     * @param username 用户名
     * @param password 密码
     * @return 登录结果
     */
    String login(String username, String password);
} 