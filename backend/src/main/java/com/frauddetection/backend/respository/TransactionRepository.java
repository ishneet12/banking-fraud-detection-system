package com.frauddetection.backend.respository;

import com.frauddetection.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction , Long > {
    public long countBySenderAccountAndTimestampAfter(String senderAccount,LocalDateTime cuttoff);
    public long countByFraudStatus(String fraudStatus);
}
