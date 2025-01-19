package com.analytics.API.DTOs;

import java.util.List;
import java.util.Map;

public class InfoDataDTO {
    private Map<String, YearDataDTO>yearData;

    public Map<String, YearDataDTO> getYearData() {
        return yearData;
    }
    @Override
    public String toString() {
        return "InfoDto{" +
                "yearData=" + yearData +
                '}';
    }


    public void setYearData(Map<String, YearDataDTO> yearData) {
        this.yearData = yearData;
    }
}