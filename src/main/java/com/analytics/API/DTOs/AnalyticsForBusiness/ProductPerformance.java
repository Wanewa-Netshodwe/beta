package com.analytics.API.DTOs.AnalyticsForBusiness;

public class ProductPerformance {
    private String productId;
    private ProductMetrics metrics;

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public ProductMetrics getMetrics() {
        return metrics;
    }

    public void setMetrics(ProductMetrics metrics) {
        this.metrics = metrics;
    }
}
