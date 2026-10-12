package com.frauddetection.backend.service;

import com.frauddetection.backend.respository.FraudAlertRepository;
import com.frauddetection.backend.respository.TransactionRepository;
import org.springframework.stereotype.Service;

@Service
public class FraudDashboardService {
    FraudAlertRepository fraudAlertRepository;
    TransactionRepository transactionRepository;

    public FraudDashboardService(FraudAlertRepository fraudAlertRepository, TransactionRepository transactionRepository) {
        this.fraudAlertRepository = fraudAlertRepository;
        this.transactionRepository = transactionRepository;
    }

    public long getTotalTransactions() {
        return transactionRepository.count();
    }

    public long getsuspiciousTransactions() {
        return transactionRepository.countByFraudStatus("SUSPICIOUS");
    }

    public long getOpenAlerts() {
        return fraudAlertRepository.countByStatus("OPEN");
    }

    public long getClosedAlerts() {
        return fraudAlertRepository.countByStatus("CLOSED");
    }
}

