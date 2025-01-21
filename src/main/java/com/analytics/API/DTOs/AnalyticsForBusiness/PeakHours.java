package com.analytics.API.DTOs.AnalyticsForBusiness;

public class PeakHours {
    private int mostTraffic;
    private int mostPurchases;

    public int getMostTraffic() {
        return mostTraffic;
    }

    public void setMostTraffic(int mostTraffic) {
        this.mostTraffic = mostTraffic;
    }

    public int getMostPurchases() {
        return mostPurchases;
    }

    public void setMostPurchases(int mostPurchases) {
        this.mostPurchases = mostPurchases;
    }
}
