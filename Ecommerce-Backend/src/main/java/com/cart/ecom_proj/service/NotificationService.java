package com.cart.ecom_proj.service;

import java.util.Optional;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender javaMailSender;
    private final UserRepo userRepo;

    public User findUserByEmail(String email) {
        Optional<User> user = userRepo.findByEmail(email);
        return user.orElse(null);
    }

    public User findUserById(Integer id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void saveUserWithUpdatedPassword(User user) {
        userRepo.save(user);
    }

    public void sendNotification(User user) {
    	
        String resetLink = "http://spspu.s3-website-us-east-1.amazonaws.com/password/" + user.getId();

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setSubject("Reset your HiTeckKart password");
        mail.setText(
                "Hello " + user.getName() + ",\n\n" +
                "Click below link to reset your password:\n" +
                resetLink + "\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Thanks,\nHiTeckKart Team"
        );

        javaMailSender.send(mail);
    }
    
    
    
    
    public void sendSellerStatusMail(User user, String status, String reason) {
        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(user.getEmail());
        mail.setFrom("findyourhobbie@gmail.com");

        if ("APPROVED".equals(status)) {
            mail.setSubject("Seller Account Approved");
            mail.setText(
                "Hello " + user.getName() + ",\n\n" +
                "Congratulations! Your seller account has been approved.\n" +
                "You can now login and manage your products.\n\n" +
                "Regards,\nHiTeckKart Team"
            );
        } else if ("REJECTED".equals(status)) {
            mail.setSubject("Seller Account Rejected");
            mail.setText(
                "Hello " + user.getName() + ",\n\n" +
                "Your seller account has been rejected.\n" +
                "Reason: " + reason + "\n\n" +
                "Regards,\nHiTeckKart Team"
            );
        } else if ("SUSPENDED".equals(status)) {
            mail.setSubject("Seller Account Suspended");
            mail.setText(
                    "Hello " + user.getName() + ",\n\n" +
                    "Your seller account has been suspended.\n" +
                    "You cannot manage products until further notice.\n\n" +
                    "Regards,\nHiTeckKart Team"
            );
        }

        javaMailSender.send(mail);
    }
    
    
}