package com.cart.ecom_proj.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cart.ecom_proj.enums.SellerStatus;
import com.cart.ecom_proj.model.Seller;
import com.cart.ecom_proj.repo.SellerRepo;
import com.cart.ecom_proj.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/sellers")
@CrossOrigin(origins = "http://spspu.s3-website-us-east-1.amazonaws.com")
@RequiredArgsConstructor
public class AdminSellerController {

    private final AdminService adminService;
    private final SellerRepo sellerRepo;

    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers() {
        return ResponseEntity.ok(sellerRepo.findAll());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Seller>> getPendingSellers() {
        return ResponseEntity.ok(sellerRepo.findByStatus(SellerStatus.PENDING));
    }

    @PutMapping("/{sellerId}/approve")
    public ResponseEntity<?> approveSeller(@PathVariable Integer sellerId) {
        Seller seller = adminService.approveSeller(sellerId);
        return ResponseEntity.ok(seller);
    }

    @PutMapping("/{sellerId}/reject")
    public ResponseEntity<?> rejectSeller(
            @PathVariable Integer sellerId,
            @RequestParam(required = false) String reason
    ) {
        Seller seller = adminService.rejectSeller(sellerId, reason);
        return ResponseEntity.ok(seller);
    }

    @PutMapping("/{sellerId}/suspend")
    public ResponseEntity<?> suspendSeller(@PathVariable Integer sellerId) {
        Seller seller = adminService.suspendSeller(sellerId);
        return ResponseEntity.ok(seller);
    }
}