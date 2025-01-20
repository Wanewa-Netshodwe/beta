package com.analytics.API.Service;

import com.analytics.API.DTOs.*;
import com.analytics.API.Models.Analytics;
import com.analytics.API.Repository.AnalyticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticService {
    @Autowired
    private AnalyticRepository ar;
    private List<BusinessDataDTO> prevData = new ArrayList<>();

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
}