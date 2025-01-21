package com.analytics.API.DTOs.AnalyticsForBusiness;

public class ConversionRates {
    private  double viewToCart;
    private double cartToCheckout;
    private  double checkoutToPurchase;

    private  double overall;

    public double getViewToCart() {
        return viewToCart;
    }

    public void setViewToCart(double viewToCart) {
        this.viewToCart = viewToCart;
    }

    public double getCartToCheckout() {
        return cartToCheckout;
    }

    public void setCartToCheckout(double cartToCheckout) {
        this.cartToCheckout = cartToCheckout;
    }

    public double getCheckoutToPurchase() {
        return checkoutToPurchase;
    }

    public void setCheckoutToPurchase(double checkoutToPurchase) {
        this.checkoutToPurchase = checkoutToPurchase;
    }

    public double getOverall() {
        return overall;
    }

    public void setOverall(double overall) {
        this.overall = overall;
    }
}
