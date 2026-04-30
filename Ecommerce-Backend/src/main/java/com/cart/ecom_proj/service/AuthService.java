package com.cart.ecom_proj.service;

import com.cart.ecom_proj.dto.AuthResponse;
import com.cart.ecom_proj.dto.LoginRequest;
import com.cart.ecom_proj.dto.RegisterRequest;
import com.cart.ecom_proj.enums.Role;
import com.cart.ecom_proj.enums.SellerStatus;
import com.cart.ecom_proj.model.Seller;
import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.SellerRepo;
import com.cart.ecom_proj.repo.UserRepo;
import com.cart.ecom_proj.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SellerRepo sellerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Role role = request.getRole();

        if (role == null) {
            role = Role.CUSTOMER;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .enabled(true)
                .build();

        User savedUser = userRepo.save(user);

        if (role == Role.SELLER) {
            Seller seller = Seller.builder()
                    .shopName(request.getShopName())
                    .phone(request.getPhone())
                    .address(request.getAddress())
                    .status(SellerStatus.PENDING)
                    .user(savedUser)
                    .build();

            sellerRepo.save(seller);
        }

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}