package com.cart.ecom_proj.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cart.ecom_proj.model.OrderItem;
import com.cart.ecom_proj.model.Seller;

public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findBySeller(Seller seller);
}