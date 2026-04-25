package com.cart.ecom_proj.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notiService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> sendResetPasswordLink(@RequestParam String email) {

        User user = notiService.findUserByEmail(email);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Email not found");
        }

        notiService.sendNotification(user);

        return ResponseEntity.ok("Password reset link sent to your email");
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam Integer id,
            @RequestParam String password
    ) {

        User user = notiService.findUserById(id);

        user.setPassword(passwordEncoder.encode(password));

        notiService.saveUserWithUpdatedPassword(user);

        return ResponseEntity.ok("Password updated successfully");
    }
}