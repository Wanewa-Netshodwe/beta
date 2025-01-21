package com.analytics.API.DTOs.AnalyticsForBusiness;
public class EngagementMetrics {
    private double averageVisitDuration;
    private double bounceRate;

    private  double returnRate;

    public double getAverageVisitDuration() {
        return averageVisitDuration;
    }

    public void setAverageVisitDuration(double averageVisitDuration) {
        this.averageVisitDuration = averageVisitDuration;
    }

    public double getBounceRate() {
        return bounceRate;
    }

    public void setBounceRate(double bounceRate) {
        this.bounceRate = bounceRate;
    }

    public double getReturnRate() {
        return returnRate;
    }

    public void setReturnRate(double returnRate) {
        this.returnRate = returnRate;
    }
}
