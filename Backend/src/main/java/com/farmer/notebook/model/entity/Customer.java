package com.farmer.notebook.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 客户实体类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("customer")
public class Customer extends BaseEntity {
    
    /**
     * 客户编号
     */
    private String customerId;
    
    /**
     * 客户名称
     */
    private String customerName;
    
    /**
     * 客户电话
     */
    private String customerPhone;
    
    /**
     * 客户地址
     */
    private String customerAddress;
    
    /**
     * 折扣率
     */
    private BigDecimal discountRate;
    
    /**
     * 联系人
     */
    private String customerContact;
    
    /**
     * 客户来源
     */
    private String customerSource;
    
    /**
     * 客户类型
     */
    private String customerCategory;
    
    /**
     * 客户等级
     */
    private String customerGrade;
    
    /**
     * 备注信息
     */
    private String notes;
    
    /**
     * 客户状态（active：活跃，disabled：已停用）
     */
    private String customerStatus;
    
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