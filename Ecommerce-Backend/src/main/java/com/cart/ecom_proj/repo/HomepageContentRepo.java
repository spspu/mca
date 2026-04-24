package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.HomepageContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomepageContentRepo extends JpaRepository<HomepageContent, Integer> {

    List<HomepageContent> findByActiveTrueOrderByPositionOrderAsc();
}