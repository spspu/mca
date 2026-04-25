package com.cart.ecom_proj.dto;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequest {

    private List<CheckoutItemRequest> items;
}