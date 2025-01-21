package com.analytics.API.DTOs;

import jakarta.validation.constraints.NotEmpty;

public class ProductInfos {
    @NotEmpty
    private boolean addedToCart;
    @NotEmpty
    private boolean inCheckout;
    @NotEmpty
    private boolean purchased;



    @NotEmpty
    private  double viewTime;
    @NotEmpty
    private Product product;

    public boolean isAddedToCart() {
        return addedToCart;
    }

    public boolean isPurchased() {
        return purchased;
    }

    public void setPurchased(boolean purchased) {
        this.purchased = purchased;
    }

    public void setAddedToCart(boolean addedToCart) {
        this.addedToCart = addedToCart;
    }

    public boolean isInCheckout() {
        return inCheckout;
    }

    public void setInCheckout(boolean inCheckout) {
        this.inCheckout = inCheckout;
    }

    public double getViewTime() {
        return viewTime;
    }

    public void setViewTime(double viewTime) {
        this.viewTime = viewTime;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
