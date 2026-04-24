package com.cart.ecom_proj.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @Column(length = 2000)
    private String description;

    private String brand;

    private BigDecimal price;

    private String category;

    private Date releaseDate;

    private boolean productAvailable;

    private int stockQuantity;

    private String imageName;

    private String imageType;

    @Lob
    private byte[] imageDate;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private Seller seller;
}