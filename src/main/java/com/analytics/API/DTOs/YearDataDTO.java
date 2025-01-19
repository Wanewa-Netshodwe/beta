package com.analytics.API.DTOs;

import java.util.List;
import java.util.Map;

public class YearDataDTO {
    private Map<String, MonthDataDTO> monthData;

    public Map<String, MonthDataDTO> getMonthData() {
        return monthData;
    }
    @Override
    public String toString() {

        return "YearDataDto{" +
                "monthData=" + monthData +
                '}';
    }

    public void setMonthData(Map<String, MonthDataDTO> monthData) {
        this.monthData = monthData;
    }
}