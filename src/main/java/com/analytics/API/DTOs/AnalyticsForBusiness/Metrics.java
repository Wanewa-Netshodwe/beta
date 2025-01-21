package com.analytics.API.DTOs.AnalyticsForBusiness;

public class Metrics {
private  OverallMetrics overallMetrics;
private  CustomerBehavior customerBehavior ;
private  ProductAnalytics productAnalytics;
private  TemporalAnalysis temporalAnalysis;
private  ConversionRates conversionRates;

    public OverallMetrics getOverallMetrics() {
        return overallMetrics;
    }

    public void setOverallMetrics(OverallMetrics overallMetrics) {
        this.overallMetrics = overallMetrics;
    }

    public CustomerBehavior getCustomerBehavior() {
        return customerBehavior;
    }

    public void setCustomerBehavior(CustomerBehavior customerBehavior) {
        this.customerBehavior = customerBehavior;
    }

    public ProductAnalytics getProductAnalytics() {
        return productAnalytics;
    }

    public void setProductAnalytics(ProductAnalytics productAnalytics) {
        this.productAnalytics = productAnalytics;
    }

    public TemporalAnalysis getTemporalAnalysis() {
        return temporalAnalysis;
    }

    public void setTemporalAnalysis(TemporalAnalysis temporalAnalysis) {
        this.temporalAnalysis = temporalAnalysis;
    }

    public ConversionRates getConversionRates() {
        return conversionRates;
    }

    public void setConversionRates(ConversionRates conversionRates) {
        this.conversionRates = conversionRates;
    }
}
