package com.frauddetection.backend.service;

import com.frauddetection.backend.ResourceNotFoundException;
import com.frauddetection.backend.entity.FraudAlert;

import com.frauddetection.backend.respository.FraudAlertRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FraudAlertService {

    FraudAlertRepository fraudAlertRepository;

    public FraudAlertService(FraudAlertRepository fraudAlertRepository) {
        this.fraudAlertRepository = fraudAlertRepository;
    }

    public List<FraudAlert> getAllAlerts(){
        return fraudAlertRepository.findAll();
    }

    public FraudAlert updateAlertStatus(Long id , String status){
        FraudAlert alert = fraudAlertRepository.findById(id).orElseThrow(
                ()->new ResourceNotFoundException("No Alert"));

        if (!status.equals("OPEN")
                && !status.equals("UNDER_REVIEW")
                && !status.equals("CLOSED")) {
            throw new IllegalArgumentException("Invalid alert status");
        }

        alert.setStatus(status);

        return fraudAlertRepository.save(alert);
    }

}
