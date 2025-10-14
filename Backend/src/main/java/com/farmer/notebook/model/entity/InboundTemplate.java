package com.farmer.notebook.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 入库模板实体类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("inbound_template")
public class InboundTemplate extends BaseEntity {
    
    /**
     * 模板编号
     */
    private String templateId;
    
    /**
     * 模板名称
     */
    private String templateName;
    
    /**
     * 物料名称
     */
    private String materialName;
    
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
     * 物料编码
     */
    private String materialCode;
    
    /**
     * 计量单位
     */
    private String unit;
    
    /**
     * 数量
     */
    private BigDecimal quantity;
    
    /**
     * 单价
     */
    private BigDecimal unitPrice;
    
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
     * 保质期天数
     */
    private Integer shelfLifeDays;
    
    /**
     * 质检状态
     */
    private String qualityStatus;
    
    /**
     * 备注说明
     */
    private String description;
}