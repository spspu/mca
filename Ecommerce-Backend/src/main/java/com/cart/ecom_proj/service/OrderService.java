package com.cart.ecom_proj.service;

import com.cart.ecom_proj.dto.CheckoutItemRequest;
import com.cart.ecom_proj.dto.CheckoutRequest;
import com.cart.ecom_proj.enums.OrderStatus;
import com.cart.ecom_proj.enums.PaymentStatus;
import com.cart.ecom_proj.model.Order;
import com.cart.ecom_proj.model.OrderItem;
import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.OrderRepo;
import com.cart.ecom_proj.repo.ProductRepo;
import com.cart.ecom_proj.repo.UserRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class OrderService {

    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final UserRepo userRepo;

    public OrderService(OrderRepo orderRepo, ProductRepo productRepo, UserRepo userRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    public Order checkout(CheckoutRequest request) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User customer = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Order order = Order.builder()
                .customer(customer)
                .orderStatus(OrderStatus.CREATED)
                .paymentStatus(PaymentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CheckoutItemRequest itemRequest : request.getItems()) {

            Product product = productRepo.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (!product.isProductAvailable()) {
                throw new RuntimeException(product.getName() + " is not available");
            }

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Not enough stock for " + product.getName());
            }

            BigDecimal lineTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .seller(product.getSeller())
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(product.getPrice())
                    .lineTotal(lineTotal)
                    .build();

            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());

            if (product.getStockQuantity() == 0) {
                product.setProductAvailable(false);
            }

            productRepo.save(product);

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(lineTotal);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setOrderStatus(OrderStatus.PLACED);

        return orderRepo.save(order);
    }

    public List<Order> getMyOrders() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User customer = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return orderRepo.findByCustomer(customer);
    }
}