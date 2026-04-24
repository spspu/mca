package com.cart.ecom_proj.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.cart.ecom_proj.enums.OrderStatus;
import com.cart.ecom_proj.enums.PaymentStatus;
import com.cart.ecom_proj.model.Order;
import com.cart.ecom_proj.model.OrderItem;
import com.cart.ecom_proj.model.Payment;
import com.cart.ecom_proj.model.SellerTransaction;
import com.cart.ecom_proj.repo.OrderRepo;
import com.cart.ecom_proj.repo.PaymentRepo;
import com.cart.ecom_proj.repo.SellerTransactionRepo;

@Service
public class PaymentService {
	
	private final SellerTransactionRepo sellerTransactionRepo;
    private final OrderRepo orderRepo;
    private final PaymentRepo paymentRepo;

    public PaymentService(
            OrderRepo orderRepo,
            PaymentRepo paymentRepo,
            SellerTransactionRepo sellerTransactionRepo
    ) {
        this.orderRepo = orderRepo;
        this.paymentRepo = paymentRepo;
        this.sellerTransactionRepo = sellerTransactionRepo;
    }

    public Payment createTestPayment(int orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = Payment.builder()
                .order(order)
                .gatewayName("TEST")
                .gatewayOrderId("TEST_ORDER_" + order.getId())
                .amount(order.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .build();

        return paymentRepo.save(payment);
    }

    
    public Payment verifyTestPayment(int orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = paymentRepo.findByOrder(order)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setGatewayPaymentId("TEST_PAYMENT_" + order.getId());
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.PAID);

        orderRepo.save(order);

        BigDecimal commissionRate = new BigDecimal("0.10");

        for (OrderItem item : order.getOrderItems()) {

            BigDecimal grossAmount = item.getLineTotal();
            BigDecimal commissionAmount = grossAmount.multiply(commissionRate);
            BigDecimal netAmount = grossAmount.subtract(commissionAmount);

            SellerTransaction transaction = SellerTransaction.builder()
                    .seller(item.getSeller())
                    .order(order)
                    .orderItem(item)
                    .grossAmount(grossAmount)
                    .commissionAmount(commissionAmount)
                    .netAmount(netAmount)
                    .transactionDate(LocalDateTime.now())
                    .status("COMPLETED")
                    .build();

            sellerTransactionRepo.save(transaction);
        }

        return paymentRepo.save(payment);
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}