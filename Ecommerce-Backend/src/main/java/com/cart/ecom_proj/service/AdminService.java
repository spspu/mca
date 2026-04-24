package com.cart.ecom_proj.service;

import org.springframework.stereotype.Service;

import com.cart.ecom_proj.enums.SellerStatus;
import com.cart.ecom_proj.model.Seller;
import com.cart.ecom_proj.repo.SellerRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final SellerRepo sellerRepo;
    private final NotificationService notificationService;

    public Seller approveSeller(Integer sellerId) {
        Seller seller = sellerRepo.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        seller.setStatus(SellerStatus.APPROVED);

        Seller savedSeller = sellerRepo.save(seller);
        System.out.println("Sending approval mail to: " + seller.getUser().getEmail());
        notificationService.sendSellerStatusMail(
                seller.getUser(),
                "APPROVED",
                null
        );

        return savedSeller;
    }

    public Seller rejectSeller(Integer sellerId, String reason) {
        Seller seller = sellerRepo.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        seller.setStatus(SellerStatus.REJECTED);
        seller.setRejectionReason(reason);

        Seller savedSeller = sellerRepo.save(seller);

        notificationService.sendSellerStatusMail(
                seller.getUser(),
                "REJECTED",
                reason
        );

        return savedSeller;
    }

    public Seller suspendSeller(Integer sellerId) {
        Seller seller = sellerRepo.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        seller.setStatus(SellerStatus.SUSPENDED);

        Seller savedSeller = sellerRepo.save(seller);

        notificationService.sendSellerStatusMail(
                seller.getUser(),
                "SUSPENDED",
                null
        );

        return savedSeller;
    }
}