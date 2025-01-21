package com.analytics.API.Service;

import com.analytics.API.DTOs.*;
import com.analytics.API.DTOs.AnalyticsForBusiness.*;
import com.analytics.API.Models.Analytics;
import com.analytics.API.Repository.AnalyticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoField;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticService {
    @Autowired
    private AnalyticRepository ar;
    private List<BusinessDataDTO> prevData = new ArrayList<>();
    private Analytics databaseDoc = new Analytics();

    public List<BusinessDataDTO> getPrevData() {
        return prevData;
    }

    public void setPrevData(List<BusinessDataDTO> prevData) {
        this.prevData = prevData;
    }

    public void prepareDocs(MainDataDTO mainData) {
        if (mainData == null || mainData.getData() == null) {
            return;
        }

        List<BusinessDataDTO> businessesToUpdate = new ArrayList<>();
        List<BusinessDataDTO> newBusinessList = new ArrayList<>();
        List<BusinessDataDTO> businessDataList = mainData.getData();

        if (prevData.isEmpty()) {
            Optional<Analytics> analytics = ar.findById("eeyeygdggGGgT$5");
            if (analytics.isPresent()) {
                prevData = analytics.get().getBusinesses();
                if (prevData == null) {
                    prevData = new ArrayList<>();
                }
            }
            System.out.println("Previous data loaded from database");
        }

        Map<String, String> prevDataMap = new HashMap<>();
        prevData.forEach(prevBusinessData -> {
            if (prevBusinessData != null && prevBusinessData.getLastModified() != null && prevBusinessData.getBusinessId() != null) {
                prevDataMap.put(prevBusinessData.getLastModified(), prevBusinessData.getBusinessId());
            }
        });

        businessDataList.forEach(businessData -> {
            if (businessData != null && businessData.getLastModified() != null && businessData.getBusinessId() != null) {
                if (!prevDataMap.containsKey(businessData.getLastModified())) {
                    if (prevDataMap.containsValue(businessData.getBusinessId())) {
                        businessesToUpdate.add(businessData);
                    } else {
                        newBusinessList.add(businessData);
                    }
                }
            }
        });

        updateDocs(businessesToUpdate, newBusinessList, businessDataList);
    }

    public void updateDocs(List<BusinessDataDTO> businessesToUpdate, List<BusinessDataDTO> newBusinessList,
                           List<BusinessDataDTO> businessDataList) {
        List<BusinessDataDTO> updatedBusinesses = new ArrayList<>();

        if (!businessesToUpdate.isEmpty()) {
            businessesToUpdate.forEach(businessData -> {
                if (businessData != null) {
                    BusinessDataDTO oldBusiness = prevData.stream()
                            .filter(b -> b != null && b.getBusinessId() != null &&
                                    b.getBusinessId().equals(businessData.getBusinessId()))
                            .findFirst()
                            .orElse(null);

                    if (oldBusiness != null) {
                        updatedBusinesses.add(updateBusiness(businessData, oldBusiness));
                    }
                }
            });
        }

        // Add new businesses
        if (newBusinessList != null) {
            updatedBusinesses.addAll(newBusinessList);
        }

        // Add businesses that weren't updated
        List<BusinessDataDTO> notUpdatedBusinesses = prevData.stream()
                .filter(oldBusiness -> oldBusiness != null &&
                        updatedBusinesses.stream()
                                .noneMatch(updated -> updated != null &&
                                        updated.getBusinessId() != null &&
                                        updated.getBusinessId().equals(oldBusiness.getBusinessId())))
                .collect(Collectors.toList());

        updatedBusinesses.addAll(notUpdatedBusinesses);

        System.out.println("Businesses updated: " + businessesToUpdate.size());
        System.out.println("New businesses added: " + newBusinessList.size());
        System.out.println("Total businesses: " + updatedBusinesses.size());

        setPrevData(updatedBusinesses);
//saveToDatabase();

    }

    public BusinessDataDTO updateBusiness(BusinessDataDTO newBusiness, BusinessDataDTO oldBusiness) {
        if (newBusiness == null) {
            return oldBusiness;
        }
        if (oldBusiness == null) {
            return newBusiness;
        }

        BusinessDataDTO updatedBusiness = new BusinessDataDTO();
        updatedBusiness.setBusinessId(newBusiness.getBusinessId());
        updatedBusiness.setLastModified(newBusiness.getLastModified());

        InfoDataDTO updatedInfo = new InfoDataDTO();
        Map<String, YearDataDTO> updatedYearData = new HashMap<>();

        Map<String, YearDataDTO> newYearData = newBusiness.getInfo() != null ?
                newBusiness.getInfo().getYearData() : new HashMap<>();
        Map<String, YearDataDTO> oldYearData = oldBusiness.getInfo() != null ?
                oldBusiness.getInfo().getYearData() : new HashMap<>();

        if (newYearData == null) newYearData = new HashMap<>();
        if (oldYearData == null) oldYearData = new HashMap<>();

        // Merge year data
        Set<String> allYears = new HashSet<>();
        allYears.addAll(newYearData.keySet());
        allYears.addAll(oldYearData.keySet());

        for (String year : allYears) {
            if (newYearData.containsKey(year)) {
                YearDataDTO newYear = newYearData.get(year);
                YearDataDTO oldYear = oldYearData.getOrDefault(year, new YearDataDTO());
                updatedYearData.put(year, mergeYearData(newYear, oldYear));
            } else {
                updatedYearData.put(year, oldYearData.get(year));
            }
        }

        updatedInfo.setYearData(updatedYearData);
        updatedBusiness.setInfo(updatedInfo);

        return updatedBusiness;
    }

    private YearDataDTO mergeYearData(YearDataDTO newYear, YearDataDTO oldYear) {
        YearDataDTO mergedYear = new YearDataDTO();
        Map<String, MonthDataDTO> mergedMonthData = new HashMap<>();

        Map<String, MonthDataDTO> newMonthData = (newYear != null && newYear.getMonthData() != null) ?
                newYear.getMonthData() : new HashMap<>();
        Map<String, MonthDataDTO> oldMonthData = (oldYear != null && oldYear.getMonthData() != null) ?
                oldYear.getMonthData() : new HashMap<>();

        Set<String> allMonths = new HashSet<>();
        allMonths.addAll(newMonthData.keySet());
        allMonths.addAll(oldMonthData.keySet());

        for (String month : allMonths) {
            if (newMonthData.containsKey(month)) {
                MonthDataDTO newMonth = newMonthData.get(month);
                MonthDataDTO oldMonth = oldMonthData.getOrDefault(month, new MonthDataDTO());
                mergedMonthData.put(month, mergeMonthData(newMonth, oldMonth));
            } else {
                mergedMonthData.put(month, oldMonthData.get(month));
            }
        }

        mergedYear.setMonthData(mergedMonthData);
        return mergedYear;
    }

    private MonthDataDTO mergeMonthData(MonthDataDTO newMonth, MonthDataDTO oldMonth) {
        MonthDataDTO mergedMonth = new MonthDataDTO();
        Map<String, DayDataDTO> mergedDayData = new HashMap<>();

        Map<String, DayDataDTO> newDayData = (newMonth != null && newMonth.getDayData() != null) ?
                newMonth.getDayData() : new HashMap<>();
        Map<String, DayDataDTO> oldDayData = (oldMonth != null && oldMonth.getDayData() != null) ?
                oldMonth.getDayData() : new HashMap<>();

        Set<String> allDays = new HashSet<>();
        allDays.addAll(newDayData.keySet());
        allDays.addAll(oldDayData.keySet());

        for (String day : allDays) {
            if (newDayData.containsKey(day)) {
                DayDataDTO newDay = newDayData.get(day);
                DayDataDTO oldDay = oldDayData.getOrDefault(day, new DayDataDTO());
                mergedDayData.put(day, mergeDayData(newDay, oldDay));
            } else {
                mergedDayData.put(day, oldDayData.get(day));
            }
        }

        mergedMonth.setDayData(mergedDayData);
        return mergedMonth;
    }

    private DayDataDTO mergeDayData(DayDataDTO newDay, DayDataDTO oldDay) {
        DayDataDTO mergedDay = new DayDataDTO();
        List<CustomerAnalytic> mergedAnalytics = new ArrayList<>();


        List<CustomerAnalytic> newAnalytics = (newDay != null && newDay.getCustomerAnalytic() != null) ?
                newDay.getCustomerAnalytic() : new ArrayList<>();
        List<CustomerAnalytic> oldAnalytics = (oldDay != null && oldDay.getCustomerAnalytic() != null) ?
                oldDay.getCustomerAnalytic() : new ArrayList<>();


        Map<String, ProductInfos> oldProductInfoMap = oldAnalytics.stream()
                .flatMap(analytic -> analytic.getProductMatrix().stream())
                .collect(Collectors.toMap(
                        productInfo -> productInfo.getProduct().getProductId(),
                        productInfo -> productInfo
                ));


        List<ProductInfos> mergedProductInfos = new ArrayList<>();
        for (CustomerAnalytic newAnalytic : newAnalytics) {
            List<ProductInfos> updatedProductInfos = new ArrayList<>();

            for (ProductInfos newProductInfo : newAnalytic.getProductMatrix()) {
                String productId = newProductInfo.getProduct().getProductId();
                ProductInfos oldProductInfo = oldProductInfoMap.get(productId);

                if (oldProductInfo != null) {

                    oldProductInfo.setViewTime(newProductInfo.getViewTime());
                    oldProductInfo.setAddedToCart(newProductInfo.isAddedToCart());
                    oldProductInfo.setInCheckout(newProductInfo.isInCheckout());
                    updatedProductInfos.add(oldProductInfo);
                } else {

                    updatedProductInfos.add(newProductInfo);
                }
            }


            newAnalytic.setProductMatrix(updatedProductInfos);
            mergedProductInfos.addAll(updatedProductInfos);
        }


        mergedAnalytics.addAll(newAnalytics);


        oldAnalytics.stream()
                .filter(oldAnalytic -> !newAnalytics.contains(oldAnalytic))
                .forEach(mergedAnalytics::add);


        mergedDay.setCustomerAnalytic(mergedAnalytics);
        return mergedDay;
    }

    @Scheduled(cron = "30 5 22 * * ?")
    private void saveToDatabase() {
        Analytics analytics = new Analytics();
        analytics.setId("eeyeygdggGGgT$5");
        analytics.setBusinesses(prevData);
        ar.save(analytics);
        System.out.println("Analytics saved to database");
    }


    public IndividualBusinessAnalytic getAnalytics(String businessId) {
        if (databaseDoc.getId() == null) {
            Optional<Analytics> analytics = ar.findById("eeyeygdggGGgT$5");
            if (analytics.isPresent()) {
                databaseDoc = analytics.get();

            }
        }
        BusinessDataDTO business = databaseDoc.getBusinesses().stream().filter(businessDataDTO -> businessDataDTO.getBusinessId().equals(businessId)).findFirst().orElse(null);
        return BuiltAnalytic(business);
    }

    private IndividualBusinessAnalytic determineDaily(BusinessDataDTO businessData) {
        IndividualBusinessAnalytic businessAnalytic = new IndividualBusinessAnalytic();

        businessAnalytic.setBusiness_id(businessAnalytic.getBusiness_id());
        LocalDate today = LocalDate.now();
        String year = Integer.toString(today.getYear());
        String shortMon = today.getMonth().toString().charAt(0) + today.getMonth().toString().substring(1, 3).toLowerCase();
        String day = Integer.toString(today.getDayOfMonth());
        List<CustomerAnalytic> customerAnalytics = businessData.getInfo().getYearData().get(year).getMonthData().get(shortMon).getDayData().get(day).getCustomerAnalytic();
        TimePeriods timePeriods = new TimePeriods();
        Daily daily = new Daily();
        Current current = new Current();
        Metrics metrics = new Metrics();
        CustomerBehavior customerBehavior = new CustomerBehavior();
        TemporalAnalysis temporalAnalysis = new TemporalAnalysis();
        ProductAnalytics productAnalytics = new ProductAnalytics();
        OverallMetrics overallMetrics = calculateOverMetrics(customerAnalytics);
        EngagementMetrics engagementMetrics = calculateEngagementMetrics(customerAnalytics);
        CustomerSegments customerSegments = calculateCustomerSegments(customerAnalytics);
        Overview overview = calculateOverview(customerAnalytics);
        PeakHours peakHours = calculatePeakHours(customerAnalytics);
        List<ProductPerformance> performanceList = calculateProductPerformance(customerAnalytics);
        productAnalytics.setProductPerformance(performanceList);
        productAnalytics.setOverview(overview);
        ConversionRates conversionRate = calculateConversionRates(customerAnalytics);
        temporalAnalysis.setPeakHours(peakHours);
        customerBehavior.setEngagementMetrics(engagementMetrics);
        customerBehavior.setCustomerSegments(customerSegments);
        metrics.setOverallMetrics(overallMetrics);
        metrics.setConversionRates(conversionRate);
        metrics.setCustomerBehavior(customerBehavior);
        metrics.setTemporalAnalysis(temporalAnalysis);
        current.setMetrics(metrics);
        daily.setCurrent(current);
        timePeriods.setDaily(daily);
        businessAnalytic.setTimePeriods(timePeriods);
        return businessAnalytic;

    }


    private OverallMetrics calculateOverMetrics(List<CustomerAnalytic> customerAnalytics){
     int totalCustomers=0;
     int totalVisits=0;
     double averageTimeInStore=0;
     double totalRevenue=0;
     double conversionRate=0;
     double sumTimeInStore =0;
     double inCheckout=0;
     double inCart=0;
     totalCustomers = customerAnalytics.size();
     totalVisits = customerAnalytics.size();
    for(CustomerAnalytic cusAnalytic : customerAnalytics ){
        sumTimeInStore +=cusAnalytic.getTimeSpendInStore();
        for(ProductInfos productInfo : cusAnalytic.getProductMatrix()){
            if(productInfo.isAddedToCart()){
                inCart++;
            }
            if(productInfo.isInCheckout()){
                inCheckout++;

            }
            if(productInfo.isPurchased()){
                totalRevenue += productInfo.getProduct().getPrice();
            }
        }
    }
    averageTimeInStore = (sumTimeInStore/totalCustomers)/1000;
    conversionRate = inCart/inCheckout;
    OverallMetrics overallMetrics = new OverallMetrics();
    overallMetrics.setConversionRate(conversionRate);
    overallMetrics.setTotalCustomers(totalCustomers);
    overallMetrics.setTotalRevenue(totalRevenue);
    overallMetrics.setAverageTimeInStore(averageTimeInStore);
    overallMetrics.setTotalVisits(totalVisits);
    return  overallMetrics;




}
    private EngagementMetrics calculateEngagementMetrics(List<CustomerAnalytic> customerAnalytics){
     double averageVisitDuration;
     double bounceRate;
      double returnRate =0;
        int totalCustomers=0;
        double sumTimeInStore =0;
        double inCart=0;
        totalCustomers = customerAnalytics.size();
        for(CustomerAnalytic cusAnalytic : customerAnalytics ){
            sumTimeInStore +=cusAnalytic.getTimeSpendInStore();
            for(ProductInfos productInfo : cusAnalytic.getProductMatrix()){
                if(productInfo.isAddedToCart()){
                    inCart++;
                }

            }
        }
        bounceRate = totalCustomers/inCart;
        averageVisitDuration=(sumTimeInStore/totalCustomers)/1000;
        EngagementMetrics metric = new EngagementMetrics();
        metric.setBounceRate(bounceRate);
        metric.setAverageVisitDuration(averageVisitDuration);
        metric.setReturnRate(0);
        return  metric;




    }

    private Overview calculateOverview(List<CustomerAnalytic> customerAnalytics){
         int totalProductViews;
          double averageViewTime;
          double sumViewTime=0;
         double cartAddRate;
         double addToCart=0;
         double checkoutRate;
         double purchaseRate;
        double isPurchased=0;
         double inCheckout=0;

        List<ProductInfos> productInfos = customerAnalytics.stream()
                .flatMap(customerAnalytic -> customerAnalytic.getProductMatrix().stream())
                .collect(Collectors.toList());
        totalProductViews =productInfos.size();
        for(ProductInfos productInfo :productInfos){
            sumViewTime +=productInfo.getViewTime();
            if(productInfo.isAddedToCart()){
                addToCart++;
            }
            if(productInfo.isInCheckout()){
                inCheckout++;
            }
            if(productInfo.isPurchased()){
                isPurchased++;
            }
        }
        purchaseRate =totalProductViews/isPurchased;
        checkoutRate =totalProductViews/inCheckout;
        cartAddRate =totalProductViews/addToCart;
        averageViewTime =(sumViewTime/totalProductViews)/1000;
        Overview overview = new Overview();
        overview.setAverageViewTime(averageViewTime);
        overview.setCheckoutRate(checkoutRate);
        overview.setCartAddRate(cartAddRate);
        overview.setPurchaseRate(purchaseRate);
        overview.setTotalProductViews(totalProductViews);
        return overview;

    }

    private PeakHours calculatePeakHours(List<CustomerAnalytic> customerAnalytics) {
        List<Integer> customersHours = customerAnalytics.stream()
                .map(customerAnalytic -> {
                    Instant date = Instant.parse(customerAnalytic.getDate());
                    LocalDate localDate = date.atZone(ZoneId.of("GMT+2")).toLocalDate();
                    return localDate.get(ChronoField.HOUR_OF_DAY);
                }).collect(Collectors.toList());

        Map<Integer, Integer> trafficMap = new HashMap<>();
        customersHours.forEach(hour -> {
            for (int i = -3; i <= 3; i++) {
                int adjustedHour = (hour + i + 24) % 24;
                trafficMap.put(adjustedHour, trafficMap.getOrDefault(adjustedHour, 0) + 1);
            }
        });

        int mostTrafficHour = -1;
        int maxCount = 0;

        for (Map.Entry<Integer, Integer> entry : trafficMap.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                mostTrafficHour = entry.getKey();
            }
        }

        PeakHours peakHours = new PeakHours();
        peakHours.setMostTraffic(mostTrafficHour);
        peakHours.setMostPurchases(mostTrafficHour);
        return peakHours;
    }
    private ConversionRates calculateConversionRates(List<CustomerAnalytic> customerAnalytics) {
        double viewToCart;
        int viewedProducts=0;
        int inCartProducts=0;
        int purchasedProducts=0;
        int inCheckoutProducts=0;
        double cartToCheckout;
        double checkoutToPurchase;
        double overall;
        List<ProductInfos> productInfos = customerAnalytics.stream()
                .flatMap(customerAnalytic -> customerAnalytic.getProductMatrix().stream())
                .collect(Collectors.toList());
       for(ProductInfos productInfo : productInfos){
           viewedProducts++;
           if(productInfo.isAddedToCart()){
               inCartProducts++;
           }
           if(productInfo.isPurchased()){
               purchasedProducts++;
           }
           if(productInfo.isInCheckout()){
               inCheckoutProducts++;
           }
       }
        cartToCheckout = inCartProducts/inCheckoutProducts;
        checkoutToPurchase = inCheckoutProducts/purchasedProducts;
        viewToCart = viewedProducts/inCartProducts;
        overall = viewedProducts/purchasedProducts;
        ConversionRates conversionRate = new ConversionRates();
        conversionRate.setOverall(overall);
        conversionRate.setCartToCheckout(cartToCheckout);
        conversionRate.setCheckoutToPurchase(checkoutToPurchase);
        conversionRate.setViewToCart(viewToCart);
        return  conversionRate;

    }

    private CustomerSegments calculateCustomerSegments(List<CustomerAnalytic> customerAnalytics) {
        int activeShoppers = 0;
        int browsers = customerAnalytics.size();
        int cartAbandoners = 0;

        Set<String> purchasedProducts = new HashSet<>();
        Set<String> addedToCartProducts = new HashSet<>();
        Set<String> cartAbandonedProducts = new HashSet<>();

        for (CustomerAnalytic cusAnalytic : customerAnalytics) {
            for (ProductInfos productInfo : cusAnalytic.getProductMatrix()) {
                if (productInfo.isPurchased()) {
                    purchasedProducts.add(productInfo.getProduct().getProductId());
                }
                if (productInfo.isAddedToCart()) {
                    addedToCartProducts.add(productInfo.getProduct().getProductId());
                }
            }
        }

        for (String productId : addedToCartProducts) {
            if (!purchasedProducts.contains(productId)) {
                cartAbandoners++;
            }
        }

        activeShoppers = purchasedProducts.size();

        CustomerSegments segment = new CustomerSegments();
        segment.setBrowsers(browsers);
        segment.setCartAbandoners(cartAbandoners);
        segment.setActiveShoppers(activeShoppers);

        return segment;
    }

    private ProductMetrics calculateProductMetrics(ProductInfos productInfo){
          int view=1;
         double averageViewTime;
          int cartAdds=0;
          int checkouts=0;
         double  revenue=0;
         double conversionRate;
         averageViewTime = productInfo.getViewTime();
         if(productInfo.isInCheckout()){
             checkouts++;
         }
         if(productInfo.isAddedToCart()){
             cartAdds++;
         }
         conversionRate = cartAdds/checkouts;
         revenue =productInfo.getProduct().getPrice();
         ProductMetrics metrics = new ProductMetrics();
         metrics.setCheckouts(checkouts);
         metrics.setCartAdds(cartAdds);
         metrics.setView(view);
         metrics.setRevenue(revenue);
         metrics.setConversionRate(conversionRate);
         metrics.setAverageViewTime(averageViewTime);
         return  metrics;

    }
    private List<ProductPerformance> calculateProductPerformance(List<CustomerAnalytic> customerAnalytics){
         String productId;
         ProductMetrics metrics;
         List<ProductPerformance> performanceList = new ArrayList<>();
        List<ProductInfos> productInfos = customerAnalytics.stream()
                .flatMap(customerAnalytic -> customerAnalytic.getProductMatrix().stream())
                .collect(Collectors.toList());
        productInfos.forEach(productInfos1 -> {
            ProductPerformance performance=new ProductPerformance();
            performance.setProductId(productInfos1.getProduct().getProductId());
            performance.setMetrics(calculateProductMetrics(productInfos1));
            Optional<ProductPerformance> existingProduct = performanceList.stream().filter(productPerformance -> productPerformance.getProductId().equals(performance.getProductId())).findFirst();
            if(existingProduct.isPresent()){
                ProductPerformance updatedPerformance =new ProductPerformance();
                updatedPerformance.setProductId(performance.getProductId());
                ProductMetrics updatedMetrics = new ProductMetrics();
                updatedMetrics.setRevenue(existingProduct.get().getMetrics().getRevenue() + performance.getMetrics().getRevenue());
                updatedMetrics.setView(existingProduct.get().getMetrics().getView() + performance.getMetrics().getView());
                updatedMetrics.setCheckouts(existingProduct.get().getMetrics().getCheckouts() + performance.getMetrics().getCheckouts());
                updatedMetrics.setCartAdds(existingProduct.get().getMetrics().getCartAdds() + performance.getMetrics().getCartAdds());
                updatedMetrics.setAverageViewTime(existingProduct.get().getMetrics().getAverageViewTime() + performance.getMetrics().getAverageViewTime());
                updatedMetrics.setConversionRate((existingProduct.get().getMetrics().getConversionRate() + performance.getMetrics().getConversionRate())/2);
                int index = performanceList.indexOf(existingProduct);
                performanceList.remove(index);
                performanceList.add(updatedPerformance);
            }
            else{
                performanceList.add(performance);
            }
        });
        return performanceList;


    }

    private IndividualBusinessAnalytic BuiltAnalytic(BusinessDataDTO businessData){
        IndividualBusinessAnalytic businessAnalytic = determineDaily(businessData);
        return businessAnalytic;
    }

}