package com.farmer.notebook.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 商品组合实体类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("product_composition")
public class ProductComposition extends BaseEntity {
    
    /**
     * 商品编号
     */
    private String productId;
    
    /**
     * 商品名称
     */
    private String productName;
    
    /**
     * 商品编码
     */
    private String productCode;
    
    /**
     * 商品单位
     */
    private String unit;
    
    /**
     * 商品描述
     */
    private String description;
    
    /**
     * 商品图片（JSON格式）
     */
    private String images;
    
    /**
     * 物料组合信息（JSON格式）
     */
    private String materials;
    
    /**
     * 物料总成本
     */
    private BigDecimal totalMaterialCost;
    
    /**
     * 利润率(%)
     */
    private BigDecimal profitRate;
    
    /**
     * 建议售价
     */
    private BigDecimal suggestedPrice;
    
    /**
     * 商品定价
     */
    private BigDecimal productPrice;
    
    /**
     * 预期利润
     */
    private BigDecimal expectedProfit;
    
    /**
     * 实际利润率(%)
     */
    private BigDecimal actualProfitRate;
    
    /**
     * 商品数量
     */
    private Integer productQuantity;
}