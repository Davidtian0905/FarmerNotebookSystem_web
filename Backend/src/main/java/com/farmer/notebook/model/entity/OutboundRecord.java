package com.farmer.notebook.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 出库记录实体类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("outbound_record")
public class OutboundRecord extends BaseEntity {
    
    /**
     * 出库单号
     */
    private String outboundId;
    
    /**
     * 产品名称
     */
    private String productName;
    
    /**
     * 产品编码
     */
    private String productCode;
    
    /**
     * 产品图片（JSON格式）
     */
    private String productImages;
    
    /**
     * 销售数量
     */
    private Integer quantity;
    
    /**
     * 单位
     */
    private String unit;
    
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
     * 折扣金额
     */
    private BigDecimal discountAmount;
    
    /**
     * 最终金额
     */
    private BigDecimal finalAmount;
    
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
    
    /**
     * 出库日期
     */
    private LocalDate date;
    
    /**
     * 出库时间
     */
    private LocalTime time;
    
    /**
     * 交易类型
     */
    private String type;
}