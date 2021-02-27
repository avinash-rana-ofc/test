package com.avinash.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.avinash.ecommerce.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{

}
