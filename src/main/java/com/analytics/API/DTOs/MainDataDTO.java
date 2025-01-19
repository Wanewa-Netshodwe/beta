package com.analytics.API.DTOs;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class MainDataDTO {
    @NotEmpty
    List<BusinessDataDTO> data;

    public List<BusinessDataDTO> getData() {
        return data;
    }

    @Override
    public String toString() {
        return data.toString();
    }

    public void setData(List<BusinessDataDTO> data) {
        this.data = data;
    }
}
