package com.cart.ecom_proj.dto;

import lombok.Data;

@Data
public class CheckoutItemRequest {

    private int productId;
    private int quantity;
}