package com.frauddetection.backend.service;

import com.frauddetection.backend.ResourceNotFoundException;
import com.frauddetection.backend.entity.Transaction;
import com.frauddetection.backend.respository.TransactionRepository;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final FraudDetectionService fraudDetectionService;

    public TransactionService(TransactionRepository transactionRepo,FraudDetectionService fraudDetectionService) {
        this.transactionRepository = transactionRepo;
        this.fraudDetectionService = fraudDetectionService;
    }

    public Transaction saveTransaction(Transaction t){
        fraudDetectionService.analyzeTransaction(t);
        return transactionRepository.save(t);
    }

    public List<Transaction> getAllTransaction(){
        return transactionRepository.findAll();
    }

    public Optional<Transaction> findById(Long id ){
        return transactionRepository.findById(id);
    }

    public Transaction updateTransaction(Long id , Transaction t){
        Transaction transaction = transactionRepository.findById(id).orElseThrow(
                ()->new ResourceNotFoundException("Transaction don't exist"));

        transaction.setSenderAccount(t.getSenderAccount());
        transaction.setReceiverAccount(t.getReceiverAccount());
        transaction.setAmount(t.getAmount());
        transaction.setTimestamp(t.getTimestamp());

        return transactionRepository.save(transaction);

    }

    public Boolean deleteById(Long id){
        if(!transactionRepository.existsById(id)){
            return false;
        }

        transactionRepository.deleteById(id);
        return true;

    }

}
