package com.cart.ecom_proj.model;

import com.cart.ecom_proj.enums.HomepageContentType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomepageContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private HomepageContentType type;

    private String title;

    private String subtitle;

    private String imageUrl;

    private String redirectUrl;

    private Integer productId;

    private int positionOrder;

    private boolean active;
}