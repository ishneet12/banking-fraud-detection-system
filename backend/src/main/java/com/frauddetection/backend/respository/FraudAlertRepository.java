package com.frauddetection.backend.respository;

import com.frauddetection.backend.entity.FraudAlert;
import com.frauddetection.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {
    long countByStatus(String status);
}

