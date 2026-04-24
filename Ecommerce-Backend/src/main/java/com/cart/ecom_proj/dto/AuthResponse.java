package com.cart.ecom_proj.dto;

import com.cart.ecom_proj.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private int userId;
    private String name;
    private String email;
    private Role role;
}