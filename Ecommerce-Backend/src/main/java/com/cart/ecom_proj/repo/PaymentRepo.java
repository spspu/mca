package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Payment;
import com.cart.ecom_proj.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepo extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByOrder(Order order);
}