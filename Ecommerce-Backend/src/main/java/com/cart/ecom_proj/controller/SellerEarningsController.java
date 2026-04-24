package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Seller;
import com.cart.ecom_proj.model.SellerTransaction;
import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.SellerRepo;
import com.cart.ecom_proj.repo.SellerTransactionRepo;
import com.cart.ecom_proj.repo.UserRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/seller/earnings")
@CrossOrigin
public class SellerEarningsController {

    private final UserRepo userRepo;
    private final SellerRepo sellerRepo;
    private final SellerTransactionRepo transactionRepo;

    public SellerEarningsController(
            UserRepo userRepo,
            SellerRepo sellerRepo,
            SellerTransactionRepo transactionRepo
    ) {
        this.userRepo = userRepo;
        this.sellerRepo = sellerRepo;
        this.transactionRepo = transactionRepo;
    }

    @GetMapping("/summary")
    public BigDecimal getTotalEarnings() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Seller seller = sellerRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        List<SellerTransaction> transactions = transactionRepo.findBySeller(seller);

        return transactions.stream()
                .map(SellerTransaction::getNetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @GetMapping("/transactions")
    public List<SellerTransaction> getMyTransactions() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Seller seller = sellerRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        return transactionRepo.findBySeller(seller);
    }
}