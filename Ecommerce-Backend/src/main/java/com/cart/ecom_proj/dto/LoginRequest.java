package com.cart.ecom_proj.dto;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class LoginRequest {

    private String email;
    private String password;
}