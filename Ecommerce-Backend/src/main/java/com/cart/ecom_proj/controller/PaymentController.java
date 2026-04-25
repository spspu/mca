package com.cart.ecom_proj.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cart.ecom_proj.dto.RazorpayVerifyRequest;
import com.cart.ecom_proj.service.PaymentService;

@RestController
@RequestMapping("/api/customer/payments")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    //Before Payment Setup Code
//    @PostMapping("/create/{orderId}")
//    public ResponseEntity<Payment> createPayment(@PathVariable int orderId) {
//        return ResponseEntity.ok(paymentService.createTestPayment(orderId));
//    }
//
//    @PostMapping("/verify/{orderId}")
//    public ResponseEntity<Payment> verifyPayment(@PathVariable int orderId) {
//        return ResponseEntity.ok(paymentService.verifyTestPayment(orderId));
//    }
    
    
    @PostMapping("/razorpay/create/{orderId}")
    public ResponseEntity<?> createRazorpayOrder(@PathVariable int orderId) throws Exception {
        return ResponseEntity.ok(paymentService.createRazorpayOrder(orderId));
    }

    @PostMapping("/razorpay/verify")
    public ResponseEntity<?> verifyRazorpayPayment(@RequestBody RazorpayVerifyRequest request) throws Exception {
        return ResponseEntity.ok(paymentService.verifyRazorpayPayment(request));
    }
    
    
    
}