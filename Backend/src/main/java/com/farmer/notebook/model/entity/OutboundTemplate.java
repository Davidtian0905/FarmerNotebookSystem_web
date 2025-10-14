package com.farmer.notebook.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 出库模板实体类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("outbound_template")
public class OutboundTemplate extends BaseEntity {
    
    /**
     * 模板编号
     */
    private String templateId;
    
    /**
     * 模板名称
     */
    private String templateName;
    
    /**
     * 产品名称
     */
    private String productName;
    
    /**
     * 产品编码
     */
    private String productCode;
    
    /**
     * 单位
     */
    private String unit;
    
    /**
     * 数量
     */
    private Integer quantity;
    
    /**
     * 单价
     */
    private BigDecimal unitPrice;
    
    /**
     * 总价
     */
    private BigDecimal totalPrice;
    
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
     * 客户折扣率
     */
    private BigDecimal customerDiscountRate;
    
    /**
     * 销售渠道
     */
    private String channel;
    
    /**
     * 标签（JSON格式）
     */
    private String tags;
    
    /**
     * 备注
     */
    private String notes;
}