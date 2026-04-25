package com.cart.ecom_proj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    @JsonIgnoreProperties({"user"}) 
    private Seller seller;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties({"orderItems", "customer"})
    private Order order;

    @ManyToOne
    @JoinColumn(name = "order_item_id")
    @JsonIgnoreProperties({"order"})
    private OrderItem orderItem;

    private BigDecimal grossAmount;
    private BigDecimal commissionAmount;
    private BigDecimal netAmount;

    private LocalDateTime transactionDate;

    private String status;
}