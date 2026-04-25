package com.cart.ecom_proj.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cart.ecom_proj.model.HomepageContent;
import com.cart.ecom_proj.repo.HomepageContentRepo;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class HomepageContentController {

    private final HomepageContentRepo homepageContentRepo;

    public HomepageContentController(HomepageContentRepo homepageContentRepo) {
        this.homepageContentRepo = homepageContentRepo;
    }

    // PUBLIC
    @GetMapping("/homepage")
    public List<HomepageContent> getActiveHomepageContent() {
        return homepageContentRepo.findByActiveTrueOrderByPositionOrderAsc();
    }
    

    // ADMIN
    @GetMapping("/admin/homepage")
    public List<HomepageContent> getAllHomepageContent() {
        return homepageContentRepo.findAll();
    }

    // ADMIN
    @PostMapping("/admin/homepage")
    public HomepageContent addHomepageContent(@RequestBody HomepageContent content) {
        return homepageContentRepo.save(content);
    }

    // ADMIN
    @PutMapping("/admin/homepage/{id}")
    public HomepageContent updateHomepageContent(
            @PathVariable int id,
            @RequestBody HomepageContent content
    ) {
        HomepageContent existing = homepageContentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Homepage content not found"));

        existing.setType(content.getType());
        existing.setTitle(content.getTitle());
        existing.setSubtitle(content.getSubtitle());
        existing.setImageUrl(content.getImageUrl());
        existing.setRedirectUrl(content.getRedirectUrl());
        existing.setProductId(content.getProductId());
        existing.setPositionOrder(content.getPositionOrder());
        existing.setActive(content.isActive());

        return homepageContentRepo.save(existing);
    }

    // ADMIN
    @PutMapping("/admin/homepage/{id}/activate")
    public String activateContent(@PathVariable int id) {
        HomepageContent content = homepageContentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Homepage content not found"));

        content.setActive(true);
        homepageContentRepo.save(content);

        return "Homepage content activated";
    }

    // ADMIN
    @PutMapping("/admin/homepage/{id}/deactivate")
    public String deactivateContent(@PathVariable int id) {
        HomepageContent content = homepageContentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Homepage content not found"));

        content.setActive(false);
        homepageContentRepo.save(content);

        return "Homepage content deactivated";
    }

    // ADMIN
    @DeleteMapping("/admin/homepage/{id}")
    public String deleteContent(@PathVariable int id) {
        homepageContentRepo.deleteById(id);
        return "Homepage content deleted";
    }
}