package com.frauddetection.backend.controller;

import com.frauddetection.backend.service.FraudDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/fraud-dashboard")
public class FraudDashboardController {

    FraudDashboardService fraudDashboardService;

    public FraudDashboardController(FraudDashboardService fraudDashboardService) {
        this.fraudDashboardService = fraudDashboardService;
    }

    @GetMapping()
    public Map<String , Long> getcount(){
        Map<String,Long> mp = new HashMap<>();

        mp.put("totalTransactions" ,fraudDashboardService.getTotalTransactions());
        mp.put("suspiciousTransactions" , fraudDashboardService.getsuspiciousTransactions());
        mp.put("openAlerts" , fraudDashboardService.getOpenAlerts());
        mp.put("closedAlerts" , fraudDashboardService.getClosedAlerts());

        return mp;
    }
}
