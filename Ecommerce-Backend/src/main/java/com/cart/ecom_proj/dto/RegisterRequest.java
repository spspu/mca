package com.cart.ecom_proj.dto;

import com.cart.ecom_proj.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private Role role;

    // seller fields
    private String shopName;
    private String phone;
    private String address;
}