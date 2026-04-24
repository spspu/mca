package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.model.Payment;
import com.cart.ecom_proj.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/payments")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create/{orderId}")
    public ResponseEntity<Payment> createPayment(@PathVariable int orderId) {
        return ResponseEntity.ok(paymentService.createTestPayment(orderId));
    }

    @PostMapping("/verify/{orderId}")
    public ResponseEntity<Payment> verifyPayment(@PathVariable int orderId) {
        return ResponseEntity.ok(paymentService.verifyTestPayment(orderId));
    }
}