package com.cart.ecom_proj.config;

import com.cart.ecom_proj.enums.Role;
import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (!userRepo.existsByEmail("admin@gmail.com")) {

            User admin = User.builder()
                    .name("Admin")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("12345"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();

            userRepo.save(admin);
        }
    }
}