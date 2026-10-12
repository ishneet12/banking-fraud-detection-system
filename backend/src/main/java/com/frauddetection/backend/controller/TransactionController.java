package com.frauddetection.backend.controller;

import com.frauddetection.backend.entity.Transaction;
import com.frauddetection.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService ;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }
    @PostMapping()
    public Transaction saveTransaction(@Valid  @RequestBody Transaction t){
        return transactionService.saveTransaction(t);
    }

    @GetMapping()
    public List<Transaction> getAllTransaction(){
        return transactionService.getAllTransaction();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> findById(@PathVariable Long id){
        Optional<Transaction> t = transactionService.findById(id);

        if(t.isPresent()){
            return ResponseEntity.ok(t.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id,
                                                         @Valid @RequestBody Transaction updatedTransaction) {
           Transaction tr = transactionService.updateTransaction(id,updatedTransaction);
           return ResponseEntity.ok(tr);

    }

    @DeleteMapping("/{id}")
    public Boolean deleteById(@PathVariable Long id){

        return transactionService.deleteById(id);
    }



}
