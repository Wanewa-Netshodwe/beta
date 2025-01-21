package com.analytics.API.DTOs.AnalyticsForBusiness;

public class CustomerSegments {
    private int activeShoppers;
    private  int browsers;
    private int cartAbandoners;

    public int getActiveShoppers() {
        return activeShoppers;
    }

    public void setActiveShoppers(int activeShoppers) {
        this.activeShoppers = activeShoppers;
    }

    public int getBrowsers() {
        return browsers;
    }

    public void setBrowsers(int browsers) {
        this.browsers = browsers;
    }

    public int getCartAbandoners() {
        return cartAbandoners;
    }

    public void setCartAbandoners(int cartAbandoners) {
        this.cartAbandoners = cartAbandoners;
    }
}
