package com.analytics.API.Controllers;

import com.analytics.API.DTOs.MainDataDTO;
import com.analytics.API.Service.AnalyticService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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



}
