package com.analytics.API.DTOs;

import java.time.ZonedDateTime;

public class CustomerAnalytic {
    private String date;
    private double timeSpendInStore;
    private String userId;
    public String toString() {
        return "CustomerAnalyticDto{" +
                "date=" + date +
                ", timeSpendInStore=" + timeSpendInStore +
                ", userId='" + userId + '\'' +
                '}';
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getTimeSpendInStore() {
        return timeSpendInStore;
    }

    public void setTimeSpendInStore(double timeSpendInStore) {
        this.timeSpendInStore = timeSpendInStore;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}