package com.analytics.API.DTOs;

import jakarta.validation.constraints.NotEmpty;

public class Product {
    @NotEmpty
    private String productId;
    @NotEmpty
    private double price;

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
