package com.analytics.API.DTOs.AnalyticsForBusiness;

public class ProductMetrics {
    private  int view;
    private double averageViewTime;
    private  int cartAdds;
    private  int checkouts;
    private double  revenue;
    private double conversionRate;

    public int getView() {
        return view;
    }

    public void setView(int view) {
        this.view = view;
    }

    public double getAverageViewTime() {
        return averageViewTime;
    }

    public void setAverageViewTime(double averageViewTime) {
        this.averageViewTime = averageViewTime;
    }

    public int getCartAdds() {
        return cartAdds;
    }

    public void setCartAdds(int cartAdds) {
        this.cartAdds = cartAdds;
    }

    public int getCheckouts() {
        return checkouts;
    }

    public void setCheckouts(int checkouts) {
        this.checkouts = checkouts;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }

    public double getConversionRate() {
        return conversionRate;
    }

    public void setConversionRate(double conversionRate) {
        this.conversionRate = conversionRate;
    }
}
