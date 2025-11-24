package com.edusync.sales.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SalesStageDTO {

    @NotBlank(message = "Stage ID is required")
    @Size(max = 50)
    private String stageId;

    @NotBlank(message = "Title is required")
    @Size(max = 100)
    private String title;

    @Size(max = 50)
    private String color;

    private Integer sortOrder;
    private Boolean isActive;

    public SalesStageDTO() {}

    public String getStageId() {
        return stageId;
    }

    public void setStageId(String stageId) {
        this.stageId = stageId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
