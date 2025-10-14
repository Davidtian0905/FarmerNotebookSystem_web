package com.farmer.notebook.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 物料实体类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("material")
public class Material extends BaseEntity {
    
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
     * 计量单位
     */
    private String unit;
    
    /**
     * 单价
     */
    private BigDecimal unitPrice;
    
    /**
     * 当前库存
     */
    private BigDecimal currentStock;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 图片（JSON格式）
     */
    private String images;
}