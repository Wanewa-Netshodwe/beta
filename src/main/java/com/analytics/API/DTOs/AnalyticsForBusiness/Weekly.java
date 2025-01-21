package com.analytics.API.DTOs.AnalyticsForBusiness;

public class Weekly implements CurrentInterface {
    private  Current current;


    @Override
    public Current getCurrent() {
        return current;
    }

    @Override
    public void setCurrent(Current current) {
        this.current = current;
    }
}
