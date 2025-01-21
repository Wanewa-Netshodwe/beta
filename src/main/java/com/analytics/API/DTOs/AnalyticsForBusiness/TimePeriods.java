package com.analytics.API.DTOs.AnalyticsForBusiness;

public class TimePeriods {
    private Daily daily;
    private Weekly weekly;
    private  BiWeekly biWeekly;
    private Month month;
    private  FirstQuarter firstQuarter;

    public Daily getDaily() {
        return daily;
    }

    public void setDaily(Daily daily) {
        this.daily = daily;
    }

    public Weekly getWeekly() {
        return weekly;
    }

    public void setWeekly(Weekly weekly) {
        this.weekly = weekly;
    }

    public BiWeekly getBiWeekly() {
        return biWeekly;
    }

    public void setBiWeekly(BiWeekly biWeekly) {
        this.biWeekly = biWeekly;
    }

    public Month getMonth() {
        return month;
    }

    public void setMonth(Month month) {
        this.month = month;
    }

    public FirstQuarter getFirstQuarter() {
        return firstQuarter;
    }

    public void setFirstQuarter(FirstQuarter firstQuarter) {
        this.firstQuarter = firstQuarter;
    }
}
