package com.cart.ecom_proj.repo;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.model.Seller;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(String keyword);

    List<Product> findBySeller(Seller seller);
    
    
    
    @Query("""
            SELECT p FROM Product p
            WHERE
            (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:category IS NULL OR LOWER(p.category) = LOWER(:category))
            AND (:brand IS NULL OR LOWER(p.brand) = LOWER(:brand))
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            AND (:inStock IS NULL OR 
                (:inStock = true AND p.stockQuantity > 0) OR
                (:inStock = false))
            """)
    List<Product> filterProducts(
            String keyword,
            String category,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean inStock
    );
    
    
    
    
    
    
    
    
    
    
}