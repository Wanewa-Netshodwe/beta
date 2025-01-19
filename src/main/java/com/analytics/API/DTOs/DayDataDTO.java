package com.analytics.API.DTOs;

import java.util.List;

public class DayDataDTO {
    private List<CustomerAnalytic> customerAnalytic;

    @Override
    public String toString() {
        return "DayDataDto{" +
                "customerAnalytic=" + customerAnalytic +
                '}';
    }
    public List<CustomerAnalytic> getCustomerAnalytic() {
        return customerAnalytic;
    }

    public void setCustomerAnalytic(List<CustomerAnalytic> customerAnalytic) {
        this.customerAnalytic = customerAnalytic;
    }
}