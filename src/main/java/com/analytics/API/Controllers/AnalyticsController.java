package com.analytics.API.Controllers;

import com.analytics.API.DTOs.AnalyticsForBusiness.IndividualBusinessAnalytic;
import com.analytics.API.DTOs.MainDataDTO;
import com.analytics.API.Service.AnalyticService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.InvocationTargetException;

@RestController
@RequestMapping("analytics")
public class AnalyticsController {
    @Autowired
    AnalyticService As;
 @PostMapping("/add")
    public ResponseEntity<String> Processinfo(@Valid @RequestBody MainDataDTO mainData) {
     System.out.println(mainData);
     As.prepareDocs(mainData);
     return  ResponseEntity.status(HttpStatus.OK).body(" recived ");

 }
    @GetMapping ("/get/{businessid}")
    public ResponseEntity<IndividualBusinessAnalytic> CalculateAnalytic(@PathVariable String businessid) throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        IndividualBusinessAnalytic businessAnalytic = As.getAnalytics(businessid);
        return  ResponseEntity.status(HttpStatus.OK).body(businessAnalytic);

    }




}
