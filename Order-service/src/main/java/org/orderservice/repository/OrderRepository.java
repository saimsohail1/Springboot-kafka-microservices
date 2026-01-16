package org.orderservice.repository;

import org.orderservice.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Orders, UUID> {
}


