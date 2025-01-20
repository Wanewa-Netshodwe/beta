package com.analytics.API.DTOs;

import java.time.ZonedDateTime;
import java.util.List;

public class CustomerAnalytic {
    private String date;
    private double timeSpendInStore;
    private String userId;
    private List<ProductInfos> productMatrix;

    public List<ProductInfos> getProductMatrix() {
        return productMatrix;
    }

    public void setProductMatrix(List<ProductInfos> productMatrix) {
        this.productMatrix = productMatrix;
    }

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