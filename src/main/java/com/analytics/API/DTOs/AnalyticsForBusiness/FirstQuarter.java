package com.analytics.API.DTOs.AnalyticsForBusiness;

public class FirstQuarter  implements  CurrentInterface{
    private  Current current;
    public FirstQuarter() {

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
