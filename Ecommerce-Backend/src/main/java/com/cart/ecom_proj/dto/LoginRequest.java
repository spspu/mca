package com.cart.ecom_proj.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;
    private String password;
}