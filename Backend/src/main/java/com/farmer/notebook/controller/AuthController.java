package com.farmer.notebook.controller;

import com.farmer.notebook.common.Result;
import com.farmer.notebook.model.dto.LoginDTO;
import com.farmer.notebook.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 用户登录
     * 
     * @param loginDTO 登录信息
     * @return 登录结果
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("用户登录: {}", loginDTO.getUsername());
        
        String token = userService.login(loginDTO.getUsername(), loginDTO.getPassword());
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("username", loginDTO.getUsername());
        
        return Result.success("登录成功", result);
    }
    
    /**
     * 用户登出
     * 
     * @return 登出结果
     */
    @PostMapping("/logout")
    public Result<Void> logout() {
        log.info("用户登出");
        return Result.success("登出成功");
    }
} 