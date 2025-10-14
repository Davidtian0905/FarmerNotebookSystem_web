package com.farmer.notebook.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 供应商实体类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("supplier")
public class Supplier extends BaseEntity {
    
    /**
     * 供应商编号
     */
    private String supplierId;
    
    /**
     * 供应商名称
     */
    private String supplierName;
    
    /**
     * 供应商电话
     */
    private String supplierPhone;
    
    /**
     * 供应商地址
     */
    private String supplierAddress;
    
    /**
     * 联系人
     */
    private String supplierContact;
    
    /**
     * 供应商类型
     */
    private String supplierCategory;
    
    /**
     * 备注信息
     */
    private String notes;
    
    /**
     * 供应商状态（active：活跃，disabled：已停用）
     */
    private String supplierStatus;
    
    /**
     * 交易次数
     */
    private Integer transactionCount;
    
    /**
     * 交易总金额
     */
    private BigDecimal transactionAmount;
    
    /**
     * 最后交易时间
     */
    private LocalDateTime lastTransactionTime;
}