package com.analytics.API.DTOs;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BusinessDataDTO {
    @JsonProperty("business_id")

    private String businessId;
    private InfoDataDTO info;
    @JsonProperty("last_modified")

    private String lastModified;

    public String getBusinessId() {
        return businessId;
    }

    @Override
    public String toString() {
        return "BusinessDto{" +
                "businessId='" + businessId + '\'' +
                ", info=" + info +
                ",last Modified = "+lastModified+
                '}';
    }

    public String getLastModified() {
        return lastModified;
    }

    public void setLastModified(String lastModified) {
        this.lastModified = lastModified;
    }

    public void setBusinessId(String businessId) {
        this.businessId = businessId;
    }

    public InfoDataDTO getInfo() {
        return info;
    }

    public void setInfo(InfoDataDTO info) {
        this.info = info;
    }
}