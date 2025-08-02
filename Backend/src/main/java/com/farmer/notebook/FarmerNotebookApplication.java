package com.farmer.notebook;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 农户笔记本系统启动类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@SpringBootApplication
@EnableTransactionManagement
@EnableCaching
@MapperScan("com.farmer.notebook.mapper")
public class FarmerNotebookApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmerNotebookApplication.class, args);
    }
} 