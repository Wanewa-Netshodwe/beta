package com.analytics.API.DTOs;

import java.util.List;
import java.util.Map;

public class MonthDataDTO {
    private Map<String, DayDataDTO> dayData;

    public Map<String, DayDataDTO>getDayData() {
        return dayData;
    }
    @Override
    public String toString() {
        return "MonthDataDto{" +
                "dayData=" + dayData +
                '}';
    }

    public void setDayData(Map<String, DayDataDTO> dayData) {
        this.dayData = dayData;
    }
}