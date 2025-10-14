package com.farmer.notebook.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 仓库位置实体类
 * 
 * @author farmer
 * @since 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("warehouse_location")
public class WarehouseLocation extends BaseEntity {
    
    /**
     * 位置编号
     */
    private String locationId;
    
    /**
     * 位置名称
     */
    private String locationName;
    
    /**
     * 位置编码
     */
    private String locationCode;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 状态（active：活跃，disabled：已停用）
     */
    private String status;
}