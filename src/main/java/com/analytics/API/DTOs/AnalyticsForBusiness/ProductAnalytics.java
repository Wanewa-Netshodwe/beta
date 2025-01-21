package com.analytics.API.DTOs.AnalyticsForBusiness;

import java.util.List;

public class ProductAnalytics {
private  Overview overview;
private List<ProductPerformance> productPerformance;

    public Overview getOverview() {
        return overview;
    }

    public void setOverview(Overview overview) {
        this.overview = overview;
    }

    public List<ProductPerformance> getProductPerformance() {
        return productPerformance;
    }

    public void setProductPerformance(List<ProductPerformance> productPerformance) {
        this.productPerformance = productPerformance;
    }
}
