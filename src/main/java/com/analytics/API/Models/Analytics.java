package com.analytics.API.Models;

import com.analytics.API.DTOs.BusinessDataDTO;
import org.springframework.data.annotation.Id;

import java.util.List;

public class Analytics {
    @Id
    private String id;
    private List<BusinessDataDTO> businesses;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<BusinessDataDTO> getBusinesses() {
        return businesses;
    }

    public void setBusinesses(List<BusinessDataDTO> businesses) {
        this.businesses = businesses;
    }
}
