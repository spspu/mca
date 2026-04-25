package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Seller;
import com.cart.ecom_proj.model.SellerTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SellerTransactionRepo extends JpaRepository<SellerTransaction, Integer> {

    List<SellerTransaction> findBySeller(Seller seller);

    List<SellerTransaction> findBySellerAndTransactionDateBetween(
            Seller seller,
            LocalDateTime startDate,
            LocalDateTime endDate
    );
}