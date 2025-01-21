package com.analytics.API.DTOs.AnalyticsForBusiness;

public class Daily implements  CurrentInterface {
    private  Current current;

    public Daily() {

    }

    @Override
    public Current getCurrent() {
        return current;
    }

    @Override
    public void setCurrent(Current current) {
this.current = current;
    }
}
