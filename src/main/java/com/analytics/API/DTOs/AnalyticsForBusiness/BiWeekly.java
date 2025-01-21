package com.analytics.API.DTOs.AnalyticsForBusiness;

public class BiWeekly  implements  CurrentInterface{
    private  Current current;

    public  BiWeekly(){

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
