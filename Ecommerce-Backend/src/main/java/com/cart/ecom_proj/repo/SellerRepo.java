package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.enums.SellerStatus;
import com.cart.ecom_proj.model.Seller;
import com.cart.ecom_proj.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SellerRepo extends JpaRepository<Seller, Integer> {

    Optional<Seller> findByUser(User user);

    List<Seller> findByStatus(SellerStatus status);
}