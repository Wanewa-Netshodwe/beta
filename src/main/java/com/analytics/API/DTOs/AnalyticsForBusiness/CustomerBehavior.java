package com.analytics.API.DTOs.AnalyticsForBusiness;

public class CustomerBehavior {
    private  EngagementMetrics engagementMetrics;
    private CustomerSegments customerSegments;

    public EngagementMetrics getEngagementMetrics() {
        return engagementMetrics;
    }

    public void setEngagementMetrics(EngagementMetrics engagementMetrics) {
        this.engagementMetrics = engagementMetrics;
    }

    public CustomerSegments getCustomerSegments() {
        return customerSegments;
    }

    public void setCustomerSegments(CustomerSegments customerSegments) {
        this.customerSegments = customerSegments;
    }
}
