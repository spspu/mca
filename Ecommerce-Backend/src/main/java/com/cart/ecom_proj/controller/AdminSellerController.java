package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.enums.SellerStatus;
import com.cart.ecom_proj.model.Seller;
import com.cart.ecom_proj.repo.SellerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sellers")
@CrossOrigin
public class AdminSellerController {

    @Autowired
    private SellerRepo sellerRepo;

    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers() {
        return ResponseEntity.ok(sellerRepo.findAll());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Seller>> getPendingSellers() {
        return ResponseEntity.ok(sellerRepo.findByStatus(SellerStatus.PENDING));
    }

    @PutMapping("/{sellerId}/approve")
    public ResponseEntity<String> approveSeller(@PathVariable int sellerId) {

        Seller seller = sellerRepo.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        seller.setStatus(SellerStatus.APPROVED);
        seller.setRejectionReason(null);

        sellerRepo.save(seller);

        return ResponseEntity.ok("Seller approved successfully");
    }

    @PutMapping("/{sellerId}/reject")
    public ResponseEntity<String> rejectSeller(
            @PathVariable int sellerId,
            @RequestParam(required = false) String reason
    ) {

        Seller seller = sellerRepo.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        seller.setStatus(SellerStatus.REJECTED);
        seller.setRejectionReason(reason);

        sellerRepo.save(seller);

        return ResponseEntity.ok("Seller rejected successfully");
    }

    @PutMapping("/{sellerId}/suspend")
    public ResponseEntity<String> suspendSeller(@PathVariable int sellerId) {

        Seller seller = sellerRepo.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        seller.setStatus(SellerStatus.SUSPENDED);

        sellerRepo.save(seller);

        return ResponseEntity.ok("Seller suspended successfully");
    }
}