package com.frauddetection.backend.controller;

import com.frauddetection.backend.entity.FraudAlert;
import com.frauddetection.backend.service.FraudAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fraud-alert")
public class FraudAlertController {

    FraudAlertService fraudAlertService;

    public FraudAlertController(FraudAlertService fraudAlertService) {
        this.fraudAlertService = fraudAlertService;
    }

    @GetMapping()
    public List<FraudAlert> getAllAlerts(){
        return fraudAlertService.getAllAlerts();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<FraudAlert> updateAlertStatus(
            @PathVariable Long id,
            @RequestBody FraudAlert fraudAlert) {

        FraudAlert updatedAlert =
                fraudAlertService.updateAlertStatus(
                        id, fraudAlert.getStatus());

        return ResponseEntity.ok(updatedAlert);
    }
}
