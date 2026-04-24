package com.cart.ecom_proj.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cart.ecom_proj.enums.SellerStatus;
import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.model.Seller;
import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.repo.ProductRepo;
import com.cart.ecom_proj.repo.SellerRepo;
import com.cart.ecom_proj.repo.UserRepo;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SellerRepo sellerRepo;

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductById(int id) {
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {

        Seller seller = getLoggedInApprovedSeller();

        product.setSeller(seller);
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageDate(imageFile.getBytes());

        return repo.save(product);
    }

    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {

        Seller seller = getLoggedInApprovedSeller();

        Product existingProduct = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (existingProduct.getSeller().getId() != seller.getId()) {
            throw new RuntimeException("You can update only your own product");
        }

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setReleaseDate(product.getReleaseDate());
        existingProduct.setProductAvailable(product.isProductAvailable());
        existingProduct.setStockQuantity(product.getStockQuantity());

        existingProduct.setImageName(imageFile.getOriginalFilename());
        existingProduct.setImageType(imageFile.getContentType());
        existingProduct.setImageDate(imageFile.getBytes());

        return repo.save(existingProduct);
    }

    public void deleteProduct(int id) {

        Seller seller = getLoggedInApprovedSeller();

        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getSeller().getId() != seller.getId()) {
            throw new RuntimeException("You can delete only your own product");
        }

        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }

    public List<Product> getMySellerProducts() {
        Seller seller = getLoggedInApprovedSeller();
        return repo.findBySeller(seller);
    }

    private Seller getLoggedInApprovedSeller() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Seller seller = sellerRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller profile not found"));

        if (seller.getStatus() != SellerStatus.APPROVED) {
            throw new RuntimeException("Seller is not approved yet");
        }

        return seller;
    }
    
    
    
    public List<Product> filterProducts(
            String keyword,
            String category,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean inStock
    ) {
        return repo.filterProducts(keyword, category, brand, minPrice, maxPrice, inStock);
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}