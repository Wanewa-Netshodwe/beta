package com.analytics.API.DTOs.AnalyticsForBusiness;

public class OverallMetrics {
   private int totalCustomers;
    private int totalVisits;
    private double averageTimeInStore;
    private double totalRevenue;
    private double conversionRate;

    public int getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(int totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public int getTotalVisits() {
        return totalVisits;
    }

    public void setTotalVisits(int totalVisits) {
        this.totalVisits = totalVisits;
    }

    public double getAverageTimeInStore() {
        return averageTimeInStore;
    }

    public void setAverageTimeInStore(double averageTimeInStore) {
        this.averageTimeInStore = averageTimeInStore;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getConversionRate() {
        return conversionRate;
    }

    public void setConversionRate(double conversionRate) {
        this.conversionRate = conversionRate;
    }
}
