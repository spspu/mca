package com.cart.ecom_proj.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cart.ecom_proj.dto.RazorpayVerifyRequest;
import com.cart.ecom_proj.enums.OrderStatus;
import com.cart.ecom_proj.enums.PaymentStatus;
import com.cart.ecom_proj.model.Order;
import com.cart.ecom_proj.model.OrderItem;
import com.cart.ecom_proj.model.Payment;
import com.cart.ecom_proj.model.SellerTransaction;
import com.cart.ecom_proj.repo.OrderRepo;
import com.cart.ecom_proj.repo.PaymentRepo;
import com.cart.ecom_proj.repo.SellerTransactionRepo;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

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

    public Map<String, Object> createRazorpayOrder(int orderId) throws Exception {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", order.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue());
        options.put("currency", "INR");
        options.put("receipt", "order_rcptid_" + order.getId());

        com.razorpay.Order razorpayOrder = razorpay.orders.create(options);

        Payment payment = Payment.builder()
                .order(order)
                .gatewayName("RAZORPAY")
                .gatewayOrderId(razorpayOrder.get("id"))
                .amount(order.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .build();

        paymentRepo.save(payment);

        return Map.of(
                "key", keyId,
                "amount", options.get("amount"),
                "currency", "INR",
                "orderId", razorpayOrder.get("id"),
                "internalOrderId", order.getId()
        );
    }

    public Payment verifyRazorpayPayment(RazorpayVerifyRequest request) throws Exception {

        Order order = orderRepo.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = paymentRepo.findByOrder(order)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", request.getRazorpayOrderId());
        options.put("razorpay_payment_id", request.getRazorpayPaymentId());
        options.put("razorpay_signature", request.getRazorpaySignature());

        boolean isValid = Utils.verifyPaymentSignature(options, keySecret);

        if (!isValid) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepo.save(payment);
            throw new RuntimeException("Invalid Razorpay payment signature");
        }

        payment.setGatewayPaymentId(request.getRazorpayPaymentId());
        payment.setGatewayOrderId(request.getRazorpayOrderId());
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