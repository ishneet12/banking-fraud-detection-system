package com.frauddetection.backend.service;

import com.frauddetection.backend.entity.FraudAlert;
import com.frauddetection.backend.entity.Transaction;
import com.frauddetection.backend.respository.FraudAlertRepository;
import com.frauddetection.backend.respository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class FraudDetectionService {

    // 1. Define the threshold as BigDecimal
    // 2. Compare transaction.getAmount() with the threshold
    // 3. Set fraudStatus, riskScore and fraudReason
    // 4. Return the transaction

    private final TransactionRepository transactionRepository ;
    private final FraudAlertRepository fraudAlertRepository;

    public FraudDetectionService(TransactionRepository transactionRepository , FraudAlertRepository fraudAlertRepository) {
        this.transactionRepository = transactionRepository;
        this.fraudAlertRepository = fraudAlertRepository;
    }

    public Transaction analyzeTransaction(Transaction t){
        BigDecimal threshold = BigDecimal.valueOf(50000);
        LocalDateTime cutoff = t.getTimestamp().minusMinutes(5);
        long recentCount = transactionRepository.countBySenderAccountAndTimestampAfter(t.getSenderAccount() , cutoff);
        int flag = t.getAmount().compareTo(threshold);
        boolean highAmount = flag > 0;
        boolean rapidTransactions = recentCount >= 5;

        if (rapidTransactions || highAmount) {
            t.setFraudStatus("SUSPICIOUS");
            t.setRiskScore(80);

            String reason = "";

            if (highAmount) {
                reason = "Amount exceeds ₹50,000";
            }

            if (rapidTransactions) {
                if (!reason.isEmpty()) {
                    reason += "; ";
                }
                reason += "Multiple transactions within 5 minutes";
            }

            t.setFraudReason(reason);
        } else {
            t.setFraudStatus("LOW_RISK");
            t.setRiskScore(10);
            t.setFraudReason("Amount is within the configured threshold");
        }

        transactionRepository.save(t);

        if ("SUSPICIOUS".equals(t.getFraudStatus())){
            FraudAlert fraudAlert = new FraudAlert();

            fraudAlert.setTransactionId(t.getId());
            fraudAlert.setReason(t.getFraudReason());
            fraudAlert.setStatus("OPEN");
            fraudAlert.setRiskScore(t.getRiskScore());

            fraudAlertRepository.save(fraudAlert);
        }

        return t;

    }
}
