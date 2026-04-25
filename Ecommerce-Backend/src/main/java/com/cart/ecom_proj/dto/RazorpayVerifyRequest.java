package com.cart.ecom_proj.dto;

import lombok.Data;

@Data
public class RazorpayVerifyRequest {
    private int orderId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}