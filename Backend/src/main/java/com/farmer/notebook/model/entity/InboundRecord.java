package com.farmer.notebook.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 入库记录实体类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("inbound_record")
public class InboundRecord extends BaseEntity {
    
    /**
     * 入库单号
     */
    private String inboundId;
    
    /**
     * 物料编号
     */
    private String materialId;
    
    /**
     * 物料名称
     */
    private String materialName;
    
    /**
     * 物料编码
     */
    private String materialCode;
    
    /**
     * 物料类型
     */
    private String materialType;
    
    /**
     * 物料等级
     */
    private String materialGrade;
    
    /**
     * 批次号
     */
    private String batchNumber;
    
    /**
     * 入库数量
     */
    private BigDecimal quantity;
    
    /**
     * 计量单位
     */
    private String unit;
    
    /**
     * 单价
     */
    private BigDecimal unitPrice;
    
    /**
     * 总金额
     */
    private BigDecimal totalPrice;
    
    /**
     * 供应商编号
     */
    private String supplierId;
    
    /**
     * 供应商名称
     */
    private String supplierName;
    
    /**
     * 仓库位置
     */
    private String warehouseLocation;
    
    /**
     * 入库日期
     */
    private LocalDate date;
    
    /**
     * 入库时间
     */
    private LocalTime time;
    
    /**
     * 到期日期
     */
    private LocalDate expiryDate;
    
    /**
     * 保质期天数
     */
    private Integer shelfLifeDays;
    
    /**
     * 质检状态
     */
    private String qualityStatus;
    
    /**
     * 检验员
     */
    private String inspector;
    
    /**
     * 检验日期
     */
    private LocalDate inspectionDate;
    
    /**
     * 质检备注
     */
    private String qualityRemarks;
    
    /**
     * 备注说明
     */
    private String description;
    
    /**
     * 图片（JSON格式）
     */
    private String images;
    
    /**
     * 质量评分
     */
    private BigDecimal qualityRating;
    
    /**
     * 交付评分
     */
    private BigDecimal deliveryRating;
    
    /**
     * 价格评分
     */
    private BigDecimal priceRating;
    
    /**
     * 服务评分
     */
    private BigDecimal serviceRating;
    
    /**
     * 交易类型
     */
    private String type;
}