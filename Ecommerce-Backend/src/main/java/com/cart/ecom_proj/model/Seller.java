package com.cart.ecom_proj.model;

import com.cart.ecom_proj.enums.SellerStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String shopName;
    private String phone;
    private String address;

    @Enumerated(EnumType.STRING)
    private SellerStatus status = SellerStatus.PENDING;

    private String rejectionReason;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}