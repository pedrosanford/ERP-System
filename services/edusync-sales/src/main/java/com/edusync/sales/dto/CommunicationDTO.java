package com.edusync.sales.dto;

import com.edusync.sales.entity.Communication.CommunicationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CommunicationDTO {

    @NotNull(message = "Lead ID is required")
    private Long leadId;

    @NotNull(message = "Type is required")
    private CommunicationType type;

    @NotBlank(message = "Summary is required")
    private String summary;

    @NotNull(message = "Timestamp is required")
    private LocalDateTime timestamp;

    private Boolean followUpRequired;

    @Size(max = 100)
    private String createdBy;

    public CommunicationDTO() {}

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }

    public CommunicationType getType() {
        return type;
    }

    public void setType(CommunicationType type) {
        this.type = type;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getFollowUpRequired() {
        return followUpRequired;
    }

    public void setFollowUpRequired(Boolean followUpRequired) {
        this.followUpRequired = followUpRequired;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
