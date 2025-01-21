package com.analytics.API.DTOs.AnalyticsForBusiness;

public class Overview {
    private int totalProductViews;
    private  double averageViewTime;
    private double cartAddRate;
    private double checkoutRate;
    private double purchaseRate;

    public int getTotalProductViews() {
        return totalProductViews;
    }
    public  Overview(){

    }

    public void setTotalProductViews(int totalProductViews) {
        this.totalProductViews = totalProductViews;
    }

    public double getAverageViewTime() {
        return averageViewTime;
    }

    public void setAverageViewTime(double averageViewTime) {
        this.averageViewTime = averageViewTime;
    }

    public double getCartAddRate() {
        return cartAddRate;
    }

    public void setCartAddRate(double cartAddRate) {
        this.cartAddRate = cartAddRate;
    }

    public double getCheckoutRate() {
        return checkoutRate;
    }

    public void setCheckoutRate(double checkoutRate) {
        this.checkoutRate = checkoutRate;
    }

    public double getPurchaseRate() {
        return purchaseRate;
    }

    public void setPurchaseRate(double purchaseRate) {
        this.purchaseRate = purchaseRate;
    }

    public Overview(int totalProductViews, double averageViewTime, double cartAddRate, double checkoutRate) {
        this.totalProductViews = totalProductViews;
        this.averageViewTime = averageViewTime;
        this.cartAddRate = cartAddRate;
        this.checkoutRate = checkoutRate;
    }
}
