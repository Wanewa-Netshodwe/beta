package com.analytics.API.DTOs.AnalyticsForBusiness;

public class IndividualBusinessAnalytic {
    private String business_id ;
    private TimePeriods timePeriods ;

    public String getBusiness_id() {
        return business_id;
    }

    public void setBusiness_id(String business_id) {
        this.business_id = business_id;
    }

    public TimePeriods getTimePeriods() {
        return timePeriods;
    }

    public void setTimePeriods(TimePeriods timePeriods) {
        this.timePeriods = timePeriods;
    }
}
