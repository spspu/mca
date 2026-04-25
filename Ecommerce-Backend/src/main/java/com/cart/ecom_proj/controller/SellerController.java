package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Seller;
import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.SellerRepo;
import com.cart.ecom_proj.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller")
@CrossOrigin
public class SellerController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SellerRepo sellerRepo;

    @GetMapping("/profile")
    public Seller getSellerProfile() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return sellerRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller profile not found"));
    }
}